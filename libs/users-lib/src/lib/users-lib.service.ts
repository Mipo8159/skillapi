import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserModel } from './models';
import { USERS_REPOSITORY_TOKEN, UsersRepository } from './repositories';
import { PaginatedService } from '@app/common';

@Injectable()
export class UsersLibService extends PaginatedService<UserModel> {
  constructor(
    @Inject(USERS_REPOSITORY_TOKEN)
    private readonly userRepository: UsersRepository,
  ) {
    super();
  }

  public create(user: Partial<UserModel>): Promise<UserModel> {
    return this.userRepository.create(user);
  }

  public async findById(id: number): Promise<UserModel | never> {
    const user = await this.userRepository.findById(id);

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  public async findOne(
    findOptions: Partial<UserModel>,
  ): Promise<UserModel | never> {
    console.log('findOptions', findOptions);
    const user = await this.userRepository.findOne(findOptions);

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  public async findByEmail(email: string): Promise<UserModel> {
    return this.userRepository.findOne({ email });
  }

  public updateById(id: number, user: Partial<UserModel>) {
    return this.userRepository.updateById(id, user);
  }

  public deleteById(id: number) {
    return this.userRepository.deleteById(id);
  }

  public checkEmailAvailability(email: string): Promise<boolean> {
    return this.userRepository
      .findOne({
        email,
      })
      .then((result) => !result);
  }
}
