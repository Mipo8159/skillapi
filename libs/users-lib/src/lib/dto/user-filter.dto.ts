import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional } from 'class-validator';

export class UserFilterDto {
  @IsEmail()
  @IsOptional()
  email?: string;
}

export class UserEmailDto {
  @ApiProperty({
    example: 'example@gmail.com',
  })
  @IsEmail()
  email: string;
}
