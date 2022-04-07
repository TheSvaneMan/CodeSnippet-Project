import { mongoose } from "mongoose";

const { Schema } = mongoose;

const snippschema = new Schema({
  title: String,
  description: String,
  favorite: Boolean,
  date: String,
  language: String,
  code: String
});

export const models = [
  {
    name: "snip",
    schema: snippschema,
    collection: "snipps",
  },
];
