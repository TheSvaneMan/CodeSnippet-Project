import mongoose from "mongoose";
import { models } from "./models.js";

const { MONGODB_URL, NODE_ENV } = process.env;

export default async function connectDb() {
  if (!MONGODB_URL) {
    const errorMsg =
      NODE_ENV === "production"
        ? "Please define the MONGODB_URL environment variable — pointing to your full connection string, including database name."
        : "Please define the MONGODB_URL environment variable inside an .env file — pointing to your full connection string, including database name.";
    throw new Error(errorMsg);
  }

  if (mongoose.connection.readyState > 0) {
    if (NODE_ENV === "development") {
      for (const model of models) {
        if (mongoose.connection.models[model.name]) {
          mongoose.connection.deleteModel(model.name);
        }
        mongoose.connection.model(model.name, model.schema, model.collection);
      }
    }
    return mongoose.connection;
  }

  try {
    const connection = await mongoose.connect(MONGODB_URL);

    for (const model of models) {
      mongoose.connection.model(model.name, model.schema, model.collection);
    }

    console.log("✅ Mongoose connected");
    return connection;
  } catch (error) {
    throw new Error("Database Connection Failed: " + error.message);
  }
}
