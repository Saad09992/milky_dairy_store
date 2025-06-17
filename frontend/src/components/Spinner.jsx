import ClipLoader from "react-spinners/ClipLoader";

const Spinner = ({ css, size, loading }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
      <div className="text-center">
        <ClipLoader 
          css={css} 
          size={size} 
          color={"#4F46E5"} 
          loading={loading}
          className="mb-2"
        />
        <p className="text-gray-600 font-medium">Loading...</p>
      </div>
    </div>
  );
};

export default Spinner;
