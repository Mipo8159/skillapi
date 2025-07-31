import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { RESOURCE_REPOSITORY_TOKEN, ResourceRepository } from './repositories';
import { ResourceModel } from './models';
import { CreateResourceDto, UpdateResourceDto } from './dto';
import { ResourceFilterDto } from 'src/resource/dto/resource-filter.dto';

@Injectable()
export class ResourceLibService {
  constructor(
    @Inject(RESOURCE_REPOSITORY_TOKEN)
    private resourceRepository: ResourceRepository,
  ) {}

  public async create(resource: CreateResourceDto[]): Promise<ResourceModel[]> {
    return this.resourceRepository.create(resource);
  }

  public async findByUuid(
    resource: string,
    id: string,
  ): Promise<ResourceModel> {
    const res = await this.resourceRepository.findByUuid(resource, id);
    if (!res) {
      throw new NotFoundException(
        `${resource} resource with id ${id} not found`,
      );
    }
    return res;
  }

  public async findByResource(
    resource: string,
    filters?: ResourceFilterDto,
  ): Promise<ResourceModel[]> {
    return this.resourceRepository.findByResource(resource, filters);
  }

  public async findByUuids(ids: string[]): Promise<ResourceModel[]> {
    return this.resourceRepository.findByUuids(ids);
  }

  public async deleteByUuid(resource: string, id: string): Promise<number> {
    return this.resourceRepository.deleteByUuid(resource, id);
  }

  public async updateByUuid(
    resource: string,
    id: string,
    data: UpdateResourceDto,
  ): Promise<[affectedCount: number]> {
    return this.resourceRepository.updateByUuid(resource, id, data);
  }
}
