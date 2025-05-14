import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthConfig } from '@app/config/lib/settings/auth.config';
import { UsersLibService } from '@app/users-lib';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UsersLibService,
    protected readonly authConfig: AuthConfig,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: authConfig.getAccessSecret(),
    });
  }

  public async validate({ sub }: { sub: number }) {
    const user = await this.userService.findById(sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
