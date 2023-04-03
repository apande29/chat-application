import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import Config from '../../config/configuration';

@Catch(HttpException)
export class GlobalHttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const responseData = exception.getResponse();
    const message = responseData ? responseData['message'] : null;
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

    response.status(status).json({
      success: false,
      status: response.statusCode,
      message: message || exception.message,
      error: null,
    });
  }
}
