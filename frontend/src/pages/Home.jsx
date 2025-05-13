import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  clearCount,
  clearUsers,
  incrementCount,
} from "../store/slices/counterSlice";
import { getDataFromApi } from "../store/methods/counterMethod";

function Home() {
  const dispatch = useDispatch();
  const { count, users } = useSelector((state) => state.counterReducer);

  return (
    <div className="flex flex-col justify-center items-center h-full">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-4">
        Home
      </h1>

      <div className="flex w-full max-w-4xl">
        {/* Left side: Box for user names */}
        <div className="flex-1 p-4 border border-gray-300 rounded-lg mr-4">
          <h2 className="text-xl font-semibold mb-2">Users</h2>
          <div className="space-y-2">
            {users.length > 0 ? (
              users.map((user, index) => (
                <div key={index} className="p-2 bg-gray-100 rounded-md">
                  {user.name}
                </div>
              ))
            ) : (
              <div className="p-2 bg-gray-100 rounded-md text-gray-500">
                No users available
              </div>
            )}
          </div>
        </div>

        {/* Right side: Buttons */}
        <div className="flex flex-col justify-center items-center">
          <h3 className="text-2xl mb-2">Count: {count}</h3>
          <button
            onClick={() => dispatch(incrementCount())}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Click me
          </button>

          <button
            onClick={() => dispatch(clearCount())}
            className="bg-blue-500 text-white mt-3 px-4 py-2 rounded-md"
          >
            Clear count
          </button>

          <button
            onClick={() => dispatch(getDataFromApi())}
            className="bg-blue-500 text-white mt-3 px-4 py-2 rounded-md"
          >
            Get Users From Api
          </button>

          <button
            onClick={() => dispatch(clearUsers())}
            className="bg-blue-500 text-white mt-3 px-4 py-2 rounded-md"
          >
            Clear users
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
