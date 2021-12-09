const mysql = require("../mysql");

exports.getOrders = async (req, res, next) => {
  try {
    const query = `SELECT orders.order_id, 
                      orders.quantity, 
                      products.product_id, 
                      products.name, 
                      products.price,
                      products.product_image
                  FROM orders INNER JOIN products
                  ON products.product_id = orders.product_id;`;
    const result = await mysql.execute(query);
    const response = {
      orders: result.map((order) => {
        return {
          order_id: order.order_id,
          quantity: order.quantity,
          product: {
            product_id: order.product_id,
            name: order.name,
            price: order.price,
            product_image: `${process.env.URL_API}${order.product_image}`,
          },
          request: {
            method: "GET",
            description: "GET an order",
            url: `${process.env.URL_API}/orders/${order.order_id}`,
          },
        };
      }),
    };
    return res.status(200).send(response);
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};
exports.getOrderById = async (req, res, next) => {
  try {
    const query = `SELECT orders.order_id, 
                      orders.quantity, 
                      products.product_id, 
                      products.name, 
                      products.price,
                      products.product_image
                  FROM orders INNER JOIN products
                  ON products.product_id = orders.product_id
                  WHERE order_id=?;`;
    const result = await mysql.execute(query, [req.params.order_id]);
    if (result.length == 0) {
      return res.status(404).send({
        message: "404 - Product not found",
      });
    }

    const response = {
      order: {
        order_id: result[0].order_id,
        quantity: result[0].quantity,
        product: {
          product_id: result[0].product_id,
          name: result[0].name,
          price: result[0].price,
          product_image: `${process.env.URL_API}${result[0].product_image}`,
        },
        request: {
          method: "GET",
          description: "GET all orders",
          url: `http://${process.env.HOST}:${process.env.PORT}/orders`,
        },
      },
    };
    return res.status(200).send(response);
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

exports.postOrder = async (req, res, next) => {
  try {
    let query = "SELECT * FROM products WHERE product_id=?;";
    let result = await mysql.execute(query, [req.body.product_id]);
    if (result.length == 0) {
      return res.status(404).send({
        message: "404 - Product not found",
      });
    }
    query = "INSERT INTO orders (quantity, product_id) VALUES (?, ?);";
    result = await mysql.execute(query, [
      req.body.quantity,
      req.body.product_id,
    ]);
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
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: error });
  }
};

exports.deleteOrder = async (req, res, next) => {
  try {
    const query = "DELETE FROM orders WHERE order_id = ?;";
    const result = await mysql.execute(query, [req.params.order_id]);
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
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};
