import { DynamicModule } from '@nestjs/common';
import { LoggerProviderModule } from './logger.module';
import { LoggerOptions } from './interfaces';
import { Logger } from '@app/common';

export class LoggerFactory {
  static forRoot(logger: LoggerOptions): DynamicModule {
    switch (logger.engine) {
      case Logger.WINSTON:
        return LoggerProviderModule.forRoot({
          engine: logger.engine,
          level: logger.level,
        });
      default:
        throw new Error(`Unsupported logger ${logger.engine}`);
    }
  }
}
