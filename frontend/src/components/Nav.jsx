import {
  Badge,
  Button,
  Dropdown,
  DropdownItem,
  Transition,
} from "@windmill/react-ui";
import useCart from "../hooks/useCart";
import useAuth from "../hooks/useAuth";
import { useState, useRef, useEffect } from "react";
import { LogOut, ShoppingCart, User } from "react-feather";
import { Link } from "react-router-dom";

const Nav = () => {
  const { cartTotal } = useCart();
  const { userData, loggedIn, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
  };

  return (
    <nav className="flex items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-36 py-4 backdrop-blur-md bg-white/90 shadow-sm shadow-black/5 fixed w-full top-0 z-50 border-b border-gray-100">
      <Link
        to="/"
        className="text-gray-900 text-xl sm:text-2xl font-bold hover:text-blue-600 transition-all duration-300 ease-out transform hover:scale-105 dark:text-gray-100 dark:hover:text-blue-400"
      >
        <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Milky Dairy
        </h1>
      </Link>

      <div className="flex items-center gap-2 sm:gap-3">
        {!loggedIn ? (
          <>
            <Link to="/login">
              <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200 ease-out border border-gray-200 hover:border-gray-300 hover:shadow-sm active:scale-95">
                Login
              </button>
            </Link>
            <Link to="/cart" className="relative">
              <button className="flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 ease-out border border-gray-200 hover:border-blue-200 hover:shadow-sm active:scale-95 relative">
                <span className="hidden sm:block">Cart</span>
                <ShoppingCart className="w-4 h-4 sm:hidden" />
                {cartTotal > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold min-w-[20px] h-5 flex items-center justify-center rounded-full shadow-lg animate-pulse">
                    {cartTotal > 99 ? "99+" : cartTotal}
                  </span>
                )}
              </button>
            </Link>
          </>
        ) : (
          <>
            <Link to="/cart" className="relative">
              <button className="flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 ease-out border border-gray-200 hover:border-blue-200 hover:shadow-sm active:scale-95 relative">
                <span className="hidden sm:block">Cart</span>
                <ShoppingCart className="w-4 h-4 sm:hidden" />
                {cartTotal > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold min-w-[20px] h-5 flex items-center justify-center rounded-full shadow-lg animate-pulse">
                    {cartTotal > 99 ? "99+" : cartTotal}
                  </span>
                )}
              </button>
            </Link>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200 ease-out border border-gray-200 hover:border-purple-200 hover:shadow-sm active:scale-95"
                aria-haspopup="true"
                aria-expanded={isDropdownOpen}
              >
                <span className="hidden sm:block">Account</span>
                <User className="w-4 h-4 sm:hidden" />
                <svg
                  className={`w-3 h-3 transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* <Transition
                show={isDropdownOpen}
                enter="transition ease-out duration-300 transform"
                enterFrom="opacity-0 scale-95 translate-y-2"
                enterTo="opacity-100 scale-100 translate-y-0"
                leave="transition ease-in duration-200 transform"
                leaveFrom="opacity-100 scale-100 translate-y-0"
                leaveTo="opacity-0 scale-95 translate-y-2"
              > */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
                    <div className="flex flex-col">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {userData?.fullname || "User"}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        @{userData?.username || "username"}
                      </p>
                    </div>
                  </div>

                  <div className="py-2">
                    <Link
                      className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all duration-150 ease-out group"
                      to="/profile"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-blue-200 transition-colors">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="font-medium">Profile</span>
                    </Link>

                    <Link
                      className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all duration-150 ease-out group"
                      to="/orders"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-green-200 transition-colors">
                        <ShoppingCart className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="font-medium">Orders</span>
                    </Link>
                  </div>

                  <div className="border-t border-gray-100 py-2">
                    <Link
                      className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 transition-all duration-150 ease-out group"
                      onClick={handleLogout}
                      to="/login"
                    >
                      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-red-200 transition-colors">
                        <LogOut className="w-4 h-4 text-red-600" />
                      </div>
                      <span className="font-medium">Logout</span>
                    </Link>
                  </div>
                </div>
              )}
              {/* </Transition> */}
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Nav;
