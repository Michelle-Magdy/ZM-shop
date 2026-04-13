import { ChevronRight } from "lucide-react";
import Link from "next/link.js";
import { usePathname } from "next/navigation.js";
import { useEffect, useState, useRef } from "react";
import { getUnreadCount } from "../../../../lib/api/reports.js";
import { API_BASE_URL } from "../../../../lib/apiConfig.js";

export default function ReportsButton({ item }) {
    const pathname = usePathname();
    const Icon = item.icon;
    const isActive = pathname === item.href;
    const [unreadCount, setUnreadCount] = useState(0);
    const [isPopping, setIsPopping] = useState(false);
    const prevCountRef = useRef(0);

    // Trigger pop animation when count increases
    useEffect(() => {
        if (unreadCount > prevCountRef.current && prevCountRef.current !== 0) {
            setIsPopping(true);
            const timer = setTimeout(() => setIsPopping(false), 400);
            return () => clearTimeout(timer);
        }
        prevCountRef.current = unreadCount;
    }, [unreadCount]);

    // Fetch initial count on mount
    useEffect(() => {
        getUnreadCount()
            .then((data) => {
                setUnreadCount(data.unreadCount || 0);
                prevCountRef.current = data.unreadCount || 0;
            })
            .catch(console.error);
    }, []);

    // Connect to SSE stream only for reports item
    useEffect(() => {
        const eventSource = new EventSource(
            `${API_BASE_URL}/admin/reviews/reports/stream`,
            { withCredentials: true },
        );

        eventSource.onmessage = (event) => {
            // Ignore ping messages
            if (event.data.startsWith(":ping")) return;

            // New report received - increment count
            setUnreadCount((prev) => prev + 1);
        };

        eventSource.onerror = (error) => {
            console.error("SSE error:", error);
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }, []);

    return (
        <Link
            onClick={() => setUnreadCount(0)}
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                isActive
                    ? "bg-white/15 text-(--color-brand-light) font-medium shadow-lg"
                    : "text-link hover:bg-white/10 hover:text-(--color-link-hover)"
            }`}
        >
            <div className="relative">
                <Icon
                    size={20}
                    className={`transition-transform duration-200 ${
                        isActive ? "scale-110" : "group-hover:scale-105"
                    }`}
                />
                {item.label === "Reports" && unreadCount > 0 && (
                    <span
                        className={`absolute -top-4 -right-2 min-w-4 h-4 flex items-center justify-center bg-white text-primary text-[10px] font-bold rounded-full px-1 transition-transform duration-300 ${isPopping ? "scale-150" : "scale-100"}`}
                    >
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                )}
            </div>
            <span className="flex-1">{item.label}</span>

            {isActive && <ChevronRight size={16} className="opacity-60" />}
        </Link>
    );
}
