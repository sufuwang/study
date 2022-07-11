import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  controllers: [UserController],
  providers: [UserService],
  // providers: [...UserProviders, UserService],
  exports: [UserService],
})
export class UserModule {}
