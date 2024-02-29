import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser = require("body-parser");

import postRoutes from './routes/posts';
import userRoutes from './routes/users';


dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
console.log(process.env.SECRET_KEY)
const CORS_ORIGIN = process.env.CORS_ORIGIN;

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors({origin: CORS_ORIGIN}))
app.use(express.json())
// connect to mongo DB
const CONNECTION_URL = `mongodb+srv://kenabdulka:${process.env.DB_PASSWORD}@cluster0.dmrsfej.mongodb.net/?retryWrites=true&w=majority`

mongoose.Promise = Promise;//
mongoose.connect(CONNECTION_URL)
  // .then(() => app.listen(port, () => console.log(`Server is Running on port: ${port}`)))
  // .catch((error) => console.log(error.message));

mongoose.connection.on(`error`, (error: Error) => console.log(error));

app.use('/posts', postRoutes);
app.use("/users", userRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

