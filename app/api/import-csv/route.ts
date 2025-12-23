import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { parse } from 'csv-parse/sync';

interface ProductData {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  chiltanpureUrl?: string;
  images: string[];
  category: string;
  stock?: number;
  sku?: string;
  variants?: string; // JSON string of variants
}

async function upsertProductsFromCSV(products: ProductData[]) {
  const results = { created: 0, updated: 0, errors: 0 };

  for (const product of products) {
    try {
      const existing = product.chiltanpureUrl ? await prisma.product.findFirst({
        where: { chiltanpureUrl: product.chiltanpureUrl },
        select: { id: true },
      }) : null;

      let variants = [];
      if (product.variants) {
        try {
          variants = JSON.parse(product.variants);
        } catch (e) {
          console.warn(`Invalid variants JSON for product ${product.name}`);
        }
      }

      const variantCreates = variants.map((variant: any) => ({
        name: variant.name || 'Variant',
        value: variant.value || '',
        price: variant.price ?? null,
        stock: variant.stock ?? null,
        isAvailable: true,
      }));

      const productData = {
        name: product.name,
        description: product.description,
        price: product.price,
        originalPrice: product.originalPrice ?? null,
        chiltanpureUrl: product.chiltanpureUrl ?? null,
        images: product.images,
        category: product.category,
        stock: product.stock ?? 0,
        sku: product.sku ?? null,
        isAvailable: true,
        variants: { create: variantCreates },
      };

      if (existing) {
        await prisma.product.update({
          where: { id: existing.id },
          data: {
            ...productData,
            variants: {
              deleteMany: { productId: existing.id },
              create: variantCreates,
            },
          },
        });
        results.updated++;
      } else {
        await prisma.product.create({
          data: productData,
        });
        results.created++;
      }
    } catch (error) {
      console.error(`Error processing product ${product.name}:`, error);
      results.errors++;
    }
  }

  return results;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!file.name.endsWith('.csv')) {
      return NextResponse.json({ error: 'File must be a CSV' }, { status: 400 });
    }

    const csvContent = await file.text();

    // Parse CSV
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    // Validate and transform data
    const products: ProductData[] = records.map((record: any) => ({
      name: record.name || record.Name || record.title || record.Title,
      description: record.description || record.Description || '',
      price: parseFloat(record.price || record.Price || '0'),
      originalPrice: record.originalPrice || record['Original Price'] ? parseFloat(record.originalPrice || record['Original Price']) : undefined,
      chiltanpureUrl: record.chiltanpureUrl || record.url || record.URL,
      images: record.images || record.Images ? (record.images || record.Images).split(',').map((img: string) => img.trim()) : [],
      category: record.category || record.Category || 'General',
      stock: record.stock || record.Stock ? parseInt(record.stock || record.Stock) : undefined,
      sku: record.sku || record.SKU,
      variants: record.variants || record.Variants,
    }));

    // Filter out invalid products
    const validProducts = products.filter(p => p.name && p.price > 0);

    console.log(`Parsed ${validProducts.length} valid products from CSV`);

    const results = await upsertProductsFromCSV(validProducts);

    return NextResponse.json({
      success: true,
      productsProcessed: validProducts.length,
      created: results.created,
      updated: results.updated,
      errors: results.errors,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error importing CSV:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to import CSV',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}