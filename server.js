import express from "express";

const app = express();
const PORT = 8000;

app.use("/", (req, res, next) => {
  res.send("Welcome To New World");
});
app.listen(PORT, (error) => {
  error && console.log(error);
  console.log(`Server running at http://localhost:${PORT}`);
});
