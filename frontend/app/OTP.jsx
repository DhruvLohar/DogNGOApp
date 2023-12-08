import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";

import { useRoute } from "@react-navigation/native";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { StatusBar } from 'expo-status-bar';
import { sendOTP, verifyOTP } from "../service/api";

const OTP = () => {
  const navigation = useNavigation();
  const [otp, setOtp] = useState("");
  const [sessionId, setSessionId] = useState("")

  const route = useRoute();
  const phoneNumber = route.params?.contactNumber;

  useEffect(() => {
    sendOTP(phoneNumber)
      .then((sess_id) => {
        if (sess_id) {
          setSessionId(sess_id)
        }
      });
  }, [])

  const handleVerifyOTP = () => {
    if (otp.length === 4 && sessionId) {
      verifyOTP(sessionId, otp).then(res => {
        if (res) {
          navigation.navigate("Setpin", { contactNumber: phoneNumber });
        }
      });
    } else alert("Invalid OTP");
    // navigation.navigate("Setpin", { contactNumber: phoneNumber });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Text style={styles.heading}>OTP Verification</Text>
      <TextInput
        style={styles.input}
        placeholder="4 Digit OTP was sent to your phone number"
        value={otp}
        onChangeText={setOtp}
        keyboardType="numeric"
        maxLength={6}
      />
      <TouchableOpacity style={styles.button} onPress={handleVerifyOTP}>
        <Text style={styles.buttonText}>Verify OTP</Text>
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

export default OTP;
