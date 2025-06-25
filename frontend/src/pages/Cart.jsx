import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHeader,
  TableRow,
} from "@windmill/react-ui";
import CartItem from "../components/CartItem";
import useCart from "../hooks/useCart";
import { formatCurrency } from "../helpers/formatCurrency";
import RootLayout from "../layout/RootLayout";
import { ShoppingCart, ArrowRight, Tag } from "react-feather";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";

const Cart = () => {
  const { cartData, isLoading, cartSubtotal } = useCart();
  const { loggedIn } = useAuth();
  const navigate = useNavigate();
  const items = cartData?.items || [];

  // Set document title
  useEffect(() => {
    document.title = "Cart | Milky Dairy";
  }, []);

  // Debug logging
  console.log('Cart data:', {
    cartData,
    items,
    cartSubtotal,
    hasItems: Array.isArray(items) && items.length > 0
  });

  if (items.length > 0) {
    console.log('First item details:', items[0]);
  }

  // Calculate total savings from discounts
  const totalSavings = items.reduce((total, item) => {
    if (item.is_on_sale && item.discount_percentage > 0 && item.discounted_price) {
      const originalSubtotal = item.price * item.quantity;
      const discountedSubtotal = item.discounted_price * item.quantity;
      return total + (originalSubtotal - discountedSubtotal);
    }
    return total;
  }, 0);

  // Calculate original total (without discounts)
  const originalTotal = items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);

  if (!Array.isArray(items) || items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Shopping Cart
        </h1>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
          <Button 
            tag={Link} 
            to="/"
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md inline-flex items-center gap-2"
          >
            Continue shopping
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Shopping Cart
      </h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <TableContainer>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableCell className="text-gray-900 font-semibold">Product</TableCell>
                <TableCell className="text-gray-900 font-semibold">Price</TableCell>
                <TableCell className="text-gray-900 font-semibold">Quantity</TableCell>
                <TableCell className="text-gray-900 font-semibold">Total</TableCell>
                <TableCell className="text-gray-900 font-semibold">Remove</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.product_id} className="hover:bg-gray-50 transition-colors duration-200">
                  <CartItem item={item} />
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <div className="p-6 bg-gray-50 border-t border-gray-100">
          <div className="flex flex-col gap-4">
            {/* Savings Summary */}
            {totalSavings > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="w-4 h-4 text-green-600" />
                  <span className="font-semibold text-green-800">You're saving money!</span>
                </div>
                <div className="text-sm text-green-700">
                  Total savings: <span className="font-bold">{formatCurrency(totalSavings)}</span>
                </div>
              </div>
            )}
            
            {/* Order Summary */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex flex-col gap-2">
                {totalSavings > 0 && (
                  <div className="text-sm text-gray-600">
                    Original total: <span className="line-through">{formatCurrency(originalTotal)}</span>
                  </div>
                )}
                <div className="text-xl font-semibold text-gray-900">
                  Total: <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {formatCurrency(cartSubtotal)}
                  </span>
                </div>
              </div>
              <Button
                tag={Link}
                to={"/cart/checkout"}
                state={{
                  fromCartPage: true,
                }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md inline-flex items-center gap-2"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
