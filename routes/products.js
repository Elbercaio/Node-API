const express = require("express");
const router = express.Router();
const mysql = require("../mysql").pool;

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    let data = new Date().toISOString().replace(/:/g, "-") + "-";
    cb(null, data + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype == "image/jpeg" ||
    file.mimetype == "image/jpg" ||
    file.mimetype == "image/png"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fieldSize: 1024 * 1024 * 5 },
  fileFilter: fileFilter,
});

router.get("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({
        error: error,
      });
    }
    conn.query(
      "SELECT product_id, name, price, product_image FROM products",
      (error, result, field) => {
        conn.release();
        if (error) {
          return res.status(500).send({
            error: error,
          });
        }
        let link = `http://${process.env.HOST}:${process.env.PORT}/`;
        const response = {
          quantity: result.length,
          products: result.map((prod) => {
            return {
              product_id: prod.product_id,
              name: prod.name,
              price: prod.price,
              product_image: `${link}${prod.product_image}`,
              request: {
                method: "GET",
                description: "GET a product",
                url: `${link}/products/${prod.product_id}`,
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
    if (error) {
      return res.status(500).send({
        error: error,
      });
    }
    conn.query(
      "SELECT product_id, name, price, product_image FROM products WHERE product_id=?",
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
        let link = `http://${process.env.HOST}:${process.env.PORT}/`;
        const response = {
          product: {
            product_id: result[0].product_id,
            name: result[0].name,
            price: result[0].price,
            product_image: `${link}${result[0].product_image}`,
            request: {
              method: "GET",
              description: "GET all products",
              url: `${link}/products`,
            },
          },
        };
        return res.status(200).send(response);
      }
    );
  });
});

router.post("/", upload.single("product_image"), (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({
        error: error,
      });
    }
    let image = req.file.path != null ? req.file.path.replace("\\", "/") : null;
    conn.query(
      "INSERT INTO products (name, price, product_image) VALUES (?, ?, ?)",
      [req.body.name, req.body.price, image],
      (error, result, field) => {
        conn.release();
        if (error) {
          return res.status(500).send({
            error: error,
          });
        }
        let link = `http://${process.env.HOST}:${process.env.PORT}/`;

        const response = {
          message: "Product created successfully",
          createdProduct: {
            product_id: result.insertId,
            name: req.body.name,
            price: req.body.price,
            product_image: `${link}${image}`,
            request: {
              method: "GET",
              description: "GET all products",
              url: `${link}/products`,
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
    if (error) {
      return res.status(500).send({
        error: error,
      });
    }
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
        if (result.affectedRows == 0) {
          return res.status(404).send({
            message: "404 - Product not found",
          });
        }
        const response = {
          message: "Product updated successfully",
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
    if (error) {
      return res.status(500).send({
        error: error,
      });
    }
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
        if (result.affectedRows == 0) {
          return res.status(404).send({
            message: "404 - Product not found",
          });
        }
        const response = {
          message: "Product deleted successfully",
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
