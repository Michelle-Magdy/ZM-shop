export default function CheckoutSummary({ address, phone, paymentMethod }) {
    const paymentLabels = {
        online: "Online (Stripe)",
        cash: "Cash on Delivery",
    };

    return (
        <div className="p-4 rounded-xl bg-badge/30 space-y-2">
            <SummaryRow
                label="Selected Address:"
                value={address?.label || "None selected"}
            />
            <SummaryRow label="Phone Number:" value={phone || "Not provided"} />
            <SummaryRow
                label="Payment Method:"
                value={paymentLabels[paymentMethod]}
            />
        </div>
    );
}

function SummaryRow({ label, value }) {
    return (
        <div className="flex items-center justify-between text-sm">
            <span className="text-secondary-text">{label}</span>
            <span className="font-medium text-(--color-primary-text)">
                {value}
            </span>
        </div>
    );
}
