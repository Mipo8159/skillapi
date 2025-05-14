import { Injectable, Provider } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TOKENS_REPOSITORY_TOKEN } from './tokens.repository.interface';
import { TokenEntity } from '../entities';
import { DataSource } from '@app/common';
import { TokensTypeormRepository } from './implementations';

export function provideTokensRepository(dataSource?: DataSource): Provider[] {
  return [
    {
      provide: TOKENS_REPOSITORY_TOKEN,
      useFactory: async (
        dependenciesProvider: TokensRepoDependenciesProvider,
      ) => provideTokensRepositoryFactory(dependenciesProvider, dataSource),
      inject: [TokensRepoDependenciesProvider],
    },
    TokensRepoDependenciesProvider,
  ];
}

async function provideTokensRepositoryFactory(
  dependenciesProvider: TokensRepoDependenciesProvider,
  dataSource?: DataSource,
) {
  await ConfigModule.envVariablesLoaded;

  switch (dataSource) {
    case DataSource.TYPEORM:
    default:
      return new TokensTypeormRepository(
        dependenciesProvider.typeormRepository,
      );
  }
}

@Injectable()
export class TokensRepoDependenciesProvider {
  constructor(
    @InjectRepository(TokenEntity)
    public typeormRepository: Repository<TokenEntity>,
  ) {}
}
