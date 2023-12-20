import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Modal,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import * as ImagePicker from "expo-image-picker";
const moment = require("moment");
import { API_URL, axiosRequest } from "../service/api";
import { useNavigation } from "expo-router";
import { getFileSizeFromBase64 } from "../service/getSize";

export default function Day() {
  const navigation = useNavigation();

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

  //error state
  const [kennelError, setKennelError] = useState("");
  const [dateError, setDateError] = useState("");
  const [foodIntakeError, setFoodIntakeError] = useState("");
  const [waterIntakeError, setWaterIntakeError] = useState("");
  const [antibioticsError, setAntibioticsError] = useState("");
  const [painkillerError, setPainkillerError] = useState("");
  const [photoError, setPhotoError] = useState("");

  useEffect(() => {
    navigation.setOptions({
      title: "Daily Treatment",
    });
  }, []);

  const handleModalOpen = () => {
    let errors = {};

    if (!kennel) {
      errors.kennelError = "Please enter a kennel number.";
    }

    setKennelError(errors.kennelError || "");

    if (Object.keys(errors).length === 0) {
      const dog = axiosRequest(
        `/dog/kennel/${kennel}`,
        {
          method: "get",
        },
        false
      )
        .then((res) => {
          setDogModalInfo(res.data);
          setCaseNumber(res?.data?.caseNumber);
          setModalVisible(true);
        })
        .catch((error) => {
          if (error.response) {
            alert(JSON.stringify(error.response.data.error));
          } else if (error.request) {
            console.log("No response received");
          } else {
            console.log("Error:", error.message);
          }
        });
    }
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
    let result;
    if (Platform.OS === "web") {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.addEventListener("change", async (event) => {
        const file = event.target.files[0];
        file["uri"] = URL.createObjectURL(file) 
        if (file) {
          setPhoto(file);
        }
        document.body.removeChild(input);
      });
      document.body.appendChild(input);
      input.click();
    } else {
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        base64: true,
        aspect: [9, 16],
        quality: 0.6,
      });
      if (!result.canceled) {
        const uri = result.assets[0].uri;

        if (getFileSizeFromBase64(result.assets[0].base64) > 3) {
          alert("Image size should be less than 3MB.");
        } else {
          setPhoto({
            uri: uri,
          });
        }
      }
    }
  };

  const handleDeleteMain = () => {
    setPhoto(null);
  };

  const handleSubmit = () => {
    let errors = {};
    const formData = new FormData();

    if (!kennel) {
      errors.kennelError = "Please enter a kennel number.";
    }

    if (!date) {
      errors.dateError = "Please enter a date.";
    }
    const momentObject = moment(date, "DD/MM/YYYY");
    if (momentObject.isValid()) {
      const dateObject = momentObject.toDate();
      formData.append("date", dateObject.toISOString());
    } else {
      errors.dateError = "Please enter a date.";
    }

    if (!foodIntake) {
      errors.foodIntakeError = "Please select food intake.";
    }

    if (!waterIntake) {
      errors.waterIntakeError = "Please select water intake.";
    }

    if (!antibiotics) {
      errors.antibioticsError = "Please select antibiotics status.";
    }

    if (!painkiller) {
      errors.painkillerError = "Please select painkiller status.";
    }

    if (!photo) {
      errors.photoError = "Please upload a photo.";
    }

    setKennelError(errors.kennelError || "");
    setDateError(errors.dateError || "");
    setFoodIntakeError(errors.foodIntakeError || "");
    setWaterIntakeError(errors.waterIntakeError || "");
    setAntibioticsError(errors.antibioticsError || "");
    setPainkillerError(errors.painkillerError || "");
    setPhotoError(errors.photoError || "");

    if (Object.keys(errors).length === 0) {
      // All fields are valid, proceed with submission
      formData.append("foodIntake", foodIntake);
      formData.append("waterIntake", waterIntake);
      formData.append("painkiller", painkiller);
      formData.append("antibiotics", antibiotics);


      if (Platform.OS !== "web") {
        const photoExt = photo.uri.split(".").pop();
        formData.append("photo", {
          uri: photo.uri,
          type: `image/${photoExt}`,
          name: `reportPhoto_${dogInfo._id}.${photoExt}`,
        });
      } else {
        formData.append("photo", photo);
      }

      axiosRequest(
        `/dog/${dogInfo._id}/caretaker/report`,
        {
          method: "post",
          data: formData,
        },
        true
      )
        .then((res) => {
          alert("Daily Report Added successfully");
          setDogInfo(null);
        })
        .catch((error) => {
          if (error.response) {
            alert(JSON.stringify(error.response.data.message));
          } else if (error.request) {
            alert("Daily Report Added successfully");
            setDogInfo(null);
          } else {
            console.log("Error:", error.message);
          }
        });

      // Reset form fields
      // setKennel("");
      // setDate(new Date().toLocaleDateString());
      // setFoodIntake("");
      // setWaterIntake("");
      // setAntibiotics("");
      // setPainkiller("");
      // setPhoto(null);
      // setCaseNumber("");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar style={"dark"} />
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
        <Text style={styles.error}>{kennelError}</Text>
      </View>

      {/* Add logic to open the modal */}
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleModalOpen}
        disabled={!kennel}
      >
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
                <View
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={{
                      uri:
                        API_URL +
                        "/" +
                        dogModalInfo?.catcherDetails?.spotPhoto?.path,
                    }}
                    style={{
                      width: 200,
                      height: 200,
                      aspectRatio: 9 / 16,
                    }}
                    resizeMode="contain"
                  />
                  <Text>Case Number: {dogModalInfo?.caseNumber}</Text>
                  <Text>
                    Caught on :{" "}
                    {moment(dogModalInfo?.createdAt).format("DD/MM/YYYY")}
                  </Text>
                </View>
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
            ) : (
              <View>
                <Text style={{ marginBottom: 15 }}>Kennel is Vacant</Text>
                <TouchableOpacity
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={handleModalClose}
                >
                  <Text style={styles.buttonText}>Choose another Kennel</Text>
                </TouchableOpacity>
              </View>
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
            <Text style={styles.error}>{dateError}</Text>
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
            <Text style={styles.error}>{foodIntakeError}</Text>
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
            <Text style={styles.error}>{waterIntakeError}</Text>
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
            <Text style={styles.error}>{antibioticsError}</Text>
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
            <Text style={styles.error}>{painkillerError}</Text>
          </View>

          {/* Kennel Photo */}
          <View style={styles.fieldContainer}>
            <Text>
              Kennel Photo <Text style={styles.required}>*</Text>
            </Text>
            {photo && (
              <View style={styles.imageContainerMain}>
                <Image source={{ uri: photo.uri }} style={styles.uploadedImage} />
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
                  <Text style={styles.placeholderText}>Click Picture</Text>
                </View>
              )}
            </TouchableOpacity>
            <Text style={styles.error}>{photoError}</Text>
          </View>

          {/* Case Number */}
          <View style={styles.fieldContainer}>
            <Text>
              Case Number <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={caseNumber}
              placeholder={caseNumber}
              editable={false}
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
    marginTop: 0,
    marginBottom: 12,
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
  error: {
    color: "red",
    fontSize: 12,
  },
});
