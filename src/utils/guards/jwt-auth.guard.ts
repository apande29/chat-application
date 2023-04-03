import {
  ExecutionContext,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(error, user, info) {
    // You can throw an exception based on either "info" or "err" arguments
    if (error || !user) {
      throw new HttpException(info, HttpStatus.UNAUTHORIZED);
    }
    return user;
  }
}
