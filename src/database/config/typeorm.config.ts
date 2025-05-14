import { DataSourceOptions } from 'typeorm';
import { resolve } from 'path';
import { DBConfig } from '@app/config/lib/settings/db.config';
import { UserEntity } from '@app/users-lib';
import { TokenEntity } from '@app/tokens-lib/lib/entities';
import { ResourceEntity } from '@app/resource-lib/lib/entities';

export const typeormConfig = (configService: DBConfig): DataSourceOptions => {
  const databaseUrl = configService.getDatabaseUrl();
  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not defined');
  }

  const isProduction = configService.getEnvironment() === 'production';
  const isDevelopment = configService.getEnvironment() === 'development';

  return {
    type: 'postgres',
    url: databaseUrl,
    schema: 'public',
    synchronize: false,
    logging: isDevelopment,
    entities: [UserEntity, TokenEntity, ResourceEntity],
    migrations: [resolve(__dirname, '..', 'migrations', '*.{js,ts}')],
    migrationsRun: false,
    migrationsTableName: 'migrations',
    ssl: isProduction ? { rejectUnauthorized: false } : false,
    extra: {
      connectionLimit: 10,
      poolSize: 10,
    },
    subscribers: [],
  };
};

export type TypeOrmConfig = ReturnType<typeof typeormConfig>;
