import { IUser } from '../interfaces';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class UserModel implements IUser {
  @ApiProperty()
  public id: number;

  @ApiProperty()
  public email: string;

  @ApiProperty()
  public firstName: string;

  @ApiProperty()
  public lastName: string;

  @Exclude({ toPlainOnly: true })
  public password: string;

  @Exclude({ toPlainOnly: true })
  public createdAt: Date;

  @Exclude({ toPlainOnly: true })
  public updatedAt: Date;
}
