"use client";

import { useState } from "react";
import AdminLayout from "../../components/AdminLayout";

type ScrapedProduct = {
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  stock?: number;
  url: string;
  images: string[];
  sku?: string;
};

type ImportResult = {
  productsScraped: number;
  created: number;
  updated: number;
  errors: number;
  timestamp?: string;
};

export default function CatalogSyncPage() {
  const [syncing, setSyncing] = useState(false);
  const [importing, setImporting] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string>("");
  const [lastSync, setLastSync] = useState<string>("");
  const [products, setProducts] = useState<ScrapedProduct[]>([]);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);

  const handlePreview = async () => {
    setSyncing(true);
    setSyncStatus("Fetching latest catalog preview...");
    setImportResult(null);

    try {
      const response = await fetch("/api/scrape?dryRun=true");
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to preview catalog");
      }

      setProducts(data.products || []);
      setLastSync(new Date().toLocaleString());
      setSyncStatus(`Preview ready: ${data.productsScraped} products scraped.`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      setSyncStatus(`Error previewing catalog: ${message}`);
      console.error("Catalog preview error:", error);
    } finally {
      setSyncing(false);
    }
  };

  const handleImport = async () => {
    setImporting(true);
    setSyncStatus("Importing catalog into the store...");

    try {
      const response = await fetch("/api/scrape", { method: "POST" });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to import catalog");
      }

      setImportResult({
        productsScraped: data.productsScraped,
        created: data.created,
        updated: data.updated,
        errors: data.errors,
        timestamp: data.timestamp,
      });
      setSyncStatus("Catalog import finished.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      setSyncStatus(`Error importing catalog: ${message}`);
      console.error("Catalog import error:", error);
    } finally {
      setImporting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Catalog Synchronization</h1>
            <p className="text-gray-600">Preview and import the latest ChiltanPure catalog.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handlePreview}
              disabled={syncing}
              className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {syncing ? "Fetching..." : "Preview Catalog"}
            </button>
            <button
              onClick={handleImport}
              disabled={importing}
              className="px-5 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {importing ? "Importing..." : "Import to Store"}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Sync Status</h2>
            {lastSync && <p className="text-sm text-gray-500">Last preview: {lastSync}</p>}
          </div>
          <p className="text-gray-700 min-h-[24px]">{syncStatus || "Waiting to start..."}</p>
          {importResult && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
              <Stat label="Scraped" value={importResult.productsScraped} accent="text-blue-600" />
              <Stat label="Created" value={importResult.created} accent="text-green-600" />
              <Stat label="Updated" value={importResult.updated} accent="text-yellow-600" />
              <Stat label="Errors" value={importResult.errors} accent="text-red-600" />
            </div>
          )}
        </div>

        {products.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Scraped Products</h2>
                <p className="text-sm text-gray-500">Preview of the latest scrape (first {products.length} items)</p>
              </div>
              <span className="text-sm text-gray-600">{products.length} items</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.map((product, index) => (
                <div key={`${product.url}-${index}`} className="border border-gray-200 rounded-lg p-4 space-y-3 bg-gray-50">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-lg font-semibold text-gray-900">{product.title}</p>
                      <p className="text-sm text-gray-500">{product.category}</p>
                    </div>
                    <div className="text-right">
                      {product.originalPrice && (
                        <p className="text-sm text-gray-400 line-through">Rs. {product.originalPrice}</p>
                      )}
                      <p className="text-xl font-bold text-gray-900">Rs. {product.price}</p>
                      {product.stock !== undefined && (
                        <p className="text-xs text-gray-500">Stock: {product.stock}</p>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 line-clamp-3">{product.description}</p>

                  <a
                    href={product.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-700 underline break-all"
                  >
                    {product.url}
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white space-y-3">
          <h3 className="text-xl font-semibold">About Catalog Sync</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">What gets synchronized:</h4>
              <ul className="text-sm space-y-1">
                <li>• Product names and descriptions</li>
                <li>• Pricing and discounts</li>
                <li>• Images and categories</li>
                <li>• Stock levels</li>
                <li>• Variants where available</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Behavior:</h4>
              <ul className="text-sm space-y-1">
                <li>• New products are added</li>
                <li>• Existing products are updated</li>
                <li>• Data is pulled from the live ChiltanPure catalog</li>
                <li>• Use preview first, then import</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <div className="p-3 rounded-lg bg-gray-100">
      <p className={`text-2xl font-bold ${accent}`}>{value}</p>
      <p className="text-sm text-gray-600">{label}</p>
    </div>
  );
}
