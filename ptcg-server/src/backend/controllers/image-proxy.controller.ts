import { Request, Response } from 'express';
import * as https from 'https';
import * as http from 'http';
import { URL } from 'url';
import { Controller, Get } from './controller';
import { RateLimit } from '../common/rate-limit';

/**
 * Allowed domains for image proxying (security: prevent SSRF attacks)
 * Includes common image hosting domains used for Pokemon card images
 */
const ALLOWED_DOMAINS = [
  // Pokemon card image sources
  'serebii.net',
  'www.serebii.net',
  'images.pokemontcg.io',
  'pokemontcg.io',
  'tcgplayer.com',
  'www.tcgplayer.com',
  'limitlesstcg.com',
  'www.limitlesstcg.com',
  'cdn.digitaloceanspaces.com', // DigitalOcean Spaces CDN (includes limitlesstcg.nyc3.cdn.digitaloceanspaces.com)
  // Common image hosting/CDN domains
  'imgur.com',
  'i.imgur.com',
  'githubusercontent.com',
  'raw.githubusercontent.com',
  'github.com',
  'cloudinary.com',
  'res.cloudinary.com',
  'cdn.discordapp.com',
  'media.discordapp.net',
  'i.redd.it',
  'preview.redd.it',
  'i.ibb.co',
  'ibb.co',
  'images.unsplash.com',
  'unsplash.com'
];

/**
 * Image proxy controller to fetch external images server-side
 * and serve them with proper CORS headers to avoid CORS issues in the browser
 */
export class ImageProxy extends Controller {
  private rateLimit: RateLimit;

  constructor(path: string, app: any, db: any, core: any) {
    super(path, app, db, core);
    this.rateLimit = RateLimit.getInstance();
  }

  @Get('/proxy')
  public async onProxy(req: Request, res: Response): Promise<void> {
    const urlParam = req.query.url as string;

    // Validate URL parameter
    if (!urlParam || typeof urlParam !== 'string') {
      res.status(400).json({ error: 'Missing or invalid url parameter' });
      return;
    }

    // Rate limiting
    if (this.rateLimit.isLimitExceeded(req.ip)) {
      res.status(429).json({ error: 'Rate limit exceeded' });
      return;
    }
    this.rateLimit.increment(req.ip);

    try {
      // Parse and validate URL
      let targetUrl: URL;
      try {
        targetUrl = new URL(urlParam);
      } catch (error) {
        res.status(400).json({ error: 'Invalid URL format' });
        return;
      }

      // Security: Only allow specific domains to prevent SSRF attacks
      const hostname = targetUrl.hostname.toLowerCase();
      const isAllowed = ALLOWED_DOMAINS.some(domain => 
        hostname === domain || hostname.endsWith('.' + domain)
      );

      if (!isAllowed) {
        // Log rejected domains for debugging - helps identify which domains need to be added
        console.warn('[ImageProxy] Domain not allowed:', hostname, 'from URL:', urlParam.substring(0, 100));
        res.status(403).json({ 
          error: 'Domain not allowed',
          message: `Domain ${hostname} is not in the allowed list`
        });
        return;
      }

      // Determine content type from URL extension
      const contentType = this.getContentType(targetUrl.pathname);

      // Fetch the image
      const protocol = targetUrl.protocol === 'https:' ? https : http;
      
      protocol.get(targetUrl.href, (proxyRes) => {
        // Check for successful response
        if (proxyRes.statusCode !== 200) {
          res.status(proxyRes.statusCode || 500).json({ 
            error: 'Failed to fetch image',
            statusCode: proxyRes.statusCode 
          });
          return;
        }

        // Set CORS headers
        const origin = req.headers.origin;
        if (origin) {
          res.setHeader('Access-Control-Allow-Origin', origin);
        }
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        // Set content type (use from response if available, otherwise infer from URL)
        const responseContentType = proxyRes.headers['content-type'] || contentType;
        res.setHeader('Content-Type', responseContentType);

        // Set cache headers (cache for 1 day)
        res.setHeader('Cache-Control', 'public, max-age=86400');

        // Stream the image data
        proxyRes.pipe(res);
      }).on('error', (error) => {
        console.error('[ImageProxy] Error fetching image:', error.message);
        if (!res.headersSent) {
          res.status(500).json({ 
            error: 'Failed to fetch image',
            message: error.message 
          });
        }
      });

    } catch (error: any) {
      console.error('[ImageProxy] Unexpected error:', error);
      if (!res.headersSent) {
        res.status(500).json({ 
          error: 'Internal server error',
          message: error?.message || 'Unknown error'
        });
      }
    }
  }

  /**
   * Determine content type from file extension
   */
  private getContentType(pathname: string): string {
    const extension = pathname.toLowerCase().split('.').pop() || '';
    
    switch (extension) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'gif':
        return 'image/gif';
      case 'webp':
        return 'image/webp';
      case 'svg':
        return 'image/svg+xml';
      default:
        return 'image/jpeg'; // Default fallback
    }
  }
}
