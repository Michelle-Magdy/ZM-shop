export const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1`
    : `${process.env.NEXT_PUBLIC_LOCAL_URL}/api/v1`;

export const IMAGES_BASE_URL =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_IMAGES_URL
    : `${process.env.NEXT_PUBLIC_API_URL}/images`;
