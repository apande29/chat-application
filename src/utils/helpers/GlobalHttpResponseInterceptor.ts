import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IApiResponse } from '../interfaces/global.interface';
import { Response } from 'express';
import Config from '../../config/configuration';

@Injectable()
export class GlobalHttpResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<IApiResponse<any>> {
    const ctx = context.switchToHttp();
    const response: Response = ctx.getResponse();
    response.setHeader('Content-Type', 'application/json');
    response.setHeader(
      'Access-Control-Allow-Origin',
      Config().nodeConfiguration.accessControlOrigin,
    );
    response.setHeader('Access-Control-Allow-Methods', '*');
    response.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, Content-Type, X-Auth-Token',
    );

    return next.handle().pipe(
      map((data) => {
        if (data && data.status) {
          context.switchToHttp().getResponse().status(data.status);
        }
        return {
          success: data.success,
          status: data.status || response.statusCode,
          message: data.message,
          data: data.data,
          error: data.error,
        };
      }),
    );
  }
}
