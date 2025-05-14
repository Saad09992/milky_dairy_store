import express from "express";
import cors from "cors";
import countRouter from "./routes/CountRouter.js";
import connection from "./config/db.js";

const PORT = process.env.PORT || 3000;

const app = express();
connection.connect(function (err) {
  if (err) throw err;
  console.log("Database connected successfully");
});
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/", countRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
