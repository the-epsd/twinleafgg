import { config } from '../../config';

interface RateLimitItem {
  ip: string;
  count: number;
  lastRequest: number;
  type: 'http' | 'websocket';
}

export class RateLimit {

  private items: RateLimitItem[] = [];
  private static instance: RateLimit = new RateLimit();

  public static getInstance(): RateLimit {
    return RateLimit.instance;
  }

  public isLimitExceeded(ip: string, type: 'http' | 'websocket' = 'http'): boolean {
    this.deleteExpired();

    const rateLimit = this.items.find(i => i.ip === ip && i.type === type);
    if (rateLimit === undefined) {
      return false;
    }

    const limit = type === 'websocket'
      ? config.backend.wsRateLimitCount || config.backend.rateLimitCount * 2
      : config.backend.rateLimitCount;

    return rateLimit.count >= limit;
  }

  public increment(ip: string, type: 'http' | 'websocket' = 'http'): void {
    let rateLimit = this.items.find(i => i.ip === ip && i.type === type);

    if (rateLimit === undefined) {
      rateLimit = { ip, type, lastRequest: 0, count: 0 };
      this.items.push(rateLimit);
    }

    rateLimit.lastRequest = Date.now();
    rateLimit.count += 1;
  }

  public getCurrentCount(ip: string, type: 'http' | 'websocket' = 'http'): number {
    const rateLimit = this.items.find(i => i.ip === ip && i.type === type);
    return rateLimit?.count || 0;
  }

  public getRetryAfter(ip: string, type: 'http' | 'websocket' = 'http'): number {
    const rateLimit = this.items.find(i => i.ip === ip && i.type === type);
    if (!rateLimit) {
      return 0;
    }

    const timeLeft = (rateLimit.lastRequest + config.backend.rateLimitTime) - Date.now();
    return Math.max(0, timeLeft);
  }

  private deleteExpired(): void {
    const expire = Date.now() - config.backend.rateLimitTime;
    this.items = this.items.filter(i => i.lastRequest >= expire);
  }

}