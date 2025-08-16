import { Input as WindmillInput } from "@windmill/react-ui";
import { forwardRef } from "react";

const Input = forwardRef(({ className = "", ...props }, ref) => {
  return (
    <WindmillInput
      ref={ref}
              className={`block w-full px-4 py-2.5 text-gray-700 bg-white border border-gray-200 rounded-lg focus:border-dairy-primary focus:ring focus:ring-dairy-primary focus:ring-opacity-50 transition-colors duration-200 shadow-sm hover:border-gray-300 ${className}`}
      {...props}
    />
  );
});

export default Input; 