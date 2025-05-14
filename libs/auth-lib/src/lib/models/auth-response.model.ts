import { TokenModel } from '@app/tokens-lib/lib/models';
import { UserModel } from '@app/users-lib';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class AuthResponseModel {
  @ApiProperty()
  @Type(() => UserModel)
  public user: UserModel;

  @ApiProperty()
  @Type(() => TokenModel)
  public credentials: TokenModel;
}
