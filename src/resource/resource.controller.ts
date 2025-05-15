import { JwtAuthGuard } from '@app/common';
import { ICreateResource, ResourceLibService } from '@app/resource-lib';
import { ResourceModel } from '@app/resource-lib/lib/models';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreateResourceInput } from './dto/create-resource.input';
import { UpdateResourceInput } from './dto/update-resource.input';
import { ApiBearerAuth } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller({ path: 'resource', version: '1' })
export class ResourceController {
  constructor(private readonly resourceLibService: ResourceLibService) {}

  @Post(':resource')
  async create(
    @Param('resource') resource: string,
    @Body() { data }: CreateResourceInput,
  ): Promise<ResourceModel[]> {
    const input: ICreateResource[] = data.map((item) => ({
      data: item,
      resource,
    }));
    return this.resourceLibService.create(input);
  }

  @Get(':resource/:id')
  async findOne(
    @Param('resource') resource: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ResourceModel> {
    return this.resourceLibService.findByUuid(resource, id);
  }

  @Get(':resource')
  async find(@Param('resource') resource: string): Promise<ResourceModel[]> {
    return this.resourceLibService.findByResource(resource);
  }

  @Put(':resource/:id')
  async update(
    @Param('resource') resource: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateResourceInput,
  ): Promise<[affectedCount: number]> {
    return this.resourceLibService.updateByUuid(resource, id, updateDto);
  }

  @Delete(':resource/:id')
  async delete(
    @Param('resource') resource: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<number> {
    return this.resourceLibService.deleteByUuid(resource, id);
  }
}
