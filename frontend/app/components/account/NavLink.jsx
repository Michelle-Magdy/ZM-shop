import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLink({ item, onClick, isLast = false }) {
  const pathname = usePathname();
  // Helper function to check if a link is active
  const isActive = (href) => {
    // Exact match for root paths, startsWith for nested paths
    if (href === "/") {
      return pathname === href;
    }

    return pathname === href || pathname.startsWith(`/account/${href}`);
  };
  const active = isActive(item.href);

  return (
    <Link
      href={item.href}
      className={`group flex items-center gap-4 px-6 py-4 transition-colors duration-200 border-b border-badge ${
        isLast ? "last:border-b-0" : ""
      } ${
        active
          ? "bg-badge text-primary-text font-semibold"
          : "text-primary-text hover:bg-badge"
      } hover:opacity-90`} // ← subtle hover effect always applies
      onClick={onClick}
    >
      <item.icon
        className={`w-5 h-5 transition-colors ${
          active
            ? "text-primary-text"
            : "text-secondary-text group-hover:text-primary-text"
        }`}
      />
      <p className="group-hover:translate-x-0.5 transition-transform">
        {item.label}
      </p>
    </Link>
  );
}
