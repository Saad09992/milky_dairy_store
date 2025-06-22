const router = require("express").Router();
const cart = require("./cart");
const order = require("./order");
const product = require("./product");
const users = require("./users");
const auth = require("./auth");
const payment = require("./payment");
const review = require("./review");
const nutrition = require("./nutrition");
const farm = require("./farm");

router.use("/auth", auth);
router.use("/users", users);
router.use("/products", product);
router.use("/orders", order);
router.use("/cart", cart);
router.use("/payment", payment);
router.use("/review", review);
router.use("/nutrition", nutrition);
router.use("/farms", farm);

module.exports = router;
