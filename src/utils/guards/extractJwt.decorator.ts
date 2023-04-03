import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Custom decorator to extract user details from protected requests.

export const ExtractJwt = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    try {
      const request = ctx.switchToHttp().getRequest();
      const returnData = {};
      const user = request.user;

      if (user) {
        Object.assign(returnData, { id: user?.id, email: user?.email });
      }

      return returnData;
    } catch (error) {
      console.log(`JwtExtractor - ERROR - ${error}`);
      return null;
    }
  },
);
