import { Module } from '@nestjs/common';
import { provideTokensRepository } from './repositories';
import { TokensLibService } from './tokens-lib.service';
import { DataSource } from '@app/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenEntity } from './entities';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@app/config';
import * as Joi from 'joi';
import { AuthConfig } from '@app/config/lib/settings/auth.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([TokenEntity]),
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
        JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
        JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
      }),
      abstractConfig: AuthConfig,
    }),
    JwtModule.registerAsync({
      useFactory: (authConfig: AuthConfig) => {
        return {
          global: true,
          secret: authConfig.getAccessSecret(),
          signOptions: {
            expiresIn: authConfig.getAccessExpiration(),
          },
        };
      },
      inject: [AuthConfig],
    }),
  ],
  providers: [TokensLibService, ...provideTokensRepository(DataSource.TYPEORM)],
  exports: [TokensLibService],
})
export class TokensLibModule {}
