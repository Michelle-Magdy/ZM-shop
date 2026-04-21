import { cookies } from "next/headers.js";
import axios from "axios";

export default async function serverApiClient() {
  const url =
    process.env.NEXT_PUBLIC_ENV === "production"
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1`
      : `${process.env.NEXT_PUBLIC_LOCAL_URL}/api/v1`;
  //used with server components fetching to forward cookies to node server
  const cookieStore = await cookies();
  return axios.create({
    baseURL: url,
    headers: {
      "Content-Type": "application/json",
      Cookie: cookieStore.toString(),
    },
  });
}
