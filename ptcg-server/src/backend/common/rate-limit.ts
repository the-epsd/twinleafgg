import { config } from '../../config';

interface RateLimitItem {
  ip: string;
  count: number;
  lastRequest: number;
}

export class RateLimit {

  private items: RateLimitItem[] = [];
  private static instance: RateLimit = new RateLimit();
  private lastCleanup: number = 0;
  private readonly CLEANUP_INTERVAL = 60000; // Clean up every minute

  public static getInstance(): RateLimit {
    return RateLimit.instance;
  }

  public isLimitExceeded(ip: string): boolean {
    this.cleanupIfNeeded();

    const rateLimit = this.items.find(i => i.ip === ip);
    if (rateLimit === undefined) {
      return false;
    }

    const expire = Date.now() - config.backend.rateLimitTime;
    if (rateLimit.lastRequest < expire) {
      return false;
    }

    if (rateLimit.count < config.backend.rateLimitCount) {
      return false;
    }

    return true;
  }

  public increment(ip: string) {
    this.cleanupIfNeeded();
    let rateLimit = this.items.find(i => i.ip === ip);

    const now = Date.now();
    const expire = now - config.backend.rateLimitTime;

    if (rateLimit === undefined) {
      rateLimit = { ip, lastRequest: now, count: 1 };
      this.items.push(rateLimit);
      return;
    }

    if (rateLimit.lastRequest < expire) {
      rateLimit.count = 1;
    } else {
      rateLimit.count += 1;
    }
    rateLimit.lastRequest = now;
  }

  private cleanupIfNeeded(): void {
    const now = Date.now();
    if (now - this.lastCleanup < this.CLEANUP_INTERVAL) {
      return;
    }

    const expire = now - config.backend.rateLimitTime;
    this.items = this.items.filter(i => i.lastRequest >= expire);
    this.lastCleanup = now;
  }

}
