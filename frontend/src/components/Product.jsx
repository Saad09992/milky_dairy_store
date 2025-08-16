import { Button } from "@windmill/react-ui";
import useCart from "../hooks/useCart";
import { useState } from "react";
import { ShoppingCart } from "react-feather";
import toast from "react-hot-toast";
import { Link, redirect, useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { formatCurrency } from "../helpers/formatCurrency";
import useAuth from "../hooks/useAuth";

const Product = ({ product }) => {
  const { cartData, addItem, increment, decrement, deleteItem } = useCart();
  const { loggedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  // Find if product is in cart
  const items = Array.isArray(cartData?.items) ? cartData.items : [];
  const cartItem = items.find((item) => item.product_id === product.product_id);

  const addToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLoading(true);
    if (!loggedIn) {
      navigate("/login");
    } else {
      try {
        await addItem(product, 1);
        toast.success("Added to cart");
      } catch (error) {
        toast.error("Error adding to cart");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleIncrement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    increment(product.product_id);
  };
  const handleDecrement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (cartItem.quantity === 1) {
      deleteItem(product.product_id);
    } else {
      decrement(product.product_id);
    }
  };

  // Check if product is on sale and has a discounted price
  const isOnSale = product.is_on_sale && product.discount_percentage > 0 && product.discounted_price;
  const displayPrice = isOnSale ? product.discounted_price : product.price;

  return (
    <div className="w-full group">
      <Link to={`/products/${product.slug}`} className="block">
        <div className="relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200">
          {/* Product Image */}
          <div className="relative h-48 bg-gray-50">
            <img
              className="w-full h-full object-contain object-center transform group-hover:scale-105 transition-transform duration-500 ease-out"
              src={`http://localhost:9000/images/${product?.image_url}`}
              alt={product.name}
              loading="lazy"
              decoding="async"
              title={product.name}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Sale Badge */}
            {isOnSale && (
              <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                {product.discount_percentage}% OFF
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="p-4 sm:p-5">
            <h2 className="text-lg font-medium text-gray-900 mb-2 line-clamp-1 group-hover:text-dairy-primary transition-colors duration-200">
              {product.name}
            </h2>

            {/* Price */}
            <div className="mb-4">
              {isOnSale ? (
                <div className="flex items-center gap-2">
                  <p className="text-xl font-semibold text-red-600">
                    {formatCurrency(displayPrice)}
                  </p>
                  <p className="text-sm text-gray-500 line-through">
                    {formatCurrency(product.price)}
                  </p>
                </div>
              ) : (
                <p className="text-xl font-semibold text-gray-900 bg-gradient-dairy-text">
                  {formatCurrency(displayPrice)}
                </p>
              )}
            </div>

            {/* Add to Cart Button or Quantity Controls */}
            {cartItem ? (
              <div className="flex items-center justify-between w-full">
                <Button
                  size="small"
                  layout="outline"
                  onClick={handleDecrement}
                  className="hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors duration-200"
                >
                  -
                </Button>
                <span className="mx-2 font-semibold text-gray-700">
                  {cartItem.quantity}
                </span>
                <Button
                  size="small"
                  layout="outline"
                  onClick={handleIncrement}
                  className="hover:bg-green-50 hover:text-green-600 hover:border-green-200 transition-colors duration-200"
                >
                  +
                </Button>
              </div>
            ) : (
              <Button
                iconLeft={() =>
                  isLoading ? (
                    <ClipLoader
                      cssOverride={{ margin: "0 auto" }}
                      color="#ffffff"
                      size={20}
                    />
                  ) : (
                    <ShoppingCart className="mr-2" size={18} />
                  )
                }
                className={`w-full transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 ${
                  isOnSale 
                    ? "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700"
                    : "bg-gradient-dairy text-white hover:bg-gradient-dairy-hover"
                }`}
                onClick={addToCart}
                disabled={isLoading}
              >
                {isLoading ? "Adding..." : "Add to Cart"}
              </Button>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Product;
