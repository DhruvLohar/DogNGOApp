import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Axios from "axios";
import { useRoute } from "@react-navigation/native";
import { API_URL, handleAccessToken } from "../service/api";
import { useNavigation } from "@react-navigation/native";

const Index = () => {
  const [pin, setPin] = useState("");
  const router = useRouter();
  const route = useRoute();
  const navigation = useNavigation();
  const contactNumber = route.params?.contactNumber;

  const handleLogin = () => {
    Axios.post(API_URL + "/user/enterpin", {
      contactNumber: contactNumber,
      password: pin,
    })
      .then(async (res) => {
        await handleAccessToken(res.data.role, res.data.token);
        router.replace("/FormPage");
      })
      .catch((error) => {
        if (error.response) {
          alert(error.response.data.message);
        } else if (error.request) {
          console.log("No response received");
        } else {
          console.log("Error:", error.message);
        }
      });
  };

  const handleForgot = () => {
    navigation.navigate("OTP", { contactNumber: contactNumber });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Enter your PIN</Text>
      <TextInput
        style={styles.input}
        placeholder="PIN"
        value={pin}
        onChangeText={setPin}
        keyboardType="phone-pad"
        maxLength={4}
        secureTextEntry={true}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Enter your PIN</Text>
      </TouchableOpacity>
      <Text onPress={handleForgot} style={styles.loginText}>
        Forgot your PIN?
      </Text>
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
    fontSize: 12,
  },
  loginText: {
    marginTop: 20,
    fontSize: 12,
    // cursor: "pointer",
    color: "#007BFF",
    fontWeight: "bold",
  },
});

export default Index;
