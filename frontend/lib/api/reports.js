import { id } from "zod/v4/locales";
import { apiClient } from "./axios.js"

const REPORTS_LIMIT = 5;

export const getUnreadCount = async () => {
    const res = await apiClient.get(`admin/reviews/reports/count`);
    return res.data;
}

export const getReports = async (page, status) => {
    let url = `admin/reviews/reports?page=${page}&limit=${REPORTS_LIMIT}`;

    if (status != "all")
        url += `&status=${status}`;

    const res = await apiClient.get(url);
    console.log(res.data);
    return res.data;
}

export const getReportDetails = async (id) => {
    const res = await apiClient.get(`admin/reviews/reports/${id}`);
    return res.data;
}

export const resolveReport = async (id, action) => {
    const res = await apiClient.patch(`admin/reviews/reports/${id}`, { action });
    return res.data;
}