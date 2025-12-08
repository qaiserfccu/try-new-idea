'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { User } from '../../lib/types';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const savedUsers = JSON.parse(localStorage.getItem('chiltanpure_users') || '[]');
    setUsers(savedUsers);
  }, []);

  return (
    <AdminLayout>
      <div className="glass-card rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-white mb-4">User Management</h1>
        <p className="text-purple-200 mb-6">
          View and manage all registered users.
        </p>

        {users.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">👥</div>
            <p className="text-xl text-purple-200">No users yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="glass border border-purple-500/20 rounded-lg p-6"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 purple-gradient rounded-full flex items-center justify-center text-white font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-semibold">{user.name}</p>
                    <p className="text-purple-300 text-sm">{user.email}</p>
                  </div>
                  <div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
                      user.role === 'admin' ? 'bg-purple-500' : 'bg-blue-500'
                    }`}>
                      {user.role.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="mt-4 text-sm text-purple-300">
                  <p>Phone: {user.phone || 'Not provided'}</p>
                  <p>Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
