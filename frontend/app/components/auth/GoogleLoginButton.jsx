"use client";

import { apiClient } from "@/lib/api/axios";
import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";

export default function GoogleLoginButton() {
    const handleSuccess = async (credentialResponse) => {
        try {
            // credentialResponse.credential is the Google ID token
            const res = await apiClient.post("/auth/google/token", {
                token: credentialResponse.credential,
            });

            console.log("Login successful!", res.data);

            if (res.data.user.roles.includes("admin"))
                window.location.href = "/admin";
            else window.location.href = "/";
        } catch (error) {
            console.error("Login failed:", error);
            alert(
                "Login failed: " +
                    (error.response?.data?.message || "Unknown error"),
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
