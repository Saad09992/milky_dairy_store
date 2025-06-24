const router = require("express").Router();
const {
  getAllProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  getProductByName,
  getProductBySlug,
  getProductsOnSale,
} = require("../controllers/products.controller");
const verifyAdmin = require("../middleware/verifyAdmin");
const verifyToken = require("../middleware/verifyToken");
const multer = require("multer");
const storage = require("../middleware/saveFile");

const upload = multer({
  storage,
});

router
  .route("/")
  .get(getAllProducts)
  .post(verifyToken, verifyAdmin, upload.single("image"), createProduct);

router.route("/sale").get(getProductsOnSale);

router.route("/:slug").get(getProductBySlug);

router
  .route("/:id")
  .put(verifyToken, verifyAdmin, upload.single("image"), updateProduct)
  .delete(verifyToken, verifyAdmin, deleteProduct);

module.exports = router;
