import { DynamicModule, Module, Provider } from '@nestjs/common';
import { LOGGER, LoggerOptions } from './interfaces';
import { WinstonEngine } from './engines/winston.engine';

@Module({})
export class LoggerProviderModule {
  public static forRoot(options: LoggerOptions): DynamicModule {
    const loggerProvider = this.createLoggerProvider(options);
    return {
      global: true,
      module: LoggerProviderModule,
      providers: [loggerProvider],
      exports: [loggerProvider],
    };
  }

  private static createLoggerProvider(options: LoggerOptions): Provider {
    switch (options.engine) {
      case options.engine:
        return {
          provide: LOGGER,
          useFactory: () => {
            return new WinstonEngine(options);
          },
        };
      default:
        throw new Error(`Provide correct logger provider`);
    }
  }
}
