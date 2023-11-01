import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Modal,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function Day() {
  const [kennel, setKennel] = useState("");
  const [date, setDate] = useState(new Date().toLocaleDateString());
  const [foodIntake, setFoodIntake] = useState("");
  const [waterIntake, setWaterIntake] = useState("");
  const [antibiotics, setAntibiotics] = useState("");
  const [painkiller, setPainkiller] = useState("");
  const [photo, setPhoto] = useState(null);
  const [caseNumber, setCaseNumber] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [dogInfo, setDogInfo] = useState(null);
  const [dogModalInfo, setDogModalInfo] = useState(null);

  const handleModalOpen = () => {
    // Implement API call to retrieve dog's information based on kennelNumber
    const dummyDogData = {
      name: "Max",
      breed: "Labrador",
      age: 5,
    };
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

  const handleDeleteMain = () => {
    setPhoto(null);
  };

  const handleSubmit = () => {
    // Validate form fields here
    if (
      !kennel ||
      !date ||
      !foodIntake ||
      !waterIntake ||
      !antibiotics ||
      !painkiller ||
      !photo ||
      !caseNumber
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    // Handle form submission logic here
    console.log(
      kennel,
      date,
      foodIntake,
      waterIntake,
      painkiller,
      antibiotics,
      photo,
      caseNumber
    );
    // For example, you can send the data to a server or perform any other action
    // console.log(kennel, date, foodIntake, waterIntake, antibiotics, painkiller, photo, caseNumber);
    // Reset form fields
    setKennel("");
    setDate(new Date().toLocaleDateString());
    setFoodIntake("");
    setWaterIntake("");
    setAntibiotics("");
    setPainkiller("");
    setPhoto(null);
    setCaseNumber("");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Kennel */}
      <View style={styles.fieldContainer}>
        <Text>
          Kennel <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          value={kennel}
          onChangeText={(text) => setKennel(text)}
          placeholder="Enter kennel No."
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
          {/* Date */}
          <View style={styles.fieldContainer}>
            <Text>
              Date <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={date}
              onChangeText={(text) => setDate(text)}
              placeholder="dd/mm/yyyy Format"
            />
          </View>

          {/* Food Intake */}
          <View style={styles.fieldContainer}>
            <Text>
              Food Intake <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.radio}>
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => setFoodIntake("yes")}
              >
                <Text>Yes</Text>
                <View
                  style={[
                    styles.radioCircle,
                    {
                      backgroundColor:
                        foodIntake === "yes" ? "#007BFF" : "#ccc",
                    },
                  ]}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => setFoodIntake("no")}
              >
                <Text>No</Text>
                <View
                  style={[
                    styles.radioCircle,
                    {
                      backgroundColor: foodIntake === "no" ? "#007BFF" : "#ccc",
                    },
                  ]}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Water Intake */}
          <View style={styles.fieldContainer}>
            <Text>
              Water Intake <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.radio}>
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => setWaterIntake("yes")}
              >
                <Text>Yes</Text>
                <View
                  style={[
                    styles.radioCircle,
                    {
                      backgroundColor:
                        waterIntake === "yes" ? "#007BFF" : "#ccc",
                    },
                  ]}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => setWaterIntake("no")}
              >
                <Text>No</Text>
                <View
                  style={[
                    styles.radioCircle,
                    {
                      backgroundColor:
                        waterIntake === "no" ? "#007BFF" : "#ccc",
                    },
                  ]}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Antibiotics */}
          <View style={styles.fieldContainer}>
            <Text>
              Antibiotics <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.radio}>
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => setAntibiotics("yes")}
              >
                <Text>Yes</Text>
                <View
                  style={[
                    styles.radioCircle,
                    {
                      backgroundColor:
                        antibiotics === "yes" ? "#007BFF" : "#ccc",
                    },
                  ]}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => setAntibiotics("no")}
              >
                <Text>No</Text>
                <View
                  style={[
                    styles.radioCircle,
                    {
                      backgroundColor:
                        antibiotics === "no" ? "#007BFF" : "#ccc",
                    },
                  ]}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Painkiller */}
          <View style={styles.fieldContainer}>
            <Text>
              Painkiller <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.radio}>
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => setPainkiller("yes")}
              >
                <Text>Yes</Text>
                <View
                  style={[
                    styles.radioCircle,
                    {
                      backgroundColor:
                        painkiller === "yes" ? "#007BFF" : "#ccc",
                    },
                  ]}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => setPainkiller("no")}
              >
                <Text>No</Text>
                <View
                  style={[
                    styles.radioCircle,
                    {
                      backgroundColor: painkiller === "no" ? "#007BFF" : "#ccc",
                    },
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
  required: {
    color: "red",
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
