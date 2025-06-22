import { Button, Badge } from "@windmill/react-ui";
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
import { Activity, Zap, Droplet } from "react-feather";

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

  const NutritionInfo = () => {
    if (!product?.nutrition) {
      return null;
    }

    const { nutrition } = product;

    return (
      <section className="body-font">
        <div className="container px-5 py-16 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Nutrition Information
            </h2>
            <p className="text-gray-600">Nutritional values per 100g serving</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {/* Calories */}
            {nutrition.calories && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Calories
                </h3>
                <p className="text-2xl font-bold text-red-600">
                  {nutrition.calories}
                </p>
                <p className="text-sm text-gray-500">kcal</p>
              </div>
            )}

            {/* Protein */}
            {nutrition.protein && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Activity className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Protein
                </h3>
                <p className="text-2xl font-bold text-blue-600">
                  {nutrition.protein}
                </p>
                <p className="text-sm text-gray-500">grams</p>
              </div>
            )}

            {/* Fat */}
            {nutrition.fat && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Droplet className="w-6 h-6 text-yellow-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Fat
                </h3>
                <p className="text-2xl font-bold text-yellow-600">
                  {nutrition.fat}
                </p>
                <p className="text-sm text-gray-500">grams</p>
              </div>
            )}

            {/* Vitamins */}
            {nutrition.vitamin && nutrition.vitamin.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Activity className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Vitamins
                </h3>
                <div className="space-y-1">
                  {nutrition.vitamin.map((vitamin, index) => (
                    <Badge key={index} type="success" className="text-xs">
                      {vitamin}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Additional nutrition info */}
          {(nutrition.carbohydrates ||
            nutrition.fiber ||
            nutrition.sugar ||
            nutrition.sodium ||
            nutrition.cholesterol) && (
            <div className="mt-12 max-w-4xl mx-auto">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                Additional Nutritional Information
              </h3>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {nutrition.carbohydrates && (
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Carbohydrates</p>
                      <p className="font-semibold text-gray-900">
                        {nutrition.carbohydrates}g
                      </p>
                    </div>
                  )}
                  {nutrition.fiber && (
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Fiber</p>
                      <p className="font-semibold text-gray-900">
                        {nutrition.fiber}g
                      </p>
                    </div>
                  )}
                  {nutrition.sugar && (
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Sugar</p>
                      <p className="font-semibold text-gray-900">
                        {nutrition.sugar}g
                      </p>
                    </div>
                  )}
                  {nutrition.sodium && (
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Sodium</p>
                      <p className="font-semibold text-gray-900">
                        {nutrition.sodium}mg
                      </p>
                    </div>
                  )}
                  {nutrition.cholesterol && (
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Cholesterol</p>
                      <p className="font-semibold text-gray-900">
                        {nutrition.cholesterol}mg
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    );
  };

  return (
    <RootLayout loading={isFetching} title={product?.name}>
      <section className="body-font overflow-hidden">
        <div className="container px-5 py-24 mx-auto">
          <div className="lg:w-4/5 mx-auto flex flex-wrap">
            <img
              decoding="async"
              loading="lazy"
              src={`http://localhost:9000/images/${product?.image_url}`}
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
                    // className="border-0 focus:outline-none rounded"
                    className=" bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
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

      {/* Nutrition Information Section */}
      <NutritionInfo />

      {/* Reviews Section */}
      {product?.product_id && <ReviewsSection productId={product.product_id} />}
    </RootLayout>
  );
};

export default ProductDetails;
