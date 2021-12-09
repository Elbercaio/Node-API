const express = require("express");
const router = express.Router();
const login = require("../middleware/login");
const productsController = require("../controllers/products-controller");

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

router.get("/", productsController.getProducts);

router.get("/:product_id", productsController.getProductById);

router.post(
  "/",
  login.required,
  upload.single("product_image"),
  productsController.postProduct
);

router.patch("/:product_id", login.required, productsController.updateProduct);

router.delete("/:product_id", login.required, productsController.deleteProduct);

module.exports = router;
