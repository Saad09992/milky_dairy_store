import { useState } from "react";
import { Button } from "@windmill/react-ui";
import { Bell, X, CheckCircle } from "react-feather";
import { toast } from "react-hot-toast";
import productService from "../services/product.service";
import Spinner from "./Spinner";

const SaleNotification = ({ onClose }) => {
  const [sending, setSending] = useState(false);

  const handleSendNotifications = async () => {
    setSending(true);
    try {
      const response = await productService.sendDiscountNotificationsToAll();
      toast.success(`Discount notifications sent to ${response.data.usersNotified} users!`);
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to send notifications");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Bell className="w-5 h-5 mr-2 text-green-600" />
            Send Sale Notifications
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            Send email notifications to all registered users about products currently on sale.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <CheckCircle className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-blue-800 font-medium mb-1">
                  What happens next?
                </p>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• All users will receive a beautiful email with sale details</li>
                  <li>• Emails include product images, prices, and discount percentages</li>
                  <li>• Users can click to visit the store and shop</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            layout="outline"
            onClick={onClose}
            className="flex-1"
            disabled={sending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSendNotifications}
            disabled={sending}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
          >
            {sending ? (
              <div className="flex items-center gap-2">
                <Spinner size={16} />
                Sending...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Send Notifications
              </div>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SaleNotification; 