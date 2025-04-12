import { HttpStatus, Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Log request details in one line
    const { method, headers, originalUrl, host, query } = req;
    const logMessage = `${method} ${host} ${originalUrl}${JSON.stringify(query)} ${headers['user-agent'] || ''}`;
    Logger.log(logMessage, 'Request');

    if (!req.headers.host) {
      return res.status(HttpStatus.BAD_REQUEST).send('Host header is missing');
    }
    req.tenantId = req.headers.host?.split('.')[0];
    next();
  }
}
