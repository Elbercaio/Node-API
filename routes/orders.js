const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.status(200).send({
    message: "GET all Orders",
  });
});

router.get("/:order_id", (req, res, next) => {
  const id = req.params.order_id;
  res.status(200).send({
    message: `GET Order: ${id}`,
  });
});

router.post("/", (req, res, next) => {
  const order = {
    product_id: req.body.id,
    quantity: req.body.quantity,
  };
  res.status(201).send({
    message: `Order created`,
    id: product_id,
    order: order,
  });
});

router.delete("/:order_id", (req, res, next) => {
  const id = req.params.order_id;
  res.status(201).send({
    message: `DELETE Product: ${id}`,
  });
});

module.exports = router;
