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

  return (
    <div className="w-full group">
      <Link to={`/products/${product.slug}`} className="block">
        <div className="relative bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden">
          {/* Product Image */}
          <div className="relative h-48 bg-gray-100">
            <img
              className="w-full h-full object-contain object-center transform group-hover:scale-105 transition-transform duration-300"
              src={product.image_url}
              alt={product.name}
              loading="lazy"
              decoding="async"
              title={product.name}
            />
          </div>

          {/* Product Info */}
          <div className="p-4">
            <h2 className="text-lg font-medium text-gray-900 mb-2 line-clamp-1">
              {product.name}
            </h2>

            {/* Price */}
            <p className="text-xl font-semibold text-gray-900 mb-4">
              {formatCurrency(product.price)}
            </p>

            {/* Add to Cart Button or Quantity Controls */}
            {cartItem ? (
              <div className="flex items-center justify-between w-full">
                <Button size="small" layout="outline" onClick={handleDecrement}>
                  -
                </Button>
                <span className="mx-2 font-semibold">{cartItem.quantity}</span>
                <Button size="small" layout="outline" onClick={handleIncrement}>
                  +
                </Button>
              </div>
            ) : (
              <Button
                iconLeft={() =>
                  isLoading ? (
                    <ClipLoader
                      cssOverride={{ margin: "0 auto" }}
                      color="#123abc"
                      size={20}
                    />
                  ) : (
                    <ShoppingCart className="mr-2" size={18} />
                  )
                }
                className="w-full bg-gray-900 text-white hover:bg-gray-800 transition-colors duration-200"
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
