import { getAdminOrdersStats } from "../../../../lib/api/orders.js";
import OrdersStatsGrid from "./OrdersStatsGrid.jsx";

export default async function OrdersStatsGridWrapper(){
    const orders = await getAdminOrdersStats();
    return <OrdersStatsGrid stats={orders.data}/>
}