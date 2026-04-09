import { cookies } from "next/headers.js";
import axios from "axios";

export default async function serverApiClient() {
    //used with server components fetching to forward cookies to node server
    const cookieStore = await cookies();
    return axios.create({
        baseURL: "http://localhost:5000/api/v1",
        headers: {
            "Content-Type": "application/json",
            Cookie: cookieStore.toString()
        }
    })
}