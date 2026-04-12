import { useQuery } from "@tanstack/react-query";
import OrdersTableBodyView from "./OrdersTableBodyView.jsx";
import { getOrders } from "../../../../lib/api/orders.js";
import { useState, useEffect } from "react";
import OrderDetailsModal from "./OrderDetailsModal.jsx";
import { createPortal } from "react-dom";

export default function OrdersTableBody({ status, paymentStatus, searchTerm }) {
    const [page, setPage] = useState(1);
    const [orderOpened, setOrderOpened] = useState(null);
    const [mounted, setMounted] = useState(false);

    const { data, isPending, error } = useQuery({
        queryKey: ["orders", page, searchTerm, status, paymentStatus],
        queryFn: () => getOrders(page, searchTerm, status, paymentStatus),
    });

    useEffect(() => {
        setPage(1);
    }, [searchTerm, status, paymentStatus]);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    return (
        <>
            <OrdersTableBodyView
                data={data}
                loading={isPending}
                error={error}
                onPageChange={handlePageChange}
                onOrderClick={(order) => setOrderOpened(order)}
            />
            {orderOpened && createPortal(<OrderDetailsModal order={orderOpened} onClose={() => setOrderOpened(null)}/>, document.getElementById("modal-root"))}
        </>
    );
}
