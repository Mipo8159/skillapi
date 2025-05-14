import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { resolve } from 'path';
import { typeormConfig } from './typeorm.config';
import { ConfigService } from '@nestjs/config';

if (process.env.NODE_ENV !== 'production') {
  config({ path: resolve(process.cwd(), '.env') });
}

const configService = new ConfigService();
const dataSourceOptions = typeormConfig({
  getDatabaseUrl: () => configService.get<string>('DATABASE_URL') || '',
  getEnvironment: () => configService.get<string>('NODE_ENV') || 'development',
});

export const AppDataSource = new DataSource(dataSourceOptions);
AppDataSource.initialize()
  .then(() => console.log('Data Source initialized'))
  .catch((err) => console.error('Error initializing data source', err));
