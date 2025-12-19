import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { logApiResponse, logError } from '@/lib/logger';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const userIdNum = userId ? Number(userId) : NaN;

    if (!userId || Number.isNaN(userIdNum)) {
      const resp = NextResponse.json({ error: 'User ID required' }, { status: 400 });
      logApiResponse({ source: 'server', url: new URL(request.url).pathname, status: 400, body: JSON.stringify({ error: 'User ID required' }), message: 'User ID required' })
      return resp;
    }

    const cart = await prisma.cart.findFirst({
      where: { userId: userIdNum },
      include: {
        cartItems: {
          include: {
            product: true,
            variant: true,
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!cart) {
      const payload = { cartItems: [] };
      const resp = NextResponse.json(payload);
      logApiResponse({ source: 'server', url: new URL(request.url).pathname, status: 200, body: JSON.stringify(payload), userId: userIdNum, message: 'Empty cart' })
      return resp;
    }

    const cartItems = cart.cartItems.map((item) => ({
      id: item.id,
      productId: item.productId,
      variantId: item.variantId,
      quantity: item.quantity,
      product: {
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        images: item.product.images,
        category: item.product.category,
      },
      variant: item.variant
    }));

    const payload = { cartItems };
    const resp = NextResponse.json(payload);
    logApiResponse({ source: 'server', url: new URL(request.url).pathname, status: 200, body: JSON.stringify(payload), userId: userIdNum, message: 'Fetched cart' })
    return resp;
  } catch (error) {
    logError(error, { source: 'server', url: new URL(request.url).pathname, message: 'Error loading cart' })
    const resp = NextResponse.json({ error: 'Failed to load cart' }, { status: 500 });
    logApiResponse({ source: 'server', url: new URL(request.url).pathname, status: 500, body: JSON.stringify({ error: 'Failed to load cart' }), message: 'Failed to load cart' })
    return resp;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, productId, variantId, quantity } = await request.json();

    const userIdNum = Number(userId);
    const productIdNum = Number(productId);
    const variantIdNum = variantId === undefined || variantId === null ? null : Number(variantId);

    if (!userId || !productId || Number.isNaN(userIdNum) || Number.isNaN(productIdNum) || (variantIdNum !== null && Number.isNaN(variantIdNum))) {
      const resp = NextResponse.json({ error: 'User ID and Product ID required' }, { status: 400 });
      logApiResponse({ source: 'server', url: new URL(request.url).pathname, status: 400, body: JSON.stringify({ error: 'User ID and Product ID required' }), message: 'Invalid add-to-cart payload' })
      return resp;
    }

    const quantityToAdd = Math.max(1, Number(quantity) || 1);

    let cart = await prisma.cart.findFirst({
      where: { userId: userIdNum }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: userIdNum }
      });
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: productIdNum,
        variantId: variantIdNum,
      }
    });

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantityToAdd }
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: productIdNum,
          variantId: variantIdNum,
          quantity: quantityToAdd,
        }
      });
    }

    const resp = NextResponse.json({ success: true });
    logApiResponse({ source: 'server', url: new URL(request.url).pathname, status: 200, body: JSON.stringify({ success: true }), userId: userIdNum, message: 'Added to cart' })
    return resp;
  } catch (error) {
    logError(error, { source: 'server', url: new URL(request.url).pathname, message: 'Error adding to cart' })
    const resp = NextResponse.json({ error: 'Failed to add to cart' }, { status: 500 });
    logApiResponse({ source: 'server', url: new URL(request.url).pathname, status: 500, body: JSON.stringify({ error: 'Failed to add to cart' }), message: 'Failed to add to cart' })
    return resp;
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId, productId, variantId, quantity } = await request.json();

    const userIdNum = Number(userId);
    const productIdNum = Number(productId);
    const variantIdNum = variantId === undefined || variantId === null ? null : Number(variantId);
    const nextQuantity = Number(quantity);

    if (!userId || !productId || quantity === undefined || Number.isNaN(userIdNum) || Number.isNaN(productIdNum) || (variantIdNum !== null && Number.isNaN(variantIdNum)) || Number.isNaN(nextQuantity)) {
      const resp = NextResponse.json({ error: 'User ID, Product ID, and quantity required' }, { status: 400 });
      logApiResponse({ source: 'server', url: new URL(request.url).pathname, status: 400, body: JSON.stringify({ error: 'User ID, Product ID, and quantity required' }), message: 'Invalid update payload' })
      return resp;
    }

    const cart = await prisma.cart.findFirst({
      where: { userId: userIdNum }
    });

    if (!cart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: productIdNum,
        variantId: variantIdNum,
      }
    });

    if (!existingItem) {
      return NextResponse.json({ error: 'Cart item not found' }, { status: 404 });
    }

    if (nextQuantity <= 0) {
      await prisma.cartItem.delete({ where: { id: existingItem.id } });
    } else {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: nextQuantity }
      });
    }

    const resp = NextResponse.json({ success: true });
    logApiResponse({ source: 'server', url: new URL(request.url).pathname, status: 200, body: JSON.stringify({ success: true }), userId: userIdNum, message: 'Updated cart' })
    return resp;
  } catch (error) {
    logError(error, { source: 'server', url: new URL(request.url).pathname, message: 'Error updating cart' })
    const resp = NextResponse.json({ error: 'Failed to update cart' }, { status: 500 });
    logApiResponse({ source: 'server', url: new URL(request.url).pathname, status: 500, body: JSON.stringify({ error: 'Failed to update cart' }), message: 'Failed to update cart' })
    return resp;
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const productId = searchParams.get('productId');
    const variantId = searchParams.get('variantId');

    const userIdNum = userId ? Number(userId) : NaN;
    const productIdNum = productId ? Number(productId) : NaN;
    const variantIdNum = variantId ? Number(variantId) : null;

    if (!userId || !productId || Number.isNaN(userIdNum) || Number.isNaN(productIdNum) || (variantIdNum !== null && Number.isNaN(variantIdNum))) {
      const resp = NextResponse.json({ error: 'User ID and Product ID required' }, { status: 400 });
      logApiResponse({ source: 'server', url: new URL(request.url).pathname, status: 400, body: JSON.stringify({ error: 'User ID and Product ID required' }), message: 'Invalid delete payload' })
      return resp;
    }

    const cart = await prisma.cart.findFirst({
      where: { userId: userIdNum }
    });

    if (!cart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }

    await prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id,
        productId: productIdNum,
        variantId: variantIdNum,
      }
    });

    const resp = NextResponse.json({ success: true });
    logApiResponse({ source: 'server', url: new URL(request.url).pathname, status: 200, body: JSON.stringify({ success: true }), userId: userIdNum, message: 'Removed from cart' })
    return resp;
  } catch (error) {
    logError(error, { source: 'server', url: new URL(request.url).pathname, message: 'Error removing from cart' })
    const resp = NextResponse.json({ error: 'Failed to remove from cart' }, { status: 500 });
    logApiResponse({ source: 'server', url: new URL(request.url).pathname, status: 500, body: JSON.stringify({ error: 'Failed to remove from cart' }), message: 'Failed to remove from cart' })
    return resp;
  }
}