import { ConfigModule } from '@app/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormConfig } from './config/typeorm.config';
import { DBConfig } from '@app/config/lib/settings/db.config';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().required(),
        DATABASE_URL: Joi.string().required(),
      }),
      abstractConfig: DBConfig,
    }),
    TypeOrmModule.forRootAsync({
      inject: [DBConfig],
      useFactory: (configService: DBConfig) => typeormConfig(configService),
    }),
  ],
})
export class DatabaseModule {}
