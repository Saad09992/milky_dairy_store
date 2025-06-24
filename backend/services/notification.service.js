const { sendDiscountNotificationMail } = require("./mail.service");
const { getProductsOnSaleDb } = require("../db/product.db");
const { getAllUsersDb } = require("../db/user.db");
const { ErrorHandler } = require("../helpers/error");

class NotificationService {
  sendDiscountNotificationsToAllUsers = async () => {
    try {
      // Get all products currently on sale
      const productsOnSale = await getProductsOnSaleDb({ limit: 50, offset: 0 });
      
      if (productsOnSale.length === 0) {
        return {
          usersNotified: 0,
          productsOnSale: 0,
          message: "No products are currently on sale"
        };
      }

      // Get all users
      const users = await getAllUsersDb();
      
      let usersNotified = 0;
      const notificationPromises = users.map(async (user) => {
        try {
          await sendDiscountNotificationMail(
            user.email,
            user.fullname,
            productsOnSale
          );
          usersNotified++;
        } catch (error) {
          console.error(`Failed to send notification to ${user.email}:`, error.message);
        }
      });

      await Promise.all(notificationPromises);

      return {
        usersNotified,
        productsOnSale: productsOnSale.length,
        message: `Successfully sent discount notifications to ${usersNotified} users for ${productsOnSale.length} products on sale`
      };
    } catch (error) {
      throw new ErrorHandler(500, `Failed to send discount notifications: ${error.message}`);
    }
  };

  sendDiscountNotificationsToUser = async (userId) => {
    try {
      // Get all products currently on sale
      const productsOnSale = await getProductsOnSaleDb({ limit: 50, offset: 0 });
      
      if (productsOnSale.length === 0) {
        return {
          userNotified: false,
          productsOnSale: 0,
          message: "No products are currently on sale"
        };
      }

      // Get specific user
      const { getUserByIdDb } = require("../db/user.db");
      const user = await getUserByIdDb(userId);
      
      if (!user) {
        throw new ErrorHandler(404, "User not found");
      }

      await sendDiscountNotificationMail(
        user.email,
        user.fullname,
        productsOnSale
      );

      return {
        userNotified: true,
        productsOnSale: productsOnSale.length,
        message: `Successfully sent discount notification to ${user.fullname} for ${productsOnSale.length} products on sale`
      };
    } catch (error) {
      throw new ErrorHandler(500, `Failed to send discount notification: ${error.message}`);
    }
  };
}

module.exports = new NotificationService(); 