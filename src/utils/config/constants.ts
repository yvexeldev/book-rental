export const RedisClient = 'REDIS_CLIENT';
export const MailTransporter = 'MAIL_TRANSPORTER';
export const RABBITMQ = {
  EXCHANGES: {
    EMAIL: 'email-exchange',
  },
  ROUTING_KEYS: {
    SEND_OTP: 'send-otp-routing-key',
  },
  QUEUES: {
    SEND_OTP: 'send-otp-queue',
  },
};
