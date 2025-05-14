import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserModel, UsersLibService } from '@app/users-lib';
import { TokensLibService } from '@app/tokens-lib';
import { plainToClass } from 'class-transformer';
import { AuthResponseModel } from './models';
import { PasswordService } from './password.service';
import { LoginDto } from './dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthLibService {
  constructor(
    private readonly usersService: UsersLibService,
    private readonly tokensService: TokensLibService,
    private readonly passwordService: PasswordService,
  ) {}

  public async validateUser(
    email: string,
    password: string,
  ): Promise<UserModel | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;

    const isMatch = await this.passwordService.compare(password, user.password);
    if (!isMatch) return null;

    return user;
  }

  public async login(input: LoginDto): Promise<AuthResponseModel> {
    const { email, password } = input;
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException();
    }

    return this.performLogin(user);
  }

  private async performLogin(user: UserModel): Promise<AuthResponseModel> {
    const token = await this.tokensService.generateTokens(user);

    return plainToClass(AuthResponseModel, {
      user,
      credentials: token,
    });
  }

  async refresh(refreshToken: string): Promise<AuthResponseModel> {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is missing');
    }

    const payload = this.tokensService.validateRefreshToken(refreshToken);
    if (!payload) {
      throw new UnauthorizedException();
    }

    const tokenFromDb = await this.tokensService.findByRefreshToken(
      payload.sub,
      refreshToken,
    );
    if (!tokenFromDb) {
      throw new UnauthorizedException();
    }

    const user = await this.usersService.findOne(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }

    const tokens = await this.tokensService.generateTokens(user);

    await this.tokensService.create({ ...tokens, userId: user.id });
    return { credentials: tokens, user };
  }

  public async logout(userId: number) {
    const token = await this.tokensService.findByUserId(userId);

    if (!token) {
      throw new UnauthorizedException();
    }

    await this.tokensService.deleteById(token.id);
    return 'success';
  }

  public async register(input: RegisterDto): Promise<AuthResponseModel> {
    if (await this.isRegistered(input.email)) {
      throw new UnauthorizedException('User already exists');
    }

    const hash = await this.passwordService.hash(input.password);
    const createdUser = await this.usersService.create({
      ...input,
      password: hash,
    });
    return this.performLogin(createdUser);
  }

  private async isRegistered(email: string): Promise<boolean> {
    const user = await this.usersService.findByEmail(email);
    return Boolean(user);
  }
}
