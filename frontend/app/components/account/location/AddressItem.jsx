export default function AddressItem({ add }) {
  return (
    <div className="mt-4 rounded-xl bg-card p-6 shadow-md flex justify-between">
      <div>
        <h3 className="font-semibold text-primary-text">
          {add.label || "Unnamed Address"}
        </h3>
        <p className="mt-2 text-secondary-text">
          {add.address || "No address provided"}
        </p>

        {/* Safe coordinate access */}
        <p className="mt-2 text-xs text-secondary-text">
          Coordinates:{" "}
          {add.location?.coordinates?.[0] !== undefined
            ? add.location.coordinates[0]
            : "N/A"}
          ,{" "}
          {add.location?.coordinates?.[1] !== undefined
            ? add.location.coordinates[1]
            : "N/A"}
        </p>
      </div>
      {add.isDefault && (
        <div className="bg-badge py-1 px-3 w-fit h-fit rounded-4xl">
          default
        </div>
      )}
    </div>
  );
}
