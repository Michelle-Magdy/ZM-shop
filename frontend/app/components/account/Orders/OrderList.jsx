import { getUserOrders } from "@/lib/api/orders";
import { useQuery } from "@tanstack/react-query";
import OrderCard from "./OrderCard";
import LoadingSpinner from "../../LoadingSpinner";

export default function OrderList({ user }) {
  const { data, isError, isFetching, error, isSuccess } = useQuery({
    queryKey: ["orders", user?.id],
    queryFn: getUserOrders,
    enabled: !!user?.id, // Only run query if user exists
    staleTime: 1000 * 60 * 5,
  });

  if (isError) {
    return (
      <main className="min-h-screen p-4">
        <div className="text-red-500 text-center">
          Error loading Orders: {error?.message || "Something went wrong"}
        </div>
      </main>
    );
  }

  if (isFetching) {
    return <LoadingSpinner />;
  }
  return (
    <>
      {isSuccess && (
        <div className="space-y-6">
          {data?.orders?.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      )}
    </>
  );
}
