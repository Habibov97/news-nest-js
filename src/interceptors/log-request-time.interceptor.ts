import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Request } from 'express';
import { map, Observable, tap } from 'rxjs';

export class LogRequestTimeInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> | Observable<any> {
    const now = Date.now();
    const req: Request = context.switchToHttp().getRequest();

    console.log('Request started', req.originalUrl, req.method);

    return next.handle().pipe(
      map((response: Response) => ({ status: 'success', response })),
      tap(() => {
        console.log('Request has been finished', Date.now() - now, 'ms');
      }),
    );
  }
}
