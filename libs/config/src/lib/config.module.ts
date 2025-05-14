import { Abstract, DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { ConfigService } from './config.service';
import * as Joi from 'joi';
import { AbstractConfig } from './settings';

@Global()
@Module({})
export class ConfigModule {
  static forRoot(options: {
    validationSchema: Joi.ObjectSchema;
    abstractConfig: Abstract<AbstractConfig>;
  }): DynamicModule {
    const configProvider = {
      provide: options.abstractConfig,
      useClass: ConfigService,
    };

    return {
      module: ConfigModule,
      imports: [
        NestConfigModule.forRoot({
          isGlobal: true,
          validationSchema: options.validationSchema,
        }),
      ],
      providers: [configProvider],
      exports: [configProvider],
    };
  }
}
