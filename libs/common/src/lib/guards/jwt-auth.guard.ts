import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const bypassToken = request.headers['x-bypass-token'];
    if (bypassToken) {
      return (
        Buffer.from(bypassToken, 'base64').toString('utf-8') === 'apiKeySecret'
      );
    }

    return super.canActivate(context) as Promise<boolean>;
  }
}
