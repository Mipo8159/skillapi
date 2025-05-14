import { IsJSON, IsNotEmpty } from 'class-validator';

export class UpdateResourceDto {
  @IsJSON()
  @IsNotEmpty()
  data: Record<string, any>;
}
