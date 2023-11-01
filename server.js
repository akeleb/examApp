import express from "express";
import morgan from "morgan";
import colors from "colors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleWare.js";
import defaultRoutes from "./routes/defaultRoutes.js";
import examRoutes from "./routes/examRoutes.js";

dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT || 5000;

// Middleware for development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Middleware for parsing JSON
app.use(express.json());

// Define routes
app.use("/", defaultRoutes);
app.use("/exams", examRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running in ${process.env.NODE_ENV} on port ${port}`.yellow.bold.underline);
});
