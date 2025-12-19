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

  async scrapeAllProducts(): Promise<ScrapedProduct[]> {
    try {
      console.log('Starting ChiltanPure catalog scraping...');

      // First, get all product URLs from the main catalog
      const productUrls = await this.getAllProductUrls();

      console.log(`Found ${productUrls.length} products to scrape`);

      if (productUrls.length === 0) {
        throw new Error('No product URLs found - website structure may have changed');
      }

      const products: ScrapedProduct[] = [];

      for (const url of productUrls) {
        try {
          const product = await this.scrapeProduct(url);
          if (product) {
            products.push(product);
          }
        } catch (error) {
          console.error('Error scraping product:', url, error);
        }

        // Be polite to the source site
        await this.delay(300);
      }

      console.log(`Successfully scraped ${products.length} products`);
      return products;

    } catch (error) {
      console.error('Error scraping ChiltanPure catalog:', error);
      throw error;
    }
  }

  private async getAllProductUrls(): Promise<string[]> {
    const urls: string[] = [];

    try {
      // Get main catalog page
      const response = await axios.get(`${this.baseUrl}/collections/all`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      const $ = cheerio.load(response.data);

      // Extract product URLs from the catalog page
      $('.product-item a, .product-card a, .grid-item a').each((_, element) => {
        const href = $(element).attr('href');
        if (href && href.includes('/products/') && !urls.includes(href)) {
          urls.push(href.startsWith('http') ? href : `${this.baseUrl}${href}`);
        }
      });

      // Also try to get products from category pages
      const categories = await this.getCategories();
      for (const category of categories) {
        try {
          const categoryUrls = await this.getProductsFromCategory(category.url);
          urls.push(...categoryUrls.filter(url => !urls.includes(url)));
        } catch (error) {
          console.error(`Error getting products from category ${category.name}:`, error);
        }
      }

    } catch (error) {
      console.error('Error getting product URLs:', error);
    }

    return [...new Set(urls)]; // Remove duplicates
  }

  private async getCategories(): Promise<{name: string, url: string}[]> {
    const categories: {name: string, url: string}[] = [];

    try {
      const response = await axios.get(this.baseUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      const $ = cheerio.load(response.data);

      // Extract categories from navigation
      $('.nav-item a, .menu-item a, .collection-link a').each((_, element) => {
        const href = $(element).attr('href');
        const name = $(element).text().trim();

        if (href && href.includes('/collections/') && name && !name.includes('All')) {
          categories.push({
            name,
            url: href.startsWith('http') ? href : `${this.baseUrl}${href}`
          });
        }
      });

    } catch (error) {
      console.error('Error getting categories:', error);
    }

    return categories;
  }

  private async getProductsFromCategory(categoryUrl: string): Promise<string[]> {
    const urls: string[] = [];

    try {
      const response = await axios.get(categoryUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      const $ = cheerio.load(response.data);

      $('.product-item a, .product-card a').each((_, element) => {
        const href = $(element).attr('href');
        if (href && href.includes('/products/')) {
          urls.push(href.startsWith('http') ? href : `${this.baseUrl}${href}`);
        }
      });

    } catch (error) {
      console.error(`Error getting products from ${categoryUrl}:`, error);
    }

    return urls;
  }

  private async scrapeProduct(url: string): Promise<ScrapedProduct | null> {
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      const $ = cheerio.load(response.data);

      // Extract product title
      const title = $('h1').first().text().trim() ||
                   $('.product-title').first().text().trim() ||
                   $('.product__title').first().text().trim() ||
                   $('title').text().trim().replace('Buy ', '').replace(' at Best Price in Pakistan - ChiltanPure VisaMastercard', '');

      // Extract description
      const description = $('.product-description, .product__description, .product-details').first().text().trim();

      // Extract price - try multiple selectors and take the first valid price
      const priceSelectors = $('.price, .product-price, .current-price, [data-price]');
      let price = 0;
      for (let i = 0; i < priceSelectors.length; i++) {
        const priceText = $(priceSelectors[i]).text().trim();
        const extractedPrice = this.extractPrice(priceText);
        if (extractedPrice > 0) {
          price = extractedPrice;
          break;
        }
      }

      // Extract original price (if on sale)
      const originalPriceText = $('.original-price, .compare-price, .was-price').first().text().trim();
      const originalPrice = originalPriceText ? this.extractPrice(originalPriceText) : undefined;

      // Extract images
      const images: string[] = [];
      $('.product-image img, .product-gallery img, .product-photos img').each((_, element) => {
        const src = $(element).attr('src') || $(element).attr('data-src');
        if (src && !src.includes('placeholder') && !src.includes('no-image')) {
          const fullUrl = src.startsWith('http') ? src : src.startsWith('//') ? `https:${src}` : `${this.baseUrl}${src}`;
          images.push(fullUrl);
        }
      });

      // Extract category from breadcrumbs or meta
      const category = this.extractCategory($);

      // Extract variants
      const variants = this.extractVariants($);

      // Extract stock information
      const stockText = $('.stock, .availability, .product-stock').first().text().trim();
      const stock = this.extractStock(stockText);

      // Extract SKU
      const sku = $('[data-sku], .sku').first().text().trim() || undefined;

      if (!title || !price) {
        console.warn(`Skipping product ${url} - missing title or price`);
        return null;
      }

      return {
        title,
        description: description || '',
        price,
        originalPrice,
        images: images.length > 0 ? images : [],
        category: category || 'General',
        variants,
        url,
        stock,
        sku
      };

    } catch (error) {
      console.error(`Error scraping product ${url}:`, error);
      return null;
    }
  }

  private extractPrice(priceText: string): number {
    // Remove currency symbols and extract numbers
    const cleaned = priceText.replace(/[^\d.,]/g, '');
    const number = parseFloat(cleaned.replace(',', ''));
    return isNaN(number) ? 0 : number;
  }

  private extractCategory($: cheerio.CheerioAPI): string {
    // Try breadcrumbs first
    const breadcrumb = $('.breadcrumb a, .breadcrumbs a').last().text().trim();
    if (breadcrumb && breadcrumb !== 'Home') {
      return breadcrumb;
    }

    // Try meta tags
    const metaCategory = $('meta[property="product:category"]').attr('content');
    if (metaCategory) {
      return metaCategory;
    }

    // Try URL structure
    const url = $('link[rel="canonical"]').attr('href') || '';
    const urlMatch = url.match(/\/collections\/([^\/]+)/);
    if (urlMatch) {
      return urlMatch[1].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    return 'General';
  }

  private extractVariants($: cheerio.CheerioAPI): ProductVariant[] {
    const variants: ProductVariant[] = [];

    // Look for variant selectors
    $('.variant-option, .product-option, .size-selector, .variant-selector').each((_, element) => {
      const $el = $(element);
      const name = $el.attr('data-option-name') || $el.prev('label').text().trim() || 'Variant';

      $el.find('option, input, button').each((_, option) => {
        const $option = $(option);
        const value = $option.attr('value') || $option.text().trim();

        if (value && value !== 'Select' && value !== 'Choose') {
          variants.push({
            name,
            value,
            price: undefined, // Could be extracted if variant has different pricing
            stock: undefined
          });
        }
      });
    });

    return variants;
  }

  private extractStock(stockText: string): number | undefined {
    if (!stockText) return undefined;

    const match = stockText.match(/(\d+)/);
    return match ? parseInt(match[1]) : undefined;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}