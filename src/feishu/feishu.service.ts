import { Injectable, CACHE_MANAGER, Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Observable, map, from, take } from 'rxjs';
import { AxiosResponse } from 'axios';
import { Cache } from 'cache-manager';
import { BusinessException } from '../common/exceptions/business.exception';
import { RobotDto, RECEIVE_TYPE } from './dto/robot.dto';

@Injectable()
export class FeishuService {
  private APP_TOKEN_CACHE_KEY;
  private CONFIG;
  private APP_ACCESS_TOKEN;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    this.APP_TOKEN_CACHE_KEY = this.configService.get('APP_TOKEN_CACHE_KEY');
    this.CONFIG = this.configService.get('FEISHU_CONFIG');
  }

  async getToken(): Promise<Observable<string>> {
    const cache = await this.cacheManager.get<string>(this.APP_TOKEN_CACHE_KEY);
    console.info('cache:', cache);
    if (cache) {
      this.APP_ACCESS_TOKEN = cache;
      return from([cache]);
    }
    const { URL, APP_ID, APP_SECRET } = this.CONFIG;
    const res = this.httpService.post(
      `${URL}/auth/v3/app_access_token/internal`,
      {
        app_id: APP_ID,
        app_secret: APP_SECRET,
      },
      {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
      },
    );
    return res.pipe(
      map(({ data }) => {
        console.info('data:', data);
        if (data.code !== 0) {
          throw new BusinessException('调用飞书 token 错误');
        }
        this.cacheManager.set(this.APP_TOKEN_CACHE_KEY, data.app_access_token, {
          ttl: data.expire - 60,
        });
        this.APP_ACCESS_TOKEN = data.app_access_token;
        return data.app_access_token;
      }),
    );
  }

  handleRobot({ type, message, userId }: RobotDto) {
    if (type === RECEIVE_TYPE.sendMessage) {
      return this.handleRobotSendMessage(message, userId);
    } else {
      throw new BusinessException('robot type 错误');
    }
  }

  private async handleRobotSendMessage(message, receive_id) {
    const { URL, APP_ID, APP_SECRET } = this.CONFIG;

    if (!this.APP_ACCESS_TOKEN) {
      throw new BusinessException('请先调一次 /feishu/token');
    }

    return this.httpService.post(
      `${URL}/im/v1/messages?receive_id_type=user_id`,
      {
        receive_id,
        content: JSON.stringify({ text: message }),
        msg_type: 'text',
      },
      {
        headers: {
          Authorization: `Bearer ${this.APP_ACCESS_TOKEN}`,
        },
      },
    );

    // return (await this.getToken()).pipe(
    //   map(({ tenant_access_token }) => {
    //     console.info(
    //       'receive_id:',
    //       URL,
    //       tenant_access_token,
    //       message,
    //       receive_id,
    //     );
    //     const ds = httpService.post(
    //       `${URL}/im/v1/messages?receive_id_type=user_id`,
    //       {
    //         receive_id,
    //         content: JSON.stringify({ text: message }),
    //         msg_type: 'text',
    //       },
    //       {
    //         headers: {
    //           Authorization: `Bearer ${tenant_access_token}`,
    //         },
    //       },
    //     );
    //     ds.pipe(map((d) => console.info('asasasas:', d.data)));
    //     // return ds;
    //     return 1212;
    //   }),
    // );
  }
}
