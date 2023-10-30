import mongoose from "mongoose";
import dotenv from "dotenv";

mongoose.set('strictQuery', true);

dotenv.config();

const connectDB = async () => {
  const URI = process.env.MONGO_URL;
  try {
    const conn = await mongoose.connect(URI).then();

    console.log(`MongoDb Connected ${conn.connection.host}`.magenta.bold.underline);
  } catch (err) {
    console.log(`Error: ${err.message}`.red.bold.underline);
    process.exit(1);
  }
};
export default connectDB;