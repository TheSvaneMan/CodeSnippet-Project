import { mongoose } from "mongoose";

const { Schema } = mongoose;

const bookSchema = new Schema({
  title: String,
  description: String,
});

export const models = [
  {
    name: "Book",
    schema: bookSchema,
    collection: "books",
  },
];
