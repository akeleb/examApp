import path from "path";
import express from "express";
import morgan from "morgan";
import colors from "colors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleWare.js";
import defaultRoutes from "./routes/defaultRoutes.js";
import defaultRoutes from "./routes/examRoutes.js";

dotenv.config();

connectDB();

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());

app.use("/", defaultRoutes);
app.use("/exam",examRoutes);

app.use(notFound);
app.use(errorHandler);
const port = process.env.PORT || 5000;
app.get("/", (req, res) => {
  res.send("Wellcome bro");
});

app.listen(port, () =>
  console.log(
    `My Server is running in ${process.env.NODE_ENV} on port ${port}`.yellow
      .bold.underline
  )
);
