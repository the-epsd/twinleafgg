import { Request, Response, NextFunction, RequestHandler } from 'express';
import { config } from '../../config';

export function cors(): RequestHandler {
  return function (req: Request, res: Response, next: NextFunction): any {
    const allowedHeaders = [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Auth-Token',
      'Authorization'
    ];

    if (config.backend.allowCors) {
      // Allow requests from the React development server
      const origin = req.headers.origin;
      if (origin && (origin.includes('localhost:3000') || origin.includes('127.0.0.1:3000'))) {
        res.header('Access-Control-Allow-Origin', origin);
        res.header('Access-Control-Allow-Credentials', 'true');
      }
    }

    res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.header('Access-Control-Allow-Headers', allowedHeaders.join(','));

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }

    next();
  };
}
