"use client";
import {
  FaBox,
  FaRotateLeft,
  FaCoins,
  FaHeart,
  FaUser,
  FaLocationDot,
  FaCreditCard,
  FaShieldHalved,
  FaGift,
} from "react-icons/fa6";
import NavLink from "./NavLink";

export default function Sidebar({ user }) {
  const menuItems = [
    { icon: FaBox, label: "Orders", href: "/orders" },
    { icon: FaRotateLeft, label: "Returns", href: "/returns" },
    { icon: FaHeart, label: "Wishlist", href: "/wishlist" },
  ];

  const accountItems = [
    { icon: FaUser, label: "Profile", href: "profile" },
    { icon: FaLocationDot, label: "Addresses", href: "addresses" },
    { icon: FaCreditCard, label: "Payments", href: "payments" },
    { icon: FaShieldHalved, label: "Warranty Claims", href: "warranty" },
    { icon: FaGift, label: "Gift Cards", href: "gift-cards" },
  ];

  // Reusable link item component

  return (
    <aside className="w-full shrink-0 ">
      {/* User Info */}
      <div className="bg-card rounded-lg p-6 mb-4 shadow-sm">
        <h2 className="text-xl font-bold text-primary-text mb-1">Hello!</h2>
        <p className="text-sm text-secondary-text break-all">{user?.name}</p>
      </div>

      {/* Main Menu */}
      <nav className="bg-card rounded-lg shadow-sm mb-4 overflow-hidden">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            item={item}
            isLast={index === menuItems.length - 1}
          />
        ))}
      </nav>

      {/* My Account Section */}
      <div className="mb-4">
        <h3 className="text-xs font-bold text-secondary-text uppercase tracking-wider px-6 mb-2">
          MY ACCOUNT
        </h3>
        <nav className="bg-card rounded-lg shadow-sm overflow-hidden">
          {accountItems.map((item, index) => (
            <NavLink
              key={index}
              item={item}
              isLast={index === accountItems.length - 1}
            />
          ))}
        </nav>
      </div>
    </aside>
  );
}
