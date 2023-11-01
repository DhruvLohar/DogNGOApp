import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";

export default function InitialObservations() {
  const [kennelNumber, setKennelNumber] = useState("");
  const [caseNumber, setCaseNumber] = useState("");
  const [mainColor, setMainColor] = useState("");
  const [description, setDescription] = useState("");
  const [gender, setGender] = useState("");
  const [aggression, setAggression] = useState("");
  const [kennelPhoto, setKennelPhoto] = useState(null);
  const [additionalPhotos, setAdditionalPhotos] = useState([]);

  const handleKennelPhotoUpload = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setKennelPhoto(result.assets[0].uri);
    }
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

  const handleDeleteMain = () => {
    setKennelPhoto(null);
  };

  const handleSubmit = () => {
    // Validate form fields here
    if (
      !kennelNumber ||
      !caseNumber ||
      !mainColor ||
      !description ||
      !gender ||
      !aggression ||
      !kennelPhoto
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    // Handle form submission logic here
    console.log(
      kennelNumber,
      caseNumber,
      mainColor,
      description,
      gender,
      aggression,
      kennelPhoto,
      additionalPhotos
    );

    // Reset form fields
    setKennelNumber("");
    setCaseNumber("");
    setMainColor("");
    setDescription("");
    setGender("");
    setAggression("");
    setKennelPhoto(null);
    setAdditionalPhotos([]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Kennel Number */}
      <View style={styles.fieldContainer}>
        <Text>
          Kennel Number <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          value={kennelNumber}
          onChangeText={(text) => setKennelNumber(text)}
          placeholder="Enter kennel number"
        />
      </View>

      {/* Case Number */}
      <View style={styles.fieldContainer}>
        <Text>
          Case Number <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          value={caseNumber}
          onChangeText={(text) => setCaseNumber(text)}
          placeholder="Enter case number"
        />
      </View>

      {/* Main Color */}
      <View style={styles.fieldContainer}>
        <Text>
          Main Color <Text style={styles.required}>*</Text>
        </Text>
        <Picker
          selectedValue={mainColor}
          onValueChange={(itemValue) => setMainColor(itemValue)}
        >
          <Picker.Item label="Select Color" value="" />
          <Picker.Item label="Black" value="BL" />
          <Picker.Item label="White" value="WH" />
          <Picker.Item label="Dark Brown" value="DB" />
          <Picker.Item label="Light Brown" value="LB" />
          <Picker.Item label="Total Mix" value="TM" />
        </Picker>
      </View>

      {/* Description */}
      <View style={styles.fieldContainer}>
        <Text>
          Description <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          value={description}
          onChangeText={(text) => setDescription(text)}
          placeholder="Enter description"
          multiline
          numberOfLines={4}
        />
      </View>

      {/* Gender */}
      <View style={styles.fieldContainer}>
        <Text>
          Gender <Text style={styles.required}>*</Text>
        </Text>
        <View style={styles.radio}>
          <TouchableOpacity
            style={styles.radioOption}
            onPress={() => setGender("male")}
          >
            <Text>Male</Text>
            <View
              style={[
                styles.radioCircle,
                { backgroundColor: gender === "male" ? "#007BFF" : "#ccc" },
              ]}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.radioOption}
            onPress={() => setGender("female")}
          >
            <Text>Female</Text>
            <View
              style={[
                styles.radioCircle,
                { backgroundColor: gender === "female" ? "#007BFF" : "#ccc" },
              ]}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Aggression */}
      <View style={styles.fieldContainer}>
        <Text>
          Aggression <Text style={styles.required}>*</Text>
        </Text>
        <View style={styles.radio}>
          <TouchableOpacity
            style={styles.radioOption}
            onPress={() => setAggression("yes")}
          >
            <Text>Yes</Text>
            <View
              style={[
                styles.radioCircle,
                { backgroundColor: aggression === "yes" ? "#007BFF" : "#ccc" },
              ]}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.radioOption}
            onPress={() => setAggression("no")}
          >
            <Text>No</Text>
            <View
              style={[
                styles.radioCircle,
                { backgroundColor: aggression === "no" ? "#007BFF" : "#ccc" },
              ]}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Kennel Photo */}
      <View style={styles.fieldContainer}>
        <Text>
          Kennel Photo <Text style={styles.required}>*</Text>
        </Text>
        {kennelPhoto && (
          <View style={styles.imageContainerMain}>
            <Image source={{ uri: kennelPhoto }} style={styles.uploadedImage} />
            <TouchableOpacity onPress={() => handleDeleteMain()}>
              <Text style={styles.deleteIconMain}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={handleKennelPhotoUpload}
        >
          {kennelPhoto ? null : (
            <View style={styles.placeholderImage}>
              <Text style={styles.placeholderText}>Upload Photo</Text>
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

      {/* Submit Button */}
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
  radio: {
    display: "flex",
    flexDirection: "row",
    gap: 25,
    marginTop: 10,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    display: "flex",
    flexDirection: "row-reverse",
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#007BFF",
    marginRight: 8,
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
  additionalImage: {
    display: "flex",
    flexDirection: "row",
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
