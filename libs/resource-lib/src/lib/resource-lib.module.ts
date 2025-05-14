import { Module } from '@nestjs/common';
import { ResourceLibService } from './resource-lib.service';
import { provideResourceRepository } from './repositories';
import { DataSource } from '@app/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResourceEntity } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([ResourceEntity])],
  providers: [
    ResourceLibService,
    ...provideResourceRepository(DataSource.TYPEORM),
  ],
  exports: [ResourceLibService],
})
export class ResourceLibModule {}
