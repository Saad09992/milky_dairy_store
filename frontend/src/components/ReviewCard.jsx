import { Card, CardBody } from "@windmill/react-ui";
import { format, parseISO } from "date-fns";
import ReactStars from "react-rating-stars-component";
import { User } from "react-feather";

const ReviewCard = ({ reviews }) => {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 font-medium">No reviews yet</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {reviews.map((review) => (
        <Card
          key={review.id}
          className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
        >
          <CardBody className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{review.name}</h3>
                <p className="text-sm text-gray-500">
                  {format(parseISO(review.date), "MMM dd, yyyy")}
                </p>
              </div>
            </div>
            <div className="mb-4">
              <ReactStars
                count={5}
                size={20}
                edit={false}
                value={review.rating}
                activeColor="#4F46E5"
                color="#E5E7EB"
              />
            </div>
            <p className="text-gray-700 leading-relaxed">{review.content}</p>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};

export default ReviewCard;
