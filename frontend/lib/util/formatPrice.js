export const formatPrice = (price) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 0,
  }).format(price);
};
