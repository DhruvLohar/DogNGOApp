import { useRouter } from "expo-router";
import { useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Axios from "axios";
import { API_URL, handleAccessToken } from "../service/api";

const Setpin = () => {
  const [pin, setPin] = useState("");
  const router = useRouter();
  const route = useRoute();
  const contactNumber = route.params?.contactNumber;

  const handleSetPin = () => {
    Axios.post(API_URL + "/user/setpin", {
      contactNumber: contactNumber,
      password: pin,
    })
      .then((res) => {
        // handleAccessToken(res.data.role, res.data.token)
        router.replace("/");
      })
      .catch((error) => {
        if (error.response) {
          alert(error.response.data.error);
        } else if (error.request) {
          console.log("No response received");
        } else {
          console.log("Error:", error.message);
        }
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Set 4-Digit PIN</Text>
      <TextInput
        style={styles.input}
        placeholder="4-Digit PIN"
        value={pin}
        onChangeText={setPin}
        keyboardType="numeric"
        maxLength={4}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleSetPin}>
        <Text style={styles.buttonText}>Set Pin</Text>
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
});

export default Setpin;
