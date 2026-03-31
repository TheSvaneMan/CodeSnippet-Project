// app/db/models.js
import { mongoose } from "mongoose";

const { Schema } = mongoose;

const snippetSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minLength: [3, "Title must be at least 3 characters"],
      maxLength: [100, "Title cannot exceed 100 characters"],
    },
    language: {
      type: String,
      required: [true, "Language is required"],
      trim: true,
      maxLength: [50, "Language cannot exceed 50 characters"],
    },
    code: {
      type: String,
      required: [true, "Code is required"],
      // Prevents payload size attacks
      maxLength: [15000, "Code snippet is too long (max 15,000 chars)"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxLength: [1000, "Description cannot exceed 1000 characters"],
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
        minLength: [1, "Tag cannot be empty"],
        maxLength: [20, "Tag is too long"],
      },
    ],
    favorite: {
      type: Boolean,
      default: false,
    },
    shareable: {
      type: Boolean,
      default: false,
    },
    user: {
      type: String,
      required: true,
      index: true, // Optimizes searching snippets by user
    },
  },
  {
    // Mongoose automatically handles createdAt and updatedAt
    timestamps: true,
  }
);

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true, // Prevents duplicate accounts
    trim: true,
    minLength: [3, "Username must be at least 3 characters"],
  },
  password: {
    type: String,
    required: true,
  },
  following: [{ type: String }],
});

const subscriptionSchema = new Schema({
  userID: {
    type: String,
    required: true,
    index: true,
  },
  data: {
    type: Object,
    required: true,
  },
});

export const models = [
  { name: "snip", schema: snippetSchema, collection: "snipps" },
  { name: "user", schema: userSchema, collection: "users" },
  {
    name: "subscription",
    schema: subscriptionSchema,
    collection: "subscriptions",
  },
];
