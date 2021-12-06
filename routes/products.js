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
          return res.status(500).send({
            error: error,
          });
        }
        const response = {
          quantity: result.length,
          products: result.map((prod) => {
            return {
              product_id: prod.product_id,
              name: prod.name,
              price: prod.price,
              request: {
                method: "GET",
                description: "GET a product",
                url: `http://${process.env.HOST}:${process.env.PORT}/products/${prod.product_id}`,
              },
            };
          }),
        };
        return res.status(200).send(response);
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
          product: {
            product_id: result[0].product_id,
            name: result[0].name,
            price: result[0].price,
            request: {
              method: "GET",
              description: "GET all products",
              url: `http://${process.env.HOST}:${process.env.PORT}/products`,
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
    conn.query(
      "INSERT INTO products (name, price) VALUES (?, ?)",
      [req.body.name, req.body.price],
      (error, result, field) => {
        conn.release();
        if (error) {
          return res.status(500).send({
            error: error,
          });
        }
        const response = {
          message: "Product successfully created",
          createdProduct: {
            product_id: result.insertId,
            name: req.body.name,
            price: req.body.price,
            request: {
              method: "GET",
              description: "GET all products",
              url: `http://${process.env.HOST}:${process.env.PORT}/products`,
            },
          },
        };
        return res.status(201).send(response);
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
          message: "Product successfully updated",
          updatedProduct: {
            product_id: req.params.product_id,
            name: req.body.name,
            price: req.body.price,
            request: {
              method: "GET",
              description: "GET a product",
              url: `http://${process.env.HOST}:${process.env.PORT}/products/${req.params.product_id}`,
            },
          },
        };
        return res.status(202).send(response);
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
          message: "Product successfully deleted",
          request: {
            method: "POST",
            description: "POST a product",
            url: `http://${process.env.HOST}:${process.env.PORT}/products`,
            body: {
              name: "String",
              price: "Number",
            },
          },
        };
        return res.status(202).send(response);
      }
    );
  });
});

module.exports = router;
