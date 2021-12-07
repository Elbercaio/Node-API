const express = require("express");
const productsRouter = require("./routes/products");
const ordersRouter = require("./routes/orders");
const morgan = require("morgan");
const bodyParser = require("body-parser");

const app = express();

app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Header",
    "Origin, X-Requested-With, Content-Type, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, DELETE, GET, PATCH");
    return res.status(200).send({});
  }

  next();
});

app.use("/products", productsRouter);
app.use("/orders", ordersRouter);

app.use((req, res, next) => {
  const error = new Error("404 - Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  return res.send({
    error: { message: error.message },
  });
});

module.exports = app;
