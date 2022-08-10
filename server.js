import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";

const app = express();
const PORT = process.env.PORT || 8000;

//Middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());

//apis
import adminUserRouter from "./src/routers/adminUserRouter.js";
app.use("/api/v1/admin-user", adminUserRouter);

app.get("/", (req, res) => {
  res.json({
    message: "Hi there, You got lost?",
  });
});
app.use((error, req, res, next) => {
  console.log(error);
  const statusCode = error.status || 404;
  res.status(statusCode).json({
    status: "error",
    message: error.message,
  });
});

app.listen(PORT, (error) => {
  error
    ? console.log(error)
    : console.log(`Server running at http://localhost:${PORT}`);
});
