import { getUserOrders } from "@/lib/api/orders";
import { useQuery } from "@tanstack/react-query";
import OrderCard from "./OrderCard";

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
    return (
      <main className="min-h-screen p-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </main>
    );
  }
  if (isSuccess) console.log(data);
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
