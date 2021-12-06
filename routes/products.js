const express = require("express");
const router = express.Router();
const mysql = require("../mysql").pool;

router.get("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    conn.query(
      "SELECT product_id, name, price FROM products",
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

router.get("/:product_id", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    conn.query(
      "SELECT product_id, name, price FROM products WHERE product_id=?",
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
      "INSERT INTO products (name, price) VALUES (?, ?)",
      [req.body.name, req.body.price],
      (error, result, field) => {
        conn.release();
        if (error) {
          res.status(500).send({
            error: error,
            response: null,
          });
        }
        res.status(201).send({
          message: `Product successfully inserted`,
          id_product: result.insertId,
        });
      }
    );
  });
});

router.patch("/:product_id", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    conn.query(
      `UPDATE products
        SET name = ?,
            price = ?
      WHERE product_id = ?`,
      [req.body.name, req.body.price, req.params.product_id],
      (error, result, field) => {
        conn.release();
        if (error) {
          res.status(500).send({
            error: error,
            response: null,
          });
        }
        res.status(202).send({
          message: `Product successfully updated`,
          id_product: result.insertId,
        });
      }
    );
  });
});

router.delete("/:product_id", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    conn.query(
      `DELETE FROM products WHERE product_id = ?`,
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
          message: `Product successfully deleted`,
          id_product: result.insertId,
        });
      }
    );
  });
});

module.exports = router;
