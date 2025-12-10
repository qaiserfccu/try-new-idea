# ChiltanPure Product Scraping Daemon

## Overview

This daemon automatically scrapes product information from ChiltanPure.com every 2 hours and updates the local product database. All products include the referral code `bg_ref=XEUldZfjcO`.

## Features

- **Automatic Scraping**: Runs every 2 hours (configurable)
- **Product Upsert**: Creates new products or updates existing ones
- **Variant Support**: Handles product variants (sizes, quantities, etc.)
- **Health Check**: Provides a health endpoint to monitor daemon status
- **Error Handling**: Robust error handling and logging
- **Graceful Shutdown**: Properly handles SIGTERM and SIGINT signals

## Usage

### Running the Daemon

```bash
# Using npm script
npm run scrape

# Or directly with node
node scripts/scrape-daemon.js
```

### Manual Single Scrape

To trigger a single scrape without running the daemon:

```bash
# Using npm script (requires the Next.js app to be running)
npm run scrape:once

# Or using curl directly
curl http://localhost:3100/api/scrape
```

### Dry Run Mode

To preview products without saving to database:

```bash
curl http://localhost:3100/api/scrape?dryRun=true
```

## Configuration

Configure the daemon using environment variables:

```bash
# Set scrape interval (in hours, default: 2)
export SCRAPE_INTERVAL_HOURS=2

# Set API base URL (default: http://localhost:3100)
export API_BASE_URL=http://localhost:3100

# Run the daemon
npm run scrape
```

## Health Check

The daemon exposes a health check endpoint on port 3101:

```bash
curl http://localhost:3101/health
```

Response example:
```json
{
  "status": "running",
  "uptime": 3600,
  "lastScrapeTime": "2024-12-10T09:30:00.000Z",
  "scrapeCount": 12,
  "errorCount": 0,
  "isCurrentlyRunning": false,
  "nextScrapeIn": 5400000,
  "config": {
    "scrapeIntervalHours": 2,
    "apiBaseUrl": "http://localhost:3100"
  }
}
```

## Production Deployment

### Using PM2

```bash
# Install PM2
npm install -g pm2

# Start the daemon with PM2
pm2 start scripts/scrape-daemon.js --name chiltanpure-scraper

# Set to restart on system reboot
pm2 startup
pm2 save
```

### Using Docker

Create a `Dockerfile.scraper`:

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY scripts/scrape-daemon.js ./scripts/

ENV SCRAPE_INTERVAL_HOURS=2
ENV API_BASE_URL=http://app:3100

CMD ["node", "scripts/scrape-daemon.js"]
```

Build and run:

```bash
docker build -f Dockerfile.scraper -t chiltanpure-scraper .
docker run -d --name scraper -e DATABASE_URL=$DATABASE_URL chiltanpure-scraper
```

### Using systemd

Create `/etc/systemd/system/chiltanpure-scraper.service`:

```ini
[Unit]
Description=ChiltanPure Product Scraping Daemon
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/chiltanpure
Environment="SCRAPE_INTERVAL_HOURS=2"
Environment="API_BASE_URL=http://localhost:3100"
ExecStart=/usr/bin/node /var/www/chiltanpure/scripts/scrape-daemon.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable and start:

```bash
sudo systemctl enable chiltanpure-scraper
sudo systemctl start chiltanpure-scraper
sudo systemctl status chiltanpure-scraper
```

## Logging

The daemon outputs JSON-formatted logs to stdout:

```json
{
  "timestamp": "2024-12-10T09:30:00.000Z",
  "level": "info",
  "message": "Scraping completed successfully",
  "data": {
    "duration": "5234ms",
    "created": 5,
    "updated": 15,
    "errors": 0,
    "total": 20
  }
}
```

### Log Levels

- `info`: Normal operation logs
- `warn`: Warning messages (e.g., scraping errors on specific products)
- `error`: Error messages (e.g., failed scrape attempt)

### Viewing Logs

With PM2:
```bash
pm2 logs chiltanpure-scraper
```

With systemd:
```bash
sudo journalctl -u chiltanpure-scraper -f
```

## Implementing Real Scraping

The current implementation uses simulated data. To implement real scraping:

1. Install scraping dependencies:
   ```bash
   npm install puppeteer cheerio
   ```

2. Update `app/api/scrape/route.ts`:
   - Replace `simulateScrapingCategory()` with real HTTP requests
   - Use Cheerio to parse HTML or Puppeteer for dynamic pages
   - Extract product data from ChiltanPure's HTML structure

3. Example with Cheerio:
   ```typescript
   import * as cheerio from 'cheerio';
   
   async function scrapeCategory(category: string) {
     const response = await fetch(`https://chiltanpure.com/collections/${category}`);
     const html = await response.text();
     const $ = cheerio.load(html);
     
     const products = [];
     $('.product-item').each((i, elem) => {
       products.push({
         name: $(elem).find('.product-title').text(),
         price: parseFloat($(elem).find('.price').text().replace(/[^0-9.]/g, '')),
         // ... extract other fields
       });
     });
     
     return products;
   }
   ```

## Monitoring

### Metrics to Monitor

- Scrape success rate
- Number of products created/updated
- Scrape duration
- Error count
- Daemon uptime

### Alerting

Set up alerts for:
- Daemon is down (health check fails)
- High error rate (>10% of products fail)
- Scrape duration exceeds threshold
- No successful scrape in last 4 hours

## Troubleshooting

### Daemon Won't Start

1. Check if port 3101 is already in use
2. Verify Node.js version (requires 20+)
3. Check database connection

### Scraping Fails

1. Verify the Next.js app is running on the configured port
2. Check database connection
3. Review error logs for specific issues

### High Memory Usage

If using real scraping with Puppeteer, configure memory limits:

```bash
export NODE_OPTIONS="--max-old-space-size=2048"
npm run scrape
```

## API Reference

### GET/POST /api/scrape

Triggers product scraping from ChiltanPure.

**Query Parameters:**
- `dryRun` (boolean): Preview mode, doesn't save to database

**Response:**
```json
{
  "success": true,
  "productsScraped": 20,
  "created": 5,
  "updated": 15,
  "errors": 0,
  "timestamp": "2024-12-10T09:30:00.000Z"
}
```

## Support

For issues or questions:
- Check the logs first
- Review the health endpoint
- Open an issue in the repository
