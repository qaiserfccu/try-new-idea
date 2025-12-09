import { NextRequest, NextResponse } from 'next/server';
import pool from '../../../lib/db';

export async function POST(request: NextRequest) {
  try {
    const { userId, cartItems, totalAmount, shippingAddress, paymentMethod } = await request.json();

    if (!userId || !cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: 'User ID and cart items required' }, { status: 400 });
    }

    // Start transaction
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Create order
      const orderResult = await client.query(
        'INSERT INTO orders (user_id, total_amount, shipping_address, payment_method, status) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [userId, totalAmount, shippingAddress, paymentMethod, 'pending']
      );

      const orderId = orderResult.rows[0].id;

      // Create order items
      for (const item of cartItems) {
        await client.query(
          'INSERT INTO order_items (order_id, product_id, variant_id, quantity, price) VALUES ($1, $2, $3, $4, $5)',
          [orderId, item.id, item.selectedVariant?.id || null, item.quantity, item.selectedVariant?.price || item.price]
        );
      }

      // Clear cart items
      await client.query('DELETE FROM cart_items WHERE user_id = $1', [userId]);

      await client.query('COMMIT');

      return NextResponse.json({ success: true, orderId });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}