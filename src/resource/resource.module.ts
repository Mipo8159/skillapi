import { ResourceLibModule } from '@app/resource-lib';
import { Module } from '@nestjs/common';
import { ResourceController } from './resource.controller';

@Module({
  imports: [ResourceLibModule],
  controllers: [ResourceController],
})
export class ResourceModule {}
