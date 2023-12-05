import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import { StatusBar } from 'expo-status-bar';
import Axios from "axios";
import { API_URL } from "../service/api";

const Register = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("");
  const router = useRouter();

  const handleSignup = () => {
    if (
      phoneNumber.length !== 10 ||
      firstName === "" ||
      lastName === "" ||
      role === ""
    ) {
      alert("Fill in all details correctly");
    } else {
      Axios.post(API_URL + "/user/signup", {
        name: `${firstName} ${lastName}`,
        contactNumber: phoneNumber,
        role: role,
      })
        .then((res) => {
          console.log(res);
          alert("New User has been created");
          router.push("/FormPage");
        })
        .catch((error) => {
          if (error.response) {
            alert(error.response.data.message);
          } else if (error.request) {
            console.log("No response received");
          } else {
            // Something happened in setting up the request
            console.log("Error:", error.message);
          }
        });
    }
  };

  const handleLogin = () => {
    router.push("/");
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <Text style={styles.heading}>Add New User</Text>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>
          First Name <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          value={firstName}
          onChangeText={(text) => setFirstName(text)}
          placeholder="Enter First Name"
        />
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>
          Last Name <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          value={lastName}
          onChangeText={(text) => setLastName(text)}
          placeholder="Enter Last Name"
        />
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>
          Phone Number <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
          maxLength={10}
        />
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>
          User Role <Text style={styles.required}>*</Text>
        </Text>
        <Picker
          selectedValue={role}
          onValueChange={(itemValue) => setRole(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select Role" value="" />
          <Picker.Item label="Catcher" value="catcher" />
          <Picker.Item label="Vet" value="vet" />
          <Picker.Item label="Caretaker" value="caretaker" />
          <Picker.Item label="Admin" value="admin" />
        </Picker>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Add User to Database</Text>
      </TouchableOpacity>

      <Text style={styles.login}>
        Not an admin?{" "}
        <Text onPress={handleLogin} style={styles.loginText}>
          User Login
        </Text>
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
    padding: 40, // Increased padding for desktop view
  },
  heading: {
    fontSize: 48, // Larger font for desktop
    marginBottom: 30,
    fontWeight: "bold",
    color: "#333",
  },
  fieldContainer: {
    width: "80%", // Adjusted width for desktop
    marginBottom: 30, // Increased margin for desktop
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
    color: "#333",
  },
  required: {
    color: "red",
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  picker: {
    width: "100%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: "100%",
    marginTop: 20,
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
    color: "#333",
  },
  loginText: {
    color: "#007BFF",
    fontWeight: "bold",
  },
});

export default Register;
