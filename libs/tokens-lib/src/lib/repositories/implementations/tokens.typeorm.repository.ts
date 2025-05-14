import { TokenModel } from '../../models';
import { TokensRepository } from '../tokens.repository.interface';
import { BaseToken } from '../../interfaces';
import { TokenEntity } from '../../entities';
import { plainToClass } from 'class-transformer';
import { DeleteResult, In, Repository, UpdateResult } from 'typeorm';

export class TokensTypeormRepository implements TokensRepository {
  constructor(private readonly tokensRepository: Repository<TokenEntity>) {}

  public async findById(id: number): Promise<TokenModel> {
    const token = await this.tokensRepository.findOneBy({ id });
    return this.toModel(token!);
  }

  public async findAll(): Promise<TokenModel[]> {
    const entities = await this.tokensRepository.find();
    return this.bulkToModels(entities);
  }

  public async findByIds(ids: number[]): Promise<TokenModel[]> {
    const entities = await this.tokensRepository.find({
      where: {
        id: In(ids),
      },
    });

    return this.bulkToModels(entities);
  }

  public async deleteById(id: number): Promise<number> {
    const result: DeleteResult = await this.tokensRepository.delete(id);
    return result.affected ?? 0;
  }

  public async updateById(
    id: number,
    token: Partial<TokenModel>,
  ): Promise<[affectedCount: number]> {
    const result: UpdateResult = await this.tokensRepository.update(id, token);
    return [result.affected ?? 0];
  }

  public async create(token: Partial<TokenModel>): Promise<TokenModel> {
    const created = this.tokensRepository.create(token);
    const saved = await this.tokensRepository.save(created);
    return this.toModel(saved);
  }

  public async findByRefreshToken(
    userId: number,
    refreshToken: string,
  ): Promise<TokenModel> {
    const token = await this.tokensRepository.findOne({
      where: {
        userId,
        refreshToken,
      },
      relations: ['user'],
    });

    return this.toModel(token!);
  }

  public async findOne(filters: Partial<BaseToken>): Promise<TokenModel> {
    const token = await this.tokensRepository.findOne({
      where: filters,
    });

    return this.toModel(token!);
  }

  public toModel(entity: TokenEntity): TokenModel {
    return plainToClass(TokenModel, entity);
  }

  public async bulkToModels(
    entities: TokenEntity[] | Promise<TokenEntity[]>,
  ): Promise<TokenModel[]> {
    if (entities instanceof Promise) {
      return (await entities).map(this.toModel);
    }

    return entities.map(this.toModel);
  }
}
