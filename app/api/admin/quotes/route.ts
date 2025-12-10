import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const quotes = await prisma.quote.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(quotes);
  } catch (error) {
    console.error('Error fetching quotes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quotes' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      company,
      product_name,
      quantity,
      specifications,
      budget,
      timeline,
      notes
    } = body;

    // Validate required fields
    if (!name || !email || !product_name || !quantity) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const quote = await prisma.quote.create({
      data: {
        name,
        email,
        phone,
        company,
        product_name,
        quantity: parseInt(quantity),
        specifications,
        budget: budget ? parseFloat(budget) : null,
        timeline,
        notes,
        status: 'pending'
      }
    });

    return NextResponse.json(quote, { status: 201 });
  } catch (error) {
    console.error('Error creating quote:', error);
    return NextResponse.json(
      { error: 'Failed to create quote' },
      { status: 500 }
    );
  }
}