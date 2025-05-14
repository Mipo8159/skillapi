import { Logger, LOGGER } from '@app/logger';
import { Controller, Get, HttpCode, HttpStatus, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { Throttle } from '@nestjs/throttler';

type HealthControllerType = { new (...args: any[]): any };

export interface HealthControllerOptions {
  service: string;
}

export function ConfigureHealthController({
  service,
}: HealthControllerOptions): HealthControllerType {
  @Controller('health')
  class HealthController {
    constructor(
      @Inject(LOGGER) private logger: Logger,
      private readonly health: HealthCheckService,
      private readonly httpHealth: HttpHealthIndicator,
      private readonly databaseHealth: TypeOrmHealthIndicator,
      private readonly config: ConfigService,
    ) {}

    @Get()
    @HealthCheck()
    @HttpCode(HttpStatus.OK)
    @Throttle({ default: { limit: 3, ttl: 30000 } })
    async check() {
      this.logger.debug('Health log');

      return {
        status: 200,
        message: 'ok',
        service,
        check: await this.health.check([
          () =>
            this.httpHealth.pingCheck(
              'docs',
              `http://${this.config.get('API_HOST')}:${this.config.get('APP_PORT')}/api/docs`,
            ),
          () => this.databaseHealth.pingCheck('database'),
        ]),
      };
    }
  }

  return HealthController;
}
