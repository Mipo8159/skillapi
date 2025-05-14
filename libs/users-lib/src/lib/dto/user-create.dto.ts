import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class UserCreateDto {
  @ApiProperty()
  @IsString()
  @Length(2, 32, {
    message: 'The "firstName" should be between 2 and 32 characters',
  })
  firstName: string;

  @ApiProperty()
  @IsString()
  @Length(2, 32, {
    message: 'The "lastName" should be between 2 and 32 characters',
  })
  lastName: string;

  @ApiProperty()
  @IsString()
  @Length(4, 128, {
    message: 'The "password" should be between 4 and 255 characters',
  })
  password: string;
}
