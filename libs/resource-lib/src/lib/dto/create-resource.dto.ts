import { IsJSON, IsNotEmpty, IsString } from 'class-validator';

export class CreateResourceDto {
  @IsString()
  @IsNotEmpty()
  resource: string;

  @IsJSON()
  @IsNotEmpty()
  data: Record<string, any>;
}
