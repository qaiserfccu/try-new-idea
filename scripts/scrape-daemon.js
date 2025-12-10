#!/usr/bin/env node

/**
 * ChiltanPure Product Scraping Daemon
 * 
 * This script continuously scrapes products from ChiltanPure every 2 hours
 * and updates the local database with the latest product information.
 * 
 * Usage:
 *   node scripts/scrape-daemon.js
 * 
 * Environment Variables:
 *   SCRAPE_INTERVAL_HOURS - Hours between scrapes (default: 2)
 *   API_BASE_URL - Base URL for the API (default: http://localhost:3100)
 */

const http = require('http');
const https = require('https');

// Configuration
const SCRAPE_INTERVAL_HOURS = parseInt(process.env.SCRAPE_INTERVAL_HOURS || '2', 10);
const SCRAPE_INTERVAL_MS = SCRAPE_INTERVAL_HOURS * 60 * 60 * 1000;
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3100';
const SCRAPE_ENDPOINT = '/api/scrape';

// State
let isRunning = false;
let lastScrapeTime = null;
let scrapeCount = 0;
let errorCount = 0;

// Logging utility
function log(level, message, data = null) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level,
    message,
    ...(data && { data })
  };
  console.log(JSON.stringify(logEntry));
}

// HTTP request helper
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const protocol = urlObj.protocol === 'https:' ? https : http;
    
    const req = protocol.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(data));
          } catch (error) {
            resolve(data);
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });
    
    req.on('error', reject);
    req.setTimeout(120000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

// Scrape products from ChiltanPure
async function scrapeProducts() {
  if (isRunning) {
    log('warn', 'Scraping already in progress, skipping...');
    return;
  }
  
  isRunning = true;
  const startTime = Date.now();
  
  try {
    log('info', 'Starting product scraping...');
    
    const url = `${API_BASE_URL}${SCRAPE_ENDPOINT}`;
    const result = await makeRequest(url);
    
    const duration = Date.now() - startTime;
    lastScrapeTime = new Date();
    scrapeCount++;
    
    log('info', 'Scraping completed successfully', {
      duration: `${duration}ms`,
      created: result.created,
      updated: result.updated,
      errors: result.errors,
      total: result.productsScraped
    });
    
    if (result.errors > 0) {
      log('warn', `Scraping had ${result.errors} errors`);
      errorCount += result.errors;
    }
    
  } catch (error) {
    errorCount++;
    log('error', 'Scraping failed', {
      error: error.message,
      stack: error.stack
    });
  } finally {
    isRunning = false;
  }
}

// Schedule next scrape
function scheduleNextScrape() {
  const nextScrapeTime = new Date(Date.now() + SCRAPE_INTERVAL_MS);
  log('info', 'Scheduling next scrape', {
    interval: `${SCRAPE_INTERVAL_HOURS} hours`,
    nextScrapeTime: nextScrapeTime.toISOString()
  });
  
  setTimeout(async () => {
    await scrapeProducts();
    scheduleNextScrape();
  }, SCRAPE_INTERVAL_MS);
}

// Health check endpoint (optional)
function startHealthCheckServer(port = 3101) {
  const server = http.createServer((req, res) => {
    if (req.url === '/health') {
      const health = {
        status: 'running',
        uptime: process.uptime(),
        lastScrapeTime,
        scrapeCount,
        errorCount,
        isCurrentlyRunning: isRunning,
        nextScrapeIn: lastScrapeTime 
          ? Math.max(0, SCRAPE_INTERVAL_MS - (Date.now() - lastScrapeTime.getTime()))
          : SCRAPE_INTERVAL_MS,
        config: {
          scrapeIntervalHours: SCRAPE_INTERVAL_HOURS,
          apiBaseUrl: API_BASE_URL
        }
      };
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(health, null, 2));
    } else {
      res.writeHead(404);
      res.end('Not Found');
    }
  });
  
  server.listen(port, () => {
    log('info', `Health check server listening on port ${port}`);
    log('info', `Health endpoint: http://localhost:${port}/health`);
  });
}

// Graceful shutdown
function setupShutdownHandlers() {
  const shutdown = async (signal) => {
    log('info', `Received ${signal}, shutting down gracefully...`);
    
    // Wait for current scraping to finish
    let waitTime = 0;
    while (isRunning && waitTime < 120000) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      waitTime += 1000;
    }
    
    log('info', 'Daemon stopped', {
      totalScrapes: scrapeCount,
      totalErrors: errorCount
    });
    
    process.exit(0);
  };
  
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

// Main function
async function main() {
  log('info', 'ChiltanPure Scraping Daemon starting...', {
    scrapeInterval: `${SCRAPE_INTERVAL_HOURS} hours`,
    apiBaseUrl: API_BASE_URL
  });
  
  setupShutdownHandlers();
  startHealthCheckServer();
  
  // Run initial scrape
  await scrapeProducts();
  
  // Schedule subsequent scrapes
  scheduleNextScrape();
  
  log('info', 'Daemon is now running. Press Ctrl+C to stop.');
}

// Start the daemon
if (require.main === module) {
  main().catch((error) => {
    log('error', 'Fatal error in daemon', {
      error: error.message,
      stack: error.stack
    });
    process.exit(1);
  });
}

module.exports = { scrapeProducts, log };
