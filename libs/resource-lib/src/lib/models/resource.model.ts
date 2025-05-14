import { Entity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IResource } from '../interfaces';

@Entity('tokens')
export class ResourceModel implements IResource {
  @ApiProperty()
  id: string;

  @ApiProperty()
  resource: string;

  @ApiProperty()
  data: Record<string, any>;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
