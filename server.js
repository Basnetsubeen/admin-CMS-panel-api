import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "path";

const app = express();
const PORT = process.env.PORT || 8000;

// Database connection
import { dbConnection } from "./src/config/dbConfig.js";
dbConnection();
//Middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());

//serve static content
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "public")));

//apis
import adminUserRouter from "./src/routers/adminUserRouter.js";
import category from "./src/routers/CategoryRouter.js";
import { adminAuth } from "./src/middlewares/auth-middleware/authMiddleware.js";
import paymentMethodRouter from "./src/routers/paymentMethodRouter.js";
import productRouter from "./src/routers/productRouter.js";
app.use("/api/v1/admin-user", adminUserRouter);
app.use("/api/v1/category", adminAuth, category);
app.use("/api/v1/payment-method", paymentMethodRouter);
app.use("/api/v1/product", productRouter);

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
