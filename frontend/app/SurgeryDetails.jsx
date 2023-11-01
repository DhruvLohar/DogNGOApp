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

export default function SurgeryDetails() {
  const [kennelNumber, setKennelNumber] = useState("");
  const [date, setDate] = useState(new Date().toLocaleDateString());
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [arv, setArv] = useState("");
  const [additionalPhotos, setAdditionalPhotos] = useState([]);
  const [photo, setPhoto] = useState(null);
  const [xylazine, setXylazine] = useState("");
  const [dexa, setDexa] = useState("");
  const [melonex, setMelonex] = useState("");
  const [atropine, setAtropine] = useState("");
  const [enrodac, setEnrodac] = useState("");
  const [prednisolone, setPrednisolone] = useState("");
  const [ketamin, setKetamin] = useState("");
  const [stadren, setStadren] = useState("");
  const [dicrysticin, setDicrysticin] = useState("");
  const [procedure, setProcedure] = useState("");
  const [earNotched, setEarNotched] = useState("");
  const [observations, setObservations] = useState("");
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

  const handlephotoUpload = async () => {
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

  const handleDeletePhoto = (index) => {
    const updatedPhotos = [...additionalPhotos];
    updatedPhotos.splice(index, 1);
    setAdditionalPhotos(updatedPhotos);
  };

  const handleSubmit = () => {
    // Validate form fields here
    if (
      !kennelNumber ||
      !date ||
      !time ||
      !arv ||
      !photo ||
      !xylazine ||
      !dexa ||
      !melonex ||
      !atropine ||
      !enrodac ||
      !prednisolone ||
      !ketamin ||
      !stadren ||
      !dicrysticin ||
      !procedure ||
      !earNotched ||
      !observations
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    // Handle form submission logic here
    console.log(
      kennelNumber,
      date,
      time,
      arv,
      photo,
      additionalPhotos,
      xylazine,
      dexa,
      melonex,
      atropine,
      enrodac,
      prednisolone,
      ketamin,
      stadren,
      dicrysticin,
      procedure,
      earNotched,
      observations
    );

    // Reset form fields
    setKennelNumber("");
    setDate(new Date().toLocaleDateString());
    setTime(formatTime());
    setArv("");
    setPhoto(null);
    setAdditionalPhotos([]);
    setXylazine("");
    setDexa("");
    setMelonex("");
    setAtropine("");
    setEnrodac("");
    setPrednisolone("");
    setKetamin("");
    setStadren("");
    setDicrysticin("");
    setProcedure("");
    setEarNotched("");
    setObservations("");
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

          {/* ARV */}
          <View style={styles.fieldContainer}>
            <Text>
              ARV <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.radio}>
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => setArv("yes")}
              >
                <Text>Yes</Text>
                <View
                  style={[
                    styles.radioCircle,
                    { backgroundColor: arv === "yes" ? "#007BFF" : "#ccc" },
                  ]}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => setArv("no")}
              >
                <Text>No</Text>
                <View
                  style={[
                    styles.radioCircle,
                    { backgroundColor: arv === "no" ? "#007BFF" : "#ccc" },
                  ]}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Photo */}
          <View style={styles.fieldContainer}>
            <Text>
              Photo <Text style={styles.required}>*</Text>{" "}
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
              onPress={handlephotoUpload}
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

          {/* Xylazine */}
          <View style={styles.fieldContainer}>
            <Text>
              Xylazine <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={xylazine}
              onChangeText={(text) => setXylazine(text)}
              placeholder="Xylazine value"
            />
          </View>

          {/* Dexa */}
          <View style={styles.fieldContainer}>
            <Text>
              Dexa <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={dexa}
              onChangeText={(text) => setDexa(text)}
              placeholder="Dexa value"
            />
          </View>

          {/* Melonex */}
          <View style={styles.fieldContainer}>
            <Text>
              Melonex <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={melonex}
              onChangeText={(text) => setMelonex(text)}
              placeholder="Melonex value"
            />
          </View>

          {/* Atropine */}
          <View style={styles.fieldContainer}>
            <Text>
              Atropine <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={atropine}
              onChangeText={(text) => setAtropine(text)}
              placeholder="Atropine value"
            />
          </View>

          {/* Enrodac */}
          <View style={styles.fieldContainer}>
            <Text>
              Enrodac <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={enrodac}
              onChangeText={(text) => setEnrodac(text)}
              placeholder="Enrodac value"
            />
          </View>

          {/* Prednisolone */}
          <View style={styles.fieldContainer}>
            <Text>
              Prednisolone <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={prednisolone}
              onChangeText={(text) => setPrednisolone(text)}
              placeholder="Prednisolone value"
            />
          </View>

          {/* Ketamin */}
          <View style={styles.fieldContainer}>
            <Text>
              Ketamin <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={ketamin}
              onChangeText={(text) => setKetamin(text)}
              placeholder="Ketamin value"
            />
          </View>

          {/* Stadren */}
          <View style={styles.fieldContainer}>
            <Text>
              Stadren <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={stadren}
              onChangeText={(text) => setStadren(text)}
              placeholder="Stadren value"
            />
          </View>

          {/* Dicrysticin */}
          <View style={styles.fieldContainer}>
            <Text>
              Dicrysticin <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={dicrysticin}
              onChangeText={(text) => setDicrysticin(text)}
              placeholder="Dicrysticin value"
            />
          </View>

          {/* Procedure */}
          <View style={styles.fieldContainer}>
            <Text>
              Procedure <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={procedure}
              onChangeText={(text) => setProcedure(text)}
              placeholder="Procedure value"
            />
          </View>

          {/* Ear Notched */}
          <View style={styles.fieldContainer}>
            <Text>
              Ear Notched <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={earNotched}
              onChangeText={(text) => setEarNotched(text)}
              placeholder="Ear Notched value"
            />
          </View>

          {/* Observations */}
          <View style={styles.fieldContainer}>
            <Text>
              Observations <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={observations}
              onChangeText={(text) => setObservations(text)}
              placeholder="Observations"
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
    marginBottom: 16,
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
