import { Request, Response } from 'express';
import * as https from 'https';
import * as http from 'http';
import { Controller, Get } from './controller';
import { config } from '../../config';

export class Images extends Controller {

  @Get('/proxy')
  public async onProxy(req: Request, res: Response) {
    const rawUrl = req.query.url;
    if (typeof rawUrl !== 'string' || !rawUrl.trim()) {
      res.status(400).send('Missing or invalid url parameter');
      return;
    }

    let parsed: URL;
    try {
      parsed = new URL(rawUrl.trim());
    } catch {
      res.status(400).send('Invalid URL format');
      return;
    }

    const protocol = parsed.protocol;
    if (protocol !== 'http:' && protocol !== 'https:') {
      res.status(400).send('Only http and https URLs are allowed');
      return;
    }

    const origin = `${parsed.protocol}//${parsed.host}`;
    const allowedOrigins = config.sets.imageProxyAllowedOrigins || [];
    const isAllowed = allowedOrigins.some(allowed => origin === allowed || origin.startsWith(allowed + '/'));
    if (!isAllowed) {
      res.status(400).send('URL origin not in allowlist');
      return;
    }

    const client = protocol === 'https:' ? https : http;
    client.get(parsed.toString(), (upstreamRes) => {
      if (upstreamRes.statusCode && upstreamRes.statusCode >= 400) {
        res.status(502).send('Upstream fetch failed');
        return;
      }

      const contentType = upstreamRes.headers['content-type'];
      if (contentType) {
        res.setHeader('Content-Type', contentType);
      }
      const cacheControl = upstreamRes.headers['cache-control'];
      if (cacheControl) {
        res.setHeader('Cache-Control', cacheControl);
      }

      upstreamRes.pipe(res);
    }).on('error', (err) => {
      console.warn('[Images proxy] Upstream fetch error:', err.message);
      if (!res.headersSent) {
        res.status(502).send('Upstream fetch failed');
      }
    });
  }
}
