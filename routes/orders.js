const express = require("express");
const router = express.Router();
const mysql = require("../mysql").pool;

router.get("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({
        error: error,
      });
    }
    conn.query(
      `SELECT orders.order_id, 
              orders.quantity, 
              products.product_id, 
              products.name, 
              products.price,
              products.product_image
      FROM orders INNER JOIN products
      ON products.product_id = orders.product_id;`,
      (error, result, field) => {
        conn.release();
        if (error) {
          return res.status(500).send({
            error: error,
          });
        }
        const response = {
          orders: result.map((order) => {
            let link = `http://${process.env.HOST}:${process.env.PORT}/`;
            return {
              order_id: order.order_id,
              quantity: order.quantity,
              product: {
                product_id: order.product_id,
                name: order.name,
                price: order.price,
                product_image: `${link}${order.product_image}`,
              },
              request: {
                method: "GET",
                description: "GET an order",
                url: `${link}/orders/${order.order_id}`,
              },
            };
          }),
        };
        return res.status(200).send(response);
      }
    );
  });
});

router.get("/:order_id", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({
        error: error,
      });
    }
    conn.query(
      `SELECT orders.order_id, 
              orders.quantity, 
              products.product_id, 
              products.name, 
              products.price,
              products.product_image
      FROM orders INNER JOIN products
      ON products.product_id = orders.product_id
      WHERE order_id=?;`,
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
        let link = `http://${process.env.HOST}:${process.env.PORT}/`;

        const response = {
          order: {
            order_id: result[0].order_id,
            quantity: result[0].quantity,
            product: {
              product_id: result[0].product_id,
              name: result[0].name,
              price: result[0].price,
              product_image: `${link}${result[0].product_image}`,
            },
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
        if (result.length == 0) {
          return res.status(404).send({
            message: "404 - Product not found",
          });
        }
        conn.query(
          "INSERT INTO orders (quantity, product_id) VALUES (?, ?)",
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
                product_id: req.body.product_id,
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
    if (error) {
      return res.status(500).send({
        error: error,
      });
    }
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
        if (result.affectedRows == 0) {
          return res.status(404).send({
            message: "404 - Product not found",
          });
        }
        const response = {
          message: "Order deleted successfully",
          request: {
            method: "POST",
            description: "POST an order",
            url: `http://${process.env.HOST}:${process.env.PORT}/orders`,
            body: {
              quantity: "Number",
              product_id: "Number",
            },
          },
        };
        return res.status(202).send(response);
      }
    );
  });
});

module.exports = router;
