import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Version,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { BusinessException } from '../common/exceptions/business.exception';
import { ConfigService } from '@nestjs/config';

// @Controller('user')
@Controller({
  path: 'user',
  version: '1',
})
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  @Get('err')
  // @Version('1')
  err() {
    const a: any = {};
    try {
      console.log(a.b.c);
    } catch (error) {
      throw new BusinessException('11111');
      // throw BusinessException.throwForbidden();
    }
  }

  @Get('find')
  @Version('2')
  findV2() {
    return 'Hello, Find v2!';
  }

  @Get('find')
  // @Version('1')
  @Version([VERSION_NEUTRAL, '1'])
  findV1() {
    // throw new Error('1221');
    return 'Hello, Find v1!';
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
