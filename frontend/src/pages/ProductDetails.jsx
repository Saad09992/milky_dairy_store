import { Button } from "@windmill/react-ui";
import useCart from "../hooks/useCart";
import { formatCurrency } from "../helpers/formatCurrency";
import RootLayout from "../layout/RootLayout";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ReactStars from "react-rating-stars-component";
import { useNavigate, useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { useDispatch, useSelector } from "react-redux";
import { getProduct } from "../store/methods/productMethod";
import { clearCurrentProduct } from "../store/slices/productSlice";
import useAuth from "../hooks/useAuth";
import ReviewsSection from "../components/ReviewsSection";

const ProductDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { cartData, addItem, increment, decrement, deleteItem } = useCart();
  const { loggedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const {
    currentProduct: product,
    loading: isFetching,
    error,
  } = useSelector((state) => state.productReducer);

  // Find if product is in cart
  const items = Array.isArray(cartData?.items) ? cartData.items : [];
  const cartItem = items.find(
    (item) => item.product_id === product?.product_id
  );

  const addToCart = async (e) => {
    e.preventDefault();
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
    increment(product.product_id);
  };

  const handleDecrement = (e) => {
    e.preventDefault();
    if (cartItem.quantity === 1) {
      deleteItem(product.product_id);
    } else {
      decrement(product.product_id);
    }
  };

  useEffect(() => {
    dispatch(getProduct(slug));
    return () => {
      dispatch(clearCurrentProduct());
    };
  }, [dispatch, slug]);

  useEffect(() => {
    if (error) {
      navigate("/404", { replace: true });
    }
  }, [error, navigate]);

  return (
    <RootLayout loading={isFetching} title={product?.name}>
      <section className="body-font overflow-hidden">
        <div className="container px-5 py-24 mx-auto">
          <div className="lg:w-4/5 mx-auto flex flex-wrap">
            <img
              decoding="async"
              loading="lazy"
              src={product?.image_url}
              alt={product?.name}
              className="lg:w-1/2 w-full lg:h-auto h-64 object-contain md:object-cover object-center rounded"
            />
            <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
              <h1 className="text-3xl title-font font-medium mb-1">
                {product?.name}
              </h1>

              <p className="leading-relaxed pb-6 border-b-2 border-gray-800">
                {product?.description}
              </p>
              <div className="flex mt-4 justify-between">
                <span className="title-font font-medium text-2xl">
                  {formatCurrency(product?.price)}
                </span>
                {cartItem ? (
                  <div className="flex items-center">
                    <Button
                      size="small"
                      layout="outline"
                      onClick={handleDecrement}
                    >
                      -
                    </Button>
                    <span className="mx-2 font-semibold">
                      {cartItem.quantity}
                    </span>
                    <Button
                      size="small"
                      layout="outline"
                      onClick={handleIncrement}
                    >
                      +
                    </Button>
                  </div>
                ) : (
                  <Button
                    className="border-0 focus:outline-none rounded"
                    onClick={(e) => addToCart(e)}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <ClipLoader
                        cssOverride={{ margin: "0 auto" }}
                        color="#123abc"
                        size={20}
                      />
                    ) : (
                      "Add to Cart"
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      {product?.product_id && (
        <ReviewsSection productId={product.product_id} />
      )}
    </RootLayout>
  );
};

export default ProductDetails;
