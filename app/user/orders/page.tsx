'use client';

import { useState, useEffect, Suspense } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSearchParams } from 'next/navigation';
import UserLayout from '../../components/UserLayout';
import { Order } from '../../lib/types';
import { formatDate, formatCurrency, getOrderStatusColor } from '../../lib/utils';

function OrdersContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const orderId = searchParams?.get('order');
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    // Load orders from localStorage
    const allOrders = JSON.parse(localStorage.getItem('chiltanpure_orders') || '[]');
    const userOrders = allOrders.filter((order: Order) => order.userId === user?.id);
    setOrders(userOrders);

    // If orderId is in URL, select that order
    if (orderId) {
      const order = userOrders.find((o: Order) => o.id === orderId);
      if (order) setSelectedOrder(order);
    }
  }, [user, orderId]);

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(o => o.status === filter);

  if (selectedOrder) {
    return (
      <div className="space-y-6">
        <div className="glass-card rounded-2xl p-8">
          <button
            onClick={() => setSelectedOrder(null)}
            className="text-purple-400 hover:text-purple-300 mb-6 flex items-center gap-2"
          >
            ← Back to Orders
          </button>

          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Order #{selectedOrder.orderNumber}
              </h1>
              <p className="text-purple-300">
                Placed on {formatDate(selectedOrder.createdAt)}
              </p>
            </div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold text-white ${getOrderStatusColor(
                selectedOrder.status
              )}`}
            >
              {selectedOrder.status.toUpperCase()}
            </span>
          </div>

          {/* Order Timeline */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-4">Order Timeline</h3>
            <div className="space-y-4">
              {['pending', 'confirmed', 'processing', 'shipped', 'delivered'].map((status, index) => {
                const isCompleted = ['pending', 'confirmed', 'processing', 'shipped', 'delivered']
                  .indexOf(selectedOrder.status) >= index;
                const isCurrent = selectedOrder.status === status;
                
                return (
                  <div key={status} className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isCompleted ? 'purple-gradient' : 'glass'
                      }`}
                    >
                      {isCompleted ? '✓' : index + 1}
                    </div>
                    <div className="flex-1">
                      <p className={`font-semibold ${isCurrent ? 'text-white' : 'text-purple-300'}`}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </p>
                      {isCurrent && (
                        <p className="text-sm text-purple-400">Current status</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Shipping Info */}
          {selectedOrder.trackingNumber && (
            <div className="glass rounded-xl p-6 mb-6">
              <h3 className="text-lg font-bold text-white mb-3">Tracking Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-purple-300">Tracking Number:</span>
                  <span className="text-white font-mono">{selectedOrder.trackingNumber}</span>
                </div>
                {selectedOrder.courierService && (
                  <div className="flex justify-between">
                    <span className="text-purple-300">Courier:</span>
                    <span className="text-white">{selectedOrder.courierService}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Items */}
          <div className="glass rounded-xl p-6 mb-6">
            <h3 className="text-lg font-bold text-white mb-4">Items</h3>
            <div className="space-y-4">
              {selectedOrder.items.map((item, index) => (
                <div key={index} className="flex gap-4 pb-4 border-b border-purple-500/20 last:border-0">
                  <div className="w-16 h-16 purple-gradient-soft rounded-lg flex items-center justify-center text-3xl">
                    {item.image}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-semibold">{item.name}</p>
                    {item.variantName && (
                      <p className="text-sm text-purple-300">{item.variantName}</p>
                    )}
                    <p className="text-sm text-purple-300">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="glass rounded-xl p-6 mb-6">
            <h3 className="text-lg font-bold text-white mb-3">Shipping Address</h3>
            <div className="text-purple-200">
              <p className="font-semibold text-white">{selectedOrder.shippingAddress.name}</p>
              <p>{selectedOrder.shippingAddress.address}</p>
              <p>{selectedOrder.shippingAddress.city} {selectedOrder.shippingAddress.postalCode}</p>
              <p>{selectedOrder.shippingAddress.phone}</p>
            </div>
          </div>

          {/* Order Summary */}
          <div className="glass rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Order Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-purple-200">
                <span>Subtotal</span>
                <span className="text-white">{formatCurrency(selectedOrder.subtotal)}</span>
              </div>
              {selectedOrder.discount > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Discount</span>
                  <span>- {formatCurrency(selectedOrder.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-purple-200">
                <span>Shipping</span>
                <span className="text-white">
                  {selectedOrder.shipping === 0 ? 'FREE' : formatCurrency(selectedOrder.shipping)}
                </span>
              </div>
              <div className="border-t border-purple-500/30 pt-3 flex justify-between text-xl font-bold">
                <span className="text-white">Total</span>
                <span className="gradient-text">{formatCurrency(selectedOrder.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-white mb-6">My Orders</h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-full transition ${
                filter === status
                  ? 'purple-gradient text-white'
                  : 'glass text-purple-200 hover:bg-white/20'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-xl text-purple-200 mb-4">
              {filter === 'all' ? 'No orders yet' : `No ${filter} orders`}
            </p>
            <a
              href="/#products"
              className="inline-block purple-gradient text-white px-6 py-3 rounded-full hover:opacity-90 transition"
            >
              Start Shopping
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="glass border border-purple-500/20 rounded-lg p-6 hover:bg-white/5 transition cursor-pointer"
                onClick={() => setSelectedOrder(order)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-white font-semibold text-lg">Order #{order.orderNumber}</p>
                    <p className="text-sm text-purple-300">{formatDate(order.createdAt)}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getOrderStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status.toUpperCase()}
                  </span>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  {order.items.slice(0, 3).map((item, index) => (
                    <div
                      key={index}
                      className="w-12 h-12 purple-gradient-soft rounded-lg flex items-center justify-center text-xl"
                    >
                      {item.image}
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <span className="text-purple-300 text-sm">
                      +{order.items.length - 3} more
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-purple-200 text-sm">
                      {order.items.length} item(s) • {order.paymentMethod.toUpperCase()}
                    </p>
                    {order.trackingNumber && (
                      <p className="text-purple-300 text-xs">
                        Tracking: {order.trackingNumber}
                      </p>
                    )}
                  </div>
                  <p className="text-white font-bold text-lg">{formatCurrency(order.total)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function UserOrders() {
  return (
    <UserLayout>
      <Suspense fallback={
        <div className="glass-card rounded-2xl p-8">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⏳</div>
            <p className="text-xl text-purple-200">Loading orders...</p>
          </div>
        </div>
      }>
        <OrdersContent />
      </Suspense>
    </UserLayout>
  );
}
