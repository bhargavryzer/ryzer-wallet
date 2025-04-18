import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RateLimiterMemory } from 'rate-limiter-flexible';

@Injectable()
export class RateLimiterMiddleware implements NestMiddleware {
  private readonly rateLimiter: RateLimiterMemory;

  constructor() {
    // Configure rate limiter
    this.rateLimiter = new RateLimiterMemory({
      points: 100, // Number of requests
      duration: 60, // Per 60 seconds
      blockDuration: 60 * 15, // Block for 15 minutes if limit exceeded
    });
  }

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const key = req.ip; // Use IP as the key for rate limiting
      await this.rateLimiter.consume(key);
      next();
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: 'Too many requests, please try again later',
          retryAfter: error.msBeforeNext / 1000,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
  }
} 