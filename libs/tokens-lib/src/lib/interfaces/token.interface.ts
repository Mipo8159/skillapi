export interface IToken {
  id: number;
  accessToken: string;
  refreshToken: string;
  userId: number;
  expiredAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type BaseToken = Omit<IToken, 'id' | 'updatedAt' | 'createdAt'>;
