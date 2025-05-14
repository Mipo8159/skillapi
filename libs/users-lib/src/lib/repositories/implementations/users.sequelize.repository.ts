import { Builder } from 'builder-pattern';
import { plainToClass } from 'class-transformer';
import { UserEntity } from '../../entities';
import { UsersRepository } from '../users.repository.interface';
import { PaginationProps, QueryResult } from '@app/common';
import { UserModel } from '../../models';
import { FindOptionsWhere, In, Repository } from 'typeorm';

export const userTypeormToModel = (entity: UserEntity): UserModel => {
  const { id, firstName, lastName, email } = entity;
  const model = Builder<UserModel>()
    .id(id)
    .firstName(firstName)
    .lastName(lastName)
    .email(email);

  return model.build();
};

export class UsersSequelizeRepository implements UsersRepository {
  constructor(private readonly usersRepository: Repository<UserEntity>) {}

  public async findById(id: number): Promise<UserModel> {
    const user = await this.usersRepository.findOneBy({ id });
    return this.toModel(user!);
  }

  public async findAll(
    { offset, limit }: PaginationProps,
    filters?: Partial<UserModel>,
  ): Promise<UserModel[]> {
    const where = filters as FindOptionsWhere<UserEntity>;
    const users = await this.usersRepository.find({
      where,
      skip: offset,
      take: limit,
    });

    return this.bulkToModels(users);
  }

  public async findOne(filters: Partial<UserModel>): Promise<UserModel> {
    const user = await this.usersRepository.findOne({
      where: filters,
    });
    return this.toModel(user!);
  }

  public async create(dto: Partial<UserModel>): Promise<UserModel> {
    const user = this.usersRepository.create(dto);
    const saved = await this.usersRepository.save(user);
    return this.toModel(saved);
  }

  public async findAndCountAll({
    offset,
    limit,
  }: PaginationProps): Promise<QueryResult<UserModel>> {
    const where: FindOptionsWhere<UserEntity> = {};

    const [items, totalCount] = await this.usersRepository.findAndCount({
      where,
      skip: offset,
      take: limit,
    });

    return {
      items: await this.bulkToModels(items),
      totalCount,
    };
  }

  public async findByIds(ids: number[]): Promise<UserModel[]> {
    const entities = await this.usersRepository.find({
      where: { id: In(ids) },
    });

    return this.bulkToModels(entities);
  }

  public async updateById(
    id: number,
    dto: Partial<UserModel>,
  ): Promise<[affectedCount: number]> {
    const updateResult = await this.usersRepository.update(id, {
      ...dto,
    });

    return [updateResult.affected ?? 0];
  }

  public async deleteById(id: number): Promise<number> {
    const result = await this.usersRepository.delete(id);
    return result.affected ?? 0;
  }

  public toModel(entity: UserEntity): UserModel {
    return plainToClass(UserModel, entity);
  }

  public async bulkToModels(
    entities: UserEntity[] | Promise<UserEntity[]>,
  ): Promise<UserModel[]> {
    if (entities instanceof Promise) {
      return (await entities).map(this.toModel);
    }

    return entities.map(this.toModel);
  }
}
