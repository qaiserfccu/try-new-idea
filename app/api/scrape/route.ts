import { NextRequest, NextResponse } from 'next/server';
import pool from '../../../lib/db';
import { CHILTANPURE_BASE_URL, CHILTANPURE_REFERRAL_CODE } from '../../lib/constants';

interface ScrapedProduct {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  chiltanpureUrl: string;
  images: string[];
  category: string;
  stock: number;
  variants?: Array<{
    name: string;
    price: number;
    stock: number;
  }>;
}

// Helper function to scrape products from ChiltanPure
async function scrapeChiltanPureProducts(): Promise<ScrapedProduct[]> {
  // In a real implementation, this would use a web scraping library like Puppeteer or Cheerio
  // For now, we'll simulate fetching products from various categories
  
  const categories = [
    'organic-food',
    'beauty-skincare', 
    'hair-care',
    'essential-oils',
    'herbs-spices',
    'honey',
    'oils'
  ];
  
  const products: ScrapedProduct[] = [];
  
  // Simulate scraping products from each category
  // In production, this would make real HTTP requests to ChiltanPure
  for (const category of categories) {
    try {
      // Simulated product data - in production, parse HTML from ChiltanPure
      const categoryProducts = await simulateScrapingCategory(category);
      products.push(...categoryProducts);
    } catch (error) {
      console.error(`Error scraping category ${category}:`, error);
    }
  }
  
  return products;
}

// Simulate scraping a category (replace with real scraping logic)
async function simulateScrapingCategory(category: string): Promise<ScrapedProduct[]> {
  // This simulates what would be scraped from ChiltanPure
  // In production, use Puppeteer/Cheerio to parse actual HTML
  
  const sampleProducts: Record<string, ScrapedProduct[]> = {
    'organic-food': [
      {
        name: 'Organic Honey 500g',
        description: 'Pure organic honey sourced from the finest beehives in Pakistan. Rich in antioxidants and natural sweetness.',
        price: 1500,
        originalPrice: 1800,
        chiltanpureUrl: `${CHILTANPURE_BASE_URL}/products/organic-honey?bg_ref=${CHILTANPURE_REFERRAL_CODE}`,
        images: [`${CHILTANPURE_BASE_URL}/cdn/shop/products/organic-honey-500g.jpg`],
        category: 'Food & Beverages',
        stock: 50,
        variants: [
          { name: '250g', price: 800, stock: 30 },
          { name: '500g', price: 1500, stock: 50 },
          { name: '1kg', price: 2800, stock: 20 }
        ]
      },
      {
        name: 'Organic Green Tea',
        description: 'Premium green tea leaves from organic farms. Rich in antioxidants and natural flavor.',
        price: 800,
        originalPrice: 1000,
        chiltanpureUrl: `${CHILTANPURE_BASE_URL}/products/green-tea?bg_ref=${CHILTANPURE_REFERRAL_CODE}`,
        images: [`${CHILTANPURE_BASE_URL}/cdn/shop/products/green-tea.jpg`],
        category: 'Food & Beverages',
        stock: 100
      }
    ],
    'beauty-skincare': [
      {
        name: 'Natural Face Serum',
        description: 'Organic face serum with vitamin C and hyaluronic acid. Anti-aging and hydrating formula.',
        price: 1800,
        originalPrice: 2200,
        chiltanpureUrl: `${CHILTANPURE_BASE_URL}/products/face-serum?bg_ref=${CHILTANPURE_REFERRAL_CODE}`,
        images: [`${CHILTANPURE_BASE_URL}/cdn/shop/products/face-serum.jpg`],
        category: 'Beauty & Skincare',
        stock: 40,
        variants: [
          { name: '30ml', price: 1800, stock: 40 },
          { name: '50ml', price: 2800, stock: 25 }
        ]
      },
      {
        name: 'Natural Body Lotion',
        description: 'Hydrating body lotion with shea butter and aloe vera. Non-greasy and fast-absorbing.',
        price: 1400,
        originalPrice: 1700,
        chiltanpureUrl: `${CHILTANPURE_BASE_URL}/products/body-lotion?bg_ref=${CHILTANPURE_REFERRAL_CODE}`,
        images: [`${CHILTANPURE_BASE_URL}/cdn/shop/products/body-lotion.jpg`],
        category: 'Beauty & Skincare',
        stock: 45
      }
    ],
    'hair-care': [
      {
        name: 'Herbal Hair Oil',
        description: 'Natural hair oil with coconut, almond, and essential oils. Promotes hair growth and shine.',
        price: 1200,
        originalPrice: 1500,
        chiltanpureUrl: `${CHILTANPURE_BASE_URL}/products/hair-oil?bg_ref=${CHILTANPURE_REFERRAL_CODE}`,
        images: [`${CHILTANPURE_BASE_URL}/cdn/shop/products/hair-oil.jpg`],
        category: 'Hair Care',
        stock: 60,
        variants: [
          { name: '100ml', price: 1200, stock: 60 },
          { name: '200ml', price: 2200, stock: 35 }
        ]
      }
    ],
    'oils': [
      {
        name: 'Extra Virgin Olive Oil',
        description: 'Cold-pressed extra virgin olive oil from organic farms. Perfect for cooking and salads.',
        price: 2500,
        originalPrice: 3000,
        chiltanpureUrl: `${CHILTANPURE_BASE_URL}/products/olive-oil?bg_ref=${CHILTANPURE_REFERRAL_CODE}`,
        images: [`${CHILTANPURE_BASE_URL}/cdn/shop/products/olive-oil.jpg`],
        category: 'Food & Beverages',
        stock: 30,
        variants: [
          { name: '250ml', price: 1500, stock: 40 },
          { name: '500ml', price: 2500, stock: 30 },
          { name: '1L', price: 4500, stock: 15 }
        ]
      }
    ]
  };
  
  return sampleProducts[category] || [];
}

// Upsert products into database
async function upsertProducts(products: ScrapedProduct[]) {
  const client = await pool.connect();
  const results = {
    created: 0,
    updated: 0,
    errors: 0
  };
  
  try {
    await client.query('BEGIN');
    
    for (const product of products) {
      try {
        // Check if product already exists by URL
        const existing = await client.query(
          'SELECT id FROM products WHERE chiltanpure_url = $1',
          [product.chiltanpureUrl]
        );
        
        if (existing.rows.length > 0) {
          // Update existing product
          await client.query(`
            UPDATE products 
            SET name = $1, 
                description = $2, 
                price = $3, 
                original_price = $4,
                images = $5,
                category = $6,
                stock = $7,
                updated_at = NOW()
            WHERE id = $8
          `, [
            product.name,
            product.description,
            product.price,
            product.originalPrice || null,
            product.images,
            product.category,
            product.stock,
            existing.rows[0].id
          ]);
          
          const productId = existing.rows[0].id;
          
          // Handle variants
          if (product.variants && product.variants.length > 0) {
            // Delete old variants
            await client.query('DELETE FROM product_variants WHERE product_id = $1', [productId]);
            
            // Insert new variants
            for (const variant of product.variants) {
              await client.query(`
                INSERT INTO product_variants (product_id, name, price, stock)
                VALUES ($1, $2, $3, $4)
              `, [productId, variant.name, variant.price, variant.stock]);
            }
          }
          
          results.updated++;
        } else {
          // Insert new product
          const result = await client.query(`
            INSERT INTO products (name, description, price, original_price, chiltanpure_url, images, category, stock, is_available)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, TRUE)
            RETURNING id
          `, [
            product.name,
            product.description,
            product.price,
            product.originalPrice || null,
            product.chiltanpureUrl,
            product.images,
            product.category,
            product.stock
          ]);
          
          const productId = result.rows[0].id;
          
          // Insert variants
          if (product.variants && product.variants.length > 0) {
            for (const variant of product.variants) {
              await client.query(`
                INSERT INTO product_variants (product_id, name, price, stock)
                VALUES ($1, $2, $3, $4)
              `, [productId, variant.name, variant.price, variant.stock]);
            }
          }
          
          results.created++;
        }
      } catch (error) {
        console.error(`Error processing product ${product.name}:`, error);
        results.errors++;
      }
    }
    
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
  
  return results;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dryRun = searchParams.get('dryRun') === 'true';
    
    console.log('Starting product scraping from ChiltanPure...');
    
    // Scrape products
    const products = await scrapeChiltanPureProducts();
    
    console.log(`Scraped ${products.length} products`);
    
    if (dryRun) {
      // Return scraped data without saving to database
      return NextResponse.json({
        success: true,
        dryRun: true,
        productsScraped: products.length,
        products: products
      });
    }
    
    // Save to database
    const results = await upsertProducts(products);
    
    console.log(`Scraping complete: ${results.created} created, ${results.updated} updated, ${results.errors} errors`);
    
    return NextResponse.json({
      success: true,
      productsScraped: products.length,
      created: results.created,
      updated: results.updated,
      errors: results.errors,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in scraping endpoint:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to scrape products',
        message: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // Same as GET but for manual triggering
  return GET(request);
}
