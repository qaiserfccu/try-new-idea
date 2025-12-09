import { NextRequest, NextResponse } from 'next/server';
import pool from '../../../lib/db';

export async function PUT(request: NextRequest) {
  try {
    const { userId, name, email, phone, address, city, postalCode } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Update user profile
    const result = await pool.query(
      'UPDATE users SET name = $1, email = $2, phone = $3, address = $4, city = $5, postal_code = $6 WHERE id = $7 RETURNING *',
      [name, email, phone, address, city, postalCode, userId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const updatedUser = result.rows[0];

    return NextResponse.json({
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        address: updatedUser.address,
        city: updatedUser.city,
        postalCode: updatedUser.postal_code,
        createdAt: updatedUser.created_at,
      }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}