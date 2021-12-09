const express = require("express");
const router = express.Router();
const login = require("../middleware/login");
const imagesController = require("../controllers/images-controller");
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

router.get("/:product_id", imagesController.getProductImages);

router.post(
  "/:product_id",
  login.required,
  upload.single("product_image"),
  imagesController.postProductImages
);

router.delete(
  "/:image_id",
  login.required,
  imagesController.deleteProductImage
);

module.exports = router;
