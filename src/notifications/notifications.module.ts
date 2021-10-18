import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RabbitMQWrapperModule } from '../rabbitmq-wrapper/rabbitmq-wrapper.module';
import { NotificationsService } from './notifications.service';

@Module({
  imports: [ConfigModule, RabbitMQWrapperModule],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
