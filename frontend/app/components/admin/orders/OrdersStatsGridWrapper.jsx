'use client'
import { useQuery } from "@tanstack/react-query";
import { getAdminOrdersStats } from "../../../../lib/api/orders.js";
import OrdersStatsGrid from "./OrdersStatsGrid.jsx";

export default function OrdersStatsGridWrapper(){
    const { data, isLoading, isError } = useQuery({
      queryFn: getAdminOrdersStats,
      queryKey:["orders","stats"]
    });
    if(isLoading || isError) return;
    return <OrdersStatsGrid stats={data.data}/>
}