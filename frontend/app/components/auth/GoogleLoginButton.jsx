"use client";

import { apiClient } from "@/lib/api/axios";
import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";

export default function GoogleLoginButton() {
  const handleSuccess = async (credentialResponse) => {
    try {
      const url =
        process.env.NODE_ENV === "production"
          ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/google/token` ||
            "https://zm-shop-production.up.railway.app/api/v1/auth/google/token"
          : `${process.env.NEXT_PUBLIC_LOCAL_URL}/api/v1/auth/google/token`;
      console.log(url);
      // credentialResponse.credential is the Google ID token
      const res = await apiClient.post(
        url,
        { token: credentialResponse.credential },
        { withCredentials: true }, // IMPORTANT: Send/receive cookies
      );

      console.log("Login successful!", res.data);
      console.log("Cookies set:", document.cookie); // Check if cookie is set

      window.location.href = "/";
    } catch (error) {
      console.error("Login failed:", error);
      alert(
        "Login failed: " + (error.response?.data?.message || "Unknown error"),
      );
    }
  };

  const handleError = () => {
    console.log("Login Failed");
    toast.error("error during login try again");
  };

  return (
    <div className="w-fit ">
      <GoogleLogin onSuccess={handleSuccess} onError={handleError} />

      {/* <GoogleLogin
        onSuccess={(res) => console.log(res)}
        onError={() => console.log("error")}
      /> */}
    </div>
  );
}
