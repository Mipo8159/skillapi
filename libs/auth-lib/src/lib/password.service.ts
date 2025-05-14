import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {
  public hash(password: string, saltLength = 10): Promise<string> {
    return bcrypt.hash(password, saltLength);
  }

  public async compare(
    rawPassword: string,
    encryptedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(rawPassword, encryptedPassword);
  }
}
