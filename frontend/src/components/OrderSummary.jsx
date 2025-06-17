import useCart from "../hooks/useCart";
import { formatCurrency } from "../helpers/formatCurrency";

const OrderSummary = () => {
  const { cartData, cartSubtotal } = useCart();
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-100">
        Order Summary
      </h1>
      <div className="space-y-4">
        {cartData?.items.map((item) => (
          <div 
            key={item.product_id} 
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
              <img
                className="w-full h-full object-contain"
                loading="lazy"
                decoding="async"
                src={item.image_url}
                alt={item.name}
              />
            </div>
            <div className="flex-grow">
              <h3 className="text-lg font-medium text-gray-900 mb-1">{item.name}</h3>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">
                  Quantity: <span className="font-medium text-gray-900">{item.quantity}</span>
                </span>
                <span className="text-lg font-semibold text-gray-900">
                  {formatCurrency(item.price)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-xl font-medium text-gray-700">Total Amount</span>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {formatCurrency(cartSubtotal)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
