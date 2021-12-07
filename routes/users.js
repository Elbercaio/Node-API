const express = require("express");
const router = express.Router();
const mysql = require("../mysql").pool;
const bcrypt = require("bcrypt");

router.post("/signup", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({
        error: error,
      });
    }
    conn.query(
      "SELECT * FROM users WHERE email=?",
      req.body.email,
      (error, result, field) => {
        if (error) {
          return res.status(500).send({
            error: error,
          });
        }
        if (result.length > 0) {
          return res.status(401).send({
            message: "409 - User already exists",
          });
        }
        bcrypt.hash(req.body.password, 10, (errBcrypt, hash) => {
          if (errBcrypt) {
            return res.status(500).send({ error: errBcrypt });
          }
          conn.query(
            "INSERT INTO users (email, password) VALUES (?, ?)",
            [req.body.email, hash],
            (error, result, field) => {
              conn.release();
              if (error) {
                return res.status(500).send({
                  error: error,
                });
              }
              const response = {
                message: "User created successfully",
                createdUser: {
                  user_id: result.insertId,
                  email: req.body.email,
                },
              };
              return res.status(201).send(response);
            }
          );
        });
      }
    );
  });
});
module.exports = router;
