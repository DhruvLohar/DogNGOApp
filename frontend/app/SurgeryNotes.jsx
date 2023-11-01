import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Modal,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function SurgeryNotes() {
  const [kennelNumber, setKennelNumber] = useState("");
  const [caseNumber, setCaseNumber] = useState("");
  const [date, setDate] = useState(new Date().toLocaleDateString());
  const [time, setTime] = useState(new Date().toLocaleDateString());
  const [photo, setPhoto] = useState(null);
  const [additionalPhotos, setAdditionalPhotos] = useState([]);
  const [notes, setNotes] = useState("");
  const [weight, setWeight] = useState("");
  const [temperature, setTemperature] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [dogInfo, setDogInfo] = useState(null);
  const [dogModalInfo, setDogModalInfo] = useState(null);

  useEffect(() => {
    setTime(formatTime);
  }, []);

  const handleModalOpen = () => {
    // Make API call to retrieve dog's information based on kennelNumber
    const dummyDogData = {
      name: "Max",
      breed: "Labrador",
      age: 5,
    };
    //if from the backend, we find the kennel is empty, we setDogInfo("Not Found") and setDogModalInfo(null)
    setDogModalInfo(dummyDogData);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setDogInfo(null);
    setModalVisible(false);
  };

  const handleModalConfirm = () => {
    // Logic for when user confirms the dog info
    setDogInfo(dogModalInfo);
    setModalVisible(false);
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

  const handlePhotoUpload = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
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
    setPhoto(null);
  };

  const handleSubmit = () => {
    // Validate form fields here
    if (
      !kennelNumber ||
      !caseNumber ||
      !date ||
      !time ||
      !photo ||
      !notes ||
      !weight ||
      !temperature
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    // Handle form submission logic here
    console.log(
      kennelNumber,
      caseNumber,
      date,
      time,
      photo,
      additionalPhotos,
      notes,
      weight,
      temperature
    );

    // Reset form fields
    setKennelNumber("");
    setCaseNumber("");
    setDate(new Date().toLocaleDateString());
    setTime(formatTime());
    setPhoto(null);
    setAdditionalPhotos([]);
    setNotes("");
    setWeight("");
    setTemperature("");
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

      {/* Add logic to open the modal */}
      <TouchableOpacity style={styles.submitButton} onPress={handleModalOpen}>
        <Text style={styles.submitText}>Retrieve Dog Info</Text>
      </TouchableOpacity>

      {/* Dog Info Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleModalClose}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {dogModalInfo ? (
              <View>
                <Text style={styles.modalText}>Dog Information</Text>
                <Text>Name: {dogModalInfo.name}</Text>
                <Text>Breed: {dogModalInfo.breed}</Text>
                <Text>Age: {dogModalInfo.age}</Text>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.confirmButton]}
                    onPress={handleModalConfirm}
                  >
                    <Text style={styles.buttonText}>Yes, Proceed</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={handleModalClose}
                  >
                    <Text style={styles.buttonText}>No, Wrong Kennel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : dogInfo === "Not Found" ? (
              <Text>Kennel is Vacant</Text>
            ) : (
              <Text>Loading dog information...</Text>
            )}
          </View>
        </View>
      </Modal>

      {dogInfo && (
        <View>
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
          {/* Date */}
          <View style={styles.fieldContainer}>
            <Text>
              Date <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={date}
              onChangeText={(text) => setDate(text)}
              placeholder="dd/mm/yyyy format"
            />
          </View>
          {/* Time */}
          <View style={styles.fieldContainer}>
            <Text>
              Time <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={time}
              onChangeText={(text) => setTime(text)}
              placeholder="HH:MM AM/PM format"
            />
          </View>
          {/* Photo */}
          <View style={styles.fieldContainer}>
            <Text>
              Photo <Text style={styles.required}>*</Text>
            </Text>
            {photo && (
              <View style={styles.imageContainerMain}>
                <Image source={{ uri: photo }} style={styles.uploadedImage} />
                <TouchableOpacity onPress={() => handleDeleteMain()}>
                  <Text style={styles.deleteIconMain}>Delete</Text>
                </TouchableOpacity>
              </View>
            )}
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={handlePhotoUpload}
            >
              {photo ? null : (
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
                      <TouchableOpacity
                        onPress={() => handleDeletePhoto(index)}
                      >
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
          {/* Notes */}
          <View style={styles.fieldContainer}>
            <Text>
              Notes <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={notes}
              onChangeText={(text) => setNotes(text)}
              placeholder="Enter notes"
              multiline
              numberOfLines={4}
            />
          </View>
          {/* Weight */}
          <View style={styles.fieldContainer}>
            <Text>
              Weight <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={weight}
              onChangeText={(text) => setWeight(text)}
              placeholder="Enter weight (KG)"
              keyboardType="numeric"
              maxLength={10}
            />
          </View>
          {/* Temperature */}
          <View style={styles.fieldContainer}>
            <Text>
              Temperature <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={temperature}
              onChangeText={(text) => setTemperature(text)}
              placeholder="Enter temperature"
            />
          </View>
          {/* Submit Button */}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitText}>Submit</Text>
          </TouchableOpacity>
        </View>
      )}
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
  modalView: {
    margin: "20%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "column",
    gap: 20,
    width: "100%",
    marginTop: 20,
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    minWidth: 80,
    alignItems: "center",
  },
  confirmButton: {
    backgroundColor: "#007BFF",
  },
  cancelButton: {
    backgroundColor: "red",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});
