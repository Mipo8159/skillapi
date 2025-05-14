import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray } from 'class-validator';

export class CreateResourceInput {
  @ApiProperty()
  @IsArray()
  @ArrayNotEmpty()
  data: Record<string, any>[];
}
