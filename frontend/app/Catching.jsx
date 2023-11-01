import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
} from "react-native";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import Axios from "axios";

export default function Catching() {
  const [location, setLocation] = useState("");
  const [locationDetails, setLocationDetails] = useState("");
  const [spotPhoto, setSpotPhoto] = useState(null);
  const [additionalPhotos, setAdditionalPhotos] = useState([]);
  const [date, setDate] = useState(new Date().toLocaleDateString());
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [caretaker, setCaretaker] = useState("");
  const [caretakerNumber, setCaretakerNumber] = useState("");

  useEffect(() => {
    // Fetch user location
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(
        `Latitude: ${location.coords.latitude}, Longitude: ${location.coords.longitude}`
      );
    })();
    setTime(formatTime());
  }, []);

  const handleSpotPhotoUpload = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSpotPhoto(result.assets[0].uri);
    }
  };

  const handleDeleteMain = () => {
    setSpotPhoto(null);
  };

  const handleAdditionalPhotoUpload = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setAdditionalPhotos([...additionalPhotos, result.assets[0].uri]);
    }
  };

  const handleDeletePhoto = (index) => {
    const updatedPhotos = [...additionalPhotos];
    updatedPhotos.splice(index, 1);
    setAdditionalPhotos(updatedPhotos);
  };

  const formatTime = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();

    const formattedTime =
      hours >= 12
        ? `${hours === 12 ? 12 : hours - 12}:${minutes
            .toString()
            .padStart(2, "0")} PM`
        : `${hours}:${minutes.toString().padStart(2, "0")} AM`;

    return formattedTime;
  };

  const handleSubmit = () => {
    // Validate form fields here
    if (!location || !spotPhoto || !date || !time) {
      alert("Please fill in all required fields.");
      return;
    }
    if (caretakerNumber.length > 0 && caretakerNumber.length !== 10) {
      alert("Please fill in valid 10 digit mobile number");
      return;
    }

    // Handle form submission logic here
    // For example, you can send the data to a server or perform any other action
    // console.log(
    //   location,
    //   locationDetails,
    //   spotPhoto,
    //   additionalPhotos,
    //   date,
    //   time,
    //   caretaker,
    //   caretakerNumber
    // );
    // Reset form fields
    setLocation("");
    setLocationDetails("");
    setSpotPhoto(null);
    setAdditionalPhotos([]);
    setDate(new Date().toLocaleDateString());
    setTime(formatTime());
    setCaretaker("");
    setCaretakerNumber("");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Location */}
      <View style={styles.fieldContainer}>
        <Text>
          Location <Text style={styles.required}>*</Text>{" "}
        </Text>
        <TextInput
          style={styles.input}
          value={location}
          onChangeText={(text) => setLocation(text)}
          placeholder="Enter location"
        />
      </View>

      {/* Location Details */}
      <View style={styles.fieldContainer}>
        <Text>Location Details</Text>
        <TextInput
          style={styles.input}
          value={locationDetails}
          onChangeText={(text) => setLocationDetails(text)}
          placeholder="Enter location details"
        />
      </View>

      {/* Spot Photo */}
      <View style={styles.fieldContainer}>
        <Text>
          Spot Photo <Text style={styles.required}>*</Text>{" "}
        </Text>
        {spotPhoto && (
          <View style={styles.imageContainerMain}>
            <Image source={{ uri: spotPhoto }} style={styles.uploadedImage} />
            <TouchableOpacity onPress={() => handleDeleteMain()}>
              <Text style={styles.deleteIconMain}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={handleSpotPhotoUpload}
        >
          {spotPhoto ? null : (
            <View style={styles.placeholderImage}>
              <Text style={styles.placeholderText}>Upload Spot Photo</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Additional Photos */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Additional Photos</Text>
        <View style={styles.uploadButton}>
          {additionalPhotos.length > 0 ? (
            <View style={styles.additionalImage}>
              {additionalPhotos.map((uri, index) => (
                <View key={index} style={styles.imageContainer}>
                  <Image source={{ uri }} style={styles.uploadedImage} />
                  <TouchableOpacity onPress={() => handleDeletePhoto(index)}>
                    <Text style={styles.deleteIcon}>Delete</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.placeholderImage}>
              <Text style={styles.placeholderText}>
                Upload Additional Photos
              </Text>
            </View>
          )}
          <TouchableOpacity onPress={handleAdditionalPhotoUpload}>
            <Text style={styles.uploadText}>Add Another Photo</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Date */}
      <View style={styles.fieldContainer}>
        <Text>
          Date <Text style={styles.required}>*</Text>{" "}
        </Text>
        <TextInput
          style={styles.input}
          value={date}
          onChangeText={(text) => setDate(text)}
          placeholder="dd:mm:yyyy format"
        />
      </View>

      {/* Time */}
      <View style={styles.fieldContainer}>
        <Text>
          Time <Text style={styles.required}>*</Text>{" "}
        </Text>
        <TextInput
          style={styles.input}
          value={time}
          onChangeText={(text) => setTime(text)}
          placeholder="HH:MM AM/PM format"
        />
      </View>

      {/* Caretaker */}
      <View style={styles.fieldContainer}>
        <Text>Caretaker</Text>
        <TextInput
          style={styles.input}
          value={caretaker}
          onChangeText={(text) => setCaretaker(text)}
          placeholder="Enter caretaker name"
        />
      </View>

      {/* Caretaker Number */}
      <View style={styles.fieldContainer}>
        <Text>Caretaker Number</Text>
        <TextInput
          style={styles.input}
          value={caretakerNumber}
          onChangeText={(text) => setCaretakerNumber(text)}
          placeholder="Enter caretaker number"
          keyboardType="numeric"
          maxLength={10}
        />
      </View>

      {/* Submit */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
  },
  required: {
    color: "red",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 5,
  },
  uploadButton: {
    alignItems: "center",
    marginTop: 16,
  },
  uploadedImage: {
    width: 100,
    height: 100,
    margin: 8,
    borderRadius: 5,
  },
  placeholderImage: {
    width: "full",
    height: 100,
    marginBottom: 8,
    borderRadius: 5,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#555",
    fontSize: 16,
  },
  uploadText: {
    color: "#007BFF",
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 16,
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
  },
  additionalImage: {
    display: "flex",
    flexDirection: "row",
  },
  imageContainer: {
    position: "relative",
    marginBottom: 50,
  },
  deleteIcon: {
    position: "absolute",
    bottom: -30,
    right: "23%",
    backgroundColor: "red",
    color: "white",
    padding: 5,
    borderRadius: 5,
  },

  imageContainerMain: {
    marginTop: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteIcon: {
    position: "absolute",
    bottom: -30,
    right: "23%",
    backgroundColor: "red",
    color: "white",
    padding: 5,
    borderRadius: 5,
  },
  deleteIconMain: {
    maxWidth: 110,
    backgroundColor: "red",
    color: "white",
    padding: 5,
    borderRadius: 5,
  },
});
