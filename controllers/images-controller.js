const mysql = require("../mysql");

exports.getProductImages = async (req, res, next) => {
  try {
    const query =
      "SELECT image_id, product_id, path FROM product_images WHERE product_id=?;";
    const result = await mysql.execute(query, [req.params.product_id]);
    if (result.length == 0) {
      return res.status(404).send({
        message: "404 - Product not found",
      });
    }
    const response = {
      image: result.map((img) => {
        return {
          image_id: img.image_id,
          product_id: img.product_id,
          path: `${process.env.URL_API}${img.path}`,
          request: {
            method: "POST",
            description: "POST image to product",
            url: `${process.env.URL_API}/images/${img.product_id}`,
          },
        };
      }),
    };
    return res.status(200).send(response);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: error });
  }
};

exports.postProductImages = async (req, res, next) => {
  try {
    const query =
      "INSERT INTO product_images (product_id, path) VALUES (?, ?);";
    const result = await mysql.execute(query, [
      req.params.product_id,
      req.file.path.replace("\\", "/"),
    ]);

    const response = {
      message: "Image uploaded successfully",
      createdImage: {
        image_id: result.insertId,
        product_id: parseInt(req.params.product_id),
        product_image: `${process.env.URL_API}${req.file.path}`.replace(
          "\\",
          "/"
        ),
      },
      request: {
        method: "GET",
        description: "GET all images from product",
        url: `${process.env.URL_API}/images/${req.params.product_id}`,
      },
    };
    return res.status(201).send(response);
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

exports.deleteProductImage = async (req, res, next) => {
  try {
    const query = "DELETE FROM product_images WHERE image_id = ?;";
    const result = await mysql.execute(query, [req.params.image_id]);
    if (result.affectedRows == 0) {
      return res.status(404).send({
        message: "404 - Product not found",
      });
    }
    const response = {
      message: "Image deleted successfully",
      request: {
        method: "POST",
        description: "POST a image",
        url: `${process.env.URL_API}/images/:product_id`,
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
