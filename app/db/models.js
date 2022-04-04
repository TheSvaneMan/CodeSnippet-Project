import { mongoose } from "mongoose";

const { Schema } = mongoose;

const snippschema = new Schema({
  title: String,
  description: String,
  favorite: Boolean,
  date: String
});

export const models = [
  {
    name: "Book",
    schema: snippschema,
    collection: "snipps",
  },
];
