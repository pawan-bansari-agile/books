import { Controller, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { GrpcMethod } from '@nestjs/microservices';

@Controller()
export class AppController {
  private logger = new Logger('BookController');

  constructor(private mathService: AppService) {}

  @GrpcMethod('BookController', 'CreateBook')
  async CreateBook(data: any) {
    console.log('✌️data --->', data);
    console.log('data', data.data);
    this.logger.log(`creating a todo with ${data.data}`);
    return this.mathService.CreateBook(data);
  }

  @GrpcMethod('BookController', 'GetBooks')
  async GetBooks(data: { userId: string }) {
    const { userId } = data;
    console.log('✌️userId from the controller --->', userId);

    this.logger.log('returning all the books');
    return this.mathService.GetBooks(userId);
  }

  @GrpcMethod('BookController', 'GetBook')
  async getBook(data: any) {
    console.log('data from getBook method', data);
    this.logger.log('getting a book with', data);
    return this.mathService.GetBook(data);
  }

  @GrpcMethod('BookController', 'UpdateBook')
  async updateBook(data: any) {
    console.log('log from book service update method');

    console.log('data from updateBook method', data);
    this.logger.log('updating a book with', data);
    return this.mathService.UpdateBook(data);
  }

  @GrpcMethod('BookController', 'DeleteBook')
  async deleteBook(data: any) {
    console.log('data from deleteBook method', data);
    this.logger.log('deleting a book with', data);
    const response = await this.mathService.DeleteBook(data);
    console.log('✌️response book service controller --->', response);
    return response;
  }
}
