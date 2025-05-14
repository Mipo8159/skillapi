import { PaginationProps, QueryResult, Repository } from '@app/common';
import { UserModel } from '../models';
import { UserFilterDto } from '../dto';

export interface UsersRepository extends Repository<UserModel> {
  findAndCountAll(
    pagination: PaginationProps,
    filters: Partial<UserFilterDto>,
  ): Promise<QueryResult<UserModel>>;
}

export const USERS_REPOSITORY_TOKEN = Symbol('users-repository-token');
