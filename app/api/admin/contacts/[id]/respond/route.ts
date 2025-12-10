import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { message } = await request.json();

    if (!message || !message.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Get contact details
    const contactResult = await pool.query(
      'SELECT name, email FROM contacts WHERE id = $1',
      [id]
    );

    if (contactResult.rows.length === 0) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    const contact = contactResult.rows[0];

    // In a real application, you would send an email here
    // For now, we'll just log the response and update the status
    console.log(`Sending response to ${contact.name} (${contact.email}):`, message);

    // Update contact status to responded
    await pool.query(
      'UPDATE contacts SET status = $1, updated_at = NOW() WHERE id = $2',
      ['responded', id]
    );

    // In a real implementation, you might want to store the response in a separate table
    // For now, we'll just return success

    return NextResponse.json({ message: 'Response sent successfully' });
  } catch (error) {
    console.error('Error sending response:', error);
    return NextResponse.json({ error: 'Failed to send response' }, { status: 500 });
  }
}