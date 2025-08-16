import { Badge, Card, CardBody } from "@windmill/react-ui";
import { format, parseISO } from "date-fns";
import { formatCurrency } from "../helpers/formatCurrency";
import RootLayout from "../layout/RootLayout";
import { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearCurrentOrder } from "../store/slices/orderSlice";
import { getOrder } from "../store/methods/orderMethod";
import { Package, Calendar, CreditCard, ShoppingBag, Tag } from "react-feather";
import useOrders from "../hooks/useOrders";

const OrderDetails = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const dispatch = useDispatch();
  const { currentOrder, loading } = useOrders();

  useEffect(() => {
    dispatch(getOrder(id));
    return () => {
      dispatch(clearCurrentOrder());
    };
  }, [dispatch, id]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-50 text-green-700";
      case "pending":
        return "bg-yellow-50 text-yellow-700";
      case "cancelled":
        return "bg-red-50 text-red-700";
      default:
        return "bg-blue-50 text-blue-700";
    }
  };

  // Calculate total savings from the stored historical data
  const calculateTotalSavings = () => {
    if (!currentOrder || currentOrder.length === 0) return 0;
    
    let totalSavings = 0;
    currentOrder.forEach((item) => {
      // Use the stored historical sale information
      const isOnSale = item.is_on_sale_at_time && item.discount_percentage_at_time > 0 && item.discounted_price_at_time;
      if (isOnSale) {
        const originalTotal = item.price_at_time * item.quantity;
        const discountedTotal = item.discounted_price_at_time * item.quantity;
        totalSavings += originalTotal - discountedTotal;
      }
    });
    return totalSavings;
  };

  const totalSavings = calculateTotalSavings();

  return (
    <RootLayout loading={loading}>
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-dairy-text">
          Order Details
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white rounded-xl shadow-sm border border-gray-100">
            <CardBody className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-dairy-primary/10 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-dairy-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Order ID</p>
                  <p className="text-lg font-semibold text-gray-900">
                    #{state.order.order_id}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-white rounded-xl shadow-sm border border-gray-100">
            <CardBody className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Items</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {state.order.total || "Not available"}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-white rounded-xl shadow-sm border border-gray-100">
            <CardBody className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatCurrency(state.order.amount)}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-white rounded-xl shadow-sm border border-gray-100">
            <CardBody className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Order Date</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {format(parseISO(state.order.date), "d MMM, yyyy")}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Savings Summary Card */}
        {totalSavings > 0 && (
          <Card className="bg-green-50 border-green-200 mb-6">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Tag className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-green-700">Total Savings</p>
                    <p className="text-lg font-semibold text-green-800">
                      {formatCurrency(totalSavings)}
                    </p>
                  </div>
                </div>
                <Badge type="success" className="bg-green-100 text-green-800">
                  Discount Applied
                </Badge>
              </div>
            </CardBody>
          </Card>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
            <div className="w-10 h-10 bg-dairy-primary/10 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-dairy-primary" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Order Items</h2>
          </div>

          <div className="space-y-6">
            {currentOrder.length != 0
              ? currentOrder?.map((item) => {
                  // Use the stored historical sale information
                  const isOnSale = item.is_on_sale_at_time && item.discount_percentage_at_time > 0 && item.discounted_price_at_time;
                  const displayPrice = isOnSale ? item.discounted_price_at_time : item.price_at_time;
                  const subtotal = item.subtotal; // Use the stored subtotal
                  
                  return (
                    <Card
                      key={item.product_id}
                      className="flex flex-col md:flex-row gap-6 p-4 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="w-full md:w-48 h-48 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 relative">
                        <img
                          className="w-full h-full object-contain"
                          loading="lazy"
                          decoding="async"
                          src={`http://localhost:9000/images/${item?.image_url}`}
                          alt={item.name}
                        />
                        {isOnSale && (
                          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            <Tag className="w-3 h-3 inline mr-1" />
                            {item.discount_percentage_at_time}% OFF
                          </div>
                        )}
                      </div>
                      <CardBody className="flex-grow">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {item.name}
                          </h3>
                          {isOnSale && (
                            <Badge type="success" className="bg-red-100 text-red-800">
                              {item.discount_percentage_at_time}% OFF
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-600 mb-4">{item.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <span className="text-gray-600">
                              Quantity:{" "}
                              <span className="font-medium text-gray-900">
                                {item.quantity}
                              </span>
                            </span>
                            <div className="flex flex-col">
                              <span className="text-gray-600">Price:</span>
                              {isOnSale ? (
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-gray-500 line-through">
                                    {formatCurrency(item.price_at_time)}
                                  </span>
                                  <span className="font-medium text-red-600">
                                    {formatCurrency(item.discounted_price_at_time)}
                                  </span>
                                </div>
                              ) : (
                                <span className="font-medium text-gray-900">
                                  {formatCurrency(item.price_at_time)}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            {isOnSale ? (
                              <>
                                <span className="text-sm text-gray-500 line-through">
                                  {formatCurrency(item.price_at_time * item.quantity)}
                                </span>
                                <span className="text-lg font-semibold text-red-600">
                                  {formatCurrency(subtotal)}
                                </span>
                              </>
                            ) : (
                              <span className="text-lg font-semibold text-gray-900">
                                {formatCurrency(subtotal)}
                              </span>
                            )}
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  );
                })
              : ""}
          </div>
        </div>
      </div>
    </RootLayout>
  );
};

export default OrderDetails;
