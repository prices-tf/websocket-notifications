import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Config, RedisConfig } from '../common/config/configuration';
import * as IORedis from 'ioredis';
import {
  RabbitSubscribe,
  requeueErrorHandler,
} from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class NotificationsService implements OnModuleDestroy {
  private readonly logger = new Logger(NotificationsService.name);
  private readonly publisherClient = this.newRedisClient();

  constructor(private readonly configService: ConfigService<Config>) {}

  @RabbitSubscribe({
    exchange: 'bptf-price.updated',
    routingKey: '*',
    queue: 'websocketNotificationBptfPrice',
    queueOptions: {
      arguments: {
        'x-queue-type': 'quorum',
      },
    },
    errorHandler: requeueErrorHandler,
  })
  private async handlePrice(price: any): Promise<void> {
    this.logger.debug('Publishing price for ' + price.sku);

    await this.publisherClient.publish(
      'websocket',
      JSON.stringify({
        type: 'PRICE_UPDATED',
        data: price,
      }),
    );
  }

  async onModuleDestroy() {
    // Close Redis client before stopping
    await this.publisherClient.quit();
  }

  isHealthy(): Promise<boolean> {
    return this.publisherClient.ping().then(() => true);
  }

  private newRedisClient() {
    const redisConfig = this.configService.get<RedisConfig>('redis');

    let options: IORedis.RedisOptions;

    if (redisConfig.isSentinel) {
      options = {
        sentinels: [
          {
            host: redisConfig.host,
            port: redisConfig.port,
          },
        ],
        name: redisConfig.set,
      };
    } else {
      options = {
        host: redisConfig.host,
        port: redisConfig.port,
        password: redisConfig.password,
      };
    }

    options.enableOfflineQueue = false;

    return new IORedis(options);
  }
}
