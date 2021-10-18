import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { TerminusModule } from '@nestjs/terminus';
import { RabbitMQHealthIndicator } from './rabbitmq.health';
import { RabbitMQWrapperModule } from '../rabbitmq-wrapper/rabbitmq-wrapper.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { NotificationsHealthIndicator } from './notifications.health';

@Module({
  imports: [TerminusModule, RabbitMQWrapperModule, NotificationsModule],
  providers: [RabbitMQHealthIndicator, NotificationsHealthIndicator],
  controllers: [HealthController],
})
export class HealthModule {}
