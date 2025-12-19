import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Simple in-memory status tracking (in production, use Redis or database)
let lastSyncTime: Date | null = null;
let isRunning = false;
let lastSyncResult: any = null;

export async function POST(request: NextRequest) {
  console.log('Catalog sync API called - testing Prisma direct import');

  try {
    // Test database connection
    console.log('Testing database connection...');
    const testQuery = await prisma.product.count();
    console.log('Database connection successful, product count:', testQuery);

    return NextResponse.json({ message: 'Prisma working', productCount: testQuery });
  } catch (error) {
    console.error('Error in test:', error);
    return NextResponse.json(
      { error: 'Prisma test failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

async function syncProductVariants(productId: number, variants: any[]) {
  let newVariants = 0;
  let updatedVariants = 0;

  for (const variant of variants) {
    try {
      // Check if variant already exists
      const existing = await prisma.productVariant.findFirst({
        where: {
          productId,
          name: variant.name,
          value: variant.value
        }
      });

      if (existing) {
        // Update existing variant
        await prisma.productVariant.update({
          where: { id: existing.id },
          data: {
            price: variant.price,
            stock: variant.stock,
            sku: variant.sku,
            isAvailable: variant.stock ? variant.stock > 0 : true,
            updatedAt: new Date(),
          }
        });
        updatedVariants++;
      } else {
        // Create new variant
        await prisma.productVariant.create({
          data: {
            productId,
            name: variant.name,
            value: variant.value,
            price: variant.price,
            stock: variant.stock,
            sku: variant.sku,
            isAvailable: variant.stock ? variant.stock > 0 : true,
          }
        });
        newVariants++;
      }
    } catch (error) {
      console.error(`Error syncing variant ${variant.name}: ${variant.value}:`, error);
    }
  }

  return { newVariants, updatedVariants };
}