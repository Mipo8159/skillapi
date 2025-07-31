import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ResourceFilterDto {
  @IsString()
  @ApiProperty()
  @IsOptional()
  type?: string;

  @IsString()
  @ApiProperty()
  @IsOptional()
  inStock?: string;

  @IsString()
  @ApiProperty()
  @IsOptional()
  role?: string;
}
