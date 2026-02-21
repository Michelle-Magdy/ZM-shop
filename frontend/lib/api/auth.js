import { API_BASE_URL } from "../apiConfig";
import { apiClient } from "./axios";
export const signup = async (data) => {
  try {
    const res = await apiClient.post(
      `${API_BASE_URL}/auth/signup`,
      { name: data.name, email: data.email, password: data.password },
      {
        withCredentials: true,
      },
    );
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const login = async (data) => {
  try {
    const res = await apiClient.post(`${API_BASE_URL}/auth/login`, data, {
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getMe = async () => {
  try {
    const res = await apiClient.get(`${API_BASE_URL}/auth/me`, {
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    if (err.response?.status === 401) {
      return null; // Return null instead of throwing
    }
    console.log(err);
    throw err;
  }
};

export const logout = async () => {
  try {
    const res = await apiClient.post(
      `${API_BASE_URL}/auth/logout`,
      {},
      { withCredentials: true },
    );
    return res.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const verifyEmail = async (verificationCode) => {
  try {
    const res = await apiClient.post(
      `${API_BASE_URL}/auth/verify-email`,
      {
        code: verificationCode,
      },
      { withCredentials: true },
    );
    return res.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const forgetPassword = async (email) => {
  try {
    const res = await apiClient.post(
      `${API_BASE_URL}/auth/forget-password`,
      {
        email,
      },
      { withCredentials: true },
    );
    return res.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const resetPassword = async (password, token) => {
  try {
    const res = await apiClient.post(
      `${API_BASE_URL}/auth/reset-password/${token}`,
      {
        password,
      },
      { withCredentials: true },
    );
    return res.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
