import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(RequestLoggerMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    const { ip, method, originalUrl, headers } = req;
    const userAgent = headers['user-agent'] || '';

    // Log request details
    this.logger.log({
      message: 'Incoming request',
      ip,
      method,
      url: originalUrl,
      userAgent,
      timestamp: new Date().toISOString(),
    });

    // Add request metadata to the request object
    req['requestMetadata'] = {
      ip,
      userAgent,
      timestamp: new Date().toISOString(),
    };

    next();
  }
} 