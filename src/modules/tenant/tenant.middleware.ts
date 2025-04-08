import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (!req.headers.host) {
      return res.status(HttpStatus.BAD_REQUEST).send('Host header is missing');
    }
    req.tenantId = req.headers.host?.split('.')[0];
    next();
  }
}
