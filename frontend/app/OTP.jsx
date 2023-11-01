import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const OTP = () => {
  const [otp, setOtp] = useState("");
  const router = useRouter();

  const handleVerifyOTP = () => {
    //if OPT match
    if (otp.length === 4) router.push("/Setpin");
    else alert("Invalid OTP");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>OTP Verification</Text>
      <TextInput
        style={styles.input}
        placeholder="4 Digit OTP sent to your phone number"
        value={otp}
        onChangeText={setOtp}
        keyboardType="numeric"
        maxLength={4}
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
