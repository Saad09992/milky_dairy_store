const notificationService = require("../services/notification.service");

const sendDiscountNotifications = async (req, res) => {
  try {
    const result = await notificationService.sendDiscountNotificationsToAllUsers();
    res.status(200).json({
      message: "Discount notifications sent successfully",
      usersNotified: result.usersNotified,
      productsOnSale: result.productsOnSale
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

const sendDiscountNotificationsToUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await notificationService.sendDiscountNotificationsToUser(userId);
    res.status(200).json({
      message: "Discount notification sent successfully",
      userNotified: result.userNotified,
      productsOnSale: result.productsOnSale
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

module.exports = {
  sendDiscountNotifications,
  sendDiscountNotificationsToUser,
}; 