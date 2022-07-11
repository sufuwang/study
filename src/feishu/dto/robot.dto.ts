import { IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum RECEIVE_TYPE {
  sendMessage = 'sendMessage',
}

export class RobotDto {
  @IsNotEmpty()
  @IsEnum(RECEIVE_TYPE)
  @ApiProperty({ example: 'sendMessage', enum: RECEIVE_TYPE })
  public type: RECEIVE_TYPE;

  @IsNotEmpty()
  @ApiProperty({ example: 'eeb18egc' })
  public userId: string;

  @IsNotEmpty()
  @ApiProperty({ example: '{"text":" test content"}' })
  public message: string;
}
