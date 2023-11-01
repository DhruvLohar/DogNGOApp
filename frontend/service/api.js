import axios from "axios";

export const API_URL = "http://localhost:3500";

import AsyncStorage from "@react-native-async-storage/async-storage";

export const handleAccessToken = async (role, token) => {
  await AsyncStorage.setItem("accessToken", token);
  await AsyncStorage.setItem("role", role);
};

export const getAccessToken = async () =>
  await AsyncStorage.getItem("accessToken");

export const getUserRole = async () => await AsyncStorage.getItem("role");

export const axiosAuthorized = async () => {
  let instance = axios.create({
    baseURL: API_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  try {
    const token = await AsyncStorage.getItem("accessToken");

    if (token) {
      instance = axios.create({
        baseURL: API_URL,
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      return instance;
    } else {
      console.error("Token not found in storage.");
      return instance;
    }
  } catch (error) {
    console.error("Error retrieving token:", error);
    return instance;
  }
};

export const axiosRequest = async (url, req_params, sendingMedia) => {
  const result = await AsyncStorage.getItem("accessToken");

  if (result != null) {
    return axios.request({
      url: API_URL + url,
      ...req_params,
      headers: {
        Authorization: `Bearer ${result.value}`,
        "Content-Type": sendingMedia
          ? "multipart/form-data"
          : "application/json",
      },
    });
  } else {
    //   return <Navigate to="/logout" />
  }
};
