import { Module, CacheModule } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { FeishuService } from './feishu.service';
import { FeishuController } from './feishu.controller';

@Module({
  imports: [HttpModule, CacheModule.register()],
  controllers: [FeishuController],
  providers: [FeishuService],
})
export class FeishuModule {}
