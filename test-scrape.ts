import axios from 'axios';
import * as cheerio from 'cheerio';

async function testProductScrape() {
  try {
    const url = 'https://chiltanpure.com/products/pait-safai-powder';
    console.log('Testing product scrape for:', url);

    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const $ = cheerio.load(response.data);

    // Test title extraction
    const title = $('h1.product-title, .product-title, .product-name').first().text().trim();
    console.log('Title:', title);

    // Test price extraction
    const priceText = $('.price, .product-price, [data-price]').first().text().trim();
    console.log('Price text:', priceText);

    // Test description
    const description = $('.product-description, .description, .product-details').first().text().trim();
    console.log('Description length:', description.length);

    // Test images
    const images: string[] = [];
    $('img[src*="cdn"], .product-image img, .product-gallery img').each((_, el) => {
      const src = $(el).attr('src');
      if (src && src.includes('cdn') && !images.includes(src)) {
        images.push(src.startsWith('http') ? src : `https:${src}`);
      }
    });
    console.log('Images found:', images.length);

  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : 'Unknown error');
  }
}

testProductScrape();