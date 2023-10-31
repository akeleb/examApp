import mongoose from "mongoose";
import dotenv from "dotenv";
import colors from "colors";
import quizes from "./data/quiz.js";
import Quiz from "./models/examModel.js";

import connectDB from "./config/db.js";

dotenv.config();

connectDB();

const importData = async () => {
  try {
    // // await Order.deleteMany();
    // // await Product.deleteMany();
    // await Quiz.deleteMany();

    const createdQuiz = await Quiz.insertMany(quizes);

  
    console.log("Data imported successfully".green.inverse);
    process.exit();
  } catch (error) {
      console.log(`${error}`.red.inverse);
      
      process.exit(1)
  }
};

const destroyData = async () => {
    try {
      // await Order.deleteMany();
      // await Product.deleteMany();
      await Quiz.deleteMany();

      console.log("Data destroyed successfully".red.inverse);
      process.exit();
    } catch (error) {
        console.log(`${error}`.red.inverse);
        
        process.exit(1)
    }
  };

if (process.argv[ 2 ] === "-d")
{
    destroyData();
} else
{
    importData();
  }