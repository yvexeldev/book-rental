import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { BookModule } from './book/book.module';

@Module({
  providers: [],
  imports: [UserModule, BookModule],
  exports: [],
})
export class IndexModule {}
