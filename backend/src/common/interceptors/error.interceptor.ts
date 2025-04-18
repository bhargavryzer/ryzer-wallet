import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Logger } from '@nestjs/common';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ErrorInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError(error => {
        const request = context.switchToHttp().getRequest();
        
        // Log the error
        this.logger.error({
          message: error.message,
          stack: error.stack,
          path: request.url,
          method: request.method,
          body: request.body,
          query: request.query,
          params: request.params,
          user: request.user,
        });

        // Transform the error response
        if (error instanceof HttpException) {
          return throwError(() => ({
            statusCode: error.getStatus(),
            message: error.message,
            timestamp: new Date().toISOString(),
            path: request.url,
          }));
        }

        // Handle unknown errors
        return throwError(() => ({
          statusCode: 500,
          message: 'Internal server error',
          timestamp: new Date().toISOString(),
          path: request.url,
        }));
      }),
    );
  }
} 