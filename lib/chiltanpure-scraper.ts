import { chromium, Browser, Page } from 'playwright';
import axios from 'axios';
import * as cheerio from 'cheerio';

export interface ScrapedProduct {
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  variants: ProductVariant[];
  url: string;
  stock?: number;
  sku?: string;
}

export interface ProductVariant {
  name: string;
  value: string;
  price?: number;
  stock?: number;
}

export class ChiltanPureScraper {
  private baseUrl = 'https://chiltanpure.com';
  private browser: Browser | null = null;
  private page: Page | null = null;

  async initBrowser() {
    if (!this.browser) {
      this.browser = await chromium.launch({ headless: true });
      const context = await this.browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      });
      this.page = await context.newPage();
    }
  }

  async closeBrowser() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
    }
  }

  async scrapeAllProducts(): Promise<ScrapedProduct[]> {
    try {
      console.log('Starting ChiltanPure catalog scraping...');

      // First, get all product URLs from sitemap (no browser needed)
      const productUrls = await this.getAllProductUrls();

      console.log(`Found ${productUrls.length} products to scrape`);

      if (productUrls.length === 0) {
        throw new Error('No product URLs found - website structure may have changed');
      }

      // Initialize browser only when needed for individual product scraping
      await this.initBrowser();

      const products: ScrapedProduct[] = [];

      for (const url of productUrls.slice(0, 10)) { // Limit to first 10 for testing
        try {
          const product = await this.scrapeProduct(url);
          if (product) {
            products.push(product);
          }
        } catch (error) {
          console.error('Error scraping product:', url, error);
        }

        // Be polite to the source site - longer delay for headless browser
        await this.delay(2000);
      }

      console.log(`Successfully scraped ${products.length} products`);
      return products;

    } catch (error) {
      console.error('Error scraping ChiltanPure catalog:', error);
      throw error;
    } finally {
      await this.closeBrowser();
    }
  }

  private async getAllProductUrls(): Promise<string[]> {
    try {
      console.log('Fetching product URLs from sitemap...');

      // Get the main sitemap
      const sitemapResponse = await axios.get(`${this.baseUrl}/sitemap.xml`);
      const sitemapData = sitemapResponse.data;

      // Parse the sitemap to find product sitemap URLs
      const productSitemapUrls: string[] = [];
      const urlRegex = /<loc>(https:\/\/chiltanpure\.com\/sitemap_products_\d+\.xml[^<]*)<\/loc>/g;
      let match;
      while ((match = urlRegex.exec(sitemapData)) !== null) {
        productSitemapUrls.push(match[1]);
      }

      console.log(`Found ${productSitemapUrls.length} product sitemap files`);

      const allProductUrls: string[] = [];

      // Fetch each product sitemap
      for (const sitemapUrl of productSitemapUrls) {
        try {
          const response = await axios.get(sitemapUrl);
          const productUrls: string[] = [];

          // Extract product URLs from the sitemap
          const productUrlRegex = /<loc>(https:\/\/chiltanpure\.com\/products\/[^<]+)<\/loc>/g;
          let productMatch;
          while ((productMatch = productUrlRegex.exec(response.data)) !== null) {
            productUrls.push(productMatch[1]);
          }

          allProductUrls.push(...productUrls);
          console.log(`Found ${productUrls.length} products in ${sitemapUrl}`);
        } catch (error) {
          console.error(`Error fetching sitemap ${sitemapUrl}:`, error);
        }
      }

      console.log(`Total product URLs found: ${allProductUrls.length}`);
      return allProductUrls;

    } catch (error) {
      console.error('Error fetching product URLs from sitemap:', error);
      throw error;
    }
  }

  private async getCategories(): Promise<{name: string, url: string}[]> {
    if (!this.page) throw new Error('Browser not initialized');

    const categories: {name: string, url: string}[] = [];

    try {
      await this.page.goto(this.baseUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await this.page.waitForTimeout(1000);

      const categoryData = await this.page.$$eval('.nav-item a, .menu-item a, .collection-link a', (links) => {
        return links.map(link => {
          const href = link.getAttribute('href');
          const name = link.textContent?.trim();
          return { href, name };
        }).filter(item => item.href && item.href.includes('/collections/') && item.name && !item.name.includes('All'));
      });

      categories.push(...categoryData.map(item => ({
        name: item.name!,
        url: item.href!.startsWith('http') ? item.href! : `${this.baseUrl}${item.href}`
      })));

    } catch (error) {
      console.error('Error getting categories:', error);
    }

    return categories;
  }

  private async getProductsFromCategory(categoryUrl: string): Promise<string[]> {
    if (!this.page) throw new Error('Browser not initialized');

    const urls: string[] = [];

    try {
      await this.page.goto(categoryUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await this.page.waitForTimeout(1000);

      const productLinks = await this.page.$$eval('.product-item a, .product-card a', (links) => {
        return links.map(link => link.getAttribute('href')).filter(href => href && href.includes('/products/'));
      });

      urls.push(...productLinks.map(href => href!.startsWith('http') ? href! : `${this.baseUrl}${href}`));

    } catch (error) {
      console.error(`Error getting products from ${categoryUrl}:`, error);
    }

    return urls;
  }

  private async scrapeProduct(url: string): Promise<ScrapedProduct | null> {
    if (!this.page) throw new Error('Browser not initialized');

    try {
      await this.page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

      // Wait a bit for dynamic content to load
      await this.page.waitForTimeout(2000);

      // Extract data using page.evaluate for better reliability
      const productData = await this.page.evaluate(() => {
        // Helper function to extract price
        const extractPrice = (text: string): number => {
          const cleaned = text.replace(/[^\d.,]/g, '');
          const number = parseFloat(cleaned.replace(',', ''));
          return isNaN(number) ? 0 : number;
        };

        // Extract title
        const titleSelectors = ['h1', '.product-title', '.product__title'];
        let title = '';
        for (const selector of titleSelectors) {
          const element = document.querySelector(selector);
          if (element?.textContent?.trim()) {
            title = element.textContent.trim();
            break;
          }
        }
        if (!title) {
          const titleTag = document.querySelector('title');
          if (titleTag) {
            title = titleTag.textContent?.replace('Buy ', '').replace(' at Best Price in Pakistan - ChiltanPure VisaMastercard', '') || '';
          }
        }

        // Extract description
        const descSelectors = ['.product-description', '.product__description', '.product-details'];
        let description = '';
        for (const selector of descSelectors) {
          const element = document.querySelector(selector);
          if (element?.textContent?.trim()) {
            description = element.textContent.trim();
            break;
          }
        }

        // Extract price
        const priceSelectors = ['.price', '.product-price', '.current-price', '[data-price]'];
        let price = 0;
        for (const selector of priceSelectors) {
          const element = document.querySelector(selector);
          if (element?.textContent) {
            const extracted = extractPrice(element.textContent.trim());
            if (extracted > 0) {
              price = extracted;
              break;
            }
          }
        }

        // Extract original price
        const originalPriceSelectors = ['.original-price', '.compare-price', '.was-price'];
        let originalPrice: number | undefined;
        for (const selector of originalPriceSelectors) {
          const element = document.querySelector(selector);
          if (element?.textContent) {
            const extracted = extractPrice(element.textContent.trim());
            if (extracted > 0) {
              originalPrice = extracted;
              break;
            }
          }
        }

        // Extract images
        const images: string[] = [];
        const imageSelectors = ['.product-image img', '.product-gallery img', '.product-photos img'];
        for (const selector of imageSelectors) {
          const elements = document.querySelectorAll(selector);
          elements.forEach(img => {
            const src = (img as HTMLImageElement).src || (img as HTMLImageElement).getAttribute('data-src');
            if (src && !src.includes('placeholder') && !src.includes('no-image')) {
              images.push(src);
            }
          });
          if (images.length > 0) break;
        }

        // Extract category
        let category = 'General';
        const breadcrumbLinks = document.querySelectorAll('.breadcrumb a, .breadcrumbs a');
        if (breadcrumbLinks.length > 0) {
          const lastBreadcrumb = breadcrumbLinks[breadcrumbLinks.length - 1];
          if (lastBreadcrumb.textContent?.trim() && lastBreadcrumb.textContent.trim() !== 'Home') {
            category = lastBreadcrumb.textContent.trim();
          }
        }

        // Extract variants
        const variants: any[] = [];
        const variantSelectors = ['.variant-option', '.product-option', '.size-selector', '.variant-selector'];
        for (const selector of variantSelectors) {
          const container = document.querySelector(selector);
          if (container) {
            const options = container.querySelectorAll('option, input[type="radio"], button');
            const name = container.getAttribute('data-option-name') ||
                        container.previousElementSibling?.textContent?.trim() || 'Variant';

            options.forEach(option => {
              const value = (option as any).value || option.textContent?.trim();
              if (value && value !== 'Select' && value !== 'Choose') {
                variants.push({ name, value });
              }
            });
          }
        }

        // Extract stock
        let stock: number | undefined;
        const stockSelectors = ['.stock', '.availability', '.product-stock'];
        for (const selector of stockSelectors) {
          const element = document.querySelector(selector);
          if (element?.textContent) {
            const match = element.textContent.match(/(\d+)/);
            if (match) {
              stock = parseInt(match[1]);
              break;
            }
          }
        }

        // Extract SKU
        const skuSelectors = ['[data-sku]', '.sku'];
        let sku: string | undefined;
        for (const selector of skuSelectors) {
          const element = document.querySelector(selector);
          if (element?.textContent?.trim()) {
            sku = element.textContent.trim();
            break;
          }
        }

        return {
          title,
          description,
          price,
          originalPrice,
          images,
          category,
          variants,
          stock,
          sku
        };
      });

      if (!productData.title || !productData.price) {
        console.warn(`Skipping product ${url} - missing title or price`);
        return null;
      }

      return {
        ...productData,
        url
      };

    } catch (error) {
      console.error(`Error scraping product ${url}:`, error);
      return null;
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}