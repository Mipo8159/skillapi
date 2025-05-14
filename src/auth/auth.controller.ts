import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpStatus,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthLibService } from '@app/auth-lib';
import { LoginDto } from '@app/auth-lib/lib/dto';
import { AuthResponseModel } from '@app/auth-lib/lib/models';
import { RegisterDto } from '@app/auth-lib/lib/dto/register.dto';
import { CurrentUser, JwtAuthGuard } from '@app/common';
import { IUser } from '@app/users-lib';
import { RefreshTokenDto } from './dto';

@ApiTags('auth')
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthLibService) {}

  @Post('login')
  @ApiResponse({ status: HttpStatus.CREATED, type: AuthResponseModel })
  public login(@Body() input: LoginDto): Promise<AuthResponseModel> {
    return this.authService.login(input);
  }

  @Post('register')
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User successfully registered',
  })
  public async register(
    @Body() input: RegisterDto,
  ): Promise<void | AuthResponseModel> {
    return this.authService.register(input);
  }

  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User successfully logged out',
  })
  @Post('logout')
  public async logout(@CurrentUser() user: IUser) {
    return this.authService.logout(user.id);
  }

  @Post('refresh')
  @ApiResponse({ status: HttpStatus.CREATED, type: AuthResponseModel })
  public refreshToken(
    @Body() { token }: RefreshTokenDto,
  ): Promise<AuthResponseModel> {
    return this.authService.refresh(token);
  }
}
