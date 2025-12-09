import { NextResponse } from 'next/server';
import pool from '../../../lib/db';

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT
        p.*,
        json_agg(
          json_build_object(
            'id', pv.variant_id,
            'name', pv.name,
            'price', pv.price,
            'originalPrice', pv.original_price
          )
        ) FILTER (WHERE pv.id IS NOT NULL) as variants
      FROM products p
      LEFT JOIN product_variants pv ON p.id = pv.product_id
      GROUP BY p.id
      ORDER BY p.id
    `);

    const products = result.rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      price: parseFloat(row.price),
      originalPrice: row.original_price ? parseFloat(row.original_price) : undefined,
      description: row.description,
      image: row.image,
      category: row.category,
      discount: row.discount,
      variants: row.variants || [],
    }));

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}