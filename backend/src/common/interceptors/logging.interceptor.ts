import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Logger } from '@nestjs/common';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, query, params, user } = request;
    const startTime = Date.now();

    // Log request
    this.logger.log({
      message: 'Incoming request',
      method,
      url,
      body,
      query,
      params,
      user: user?.id,
    });

    return next.handle().pipe(
      tap({
        next: (data) => {
          const responseTime = Date.now() - startTime;
          // Log successful response
          this.logger.log({
            message: 'Request completed',
            method,
            url,
            statusCode: 200,
            responseTime: `${responseTime}ms`,
          });
        },
        error: (error) => {
          const responseTime = Date.now() - startTime;
          // Log error response
          this.logger.error({
            message: 'Request failed',
            method,
            url,
            error: error.message,
            statusCode: error.status || 500,
            responseTime: `${responseTime}ms`,
          });
        },
      }),
    );
  }
} 