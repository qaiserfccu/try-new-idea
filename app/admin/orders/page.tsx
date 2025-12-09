'use client';

import { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';

interface Order {
  id: number;
  orderId: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: string;
  trackingNumber: string;
  createdAt: string;
  items: number;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 1,
      orderId: 'ORD-2024-001',
      customerName: 'Regular User',
      customerEmail: 'user@trynewidea.com',
      totalAmount: 5200,
      status: 'delivered',
      paymentMethod: 'Cash on Delivery',
      trackingNumber: 'TRK-001-2024',
      createdAt: '2024-01-15',
      items: 3
    },
    {
      id: 2,
      orderId: 'ORD-2024-002',
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      totalAmount: 3500,
      status: 'shipped',
      paymentMethod: 'Online Payment',
      trackingNumber: 'TRK-002-2024',
      createdAt: '2024-01-16',
      items: 2
    },
    {
      id: 3,
      orderId: 'ORD-2024-003',
      customerName: 'Sarah Khan',
      customerEmail: 'sarah@example.com',
      totalAmount: 1800,
      status: 'processing',
      paymentMethod: 'Cash on Delivery',
      trackingNumber: 'TRK-003-2024',
      createdAt: '2024-01-17',
      items: 1
    },
  ]);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'processing':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'shipped':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'delivered':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const updateOrderStatus = (orderId: number, newStatus: Order['status']) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  const statusCounts = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="glass-card rounded-2xl p-8">
          <h1 className="text-3xl font-bold text-white mb-2">Order Management</h1>
          <p className="text-green-200">
            Manage all customer orders, update statuses, and track shipments.
          </p>
        </div>

        {/* Status Filter */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex flex-wrap gap-3">
            {Object.entries(statusCounts).map(([status, count]) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  filterStatus === status
                    ? 'bg-green-500 text-white'
                    : 'bg-white/10 text-green-200 hover:bg-white/20'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)} ({count})
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table */}
        <div className="glass-card rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            All Orders ({filteredOrders.length})
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-green-500/20">
                  <th className="text-left py-3 px-4 text-green-300 font-semibold">Order ID</th>
                  <th className="text-left py-3 px-4 text-green-300 font-semibold">Customer</th>
                  <th className="text-left py-3 px-4 text-green-300 font-semibold">Date</th>
                  <th className="text-right py-3 px-4 text-green-300 font-semibold">Amount</th>
                  <th className="text-center py-3 px-4 text-green-300 font-semibold">Items</th>
                  <th className="text-center py-3 px-4 text-green-300 font-semibold">Status</th>
                  <th className="text-center py-3 px-4 text-green-300 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr 
                    key={order.id} 
                    className="border-b border-green-500/10 hover:bg-green-500/5 transition"
                  >
                    <td className="py-4 px-4">
                      <p className="text-white font-mono font-semibold">{order.orderId}</p>
                      <p className="text-green-400 text-xs">{order.trackingNumber}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-white font-semibold">{order.customerName}</p>
                      <p className="text-green-300 text-sm">{order.customerEmail}</p>
                    </td>
                    <td className="py-4 px-4 text-green-200">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 text-right text-white font-bold">
                      Rs. {order.totalAmount.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-center text-green-200">
                      {order.items}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.status)}`}>
                        {order.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-green-400 hover:text-green-300 text-sm font-medium"
                      >
                        View Details →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <p className="text-green-300 text-lg">No orders found for this filter</p>
            </div>
          )}
        </div>

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="glass-card rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Order Details</h2>
                  <p className="text-green-300 font-mono">{selectedOrder.orderId}</p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-green-300 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                {/* Customer Info */}
                <div className="glass rounded-lg p-4">
                  <h3 className="text-lg font-bold text-white mb-3">Customer Information</h3>
                  <div className="space-y-2 text-green-200">
                    <p><span className="font-semibold">Name:</span> {selectedOrder.customerName}</p>
                    <p><span className="font-semibold">Email:</span> {selectedOrder.customerEmail}</p>
                    <p><span className="font-semibold">Payment:</span> {selectedOrder.paymentMethod}</p>
                  </div>
                </div>

                {/* Order Status */}
                <div className="glass rounded-lg p-4">
                  <h3 className="text-lg font-bold text-white mb-3">Order Status</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-green-200">Current Status:</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(selectedOrder.status)}`}>
                        {selectedOrder.status.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <label className="block text-green-300 text-sm mb-2">Update Status:</label>
                      <select
                        value={selectedOrder.status}
                        onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value as Order['status'])}
                        className="w-full px-4 py-2 bg-white/10 border border-green-500/30 rounded-lg text-white focus:ring-2 focus:ring-green-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Tracking Info */}
                <div className="glass rounded-lg p-4">
                  <h3 className="text-lg font-bold text-white mb-3">Tracking Information</h3>
                  <div className="space-y-2 text-green-200">
                    <p><span className="font-semibold">Tracking Number:</span> {selectedOrder.trackingNumber}</p>
                    <p><span className="font-semibold">Order Date:</span> {new Date(selectedOrder.createdAt).toLocaleDateString('en-PK', { dateStyle: 'long' })}</p>
                    <p><span className="font-semibold">Items Count:</span> {selectedOrder.items} items</p>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="glass rounded-lg p-4 bg-green-500/10 border-green-500/30">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-white">Total Amount:</span>
                    <span className="text-2xl font-bold text-green-400">
                      Rs. {selectedOrder.totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="flex-1 bg-white/10 text-white px-6 py-3 rounded-lg hover:bg-white/20 transition font-semibold"
                  >
                    Close
                  </button>
                  <button
                    className="flex-1 purple-gradient text-white px-6 py-3 rounded-lg hover:opacity-90 transition font-semibold"
                  >
                    Print Invoice
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
