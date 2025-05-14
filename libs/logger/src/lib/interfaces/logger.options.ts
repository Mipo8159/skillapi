import { Logger } from '@app/common';
import { LogLevel } from '@nestjs/common';

export interface LoggerOptions {
  engine: Logger;
  level: LogLevel;
}

export interface LogLevelOptions {
  level: LogLevel;
  serviceName?: string;
}
