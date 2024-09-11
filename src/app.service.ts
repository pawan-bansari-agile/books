import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Book, BookDocument } from './schemas/book.schema';
import { Model } from 'mongoose';
import {
  GrpcInvalidArgumentException,
  GrpcNotFoundException,
  GrpcUnknownException,
} from 'nestjs-grpc-exceptions';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Book.name) private bookModel: Model<BookDocument>, // Inject the Todo model
  ) {}

  async CreateBook(data) {
    console.log('✌️data from service method --->', data);
    const book = new this.bookModel({ ...data });
    await book.save();
    console.log('create ✌️book result --->', book);
    return book;
  }

  async GetBooks(userId: string) {
    console.log('✌️userId from the service --->', userId);
    const books = await this.bookModel.find({ userId });
    console.log('books from service method --->', books);
    return { books };
  }

  async GetBook(data: any) {
    console.log('✌️data --->', data);
    try {
      console.log('log from getBook method in service', data.id);

      if (!data.id.match(/^[0-9a-fA-F]{24}$/)) {
        throw new GrpcInvalidArgumentException('Incorrect ID Format');
      }

      const book = await this.bookModel.findById(data.id);
      console.log('✌️book --->', book);
      if (!book) {
        throw new GrpcNotFoundException('book Not Found.');
      }
      if (book.userId !== data.userId) {
        throw new GrpcUnknownException(
          'You are not authorized to access this book',
        );
      }
      return { book };
    } catch (err) {
      if (
        err instanceof GrpcInvalidArgumentException ||
        err instanceof GrpcNotFoundException
      ) {
        throw err; // Re-throw the original gRPC-specific error
      }

      // Throw an unknown error with the actual error message for better debugging
      throw new GrpcUnknownException(
        `Internal server error: ${err.message || err}`,
      );
    }
  }

  async UpdateBook(data) {
    try {
      console.log('log from updateBook method in service', data);

      if (!data.id.match(/^[0-9a-fA-F]{24}$/)) {
        throw new GrpcInvalidArgumentException('Incorrect ID format');
      }

      const book = await this.bookModel.findById(data.id);
      if (!book) {
        throw new GrpcNotFoundException('Book not found');
      }
      if (book.userId !== data.userId) {
        throw new GrpcUnknownException(
          'You are not authorized to access this book',
        );
      }

      if (data.title) book.title = data.title;
      if (data.description) book.description = data.description;
      if (data.author) book.author = data.author;
      await book.save();

      return { book };
    } catch (err) {
      throw new GrpcUnknownException(`Internal server error: ${err.message}`);
    }
  }

  async DeleteBook(data: any) {
    try {
      if (!data.id.match(/^[0-9a-fA-F]{24}$/)) {
        throw new GrpcInvalidArgumentException('Incorrect ID format');
      }

      const book = await this.bookModel.findById(data.id);
      if (book.userId !== data.userId) {
        throw new GrpcUnknownException(
          'You are not authorized to access this book',
        );
      }
      const result = await this.bookModel.deleteOne({ _id: data.id }).exec();
      if (result.deletedCount === 0) {
        throw new GrpcNotFoundException('Book not found');
      }

      return { success: true }; // Return a structured boolean response
    } catch (err) {
      throw new GrpcUnknownException(`Internal server error: ${err.message}`);
    }
  }
}
