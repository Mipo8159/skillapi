import { ApiProperty } from '@nestjs/swagger';
import { IsObject } from 'class-validator';

export class UpdateResourceInput {
  @ApiProperty()
  @IsObject()
  data: Record<string, any>[];
}
