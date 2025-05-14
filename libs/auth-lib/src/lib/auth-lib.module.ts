import { Module } from '@nestjs/common';
import * as Joi from 'joi';
import { AuthConfig } from '@app/config/lib/settings/auth.config';
import { ConfigModule } from '@app/config';
import { AuthLibService } from './auth-lib.service';
import { TokensLibModule } from '@app/tokens-lib';
import { UsersLibModule } from '@app/users-lib';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies';
import { PasswordService } from './password.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
        JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
        JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
      }),
      abstractConfig: AuthConfig,
    }),
    TokensLibModule,
    UsersLibModule,
    PassportModule,
  ],
  providers: [AuthLibService, JwtStrategy, PasswordService],
  exports: [AuthLibService],
})
export class AuthLibModule {}
