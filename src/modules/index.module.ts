import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { BookModule } from './book/book.module';
import { RentalModule } from './rental/rental.module';

@Module({
  providers: [],
  imports: [UserModule, BookModule, RentalModule],
  exports: [],
})
export class IndexModule {}
