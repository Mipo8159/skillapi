import { ResourceFilterDto } from 'src/resource/dto/resource-filter.dto';
import { IUpdateResource } from '../interfaces';
import { ICreateResource } from '../interfaces/create-resource.interface';
import { ResourceModel } from '../models';

export interface ResourceRepository {
  updateByUuid(
    resource: string,
    id: string,
    data: IUpdateResource,
  ): Promise<[affectedCount: number]>;
  deleteByUuid(resource: string, id: string): Promise<number>;
  findByUuids(ids: string[]): Promise<ResourceModel[]>;
  findByUuid(resource: string, id: string): Promise<ResourceModel>;
  create(resources: ICreateResource[]): Promise<ResourceModel[]>;
  findByResource(
    resource: string,
    filters?: ResourceFilterDto,
  ): Promise<ResourceModel[]>;
}

export const RESOURCE_REPOSITORY_TOKEN = Symbol('resource-repository-token');
