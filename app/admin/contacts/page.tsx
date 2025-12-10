'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';

interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'responded';
  created_at: string;
  updated_at: string;
}

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [filter, setFilter] = useState<'all' | 'new' | 'read' | 'responded'>('all');

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/contacts');
      if (!response.ok) {
        throw new Error('Failed to fetch contacts');
      }
      const data = await response.json();
      setContacts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const updateContactStatus = async (id: number, status: 'new' | 'read' | 'responded') => {
    try {
      const response = await fetch(`/api/admin/contacts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        throw new Error('Failed to update contact status');
      }

      await fetchContacts();
      if (selectedContact?.id === id) {
        setSelectedContact({ ...selectedContact, status });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const sendResponse = async () => {
    if (!selectedContact || !responseMessage.trim()) return;

    try {
      const response = await fetch(`/api/admin/contacts/${selectedContact.id}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: responseMessage })
      });

      if (!response.ok) {
        throw new Error('Failed to send response');
      }

      await updateContactStatus(selectedContact.id, 'responded');
      setResponseMessage('');
      alert('Response sent successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const filteredContacts = contacts.filter(contact => {
    if (filter === 'all') return true;
    return contact.status === filter;
  });

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Contact Submissions</h1>
          <button
            onClick={fetchContacts}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">Error: {error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contact List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-3 py-1 text-sm rounded ${filter === 'all' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}
                  >
                    All ({contacts.length})
                  </button>
                  <button
                    onClick={() => setFilter('new')}
                    className={`px-3 py-1 text-sm rounded ${filter === 'new' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}
                  >
                    New ({contacts.filter(c => c.status === 'new').length})
                  </button>
                  <button
                    onClick={() => setFilter('responded')}
                    className={`px-3 py-1 text-sm rounded ${filter === 'responded' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}
                  >
                    Responded ({contacts.filter(c => c.status === 'responded').length})
                  </button>
                </div>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {filteredContacts.map((contact) => (
                  <div
                    key={contact.id}
                    onClick={() => setSelectedContact(contact)}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                      selectedContact?.id === contact.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 truncate">{contact.name}</h3>
                        <p className="text-sm text-gray-500 truncate">{contact.subject}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(contact.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ml-2 ${
                        contact.status === 'new' ? 'bg-green-100 text-green-800' :
                        contact.status === 'read' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {contact.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-2">
            {selectedContact ? (
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{selectedContact.subject}</h2>
                      <p className="text-gray-600 mt-1">From: {selectedContact.name} ({selectedContact.email})</p>
                      {selectedContact.phone && (
                        <p className="text-gray-600">Phone: {selectedContact.phone}</p>
                      )}
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(selectedContact.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      {selectedContact.status === 'new' && (
                        <button
                          onClick={() => updateContactStatus(selectedContact.id, 'read')}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                        >
                          Mark as Read
                        </button>
                      )}
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${
                        selectedContact.status === 'new' ? 'bg-green-100 text-green-800' :
                        selectedContact.status === 'read' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {selectedContact.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h3 className="font-medium text-gray-900 mb-2">Message:</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedContact.message}</p>
                  </div>

                  {selectedContact.status !== 'responded' && (
                    <div className="border-t pt-6">
                      <h3 className="font-medium text-gray-900 mb-3">Send Response</h3>
                      <textarea
                        value={responseMessage}
                        onChange={(e) => setResponseMessage(e.target.value)}
                        placeholder="Type your response here..."
                        className="w-full border border-gray-300 rounded-md shadow-sm p-3 h-32 resize-none"
                      />
                      <div className="flex justify-end mt-3">
                        <button
                          onClick={sendResponse}
                          disabled={!responseMessage.trim()}
                          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
                        >
                          Send Response
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <div className="text-6xl mb-4">📧</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a contact</h3>
                <p className="text-gray-500">Choose a contact from the list to view details and respond</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
