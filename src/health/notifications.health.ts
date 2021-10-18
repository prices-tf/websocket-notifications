import { Injectable } from '@nestjs/common';
import {
  HealthIndicator,
  HealthIndicatorResult,
  HealthCheckError,
} from '@nestjs/terminus';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class NotificationsHealthIndicator extends HealthIndicator {
  constructor(private readonly notifications: NotificationsService) {
    super();
  }

  isHealthy(key: string): Promise<HealthIndicatorResult> {
    return this.notifications
      .isHealthy()
      .then(() => {
        return this.getStatus(key, true);
      })
      .catch((err) => {
        throw new HealthCheckError(
          'Gateway check failed',
          this.getStatus(key, false, { message: err.message }),
        );
      });
  }
}
