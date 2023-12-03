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
import * as FileSystem from "expo-file-system";
import { useRouter } from "expo-router";
import { API_URL, axiosRequest } from "../service/api";
const moment = require("moment");

export default function Medicines() {
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

  //error state
  const [kennelNumberError, setKennelNumberError] = useState(null);
  const [dateError, setDateError] = useState(null);
  const [timeError, setTimeError] = useState(null);
  const [arvError, setArvError] = useState(null);
  const [photoError, setPhotoError] = useState(null);
  const [xylazineError, setXylazineError] = useState(null);
  const [dexaError, setDexaError] = useState(null);
  const [melonexError, setMelonexError] = useState(null);
  const [atropineError, setAtropineError] = useState(null);
  const [enrodacError, setEnrodacError] = useState(null);
  const [prednisoloneError, setPrednisoloneError] = useState(null);
  const [ketaminError, setKetaminError] = useState(null);
  const [stadrenError, setStadrenError] = useState(null);
  const [dicrysticinError, setDicrysticinError] = useState(null);
  const [procedureError, setProcedureError] = useState(null);
  const [earNotchedError, setEarNotchedError] = useState(null);
  const [observationsError, setObservationsError] = useState(null);

  // Akshar Changes get dog weight from backend in a useeffect.
  const [weight, setWeight] = useState(10);

  useEffect(() => {
    setTime(formatTime);
  }, []);

  const handleModalOpen = () => {
    let errors = {};

    if (!kennelNumber) {
      errors.kennelNumberError = "Please enter a kennel number.";
    }
    setKennelNumberError(errors.kennelNumberError || "");

    if (kennelNumber) {
      const dog = axiosRequest(
        `/dog/kennel/${kennelNumber}`,
        {
          method: "get",
        },
        false
      )
        .then((res) => {
          setDogModalInfo(res.data);
          setWeight(res.data?.vetDetails?.dogWeight);
          setModalVisible(true);
        })
        .catch((error) => {
          if (error.response) {
            alert(JSON.stringify(error.response));
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

  const handleModalConfirm = async () => {
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
      aspect: [9, 16],
      quality: .6,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;

      const fileInfo = await FileSystem.getInfoAsync(uri);
      const fileSizeInMB = fileInfo.size / (1024 * 1024);
      if (fileSizeInMB > 3) {
        alert("Image size should be less then 3MB.")
      } else {
        setPhoto(uri);
      }
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
    let errors = {};

    if (!kennelNumber) {
      errors.kennelNumberError = "Please enter a kennel number.";
    }

    if (!date) {
      errors.dateError = "Please enter a date.";
    }

    if (!time) {
      errors.timeError = "Please enter a time.";
    }

    if (!arv) {
      errors.arvError = "Please select ARV status.";
    }

    if (!photo) {
      errors.photoError = "Please upload a photo.";
    }

    if (!xylazine) {
      errors.xylazineError = "Please enter Xylazine value.";
    }

    if (!dexa) {
      errors.dexaError = "Please enter Dexa value.";
    }

    if (!melonex) {
      errors.melonexError = "Please enter Melonex value.";
    }

    if (!atropine) {
      errors.atropineError = "Please enter Atropine value.";
    }

    if (!enrodac) {
      errors.enrodacError = "Please enter Enrodac value.";
    }

    if (!prednisolone) {
      errors.prednisoloneError = "Please enter Prednisolone value.";
    }

    if (!ketamin) {
      errors.ketaminError = "Please enter Ketamin value.";
    }

    if (!stadren) {
      errors.stadrenError = "Please enter Stadren value.";
    }

    if (!dicrysticin) {
      errors.dicrysticinError = "Please enter Dicrysticin value.";
    }

    if (!procedure) {
      errors.procedureError = "Please enter Procedure value.";
    }

    if (!earNotched) {
      errors.earNotchedError = "Please enter Ear Notched value.";
    }

    if (!observations) {
      errors.observationsError = "Please enter Observations.";
    }

    setKennelNumberError(errors.kennelNumberError || "");
    setDateError(errors.dateError || "");
    setTimeError(errors.timeError || "");
    setArvError(errors.arvError || "");
    setPhotoError(errors.photoError || "");
    setXylazineError(errors.xylazineError || "");
    setDexaError(errors.dexaError || "");
    setMelonexError(errors.melonexError || "");
    setAtropineError(errors.atropineError || "");
    setEnrodacError(errors.enrodacError || "");
    setPrednisoloneError(errors.prednisoloneError || "");
    setKetaminError(errors.ketaminError || "");
    setStadrenError(errors.stadrenError || "");
    setDicrysticinError(errors.dicrysticinError || "");
    setProcedureError(errors.procedureError || "");
    setEarNotchedError(errors.earNotchedError || "");
    setObservationsError(errors.observationsError || "");

    if (Object.keys(errors).length === 0) {
      // All fields are valid, proceed with submission
      const formData = new FormData();
      const momentObject = moment(date, "MM/DD/YYYY");
      let dateObject;
      if (momentObject.isValid()) {
        dateObject = momentObject.toDate();
      } else {
        errors.dateError = "Please enter a date.";
      }

      const formDataObject = {
        surgeryDate: dateObject,
        arv: arv,
        additionalPhotos: additionalPhotos,
        xylazine: xylazine,
        dexa: dexa,
        melonex: melonex,
        atropine: atropine,
        enrodac: enrodac,
        prednisolone: prednisolone,
        ketamin: ketamin,
        stadren: stadren,
        dicrysticin: dicrysticin,
        procedure: procedure,
        earNotched: earNotched,
        observations: observations,
      };
      formData.append("vetDetails", JSON.stringify(formDataObject));

      const photoExt = photo.split(".").pop();
      formData.append("surgeryPhoto", {
        uri: photo,
        type: `image/${photoExt}`,
        name: `surgeryPhoto.${photoExt}`,
      });

      additionalPhotos.forEach((photo, index) => {
        let ext = photo.split(".").pop();
        formData.append("additionalPhotos[]", {
          uri: photo,
          type: `image/${ext}`,
          name: `vetAdditionalPhoto_${index}.${ext}`,
        });
      });

      axiosRequest(
        `/dog/${dogInfo._id}/update/vet`,
        {
          method: "put",
          data: formData,
        },
        true
      )
        .then((res) => {
          alert("Medicines Details updated successfully");
          setDogInfo(null)
        })
        .catch((error) => {
          if (error.response) {
            alert(JSON.stringify(error.response));
          } else if (error.request) {
            console.log("No response received");
            setDogInfo(null)
          } else {
            console.log("Error:", error.message);
          }
        });
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
    }
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
        <Text style={styles.error}>{kennelNumberError}</Text>
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
                <Image
                  source={{
                    uri:
                      API_URL +
                      "/" +
                      dogModalInfo?.catcherDetails?.spotPhoto?.path,
                  }}
                  style={{ width: 200, height: 200, aspectRatio: 9 / 16 }}
                  resizeMode="contain"
                />
                <Text>Case Number: {dogModalInfo.caseNumber}</Text>
                <Text>Caught on : {dogModalInfo?.createdAt}</Text>
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
            <Text style={styles.error}>{dateError}</Text>
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
            <Text style={styles.error}>{timeError}</Text>
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
            <Text style={styles.error}>{arvError}</Text>
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
                  <Text style={styles.placeholderText}>Click Photo</Text>
                </View>
              )}
            </TouchableOpacity>
            <Text style={styles.error}>{photoError}</Text>
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
                    Click Additional Photos
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
              placeholder={weight + "ml"}
            />
            <Text style={styles.error}>{xylazineError}</Text>
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
              placeholder={weight + "ml"}
            />
            <Text style={styles.error}>{dexaError}</Text>
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
              placeholder={weight + "ml"}
            />
            <Text style={styles.error}>{melonexError}</Text>
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
              placeholder={weight + "ml"}
            />
            <Text style={styles.error}>{atropineError}</Text>
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
              placeholder={weight + "ml"}
            />
            <Text style={styles.error}>{enrodacError}</Text>
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
              placeholder={weight + "ml"}
            />
            <Text style={styles.error}>{prednisoloneError}</Text>
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
              placeholder={weight + "ml"}
            />
            <Text style={styles.error}>{ketaminError}</Text>
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
              placeholder={weight + "ml"}
            />
            <Text style={styles.error}>{stadrenError}</Text>
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
              placeholder={weight + "ml"}
            />
            <Text style={styles.error}>{dicrysticinError}</Text>
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
            <Text style={styles.error}>{procedureError}</Text>
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
            <Text style={styles.error}>{earNotchedError}</Text>
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
            <Text style={styles.error}>{observationsError}</Text>
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
  error: {
    color: "red",
    fontSize: 12,
  },
});
