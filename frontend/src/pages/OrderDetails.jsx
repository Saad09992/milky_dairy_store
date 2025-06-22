import { Badge, Card, CardBody } from "@windmill/react-ui";
import { format, parseISO } from "date-fns";
import { formatCurrency } from "../helpers/formatCurrency";
import RootLayout from "../layout/RootLayout";
import { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearCurrentOrder } from "../store/slices/orderSlice";
import { getOrder } from "../store/methods/orderMethod";
import { Package, Calendar, DollarSign, ShoppingBag } from "react-feather";
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

  return (
    <RootLayout loading={loading}>
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Order Details
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white rounded-xl shadow-sm border border-gray-100">
            <CardBody className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-blue-600" />
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
                  <DollarSign className="w-6 h-6 text-green-600" />
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

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Order Items</h2>
          </div>

          <div className="space-y-6">
            {currentOrder.length != 0
              ? currentOrder?.map((item) => (
                  <Card
                    key={item.product_id}
                    className="flex flex-col md:flex-row gap-6 p-4 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="w-full md:w-48 h-48 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        className="w-full h-full object-contain"
                        loading="lazy"
                        decoding="async"
                        src={`http://localhost:9000/images/${item?.image_url}`}
                        alt={item.name}
                      />
                    </div>
                    <CardBody className="flex-grow">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {item.name}
                      </h3>
                      <p className="text-gray-600 mb-4">{item.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="text-gray-600">
                            Quantity:{" "}
                            <span className="font-medium text-gray-900">
                              {item.quantity}
                            </span>
                          </span>
                          <span className="text-gray-600">
                            Price:{" "}
                            <span className="font-medium text-gray-900">
                              {formatCurrency(item.price)}
                            </span>
                          </span>
                        </div>
                        <span className="text-lg font-semibold text-gray-900">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    </CardBody>
                  </Card>
                ))
              : ""}
          </div>
        </div>
      </div>
    </RootLayout>
  );
};

export default OrderDetails;
