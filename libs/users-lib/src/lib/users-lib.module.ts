import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities';
import { UsersLibService } from './users-lib.service';
import { provideUsersRepository } from './repositories';
import { DataSource } from '@app/common';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UsersLibService, ...provideUsersRepository(DataSource.TYPEORM)],
  exports: [UsersLibService],
})
export class UsersLibModule {}
