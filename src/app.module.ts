import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Book, BookSchema } from './schemas/book.schema';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/book-manager'),
    MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
