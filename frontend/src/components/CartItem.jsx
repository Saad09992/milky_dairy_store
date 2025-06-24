import { Button, TableCell, Badge } from "@windmill/react-ui";
import useCart from "../hooks/useCart";
import { formatCurrency } from "../helpers/formatCurrency";
import { Trash2, Tag } from "react-feather";

const CartItem = ({ item }) => {
  const { decrement, increment, deleteItem } = useCart();

  // Check if item is on sale and has a discounted price
  const isOnSale = item?.is_on_sale && item?.discount_percentage > 0 && item?.discounted_price;
  const displayPrice = isOnSale ? item.discounted_price : item.price;
  const subtotal = displayPrice * item.quantity;

  // Debug logging
  // console.log('CartItem data:', {
  //   name: item?.name,
  //   price: item?.price,
  //   discounted_price: item?.discounted_price,
  //   is_on_sale: item?.is_on_sale,
  //   discount_percentage: item?.discount_percentage,
  //   isOnSale,
  //   displayPrice
  // });

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
          <div className="relative">
            <img
              src={`http://localhost:9000/images/${item?.image_url}`}
              alt={item.name}
              className="w-12 h-12 object-contain rounded-lg bg-gray-50 mr-3"
            />
            {/* Sale Badge */}
            {isOnSale && (
              <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1 py-0.5 rounded-full">
                <Tag className="w-2 h-2" />
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-gray-900">{item.name}</span>
            {isOnSale && (
              <Badge type="success" className="bg-red-100 text-red-800 text-xs w-fit">
                {item.discount_percentage}% OFF
              </Badge>
            )}
          </div>
        </div>
      </TableCell>
      <TableCell className="py-4">
        <div className="flex flex-col">
          {isOnSale ? (
            <>
              <span className="font-semibold text-red-600">
                {formatCurrency(displayPrice)}
              </span>
              <span className="text-sm text-gray-500 line-through">
                {formatCurrency(item.price)}
              </span>
            </>
          ) : (
            <span className="font-semibold text-gray-900">
              {formatCurrency(displayPrice)}
            </span>
          )}
        </div>
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
          <span className="mx-3 font-semibold text-gray-700">
            {item.quantity}
          </span>
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
        <div className="flex flex-col">
          {isOnSale ? (
            <>
              <span className="font-bold text-red-600">
                {formatCurrency(subtotal)}
              </span>
              <span className="text-sm text-gray-500 line-through">
                {formatCurrency(item.price * item.quantity)}
              </span>
            </>
          ) : (
            <span className="font-bold text-gray-900">
              {formatCurrency(subtotal)}
            </span>
          )}
        </div>
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
