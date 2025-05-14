import { Repository } from '@app/common';
import { TokenModel } from '../models';

export interface TokensRepository extends Repository<TokenModel> {
  findByRefreshToken(userId: number, token: string): Promise<TokenModel>;
}

export const TOKENS_REPOSITORY_TOKEN = Symbol('tokens-repository-token');
