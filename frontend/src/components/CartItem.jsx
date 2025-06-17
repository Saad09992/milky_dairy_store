import { Button, TableCell } from "@windmill/react-ui";
import useCart from "../hooks/useCart";
import { formatCurrency } from "../helpers/formatCurrency";
import { Trash2 } from "react-feather";

const CartItem = ({ item }) => {
  const { decrement, increment, deleteItem } = useCart();

  const increase = () => {
    increment(item.product_id);
  };
  const decrease = () => {
    decrement(item.product_id);
  };
  return (
    <>
      <TableCell className="py-4">
        <div className="flex items-center">
          <img
            src={item.image_url}
            alt={item.name}
            className="w-12 h-12 object-contain rounded-lg bg-gray-50 mr-3"
          />
          <span className="font-medium text-gray-900">{item.name}</span>
        </div>
      </TableCell>
      <TableCell className="py-4">
        <span className="font-semibold text-gray-900">{formatCurrency(item.price)}</span>
      </TableCell>
      <TableCell className="py-4">
        <div className="flex items-center">
          <Button
            size="small"
            layout="outline"
            disabled={item.quantity === 1}
            onClick={() => decrease()}
            className="hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            -
          </Button>
          <span className="mx-3 font-semibold text-gray-700">{item.quantity}</span>
          <Button 
            size="small" 
            layout="outline" 
            onClick={() => increase()}
            className="hover:bg-green-50 hover:text-green-600 hover:border-green-200 transition-colors duration-200"
          >
            +
          </Button>
        </div>
      </TableCell>
      <TableCell className="py-4">
        <span className="font-bold text-gray-900">{formatCurrency(item.subtotal)}</span>
      </TableCell>
      <TableCell className="py-4">
        <Button 
          layout="Link" 
          onClick={() => deleteItem(item.product_id)}
          className="text-gray-400 hover:text-red-600 transition-colors duration-200"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </TableCell>
    </>
  );
};

export default CartItem;
