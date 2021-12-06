const express = require("express");
const router = express.Router();
const mysql = require("../mysql").pool;

router.get("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    conn.query("SELECT * FROM orders", (error, result, field) => {
      conn.release();
      if (error) {
        return res.status(500).send({
          error: error,
        });
      }
      const response = {
        quantity: result.length,
        orders: result.map((order) => {
          return {
            order_id: order.order_id,
            quantity: order.quantity,
            id_product: order.id_product,
            request: {
              method: "GET",
              description: "GET an order",
              url: `http://${process.env.HOST}:${process.env.PORT}/orders/${order.order_id}`,
            },
          };
        }),
      };
      return res.status(200).send(response);
    });
  });
});

router.get("/:order_id", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    conn.query(
      "SELECT * FROM orders WHERE order_id=?",
      req.params.order_id,
      (error, result, field) => {
        conn.release();
        if (error) {
          return res.status(500).send({
            error: error,
          });
        }
        if (result.length == 0) {
          return res.status(404).send({
            message: "404 - Product not found",
          });
        }
        const response = {
          order: {
            order_id: result[0].order_id,
            quantity: result[0].quantity,
            id_product: result[0].id_product,
            request: {
              method: "GET",
              description: "GET all orders",
              url: `http://${process.env.HOST}:${process.env.PORT}/orders`,
            },
          },
        };
        return res.status(200).send(response);
      }
    );
  });
});

router.post("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({
        error: error,
      });
    }
    conn.query(
      "SELECT * FROM products WHERE product_id=?",
      req.body.product_id,
      (error, result, field) => {
        if (error) {
          return res.status(500).send({
            error: error,
          });
        }
        if (result.length == 0) {
          return res.status(404).send({
            message: "404 - Product not found",
          });
        }
        conn.query(
          "INSERT INTO orders (quantity, id_product) VALUES (?, ?)",
          [req.body.quantity, req.body.product_id],
          (error, result, field) => {
            conn.release();
            if (error) {
              return res.status(500).send({
                error: error,
              });
            }
            const response = {
              message: "Order successfully created",
              createdOrder: {
                order_id: result.insertId,
                quantity: req.body.quantity,
                id_product: req.body.product_id,
                request: {
                  method: "GET",
                  description: "GET all orders",
                  url: `http://${process.env.HOST}:${process.env.PORT}/orders`,
                },
              },
            };
            return res.status(201).send(response);
          }
        );
      }
    );
  });
});

router.delete("/:order_id", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    conn.query(
      `DELETE FROM orders WHERE order_id = ?`,
      req.params.order_id,
      (error, result, field) => {
        conn.release();
        if (error) {
          return res.status(500).send({
            error: error,
          });
        }
        if (result.length == 0) {
          return res.status(404).send({
            message: "404 - Product not found",
          });
        }
        const response = {
          message: "Order successfully deleted",
          request: {
            method: "POST",
            description: "POST an order",
            url: `http://${process.env.HOST}:${process.env.PORT}/orders`,
            body: {
              quantity: "Number",
              id_product: "Number",
            },
          },
        };
        return res.status(202).send(response);
      }
    );
  });
});

module.exports = router;
