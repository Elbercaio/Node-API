const express = require("express");
const router = express.Router();
const login = require("../middleware/login");
const ordersController = require("../controllers/orders-controller");

router.get("/", ordersController.getOrders);

router.get("/:order_id", ordersController.getOrderById);

router.post("/", login.required, ordersController.postOrder);

router.delete("/:order_id", login.required, ordersController.deleteOrder);

module.exports = router;
