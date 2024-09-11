import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

// Define the document type
export type BookDocument = HydratedDocument<Book>;

// Define the schema using @Schema decorator
@Schema({ timestamps: true }) // Adds createdAt and updatedAt fields
export class Book {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  author: string;

  @Prop({ required: true })
  userId: string;
}

// Create and export the schema
export const BookSchema = SchemaFactory.createForClass(Book);
