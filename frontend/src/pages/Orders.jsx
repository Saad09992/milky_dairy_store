import {
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHeader,
  TableRow,
} from "@windmill/react-ui";
import OrderItem from "../components/OrderItem";
import useOrders from "../hooks/useOrders";
import RootLayout from "../layout/RootLayout";
import { useNavigate } from "react-router-dom";
import { Package } from "react-feather";

const Orders = () => {
  const { orders, loading, page, setPage } = useOrders();
  const navigate = useNavigate();

  const handlePage = (num) => {
    setPage(num);
  };

  const goToDetails = (order) => {
    navigate(`/orders/${order.order_id}`, { state: { order } });
  };

  if (orders?.items?.length === 0) {
    return (
      <RootLayout loading={loading}>
        <div className="max-w-7xl mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Orders
          </h1>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Orders Yet</h2>
            <p className="text-gray-600">Start shopping to see your orders here</p>
          </div>
        </div>
      </RootLayout>
    );
  }

  return (
    <RootLayout title="Orders" loading={loading}>
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Orders
        </h1>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <TableContainer>
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableCell className="text-gray-900 font-semibold">ID</TableCell>
                  <TableCell className="text-gray-900 font-semibold">No. of items</TableCell>
                  <TableCell className="text-gray-900 font-semibold">Status</TableCell>
                  <TableCell className="text-gray-900 font-semibold">Amount</TableCell>
                  <TableCell className="text-gray-900 font-semibold">Date</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders?.items?.map((order) => (
                  <TableRow
                    className="cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => goToDetails(order)}
                    key={order.order_id}
                  >
                    <OrderItem order={order} />
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TableFooter>
            <Pagination
              totalResults={orders?.total || 0}
              resultsPerPage={5}
              onChange={handlePage}
              label="Table navigation"
            />
          </TableFooter>
        </div>
      </div>
    </RootLayout>
  );
};

export default Orders;
