import useCart from "../hooks/useCart";
import { formatCurrency } from "../helpers/formatCurrency";

const OrderSummary = () => {
  const { cartData, cartSubtotal } = useCart();

  // Calculate original total and total savings
  let originalTotal = 0;
  let totalSavings = 0;

  cartData?.items.forEach((item) => {
    const isOnSale = item.is_on_sale && item.discount_percentage > 0 && item.discounted_price;
    const itemOriginalTotal = item.price * item.quantity;
    const itemDiscountedTotal = isOnSale ? item.discounted_price * item.quantity : itemOriginalTotal;
    originalTotal += itemOriginalTotal;
    totalSavings += isOnSale ? (itemOriginalTotal - itemDiscountedTotal) : 0;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-100">
        Order Summary
      </h1>
      <div className="space-y-4">
        {cartData?.items.map((item) => {
          const isOnSale = item.is_on_sale && item.discount_percentage > 0 && item.discounted_price;
          const displayPrice = isOnSale ? item.discounted_price : item.price;
          return (
            <div
              key={item.product_id}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  className="w-full h-full object-contain"
                  loading="lazy"
                  decoding="async"
                  src={`http://localhost:9000/images/${item.image_url}`}
                  alt={item.name}
                />
              </div>
              <div className="flex-grow">
                <h3 className="text-lg font-medium text-gray-900 mb-1 flex items-center gap-2">
                  {item.name}
                  {isOnSale && (
                    <span className="ml-2 px-2 py-0.5 rounded bg-red-100 text-red-700 text-xs font-semibold">
                      {item.discount_percentage}% OFF
                    </span>
                  )}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">
                    Quantity: <span className="font-medium text-gray-900">{item.quantity}</span>
                  </span>
                  <span className="text-lg font-semibold text-gray-900 flex flex-col items-end">
                    {isOnSale ? (
                      <>
                        <span className="line-through text-gray-400 text-base">
                          {formatCurrency(item.price)}
                        </span>
                        <span className="text-red-600 font-bold">
                          {formatCurrency(item.discounted_price)}
                        </span>
                      </>
                    ) : (
                      <span>{formatCurrency(item.price)}</span>
                    )}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-6 pt-4 border-t border-gray-100 space-y-2">
        {totalSavings > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-base text-gray-500">Original total</span>
            <span className="line-through text-gray-400">{formatCurrency(originalTotal)}</span>
          </div>
        )}
        {totalSavings > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-base text-green-700 font-medium">Total savings</span>
            <span className="text-green-700 font-bold">{formatCurrency(totalSavings)}</span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className="text-xl font-medium text-gray-700">
            Total Amount
          </span>
          <span className="text-2xl font-bold bg-gradient-dairy-text">
            {formatCurrency(cartSubtotal)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
