import { NextRequest, NextResponse } from 'next/server';
import pool from '../../../lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const result = await pool.query(`
      SELECT ci.*, p.name, p.price, pv.variant_name, pv.price as variant_price
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      LEFT JOIN product_variants pv ON ci.variant_id = pv.id
      WHERE ci.user_id = $1
      ORDER BY ci.created_at DESC
    `, [userId]);

    const cartItems = result.rows.map((row: any) => ({
      id: row.id,
      productId: row.product_id,
      variantId: row.variant_id,
      quantity: row.quantity,
      product: {
        id: row.product_id,
        name: row.name,
        price: row.price,
      },
      variant: row.variant_id ? {
        id: row.variant_id,
        name: row.variant_name,
        price: row.variant_price,
      } : null,
    }));

    return NextResponse.json({ cartItems });
  } catch (error) {
    console.error('Error loading cart:', error);
    return NextResponse.json({ error: 'Failed to load cart' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, productId, variantId, quantity } = await request.json();

    if (!userId || !productId) {
      return NextResponse.json({ error: 'User ID and Product ID required' }, { status: 400 });
    }

    // Check if item already exists in cart
    const existing = await pool.query(
      'SELECT * FROM cart_items WHERE user_id = $1 AND product_id = $2 AND (variant_id = $3 OR (variant_id IS NULL AND $3 IS NULL))',
      [userId, productId, variantId]
    );

    if (existing.rows.length > 0) {
      // Update quantity
      const newQuantity = existing.rows[0].quantity + (quantity || 1);
      await pool.query(
        'UPDATE cart_items SET quantity = $1 WHERE id = $2',
        [newQuantity, existing.rows[0].id]
      );
    } else {
      // Add new item
      await pool.query(
        'INSERT INTO cart_items (user_id, product_id, variant_id, quantity) VALUES ($1, $2, $3, $4)',
        [userId, productId, variantId, quantity || 1]
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json({ error: 'Failed to add to cart' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId, productId, variantId, quantity } = await request.json();

    if (!userId || !productId || quantity === undefined) {
      return NextResponse.json({ error: 'User ID, Product ID, and quantity required' }, { status: 400 });
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      await pool.query(
        'DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2 AND (variant_id = $3 OR (variant_id IS NULL AND $3 IS NULL))',
        [userId, productId, variantId]
      );
    } else {
      // Update quantity
      await pool.query(
        'UPDATE cart_items SET quantity = $1 WHERE user_id = $2 AND product_id = $3 AND (variant_id = $4 OR (variant_id IS NULL AND $4 IS NULL))',
        [quantity, userId, productId, variantId]
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating cart:', error);
    return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Clear all cart items for the user
    await pool.query('DELETE FROM cart_items WHERE user_id = $1', [userId]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error clearing cart:', error);
    return NextResponse.json({ error: 'Failed to clear cart' }, { status: 500 });
  }
}