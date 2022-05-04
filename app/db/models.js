import { mongoose } from "mongoose";

const { Schema } = mongoose;

const snippschema = new Schema({
  title: String,
  description: String,
  favorite: Boolean,
  date: String,
  language: String,
  code: String,
  user: String,
  //add Timestamps (google mongoose timestamps)
});

const userSchema = new Schema({
  username: String,
  password: String
});

export const models = [
  {
    name: "snip",
    schema: snippschema,
    collection: "snipps",
  },
  {
    name: "user",
    schema: userSchema,
    collection: "users",
  },
];

