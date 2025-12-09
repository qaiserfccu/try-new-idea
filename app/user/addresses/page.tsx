'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useAuth } from '../../context/AuthContext';
import UserLayout from '../../components/UserLayout';
import { Address } from '../../lib/types';
import { generateId } from '../../lib/utils';

export default function UserAddresses() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    label: '',
    name: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
  });

  useEffect(() => {
    const savedAddresses = JSON.parse(localStorage.getItem('chiltanpure_addresses') || '[]');
    const userAddresses = savedAddresses.filter((addr: Address) => addr.userId === user?.id);
    setAddresses(userAddresses);
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (editingId) {
      // Update existing address
      const updated = addresses.map(addr => 
        addr.id === editingId ? { ...addr, ...formData } : addr
      );
      setAddresses(updated);
      
      const allAddresses = JSON.parse(localStorage.getItem('chiltanpure_addresses') || '[]');
      const otherAddresses = allAddresses.filter((addr: Address) => addr.userId !== user?.id);
      localStorage.setItem('chiltanpure_addresses', JSON.stringify([...otherAddresses, ...updated]));
      
      setEditingId(null);
    } else {
      // Add new address
      const newAddress: Address = {
        id: generateId(),
        userId: user?.id || '',
        ...formData,
        isDefault: addresses.length === 0,
      };
      
      const updated = [...addresses, newAddress];
      setAddresses(updated);
      
      const allAddresses = JSON.parse(localStorage.getItem('chiltanpure_addresses') || '[]');
      localStorage.setItem('chiltanpure_addresses', JSON.stringify([...allAddresses, newAddress]));
      
      setIsAdding(false);
    }

    setFormData({ label: '', name: '', phone: '', address: '', city: '', postalCode: '' });
  };

  const handleEdit = (address: Address) => {
    setEditingId(address.id);
    setFormData({
      label: address.label,
      name: address.name,
      phone: address.phone,
      address: address.address,
      city: address.city,
      postalCode: address.postalCode || '',
    });
    setIsAdding(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    
    const updated = addresses.filter(addr => addr.id !== id);
    setAddresses(updated);
    
    const allAddresses = JSON.parse(localStorage.getItem('chiltanpure_addresses') || '[]');
    const filtered = allAddresses.filter((addr: Address) => addr.id !== id);
    localStorage.setItem('chiltanpure_addresses', JSON.stringify(filtered));
  };

  const setAsDefault = (id: string) => {
    const updated = addresses.map(addr => ({ ...addr, isDefault: addr.id === id }));
    setAddresses(updated);
    
    const allAddresses = JSON.parse(localStorage.getItem('chiltanpure_addresses') || '[]');
    const otherAddresses = allAddresses.filter((addr: Address) => addr.userId !== user?.id);
    localStorage.setItem('chiltanpure_addresses', JSON.stringify([...otherAddresses, ...updated]));
  };

  return (
    <UserLayout>
      <div className="space-y-6">
        <div className="glass-card rounded-2xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-white">My Addresses</h1>
            {!isAdding && (
              <button
                onClick={() => setIsAdding(true)}
                className="purple-gradient text-white px-6 py-2 rounded-full hover:opacity-90 transition"
              >
                + Add Address
              </button>
            )}
          </div>

          {/* Add/Edit Form */}
          {isAdding && (
            <div className="glass rounded-xl p-6 mb-6">
              <h3 className="text-xl font-bold text-white mb-4">
                {editingId ? 'Edit Address' : 'Add New Address'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-purple-200 mb-2">
                      Label (e.g., Home, Office)
                    </label>
                    <input
                      type="text"
                      name="label"
                      required
                      value={formData.label}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-white/10 border border-purple-300/30 rounded-lg focus:ring-2 focus:ring-purple-500 text-white"
                      placeholder="Home"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-purple-200 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-white/10 border border-purple-300/30 rounded-lg focus:ring-2 focus:ring-purple-500 text-white"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-purple-200 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-white/10 border border-purple-300/30 rounded-lg focus:ring-2 focus:ring-purple-500 text-white"
                      placeholder="+92 300 1234567"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-purple-200 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-white/10 border border-purple-300/30 rounded-lg focus:ring-2 focus:ring-purple-500 text-white"
                      placeholder="Lahore"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-purple-200 mb-2">
                      Street Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-white/10 border border-purple-300/30 rounded-lg focus:ring-2 focus:ring-purple-500 text-white"
                      placeholder="123 Main Street"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-purple-200 mb-2">
                      Postal Code (Optional)
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-white/10 border border-purple-300/30 rounded-lg focus:ring-2 focus:ring-purple-500 text-white"
                      placeholder="54000"
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 purple-gradient text-white px-6 py-2 rounded-full hover:opacity-90 transition"
                  >
                    {editingId ? 'Update Address' : 'Save Address'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAdding(false);
                      setEditingId(null);
                      setFormData({ label: '', name: '', phone: '', address: '', city: '', postalCode: '' });
                    }}
                    className="flex-1 glass text-purple-200 hover:bg-white/20 px-6 py-2 rounded-full transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Addresses List */}
          {addresses.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📍</div>
              <p className="text-xl text-purple-200 mb-4">No addresses saved yet</p>
              <p className="text-purple-300">Add your delivery addresses for faster checkout</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className={`glass rounded-xl p-6 ${
                    address.isDefault ? 'border-2 border-purple-500' : 'border border-purple-500/20'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white">{address.label}</h3>
                      {address.isDefault && (
                        <span className="text-xs purple-gradient text-white px-2 py-1 rounded-full inline-block mt-1">
                          Default
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(address)}
                        className="text-purple-400 hover:text-purple-300"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(address.id)}
                        className="text-red-400 hover:text-red-300"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  <div className="text-purple-200 space-y-1 mb-4">
                    <p className="font-semibold text-white">{address.name}</p>
                    <p>{address.address}</p>
                    <p>{address.city} {address.postalCode}</p>
                    <p>{address.phone}</p>
                  </div>
                  {!address.isDefault && (
                    <button
                      onClick={() => setAsDefault(address.id)}
                      className="text-purple-400 hover:text-purple-300 text-sm"
                    >
                      Set as default
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </UserLayout>
  );
}
