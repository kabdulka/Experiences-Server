import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// app.use(bodyParser.json({ limit: "30mb" }));
// app.use(bodyParser.urlencoded({ limit: "30mb" }));
app.use(cors());

// connect to mongo DB
const CONNECTION_URL = `mongodb+srv://kenabdulka:${process.env.DB_PASSWORD}@cluster0.dmrsfej.mongodb.net/?retryWrites=true&w=majority`

mongoose.Promise = Promise;//
mongoose.connect(CONNECTION_URL)
  // .then(() => app.listen(port, () => console.log(`Server is Running on port: ${port}`)))
  // .catch((error) => console.log(error.message));

mongoose.connection.on(`error`, (error: Error) => console.log(error));

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

