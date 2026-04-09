import { useQuery } from "@tanstack/react-query";
import UsersTableBodyView from "./UsersTableBodyView.jsx";
import { getUsers } from "../../../../lib/api/user.js";
import { useState, useEffect } from "react";

export default function UsersTableBody({ role, status, searchTerm }) {
    const [page, setPage] = useState(1);
    const { data, isPending, error } = useQuery({
        queryKey: ["users", page, searchTerm, role, status],
        queryFn: () => getUsers(page, searchTerm, role, status),
    });

    useEffect(() => {
        setPage(1);
    }, [searchTerm, role, status]);

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    return (
        <UsersTableBodyView
            data={data}
            loading={isPending}
            error={error}
            onPageChange={handlePageChange}
        />
    );
}
