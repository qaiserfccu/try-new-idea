'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface Quotation {
  id: string;
  date: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    company: string;
    address: string;
    notes: string;
  };
  items: Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
    category: string;
    image: string;
  }>;
  totalPrice: number;
}

export default function QuotationsPage() {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [selectedQuote, setSelectedQuote] = useState<Quotation | null>(null);

  useEffect(() => {
    // Load quotations from localStorage
    const storedQuotes = localStorage.getItem('quotations');
    if (storedQuotes) {
      setQuotations(JSON.parse(storedQuotes));
    }
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const deleteQuotation = (quoteId: string) => {
    if (confirm('Are you sure you want to delete this quotation?')) {
      const updatedQuotations = quotations.filter(q => q.id !== quoteId);
      setQuotations(updatedQuotations);
      localStorage.setItem('quotations', JSON.stringify(updatedQuotations));
      if (selectedQuote?.id === quoteId) {
        setSelectedQuote(null);
      }
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Quotation Management</h1>
          <p className="text-xl text-purple-200">View and manage all customer quotations</p>
        </div>

        {quotations.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center">
            <div className="text-8xl mb-6">📋</div>
            <h2 className="text-3xl font-bold text-white mb-4">No Quotations Yet</h2>
            <p className="text-xl text-purple-200 mb-8">
              Quotations submitted by customers will appear here.
            </p>
            <Link
              href="/#products"
              className="inline-block purple-gradient text-white px-8 py-4 rounded-full hover:opacity-90 transition font-semibold text-lg"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quotations List */}
            <div className="lg:col-span-1 space-y-4">
              <h2 className="text-2xl font-bold text-white mb-4">
                All Quotations ({quotations.length})
              </h2>
              {quotations.map((quote) => (
                <div
                  key={quote.id}
                  onClick={() => setSelectedQuote(quote)}
                  className={`glass-card rounded-xl p-4 cursor-pointer transition-all hover:scale-105 ${
                    selectedQuote?.id === quote.id ? 'ring-2 ring-purple-500' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-mono text-purple-300">{quote.id}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteQuotation(quote.id);
                      }}
                      className="text-red-400 hover:text-red-300"
                      title="Delete quotation"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-white font-semibold">{quote.customer.name}</p>
                  <p className="text-sm text-purple-200">{quote.customer.email}</p>
                  <div className="mt-2 pt-2 border-t border-purple-500/30">
                    <div className="flex justify-between text-sm">
                      <span className="text-purple-300">
                        {quote.items.length} item(s)
                      </span>
                      <span className="text-white font-bold">
                        ر.س {quote.totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-purple-400 mt-2">
                    {formatDate(quote.date)}
                  </p>
                </div>
              ))}
            </div>

            {/* Quotation Details */}
            <div className="lg:col-span-2">
              {selectedQuote ? (
                <div className="glass-card rounded-2xl p-8">
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-3xl font-bold text-white">
                        Quotation Details
                      </h2>
                      <span className="text-sm font-mono text-purple-300 px-4 py-2 glass rounded-full">
                        {selectedQuote.id}
                      </span>
                    </div>
                    <p className="text-purple-200">
                      Created: {formatDate(selectedQuote.date)}
                    </p>
                  </div>

                  {/* Customer Information */}
                  <div className="mb-8 p-6 glass rounded-xl">
                    <h3 className="text-xl font-bold text-white mb-4">
                      Customer Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-purple-300">Name</p>
                        <p className="text-white font-semibold">
                          {selectedQuote.customer.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-purple-300">Email</p>
                        <p className="text-white font-semibold">
                          {selectedQuote.customer.email}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-purple-300">Phone</p>
                        <p className="text-white font-semibold">
                          {selectedQuote.customer.phone}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-purple-300">Company</p>
                        <p className="text-white font-semibold">
                          {selectedQuote.customer.company || 'N/A'}
                        </p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-sm text-purple-300">Address</p>
                        <p className="text-white font-semibold">
                          {selectedQuote.customer.address}
                        </p>
                      </div>
                      {selectedQuote.customer.notes && (
                        <div className="md:col-span-2">
                          <p className="text-sm text-purple-300">Notes</p>
                          <p className="text-white">
                            {selectedQuote.customer.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Items */}
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-white mb-4">
                      Ordered Items
                    </h3>
                    <div className="space-y-3">
                      {selectedQuote.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-4 p-4 glass rounded-xl"
                        >
                          <div className="w-16 h-16 purple-gradient-soft rounded-lg flex items-center justify-center text-3xl flex-shrink-0">
                            {item.image}
                          </div>
                          <div className="flex-grow">
                            <p className="text-white font-semibold">{item.name}</p>
                            <p className="text-sm text-purple-300">
                              {item.category}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-white font-semibold">
                              Qty: {item.quantity}
                            </p>
                            <p className="text-purple-200">
                              ر.س {item.price.toFixed(2)} each
                            </p>
                          </div>
                          <div className="text-right min-w-[100px]">
                            <p className="text-lg font-bold gradient-text">
                              ر.س {(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Total */}
                  <div className="p-6 purple-gradient-soft rounded-xl">
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-white">
                        Total Amount
                      </span>
                      <span className="text-3xl font-bold gradient-text">
                        ر.س {selectedQuote.totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 flex gap-4">
                    <button
                      onClick={() => window.print()}
                      className="flex-1 purple-gradient text-white px-6 py-3 rounded-full hover:opacity-90 transition font-semibold"
                    >
                      Print Quotation
                    </button>
                    <button
                      onClick={() => deleteQuotation(selectedQuote.id)}
                      className="glass text-red-300 hover:bg-red-500/20 px-6 py-3 rounded-full transition font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ) : (
                <div className="glass-card rounded-2xl p-12 text-center h-full flex items-center justify-center">
                  <div>
                    <div className="text-6xl mb-4">👈</div>
                    <p className="text-xl text-purple-200">
                      Select a quotation from the list to view details
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
