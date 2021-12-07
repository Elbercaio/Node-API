const jwt = require("jsonwebtoken");

exports.required = (req, res, next) => {
  try {
    token = req.headers.authorization.split(" ")[1];
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decode;
    next();
  } catch (error) {
    return res.status(401).send({
      message: "401 - Authentication failure",
    });
  }
};

exports.unrequired = (req, res, next) => {
  try {
    token = req.headers.authorization.split(" ")[1];
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decode;
    next();
  } catch (error) {
    next();
  }
};
