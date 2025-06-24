const router = require("express").Router();
const {
  sendDiscountNotifications,
  sendDiscountNotificationsToUser,
} = require("../controllers/notification.controller");
const verifyAdmin = require("../middleware/verifyAdmin");
const verifyToken = require("../middleware/verifyToken");

// Send discount notifications to all users (admin only)
router.post("/discount/all", verifyToken, verifyAdmin, sendDiscountNotifications);

// Send discount notification to specific user (admin only)
router.post("/discount/user/:userId", verifyToken, verifyAdmin, sendDiscountNotificationsToUser);

module.exports = router; 