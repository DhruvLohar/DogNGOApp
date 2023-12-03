import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const API_URL = "http://13.235.31.125";
// export const API_URL = "http://192.168.1.4:3500";

const API_KEY = "3b80afc4-787c-11ee-8cbb-0200cd936042";

export const sendOTP = async (mobileNumber) => {
  try {
    const response = await axios.post(
      "https://2factor.in/API/V1/" +
        API_KEY +
        "/SMS/+91" +
        mobileNumber +
        "/AUTOGEN"
      // `https://2factor.in/API/V1/${API_KEY}/SMS/${mobileNumber}/${random}/OTP1`
    );

    // Check the response for success
    if (response.data.Status === "Success") {
      console.log("OTP sent successfully");
      return response.data.Details;
    } else {
      console.error("Failed to send OTP:", response.data.Details);
      return null;
    }
  } catch (error) {
    console.error("Error sending OTP:", error.message);
    return null;
  }
};

export const verifyOTP = async (sessionId, otp) => {
  try {
    const response = await axios.get(
      "https://2factor.in/API/V1/" +
        API_KEY +
        "/SMS/VERIFY/" +
        sessionId +
        "/" +
        otp
    );

    // Check the response for success
    if (response.data.Status === "Success") {
      console.log("OTP verified successfully");
      return true;
    } else {
      console.error("OTP verification failed:", response.data.Details);
      return false;
    }
  } catch (error) {
    console.error("Error verifying OTP:", error.message);
    return false;
  }
};

export const handleAccessToken = async (role, token) => {
  await AsyncStorage.setItem("accessToken", token);
  await AsyncStorage.setItem("role", role);
  return true;
};

export const getAccessToken = async () =>
  await AsyncStorage.getItem("accessToken");

export const getUserRole = async () => await AsyncStorage.getItem("role");

export const logOutUser = async () => {
  await AsyncStorage.clear();
  return true;
};

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
        Authorization: result,
        Accept: "application/json",
        "Content-Type": sendingMedia
          ? "multipart/form-data"
          : "application/json",
      },
    });
  } else {
    alert("Something went wrong. Try logging in again.");
  }
};
