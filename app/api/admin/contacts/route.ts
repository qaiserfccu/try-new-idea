import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const result = await pool.query(
      'SELECT id, name, email, phone, subject, message, status, created_at, updated_at FROM contacts ORDER BY created_at DESC'
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json({ error: 'Failed to fetch contacts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, subject, message } = await request.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'Name, email, subject, and message are required' }, { status: 400 });
    }

    const result = await pool.query(
      'INSERT INTO contacts (name, email, phone, subject, message, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, email, phone, subject, message, status, created_at, updated_at',
      [name, email, phone || null, subject, message, 'new']
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error creating contact:', error);
    return NextResponse.json({ error: 'Failed to create contact' }, { status: 500 });
  }
}