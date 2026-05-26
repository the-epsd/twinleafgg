import { Request, Response, NextFunction, RequestHandler } from 'express';
import { config } from '../../config';

const defaultAllowedOrigins = [
  'https://play.twinleaf.gg',
  'http://play.twinleaf.gg',
  'http://localhost:4200',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://beta-27qlv.ondigitalocean.app'
];

function configuredAllowedOrigins(): string[] {
  const configured = process.env.CORS_ALLOWED_ORIGINS || '';
  return configured
    .split(',')
    .map(origin => origin.trim().replace(/\/$/, ''))
    .filter(origin => origin.length > 0);
}

export function cors(): RequestHandler {
  return function (req: Request, res: Response, next: NextFunction): any {
    const allowedOrigins = [
      ...defaultAllowedOrigins,
      ...configuredAllowedOrigins()
    ];
    const origin = typeof req.headers.origin === 'string'
      ? req.headers.origin.replace(/\/$/, '')
      : undefined;
    if (config.backend.allowCors && origin && allowedOrigins.includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin);
    }

    res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST');
    res.header('Access-Control-Allow-Headers', [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Auth-Token'
    ].join(','));

    next();
  };
}
