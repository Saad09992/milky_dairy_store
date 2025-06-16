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
        <h1 className="my-10 text-center text-4xl font-semibold">Orders</h1>
        <p>You are yet to place an order</p>
      </RootLayout>
    );
  }

  return (
    <RootLayout title="Orders" loading={loading}>
      <h1 className="my-10 text-center text-4xl font-semibold">Orders</h1>
      <TableContainer>
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>No. of items</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders?.items?.map((order) => (
              <TableRow
                className="cursor-pointer"
                onClick={() => goToDetails(order)}
                key={order.order_id}
              >
                <OrderItem order={order} />
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TableFooter>
          <Pagination
            totalResults={orders?.total || 0}
            resultsPerPage={5}
            onChange={handlePage}
            label="Table navigation"
          />
        </TableFooter>
      </TableContainer>
    </RootLayout>
  );
};

export default Orders;
