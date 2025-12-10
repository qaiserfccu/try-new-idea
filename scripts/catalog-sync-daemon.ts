import * as cron from 'node-cron';
import axios from 'axios';

const CATALOG_SYNC_URL = process.env.NODE_ENV === 'production'
  ? 'https://your-domain.com/api/admin/catalog-sync'
  : 'http://localhost:3100/api/admin/catalog-sync';

class CatalogSyncDaemon {
  private isRunning = false;

  constructor() {
    this.setupCronJob();
    console.log('🕒 Catalog Sync Daemon started - will sync every 2 hours');
  }

  private setupCronJob() {
    // Run every 2 hours: '0 */2 * * *'
    // For testing, you can use more frequent intervals like '*/5 * * * *' (every 5 minutes)
    cron.schedule('0 */2 * * *', async () => {
      await this.runCatalogSync();
    });

    // Also run immediately on startup
    setTimeout(() => {
      this.runCatalogSync();
    }, 5000); // Wait 5 seconds after startup
  }

  private async runCatalogSync() {
    if (this.isRunning) {
      console.log('⏳ Catalog sync already running, skipping...');
      return;
    }

    this.isRunning = true;
    const startTime = new Date();

    try {
      console.log('🔄 Starting scheduled catalog sync...');

      const response = await axios.post(CATALOG_SYNC_URL, {}, {
        headers: {
          'Content-Type': 'application/json',
          // Add authentication headers if needed
          // 'Authorization': `Bearer ${process.env.ADMIN_TOKEN}`,
        },
        timeout: 300000, // 5 minutes timeout
      });

      const endTime = new Date();
      const duration = (endTime.getTime() - startTime.getTime()) / 1000;

      console.log(`✅ Catalog sync completed in ${duration}s`);
      console.log(`📊 Results: ${JSON.stringify(response.data, null, 2)}`);

    } catch (error) {
      const endTime = new Date();
      const duration = (endTime.getTime() - startTime.getTime()) / 1000;

      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`❌ Catalog sync failed after ${duration}s:`, errorMessage);

      // Send notification about failure (you can integrate with email/SMS services)
      await this.notifyFailure(error);
    } finally {
      this.isRunning = false;
    }
  }

  private async notifyFailure(error: any) {
    // Implement notification logic here
    // Could send email, SMS, or post to monitoring service
    console.error('🚨 Catalog sync failure notification:', {
      timestamp: new Date().toISOString(),
      error: error.message,
      details: error.response?.data
    });
  }

  // Manual trigger method for testing
  public async triggerSync() {
    console.log('🔧 Manual catalog sync triggered');
    await this.runCatalogSync();
  }

  // Health check method
  public getStatus() {
    return {
      isRunning: this.isRunning,
      nextRun: this.getNextRunTime(),
      lastRun: this.getLastRunTime()
    };
  }

  private getNextRunTime(): string {
    // Calculate next cron run time
    const now = new Date();
    const nextRun = new Date(now);

    // Find next 2-hour interval
    const currentHour = now.getHours();
    const nextHour = Math.ceil((currentHour + 1) / 2) * 2;
    nextRun.setHours(nextHour % 24, 0, 0, 0);

    if (nextRun <= now) {
      nextRun.setDate(nextRun.getDate() + 1);
    }

    return nextRun.toISOString();
  }

  private getLastRunTime(): string | null {
    // This would need to be tracked separately in a real implementation
    return null;
  }
}

// Export for use in other modules
export default CatalogSyncDaemon;

// If run directly, start the daemon
if (require.main === module) {
  const daemon = new CatalogSyncDaemon();

  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('🛑 Shutting down Catalog Sync Daemon...');
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    console.log('🛑 Shutting down Catalog Sync Daemon...');
    process.exit(0);
  });
}