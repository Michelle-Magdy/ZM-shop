import { cookies } from "next/headers.js";
import axios from "axios";

export default async function serverApiClient() {
  const url =
    process.env.NODE_ENV === "production"
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1`
      : `${process.env.NEXT_PUBLIC_LOCAL_URL}/api/v1`;

  const cookieStore = await cookies();

  // Get all cookies and format them properly
  const allCookies = cookieStore.getAll();
  const cookieHeader = allCookies
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");

  return axios.create({
    baseURL: url,
    headers: {
      "Content-Type": "application/json",
      Cookie: cookieHeader,
    },
    withCredentials: true,
  });
}
