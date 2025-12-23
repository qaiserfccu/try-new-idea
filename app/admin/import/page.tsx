'use client';

import { useState } from 'react';

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      setError(null);
    } else {
      setFile(null);
      setError('Please select a valid CSV file');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/import-csv', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error || 'Import failed');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Import Products from CSV</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Upload CSV File</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select CSV File
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          <button
            type="submit"
            disabled={!file || loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Importing...' : 'Import Products'}
          </button>
        </form>
      </div>

      {result && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-800 mb-4">Import Results</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{result.productsProcessed}</div>
              <div className="text-sm text-green-700">Processed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{result.created}</div>
              <div className="text-sm text-blue-700">Created</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{result.updated}</div>
              <div className="text-sm text-yellow-700">Updated</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{result.errors}</div>
              <div className="text-sm text-red-700">Errors</div>
            </div>
          </div>
          <div className="mt-4 text-sm text-green-700">
            Completed at: {new Date(result.timestamp).toLocaleString()}
          </div>
        </div>
      )}

      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">CSV Format Requirements</h3>
        <p className="text-sm text-gray-600 mb-4">
          Your CSV file should contain the following columns (case-insensitive):
        </p>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Column</th>
                <th className="text-left py-2">Required</th>
                <th className="text-left py-2">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-2">name</td>
                <td className="py-2 text-green-600">Yes</td>
                <td className="py-2">Product name</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">description</td>
                <td className="py-2 text-gray-600">No</td>
                <td className="py-2">Product description</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">price</td>
                <td className="py-2 text-green-600">Yes</td>
                <td className="py-2">Product price (numeric)</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">originalPrice</td>
                <td className="py-2 text-gray-600">No</td>
                <td className="py-2">Original price if on sale</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">chiltanpureUrl</td>
                <td className="py-2 text-gray-600">No</td>
                <td className="py-2">URL from ChiltanPure website</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">images</td>
                <td className="py-2 text-gray-600">No</td>
                <td className="py-2">Comma-separated image URLs</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">category</td>
                <td className="py-2 text-gray-600">No</td>
                <td className="py-2">Product category</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">stock</td>
                <td className="py-2 text-gray-600">No</td>
                <td className="py-2">Stock quantity</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">sku</td>
                <td className="py-2 text-gray-600">No</td>
                <td className="py-2">Stock keeping unit</td>
              </tr>
              <tr>
                <td className="py-2">variants</td>
                <td className="py-2 text-gray-600">No</td>
                <td className="py-2">JSON string of product variants</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}