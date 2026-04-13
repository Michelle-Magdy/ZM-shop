"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import ReportsList from "../../../components/admin/reports/ReportsList.jsx";
import ReportDetails from "../../../components/admin/reports/ReportDetails.jsx";


export default function ReportsPage() {
    const [selectedReportId, setSelectedReportId] = useState(null);

    return (
        <div className="h-full flex flex-col animate-enter">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-primary-text">Reports</h1>
                <button className="p-2 rounded-lg hover:bg-badge transition-colors">
                    <RefreshCw className="w-5 h-5 text-secondary-text" />
                </button>
            </div>

            <div className="flex-1 flex gap-6 h-[calc(100vh-140px)]">
                {/* Left Panel - Report List */}
                <ReportsList selectedReportId={selectedReportId} onChange={(id) => setSelectedReportId(id)} />

                {/* Right Panel - Report Details */}
                <ReportDetails selectedReportId={selectedReportId} />
            </div>
        </div>
    );
}