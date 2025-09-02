import { plainToClass } from 'class-transformer';
import { FindOptionsOrder, In, Raw, Repository, UpdateResult } from 'typeorm';
import { ResourceRepository } from '../resource.repository.interface';
import { ResourceEntity } from '../../entities';
import { ResourceModel } from '../../models';
import { BaseResource } from '../../interfaces';
import { ICreateResource } from '../../interfaces/create-resource.interface';

export class ResourceTypeormRepository implements ResourceRepository {
  constructor(
    private readonly resourceRepository: Repository<ResourceEntity>,
  ) {}

  public async findByUuid(
    resource: string,
    id: string,
  ): Promise<ResourceModel> {
    const res = await this.resourceRepository.findOneBy({ resource, id });
    return this.toModel(res!);
  }

  public async findAll(): Promise<ResourceModel[]> {
    const entities = await this.resourceRepository.find();
    return this.bulkToModels(entities);
  }

  public async findByResource(
    resource: string,
    filters: Record<string, string> = {},
    sort?: 'ASC' | 'DESC',
  ): Promise<ResourceModel[]> {
    const where: any = { resource };
    const jsonConditions: string[] = [];

    const search = filters.search?.trim();
    if (search) {
      const escapedSearch = search.replace(/'/g, "''");

      jsonConditions.push(
        `(data ->> 'title' ILIKE '%${escapedSearch}%' OR data ->> 'description' ILIKE '%${escapedSearch}%')`,
      );

      delete filters.search;
    }

    for (const [key, value] of Object.entries(filters)) {
      if (key === 'inStock') {
        const boolValue = value.toLowerCase() === 'true' ? 'true' : 'false';
        jsonConditions.push(`data -> '${key}' = '${boolValue}'::jsonb`);
      } else {
        jsonConditions.push(
          `data ->> '${key}' = '${value.replace(/'/g, "''")}'`,
        );
      }
    }

    if (jsonConditions.length > 0) {
      where.data = Raw(() => jsonConditions.join(' AND '));
    }

    const order: FindOptionsOrder<object> | undefined = sort
      ? { createdAt: sort.toUpperCase() === 'DESC' ? 'DESC' : 'ASC' }
      : undefined;

    const entities = await this.resourceRepository.find({
      where,
      ...(order && { order }),
    });

    return this.bulkToModels(entities);
  }

  public async findByUuids(ids: string[]): Promise<ResourceModel[]> {
    const entities = await this.resourceRepository.find({
      where: {
        id: In(ids),
      },
    });

    if (entities.length === 0) {
      return [];
    }

    return this.bulkToModels(entities);
  }

  public async deleteByUuid(resource: string, id: string): Promise<number> {
    const result = await this.resourceRepository.delete({
      resource,
      id,
    });

    return result.affected ?? 0;
  }

  public async updateByUuid(
    resource: string,
    id: string,
    data: ICreateResource,
  ): Promise<[affectedCount: number]> {
    const result: UpdateResult = await this.resourceRepository.update(
      { resource, id },
      data,
    );
    return [result.affected ?? 0];
  }

  public async create(resources: ICreateResource[]): Promise<ResourceModel[]> {
    const savedResources = await Promise.all(
      resources.map(async (resource) => {
        const created = this.resourceRepository.create(resource);
        const saved = await this.resourceRepository.save(created);
        return this.toModel(saved);
      }),
    );

    return savedResources;
  }

  public async findOne(filters: Partial<BaseResource>): Promise<ResourceModel> {
    const resource = await this.resourceRepository.findOne({
      where: filters,
    });

    return this.toModel(resource!);
  }

  public toModel(entity: ResourceEntity): ResourceModel {
    return plainToClass(ResourceModel, entity);
  }

  public async bulkToModels(
    entities: ResourceEntity[] | Promise<ResourceEntity[]>,
  ): Promise<ResourceModel[]> {
    if (entities instanceof Promise) {
      return (await entities).map(this.toModel);
    }

    return entities.map(this.toModel);
  }
}
