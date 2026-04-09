import { getUsersStats } from "../../../../lib/api/user.js";
import UsersStatsGrid from "./UsersStatsGrid.jsx";

export default async function UsersStatsGridWrapper() {
    const data = await getUsersStats();
    return <UsersStatsGrid stats={data} />;
}
