export default function ReportsFilter({ status, onStatusChange }) {
    const tabs = [
        { id: "all", label: "All" },
        { id: "unread", label: "New" },
        { id: "viewed", label: "Viewed" },
        { id: "resolved", label: "Resolved" },
    ];

    return (
        <div className="flex border-b border-badge p-2 gap-1">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onStatusChange(tab.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        status === tab.id
                            ? "bg-primary text-white shadow-md"
                            : "text-secondary-text hover:bg-badge hover:text-primary-text"
                    }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}
