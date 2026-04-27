'use client'
import { useQuery } from "@tanstack/react-query";
import { getUsersStats } from "../../../../lib/api/user.js";
import UsersStatsGrid from "./UsersStatsGrid.jsx";

export default function UsersStatsGridWrapper() {
    const {data,isLoading,isError,error} = useQuery({
        queryKey:["users","stats"],
        queryFn:getUsersStats
    })
    if(isLoading || isError) return;
    
    return <UsersStatsGrid stats={data} />;
}
