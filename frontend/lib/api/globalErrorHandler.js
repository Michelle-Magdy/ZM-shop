export const handleApiError = (error) => {
  if (!error.response) {
    return {
      message: "Network error. Please check your internet connection.",
      status: null,
    };
  }

  const { status, data } = error.response;

  return {
    status,
    message: data?.message || "Something went wrong",
    errors: data?.errors,
  };
};
