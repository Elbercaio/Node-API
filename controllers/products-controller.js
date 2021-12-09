const mysql = require("../mysql");

exports.getProducts = async (req, res, next) => {
  try {
    const query =
      "SELECT product_id, name, price, product_image FROM products;";
    const result = await mysql.execute(query);
    const response = {
      quantity: result.length,
      products: result.map((prod) => {
        return {
          product_id: prod.product_id,
          name: prod.name,
          price: prod.price,
          product_image: `${process.env.URL_API}${prod.product_image}`,
          request: {
            method: "GET",
            description: "GET a product",
            url: `${process.env.URL_API}/products/${prod.product_id}`,
          },
        };
      }),
    };
    return res.status(200).send(response);
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const query =
      "SELECT product_id, name, price, product_image FROM products WHERE product_id=?;";
    const result = await mysql.execute(query, [req.params.product_id]);
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
        product_image: `${process.env.URL_API}${result[0].product_image}`,
        request: {
          method: "GET",
          description: "GET all products",
          url: `${process.env.URL_API}/products`,
        },
      },
    };
    return res.status(200).send(response);
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

exports.postProduct = async (req, res, next) => {
  try {
    const image =
      req.file.path != null ? req.file.path.replace("\\", "/") : null;
    const query =
      `INSERT INTO products (name, price, product_image, category_id)
       VALUES (?, ?, ?, ?);`;
    const result = await mysql.execute(query, [
      req.body.name,
      req.body.price,
      image,
      req.body.category_id,
    ]);
    const response = {
      message: "Product created successfully",
      createdProduct: {
        product_id: result.insertId,
        name: req.body.name,
        price: parseFloat(req.body.price),
        product_image: `${process.env.URL_API}${image}`,
        request: {
          method: "GET",
          description: "GET all products",
          url: `${process.env.URL_API}/products`,
        },
      },
    };
    return res.status(201).send(response);
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const query = `UPDATE products
                    SET name = ?,
                        price = ?
                  WHERE product_id = ?`;
    const result = await mysql.execute(query, [
      req.body.name,
      req.body.price,
      req.params.product_id,
    ]);
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
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const query = "DELETE FROM products WHERE product_id = ?;";
    const result = await mysql.execute(query, [req.params.product_id]);
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
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

