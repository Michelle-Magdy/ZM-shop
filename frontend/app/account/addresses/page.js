// app/page.jsx
"use client";

import AddressItem from "@/app/components/account/location/AddressItem";
import LocationPicker from "@/app/components/account/location/LocationPicker";
import { useAuth } from "@/app/context/AuthenticationProvider";
import { addAddress, getAddresses } from "@/lib/api/address";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Address() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const { isFetching, isError, data, isSuccess, error } = useQuery({
    queryKey: ["addresses", user?.id], // Optional chaining for safety
    queryFn: getAddresses,
    enabled: !!user?.id, // Only run query if user exists
    staleTime: 1000 * 60 * 5,
  });

  const queryClient = useQueryClient();
  // Loading state
  if (isFetching) {
    return (
      <main className="min-h-screen p-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </main>
    );
  }

  // Error state
  if (isError) {
    return (
      <main className="min-h-screen p-4">
        <div className="text-red-500 text-center">
          Error loading addresses: {error?.message || "Something went wrong"}
        </div>
      </main>
    );
  }
  const handleDelete = () => {
    queryClient.invalidateQueries(["addresses", user?.id]);
  };

  const handleSubmit = async (selectedLocation) => {
    const payload = {
      userId: user.id || user._id,
      latitude: selectedLocation.lat,
      longitude: selectedLocation.lng,
      label: selectedLocation.label,
      address: selectedLocation.displayName,
      isDefault: selectedLocation.isDefault,
    };

    try {
      const data = await addAddress(payload);
      if (!data) {
        throw new Error("failed to add location");
      }
      queryClient.invalidateQueries(["addresses", user?.id]);

      toast.success("new address added");
    } catch (err) {
      console.log(err);
      toast.error(err);
    }
  };

  return (
    <main className="min-h-screen gap-4 p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-primary-text text-2xl">Choose your Address</h1>

        <button
          onClick={() => setIsOpen(true)}
          className="rounded-xl bg-primary px-6 py-3 font-semibold text-white shadow-lg transition-all hover:bg-primary-hover"
        >
          Open Location Picker
        </button>
      </div>

      {/* Addresses List */}
      {/* Addresses List */}
      {isSuccess &&
        data?.data?.length > 0 &&
        data.data.map((add, index) => (
          <AddressItem add={add} key={index} onDelete={handleDelete} />
        ))}

      {isSuccess && data?.data?.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          No addresses found. Add your first address!
        </div>
      )}

      {isError && (
        <div className="text-red-500 text-center">
          Error: {error?.message || "Something went wrong"}
        </div>
      )}

      {isFetching && <>Loading...</>}

      <LocationPicker
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        defaultValues={{
          lat: 30.0444,
          lng: 31.2357,
          state: "",
          village: "",
          displayName: "",
          suburb: "",
          label: "",
          isDefault: false,
        }}
        onConfirm={handleSubmit}
      />
    </main>
  );
}
