import { NextResponse } from 'next/server';
import pool from '../../../lib/db';

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT
        p.id,
        p.name,
        p.description,
        p.price,
        p.original_price,
        p.chiltanpure_url,
        p.images,
        p.category,
        p.stock,
        p.is_available
      FROM products p
      WHERE p.is_available = TRUE
      ORDER BY p.id
    `);

    const products = result.rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      price: parseFloat(row.price),
      originalPrice: row.original_price ? parseFloat(row.original_price) : undefined,
      description: row.description,
      image: '🌿', // Emoji placeholder - in production, use actual product images
      images: row.images || [],
      category: row.category,
      chiltanpureUrl: row.chiltanpure_url,
      stock: row.stock,
      discount: row.original_price && row.price < row.original_price 
        ? Math.round(((parseFloat(row.original_price) - parseFloat(row.price)) / parseFloat(row.original_price)) * 100)
        : undefined,
      variants: [], // Variants would come from a separate join if needed
    }));

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}