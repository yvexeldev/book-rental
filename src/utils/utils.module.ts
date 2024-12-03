import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma';
import { RedisModule } from './redis/redis.module';
import { MailModule } from './mail/mail.module';

@Module({
    imports: [PrismaModule, RedisModule, MailModule],
})
export class UtilsModule {}
