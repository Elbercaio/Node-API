const express = require("express");
const router = express.Router();
const mysql = require("../mysql").pool;

// router.post('/signup', (req, res, next) => {
//     mysql.getConnection((error, conn) => {
//       if (error) {
//         return res.status(500).send({
//           error: error,
//         });
//       }
//       let image = req.file.path != null ? req.file.path.replace("\\", "/") : null;
//       conn.query(
//         "INSERT INTO products (name, price, product_image) VALUES (?, ?, ?)",
//         [req.body.name, req.body.price, image],
//         (error, result, field) => {
//           conn.release();
 
//               },
//             },
//           };
//           return res.status(201).send(response);
//         }
//       );
//     });


module.exports = router;