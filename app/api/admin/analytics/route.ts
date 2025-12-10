import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    // Get total users
    const usersResult = await pool.query('SELECT COUNT(*) as count FROM users');
    const totalUsers = parseInt(usersResult.rows[0].count);

    // Get total orders
    const ordersResult = await pool.query('SELECT COUNT(*) as count FROM orders');
    const totalOrders = parseInt(ordersResult.rows[0].count);

    // Get total revenue
    const revenueResult = await pool.query('SELECT COALESCE(SUM(total_amount), 0) as revenue FROM orders WHERE status = $1', ['completed']);
    const totalRevenue = parseFloat(revenueResult.rows[0].revenue);

    // Get total products
    const productsResult = await pool.query('SELECT COUNT(*) as count FROM products');
    const totalProducts = parseInt(productsResult.rows[0].count);

    // Get recent orders with user names
    const recentOrdersResult = await pool.query(`
      SELECT o.id, o.user_id, o.total_amount, o.status, o.created_at, u.name as user_name
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
      LIMIT 10
    `);

    // Get top products by sales
    const topProductsResult = await pool.query(`
      SELECT p.id, p.name,
             COALESCE(SUM(oi.quantity), 0) as total_sold,
             COALESCE(SUM(oi.quantity * oi.price), 0) as revenue
      FROM products p
      LEFT JOIN order_items oi ON p.id = oi.product_id
      LEFT JOIN orders o ON oi.order_id = o.id AND o.status = 'completed'
      GROUP BY p.id, p.name
      ORDER BY total_sold DESC
      LIMIT 10
    `);

    // Get monthly revenue for the last 12 months
    const monthlyRevenueResult = await pool.query(`
      SELECT
        TO_CHAR(created_at, 'Mon YYYY') as month,
        EXTRACT(YEAR FROM created_at) as year,
        EXTRACT(MONTH FROM created_at) as month_num,
        COALESCE(SUM(total_amount), 0) as revenue,
        COUNT(*) as orders
      FROM orders
      WHERE status = 'completed' AND created_at >= NOW() - INTERVAL '12 months'
      GROUP BY year, month_num, TO_CHAR(created_at, 'Mon YYYY')
      ORDER BY year, month_num
    `);

    const analytics = {
      totalUsers,
      totalOrders,
      totalRevenue,
      totalProducts,
      recentOrders: recentOrdersResult.rows,
      topProducts: topProductsResult.rows,
      monthlyRevenue: monthlyRevenueResult.rows
    };

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics data' }, { status: 500 });
  }
}