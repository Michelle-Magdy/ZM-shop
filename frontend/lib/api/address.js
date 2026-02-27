import { API_BASE_URL } from "../apiConfig";
import { apiClient } from "./axios";

export const addAddress = async (data) => {
  try {
    const { userId, latitude, longitude, label, fullAddress, isDefault } = data;
    const res = await apiClient.post(
      `${API_BASE_URL}/addresses`,
      {
        userId,
        latitude,
        longitude,
        label,
        fullAddress,
        isDefault,
      },
      {
        withCredentials: true,
      },
    );
    return res.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getAddresses = async () => {
  try {
    const res = await apiClient.get(`${API_BASE_URL}/addresses`, { withCredentials: true });
    return res.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getAddressFromLocation = async (lat, lon, signal) => {
  try {
    const res = await apiClient.get(
      `${API_BASE_URL}/addresses/lookup?lat=${lat}&lon=${lon}`,
      { signal: signal },
      {
        withCredentials: true,
      },
    );
    return res.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const updateAddress = async (id, data) => {
  try {
    const res = await apiClient.patch(`${API_BASE_URL}/addresses/${id}`, data, {
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const deleteAddress = async (id) => {
  try {
    const res = await apiClient.delete(`${API_BASE_URL}/addresses/${id}`, {
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
