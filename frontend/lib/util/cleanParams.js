export function cleanParams(params) {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([key, v]) =>
        v !== "" && v !== null && v !== undefined && key !== "category",
    ),
  );
}
