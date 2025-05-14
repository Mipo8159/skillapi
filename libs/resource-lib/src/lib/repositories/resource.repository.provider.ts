import { Injectable, Provider } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataSource } from '@app/common';
import { ResourceEntity } from '../entities';
import { RESOURCE_REPOSITORY_TOKEN } from './resource.repository.interface';
import { ResourceTypeormRepository } from './implementations';

export function provideResourceRepository(dataSource?: DataSource): Provider[] {
  return [
    {
      provide: RESOURCE_REPOSITORY_TOKEN,
      useFactory: async (
        dependenciesProvider: ResourceRepoDependenciesProvider,
      ) => provideResourceRepositoryFactory(dependenciesProvider, dataSource),
      inject: [ResourceRepoDependenciesProvider],
    },
    ResourceRepoDependenciesProvider,
  ];
}

async function provideResourceRepositoryFactory(
  dependenciesProvider: ResourceRepoDependenciesProvider,
  dataSource?: DataSource,
) {
  await ConfigModule.envVariablesLoaded;

  switch (dataSource) {
    case DataSource.TYPEORM:
    default:
      return new ResourceTypeormRepository(
        dependenciesProvider.typeormRepository,
      );
  }
}

@Injectable()
export class ResourceRepoDependenciesProvider {
  constructor(
    @InjectRepository(ResourceEntity)
    public typeormRepository: Repository<ResourceEntity>,
  ) {}
}
