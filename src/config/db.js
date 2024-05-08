import mongoose from "mongoose";
import { mongoURL } from "../app/secret.js";
// mongoose.set("strictQuery", false);

const mongoDBConnection = async (options = {}) => {
  try {
    const connect = await mongoose.connect(mongoURL, options);

    console.log(
      `mongoDB connected successfully to ${connect.connection.name}`.red.bgGreen
    );
    mongoose.connection.on("error", (error) => {
      console.log("mongodb error" + error);
    });
  } catch (error) {
    console.log(error.message.bgRed);
  }
};

export default mongoDBConnection;
