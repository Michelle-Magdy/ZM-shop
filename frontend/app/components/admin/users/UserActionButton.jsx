import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useRef, useEffect } from "react";
import { FaEllipsisV } from "react-icons/fa";
import { updateUser } from "../../../../lib/api/user.js";
import { toast } from "react-hot-toast"; // or your toast library
import { useAuth } from "../../../context/AuthenticationProvider.jsx";

export default function UserActionButton({ userId, status }) {
    // status => active, suspended or deleted
    const { user: currentUser } = useAuth();
    const isCurrentUser = userId === currentUser?.id;
    if (isCurrentUser) {
        return <span className="w-4 h-4" />
    };

    const [isExpanded, setIsExpanded] = useState(false);
    const dropdownRef = useRef(null);
    const queryClient = useQueryClient();

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (data) => updateUser(userId, data),
    });

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsExpanded(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleExpanded = () => setIsExpanded(!isExpanded);

    // Determine actions based on status
    const getActions = () => {
        switch (status) {
            case "deleted":
                return [
                    {
                        label: "Restore",
                        action: "Restore",
                        className: "text-green-600 hover:bg-green-50",
                    },
                ];
            case "suspended":
                return [
                    {
                        label: "Unsuspend",
                        action: "Unsuspend",
                        className: "text-blue-600 hover:bg-blue-50",
                    },
                    {
                        label: "Delete",
                        action: "Delete",
                        className: "text-red-600 hover:bg-red-50",
                    },
                ];
            case "active":
            default:
                return [
                    {
                        label: "Suspend",
                        action: "Suspend",
                        className: "text-amber-600 hover:bg-amber-50",
                    },
                    {
                        label: "Delete",
                        action: "Delete",
                        className: "text-red-600 hover:bg-red-50",
                    },
                ];
        }
    };

    const actions = getActions();

    const getSuccessMessage = (action) => {
        switch (action) {
            case "Restore":
                return "User restored successfully";
            case "Unsuspend":
                return "User unsuspended successfully";
            case "Delete":
                return "User deleted successfully";
            case "Suspend":
                return "User suspended successfully";
            default:
                return "Action completed successfully";
        }
    };

    const handleAction = async (action) => {
        let data = {};
        if (action === "Restore") {
            data.isDeleted = false;
        } else if (action === "Unsuspend") {
            data.isSuspended = false;
        } else if (action === "Delete") {
            data.isDeleted = true;
        } else if (action === "Suspend") {
            data.isSuspended = true;
        }

        try {
            await mutateAsync(data);
            toast.success(getSuccessMessage(action));
            queryClient.invalidateQueries({ queryKey: ["users"] });
        } catch (error) {
            toast.error(
                error?.message || "Something went wrong",
            );
        } finally {
            setIsExpanded(false);
        }
    };

    return (
        <div className="relative inline-block" ref={dropdownRef}>
            <button
                onClick={toggleExpanded}
                disabled={isPending}
                className="text-secondary-text hover:text-(--color-primary-text) transition-colors p-1 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isPending ? (
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-current rounded-full animate-spin" />
                ) : (
                    <FaEllipsisV className="w-4 h-4" />
                )}
            </button>

            {isExpanded && (
                <div className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 animate-in fade-in duration-200">
                    {actions.map((action, index) => (
                        <button
                            disabled={isPending}
                            key={index}
                            onClick={() => handleAction(action.action)}
                            className={`w-full text-left px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 ${action.className}`}
                        >
                            {action.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
