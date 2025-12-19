import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ChiltanPureScraper, ScrapedProduct } from '@/lib/chiltanpure-scraper';

const scraper = new ChiltanPureScraper();

async function upsertProducts(products: ScrapedProduct[]) {
  const results = { created: 0, updated: 0, errors: 0 };

  for (const product of products) {
    try {
      const existing = await prisma.product.findFirst({
        where: { chiltanpureUrl: product.url },
        select: { id: true },
      });

      const variantCreates = (product.variants || []).map((variant) => ({
        name: variant.name,
        value: variant.value,
        price: variant.price ?? null,
        stock: variant.stock ?? null,
        isAvailable: true,
      }));

      if (existing) {
        await prisma.product.update({
          where: { id: existing.id },
          data: {
            name: product.title,
            description: product.description,
            price: product.price,
            originalPrice: product.originalPrice ?? null,
            chiltanpureUrl: product.url,
            images: product.images,
            category: product.category,
            stock: product.stock ?? 0,
            sku: product.sku ?? null,
            variants: {
              deleteMany: { productId: existing.id },
              create: variantCreates,
            },
          },
        });
        results.updated++;
      } else {
        await prisma.product.create({
          data: {
            name: product.title,
            description: product.description,
            price: product.price,
            originalPrice: product.originalPrice ?? null,
            chiltanpureUrl: product.url,
            images: product.images,
            category: product.category,
            stock: product.stock ?? 0,
            sku: product.sku ?? null,
            isAvailable: true,
            variants: { create: variantCreates },
          },
        });
        results.created++;
      }
    } catch (error) {
      console.error(`Error processing product ${product.title}:`, error);
      results.errors++;
    }
  }

  return results;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dryRun = searchParams.get('dryRun') === 'true';
    console.log('Starting product scraping from ChiltanPure...');

    const products = await scraper.scrapeAllProducts();

    console.log(`Scraped ${products.length} products`);

    if (dryRun) {
      return NextResponse.json({
        success: true,
        dryRun: true,
        productsScraped: products.length,
        products
      });
    }

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
