import { Badge, TableCell } from "@windmill/react-ui";
import { format, parseISO } from "date-fns";
import { formatCurrency } from "../helpers/formatCurrency";

const OrderItem = ({ order }) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'danger';
      default:
        return 'primary';
    }
  };

  const getStatusBgColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-50 text-green-700';
      case 'pending':
        return 'bg-yellow-50 text-yellow-700';
      case 'cancelled':
        return 'bg-red-50 text-red-700';
      default:
        return 'bg-blue-50 text-blue-700';
    }
  };

  return (
    <>
      <TableCell className="py-4">
        <span className="font-medium text-gray-900">#{order.order_id}</span>
      </TableCell>
      <TableCell className="py-4">
        <span className="text-gray-700">{order.total || "Not available"}</span>
      </TableCell>
      <TableCell className="py-4">
        <Badge 
          type={getStatusColor(order.status)}
          className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusBgColor(order.status)}`}
        >
          {order.status}
        </Badge>
      </TableCell>
      <TableCell className="py-4">
        <span className="font-semibold text-gray-900">
          {formatCurrency(order.amount)}
        </span>
      </TableCell>
      <TableCell className="py-4">
        <span className="text-gray-600">
          {format(parseISO(order.date), "dd/MM/yy")}
        </span>
      </TableCell>
    </>
  );
};

export default OrderItem;
