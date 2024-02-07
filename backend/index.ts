import express from "express";
import cors from "cors";
import mainRouter from "./routes/index";
import dotenv from "dotenv";
dotenv.config();

const port = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1", mainRouter);

app.listen(port, () => {
  console.log(`listening on Port ${port}`);
});
