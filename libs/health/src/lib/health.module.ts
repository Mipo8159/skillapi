import { Module, DynamicModule } from '@nestjs/common';
import {
  ConfigureHealthController,
  HealthControllerOptions,
} from './health.controller';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TerminusModule, HttpModule],
})
export class HealthModule {
  static register({ service }: HealthControllerOptions): DynamicModule {
    return {
      imports: [],
      module: HealthModule,
      controllers: [ConfigureHealthController({ service })],
      exports: [],
    };
  }
}
