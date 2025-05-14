import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import {} from './settings';
import { AuthConfig } from './settings/auth.config';
import { DBConfig } from './settings/db.config';

@Injectable()
export class ConfigService implements AuthConfig, DBConfig {
  constructor(private configService: NestConfigService) {}

  getAccessSecret(): string {
    return this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET') || '';
  }

  getRefreshSecret(): string {
    return this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET') || '';
  }

  getAccessExpiration(): string {
    return (
      this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRATION_TIME') || '1h'
    );
  }

  getRefreshExpiration(): string {
    return (
      this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION_TIME') ||
      '30d'
    );
  }

  getDatabaseUrl(): string {
    return this.configService.get<string>('DATABASE_URL') || '';
  }

  getEnvironment(): string {
    return this.configService.get<string>('NODE_ENV') || 'development';
  }
}
