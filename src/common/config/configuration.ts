export interface Config {
  port: number;
  redis: RedisConfig;
  rabbitmq: RabbitMQConfig;
}

export interface RedisConfig {
  isSentinel: boolean;
  host: string;
  port: number;
  password?: string;
  set?: string;
}

export interface RabbitMQConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  vhost: string;
}

export default (): Config => {
  return {
    port:
      process.env.NODE_ENV === 'production'
        ? 3000
        : parseInt(process.env.PORT, 10),
    redis: {
      isSentinel: process.env.REDIS_IS_SENTINEL === 'true',
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT, 10),
      password: process.env.REDIS_PASSWORD,
      set: process.env.REDIS_SET,
    },
    rabbitmq: {
      host: process.env.RABBITMQ_HOST,
      port: parseInt(process.env.RABBITMQ_PORT, 10),
      username: process.env.RABBITMQ_USERNAME,
      password: process.env.RABBITMQ_PASSWORD,
      vhost: process.env.RABBITMQ_VHOST,
    },
  };
};
