import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await pool.query(
      `SELECT id, code, description, discount_type, discount_value, min_order_amount,
              max_discount, usage_limit, used_count, start_date, end_date, is_active, created_at
       FROM promotions WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Promotion not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching promotion:', error);
    return NextResponse.json({ error: 'Failed to fetch promotion' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const {
      code,
      description,
      discount_type,
      discount_value,
      min_order_amount,
      max_discount,
      usage_limit,
      start_date,
      end_date
    } = await request.json();

    if (!code || !description || !discount_type || discount_value === undefined || !start_date || !end_date) {
      return NextResponse.json({ error: 'Required fields are missing' }, { status: 400 });
    }

    // Check if code already exists for another promotion
    const existing = await pool.query('SELECT id FROM promotions WHERE code = $1 AND id != $2', [code, id]);
    if (existing.rows.length > 0) {
      return NextResponse.json({ error: 'Promotion code already exists' }, { status: 400 });
    }

    const result = await pool.query(
      `UPDATE promotions SET code = $1, description = $2, discount_type = $3, discount_value = $4,
                              min_order_amount = $5, max_discount = $6, usage_limit = $7,
                              start_date = $8, end_date = $9
       WHERE id = $10
       RETURNING id, code, description, discount_type, discount_value, min_order_amount,
                 max_discount, usage_limit, used_count, start_date, end_date, is_active, created_at`,
      [code, description, discount_type, discount_value, min_order_amount, max_discount, usage_limit, start_date, end_date, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Promotion not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating promotion:', error);
    return NextResponse.json({ error: 'Failed to update promotion' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { is_active } = await request.json();

    if (typeof is_active !== 'boolean') {
      return NextResponse.json({ error: 'is_active must be a boolean' }, { status: 400 });
    }

    const result = await pool.query(
      'UPDATE promotions SET is_active = $1 WHERE id = $2 RETURNING id, is_active',
      [is_active, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Promotion not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating promotion status:', error);
    return NextResponse.json({ error: 'Failed to update promotion status' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await pool.query('DELETE FROM promotions WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Promotion not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Promotion deleted successfully' });
  } catch (error) {
    console.error('Error deleting promotion:', error);
    return NextResponse.json({ error: 'Failed to delete promotion' }, { status: 500 });
  }
}