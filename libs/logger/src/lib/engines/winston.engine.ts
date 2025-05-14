import {
  createLogger,
  format,
  transports,
  Logger as WinstonLogger,
} from 'winston';
import { Logger, LogLevelOptions } from '../interfaces';

export class WinstonEngine implements Logger {
  private logger: WinstonLogger;
  private level: string;

  constructor({ level }: LogLevelOptions) {
    this.level = level;

    this.logger = createLogger({
      level,
      format: format.json(),
      transports: [
        new transports.Console({
          format: format.simple(),
        }),
      ],
    });
  }

  log(message: string): void {
    this.logger.log({ level: this.level, message });
  }

  debug(message: string): void {
    this.logger.debug(message);
  }

  warn(message: string): void {
    this.logger.warn(message);
  }

  info(message: string): void {
    this.logger.info(message);
  }

  error(message: string, ...meta: any[]): void {
    this.logger.error(message, meta);
  }
}
