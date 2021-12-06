const express = require("express");
const router = express.Router();
const mysql = require("../mysql").pool;

router.get("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    conn.query(
      "SELECT * FROM orders",
      (error, result, field) => {
        conn.release();
        if (error) {
          res.status(500).send({
            error: error,
            response: null,
          });
        }
        res.status(200).send({
          response: result,
        });
      }
    );
  });
});

router.get("/:order_id", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    conn.query(
      "SELECT * FROM orders WHERE order_id=?",
      req.params.product_id,
      (error, result, field) => {
        conn.release();
        if (error) {
          res.status(500).send({
            error: error,
            response: null,
          });
        }
        res.status(200).send({
          response: result,
        });
      }
    );
  });
});

router.post("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    conn.query(
      "INSERT INTO orders (order_id, quantity, product_id) VALUES (?, ?, ?)",
      [req.body.id, req.body.quantity, res.body.product_id],
      (error, result, field) => {
        conn.release();
        if (error) {
          res.status(500).send({
            error: error,
            response: null,
          });
        }
        res.status(201).send({
          message: `Order successfully inserted`,
          id_product: result.insertId,
        });
      }
    );
  });
});

router.delete("/:order_id", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    conn.query(
      `DELETE FROM orders WHERE order_id = ?`,
      req.params.product_id,
      (error, result, field) => {
        conn.release();
        if (error) {
          res.status(500).send({
            error: error,
            response: null,
          });
        }
        res.status(202).send({
          message: `Order successfully deleted`,
          id_product: result.insertId,
        });
      }
    );
  });
});

module.exports = router;
