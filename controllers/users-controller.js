const mysql = require("../mysql");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res, next) => {
  try {
    hash = bcrypt.hashSync(req.body.password, 10);
    query = "INSERT INTO users (email, password) VALUES (?, ?);";
    result = await mysql.execute(query, [req.body.email, hash]);
    const response = {
      message: "User created successfully",
      createdUser: {
        user_id: result.insertId,
        email: req.body.email,
      },
    };
    return res.status(201).send(response);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: error });
  }
};

exports.signin = async (req, res, next) => {
  try {
    const query = "SELECT * FROM users WHERE email=?;";
    const result = await mysql.execute(query, [req.body.email]);
    if (result.length < 1) {
      return res.status(401).send({
        message: "401 - Authentication failure",
      });
    }
    bcrypt.compare(
      req.body.password,
      result[0].password,
      (errBcrypt, authentication) => {
        if (errBcrypt) {
          return res.status(401).send({
            error: errBcrypt,
            message: "401 - Authentication failure",
          });
        }
        if (authentication) {
          let token = jwt.sign(
            {
              user_id: result[0].user_id,
              email: result[0].email,
            },
            process.env.SECRET_KEY,
            {
              expiresIn: "1h",
            }
          );
          return res.status(200).send({
            message: "200 - Successful authentication",
            token: token,
          });
        }
        return res.status(401).send({
          message: "401 - Authentication failure",
        });
      }
    );
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};
