import { Injectable, Provider } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DataSource } from '@app/common';
import { UserEntity } from '../entities';
import { UsersSequelizeRepository } from './implementations';
import { USERS_REPOSITORY_TOKEN } from './users.repository.interface';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

export function provideUsersRepository(dataSource?: DataSource): Provider[] {
  return [
    {
      provide: USERS_REPOSITORY_TOKEN,
      useFactory: async (dependenciesProvider: UsersRepoDependenciesProvider) =>
        provideUsersRepositoryFactory(dependenciesProvider, dataSource),
      inject: [UsersRepoDependenciesProvider],
    },
    UsersRepoDependenciesProvider,
  ];
}

async function provideUsersRepositoryFactory(
  dependenciesProvider: UsersRepoDependenciesProvider,
  dataSource?: DataSource,
) {
  await ConfigModule.envVariablesLoaded;

  switch (dataSource) {
    case DataSource.TYPEORM:
    default:
      return new UsersSequelizeRepository(
        dependenciesProvider.sequelizeOrmRepository,
      );
  }
}

@Injectable()
export class UsersRepoDependenciesProvider {
  constructor(
    @InjectRepository(UserEntity)
    public sequelizeOrmRepository: Repository<UserEntity>,
  ) {}
}
