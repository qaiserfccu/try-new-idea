import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const productId = parseInt(params.id);
    
    if (isNaN(productId)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    const result = await pool.query(
      `SELECT 
        id, 
        name, 
        description, 
        price, 
        original_price as "originalPrice", 
        chiltanpure_url as "chiltanpureUrl", 
        images, 
        category, 
        stock, 
        is_available as "isAvailable"
      FROM products 
      WHERE id = $1`,
      [productId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const product = result.rows[0];
    
    // Convert price to number
    product.price = parseFloat(product.price);
    if (product.originalPrice) {
      product.originalPrice = parseFloat(product.originalPrice);
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}
