import { Inject, Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';
import {
  TOKENS_REPOSITORY_TOKEN,
  TokensTypeormRepository,
} from './repositories';
import { BaseToken, jwtPayload } from './interfaces';
import { TokenModel } from './models';
import { UserModel } from '@app/users-lib';
import { AuthConfig } from '@app/config/lib/settings/auth.config';

@Injectable()
export class TokensLibService {
  constructor(
    @Inject(TOKENS_REPOSITORY_TOKEN)
    private tokensRepository: TokensTypeormRepository,
    private readonly jwtService: JwtService,
    private readonly authConfig: AuthConfig,
  ) {}

  public findById(id: number): Promise<TokenModel> {
    return this.tokensRepository.findById(id);
  }

  public findByUserId(userId: number): Promise<TokenModel> {
    return this.tokensRepository.findOne({ userId });
  }

  public async create(input: BaseToken): Promise<TokenModel> {
    return this.tokensRepository.create(input);
  }

  public update(
    id: number,
    token: BaseToken,
  ): Promise<[affectedCount: number]> {
    return this.tokensRepository.updateById(id, token);
  }

  public async generateTokens(user: UserModel): Promise<TokenModel> {
    const payload = {
      sub: user.id,
    };

    const newDate = new Date();
    const expiredAt = new Date(newDate.setDate(newDate.getDate() + 7));
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);

    const dbToken = await this.findByUserId(user.id);
    if (dbToken) {
      dbToken.refreshToken = refreshToken;
      await this.update(user.id, dbToken);
      return dbToken;
    }

    return this.create({
      accessToken,
      refreshToken,
      userId: user.id,
      expiredAt,
    });
  }

  public generateAccessToken(payload: jwtPayload): string {
    return this.jwtService.sign({ ...payload, type: 'access' });
  }

  public generateRefreshToken(payload: jwtPayload): string {
    const options: JwtSignOptions = {
      secret: this.authConfig.getRefreshSecret(),
      expiresIn: this.authConfig.getRefreshExpiration(),
    };

    return this.jwtService.sign({ ...payload, type: 'refresh' }, options);
  }

  private verifyToken(token: string, secret: string) {
    const opts: JwtVerifyOptions = {
      secret,
      ignoreExpiration: false,
    };

    try {
      return this.jwtService.verify(token, opts);
    } catch {
      return null;
    }
  }

  public validateAccessToken(token: string) {
    return this.verifyToken(token, this.authConfig.getAccessSecret());
  }

  public validateRefreshToken(token: string) {
    return this.verifyToken(token, this.authConfig.getRefreshSecret());
  }

  public findByRefreshToken(
    userId: number,
    refreshToken: string,
  ): Promise<TokenModel> {
    return this.tokensRepository.findByRefreshToken(userId, refreshToken);
  }

  public deleteById(id: number) {
    return this.tokensRepository.deleteById(id);
  }
}
