import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { API_URL, axiosAuthorized, getUserRole } from "../service/api";
import { useRouter } from "expo-router";

const Index = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const navigation = useNavigation();
  const router = useRouter()

  const role = async () => {
    let r = await getUserRole();
    if (r) {
      router.replace("/FormPage")
    }
  };

  useEffect(() => {
    role();
  }, [])

  const handleLogin = () => {
    //if user logging in for the first time router.push("/setPin")

    if (phoneNumber.length === 10) {
      Axios.post(API_URL + "/user/login", {
        contactNumber: phoneNumber,
      })
        .then((res) => {
          if (res.status == 205) {
            navigation.navigate("OTP", { contactNumber: phoneNumber });
          } else if (res.status == 200) {
            // alert("Enter your PIN");
            navigation.navigate("EnterPin", { contactNumber: phoneNumber });
          }
        })
        .catch((error) => {
          if (error.response) {
            // console.log(error);
            alert(error.response.data.error);
          } else if (error.request) {
            console.log("No response received");
          } else {
            console.log("Error:", error.message);
          }
        });
    } else alert("Invalid Phone number");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
        maxLength={10}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  heading: {
    fontSize: 32,
    marginBottom: 30,
    fontWeight: "bold",
    color: "#333",
  },
  input: {
    width: "80%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 12,
    borderRadius: 5,
    width: "80%",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  login: {
    marginTop: 20,
    fontSize: 16,
  },
  loginText: {
    color: "#007BFF",
    fontWeight: "bold",
  },
});

export default Index;
