import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT id, code, description, discount_type, discount_value, min_order_amount,
             max_discount, usage_limit, used_count, start_date, end_date, is_active, created_at
      FROM promotions
      ORDER BY created_at DESC
    `);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching promotions:', error);
    return NextResponse.json({ error: 'Failed to fetch promotions' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
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

    // Check if code already exists
    const existing = await pool.query('SELECT id FROM promotions WHERE code = $1', [code]);
    if (existing.rows.length > 0) {
      return NextResponse.json({ error: 'Promotion code already exists' }, { status: 400 });
    }

    const result = await pool.query(
      `INSERT INTO promotions (code, description, discount_type, discount_value, min_order_amount,
                              max_discount, usage_limit, used_count, start_date, end_date, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 0, $8, $9, true)
       RETURNING id, code, description, discount_type, discount_value, min_order_amount,
                 max_discount, usage_limit, used_count, start_date, end_date, is_active, created_at`,
      [code, description, discount_type, discount_value, min_order_amount, max_discount, usage_limit, start_date, end_date]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error creating promotion:', error);
    return NextResponse.json({ error: 'Failed to create promotion' }, { status: 500 });
  }
}