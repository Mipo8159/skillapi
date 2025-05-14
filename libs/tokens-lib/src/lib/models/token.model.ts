import { Exclude } from 'class-transformer';
import { IToken } from '../interfaces';
import { ApiProperty } from '@nestjs/swagger';
import { UserModel } from '@app/users-lib';

export class TokenModel implements IToken {
  @Exclude({ toPlainOnly: true })
  public id: number;

  @ApiProperty()
  public accessToken: string;

  @ApiProperty()
  public refreshToken: string;

  @ApiProperty()
  public userId: number;

  @Exclude({ toPlainOnly: true })
  public user?: UserModel;

  @ApiProperty()
  public expiredAt: Date;

  @Exclude({ toPlainOnly: true })
  public createdAt: Date;

  @Exclude({ toPlainOnly: true })
  public updatedAt: Date;
}
