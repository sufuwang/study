import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FeishuService } from './feishu.service';
import { RobotDto, RECEIVE_TYPE } from './dto/robot.dto';
import { ConfigService } from '@nestjs/config';

@Controller('feishu')
export class FeishuController {
  constructor(
    private readonly feishuService: FeishuService,
    private readonly configService: ConfigService,
  ) {}

  @Get('keys')
  getKeys() {
    return this.configService.get('FEISHU_CONFIG');
  }

  @Get('token')
  getToken(): any {
    return this.feishuService.getToken();
  }
  @Post('robot')
  handleRobot(@Body() robotDto: RobotDto) {
    return this.feishuService.handleRobot(robotDto);
  }
}
