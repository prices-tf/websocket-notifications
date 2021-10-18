import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { NotificationsHealthIndicator } from './notifications.health';
import { RabbitMQHealthIndicator } from './rabbitmq.health';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private rabbitmqHealthIndicator: RabbitMQHealthIndicator,
    private notificationHealthIndicator: NotificationsHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.notificationHealthIndicator.isHealthy('notifications'),
      () => this.rabbitmqHealthIndicator.isHealthy('rabbitmq'),
    ]);
  }
}
