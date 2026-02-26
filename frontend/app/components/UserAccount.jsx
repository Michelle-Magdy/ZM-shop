"use client";

import { useAuth } from "../context/AuthenticationProvider";
import Link from "next/link";
import { LuUserRound } from "react-icons/lu";
import { useState, useRef, useEffect } from "react";
import { FaArrowDown } from "react-icons/fa";
import animation from "@/app/UI/Animation.module.css";
import { logout } from "@/lib/api/auth";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { clearCart } from "@/features/cart/cartSlice";
import { clearWishlist } from "@/features/wishlist/wishlistSlice";

export default function UserAccount() {
  const { isAuthenticated, user, setUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      const res = await logout();
      toast.success(res.message || "Logged out successfully");
      dispatch(clearCart(true));
      dispatch(clearWishlist(true));
      setUser(null);
      setIsOpen(false);
    } catch (err) {
      toast.error(err.message || "Logout failed");
    }
  };

  if (!isAuthenticated)
    return (
      <Link href="/login">
        <LuUserRound
          className="mr-1 w-7 h-7 md:w-9 md:h-9"
          alt="User Account"
          title="Login"
        />
      </Link>
    );

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center focus:outline-none transition-colors cursor-pointer"
      >
        <LuUserRound className="w-7 h-7 md:w-9 md:h-9 " alt="User Account" />
        <FaArrowDown
          className={`${isOpen ? animation.rotateUpDown : animation.rotateDownUp}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg py-1 bg-(--color-card) border border-badge z-50">
          {/* Greeting */}
          <div className="px-4 py-3 border-b text-primary dark:text-primary-text border-badge flex gap-1">
            <p className="text-sm ">Hello,</p>
            <p className="text-sm font-bold truncate">
              {user?.name || user?.email || "User"}
            </p>
          </div>

          {/* Menu Items */}
          <Link
            href="/account/profile"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-2 text-sm text-(--color-primary-text) border-b border-badge hover:bg-badge dark:hover:text-secondary-text transition-colors"
          >
            My Account
          </Link>

          <Link
            href="/orders"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-2 text-sm text-(--color-primary-text) hover:bg-badge dark:hover:text-secondary-text transition-colors"
          >
            Order History
          </Link>

          {/* Logout */}
          <div className="border-t border-badge mt-1 text-center p-1">
            <button
              onClick={handleLogout}
              className="w-[90%] p-2 text-center text-white bg-primary rounded-lg shadow-md transition-all duration-300 hover:bg-primary-hover text-sm font-medium mt-auto"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
