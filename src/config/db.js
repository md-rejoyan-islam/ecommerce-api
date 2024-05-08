import mongoose from "mongoose";
mongoose.set("strictQuery", false);
const url = process.env.MONGO_URL;
const mongoDBConnection = async (options = {}) => {
  try {
    const connect = await mongoose.connect(url, options);
    console.log(`mongoDB connected successfully`.red.bgGreen);
    mongoose.connection.on("error", (error) => {
      console.log("mongodb error" + error);
    });
  } catch (error) {
    console.log(error.message.bgRed);
  }
};

export default mongoDBConnection;
