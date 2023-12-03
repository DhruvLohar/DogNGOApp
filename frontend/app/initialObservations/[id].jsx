import React, { useEffect, useState } from "react";
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
import * as FileSystem from "expo-file-system";
import { useRouter } from "expo-router";
import { useGlobalSearchParams, useNavigation } from "expo-router";
import { axiosRequest } from "../../service/api";

export default function InitialObservations() {
  const navigation = useNavigation();
  const router = useRouter();
  const { id } = useGlobalSearchParams();

  const [dog, setDog] = useState(null);

  const [kennelNumber, setKennelNumber] = useState("");
  const [caseNumber, setCaseNumber] = useState("");
  const [dogName, setDogName] = useState("");
  const [breed, setBreed] = useState("Indian / Mixed Breed");
  const [mainColor, setMainColor] = useState("");
  const [description, setDescription] = useState("");
  const [gender, setGender] = useState("");
  const [aggression, setAggression] = useState("");
  const [kennelPhoto, setKennelPhoto] = useState(null);
  const [additionalPhotos, setAdditionalPhotos] = useState([]);

  //error states
  const [kennelNumberError, setKennelNumberError] = useState("");
  const [dogNameError, setDogNameError] = useState("");
  const [breedError, setBreedError] = useState("");
  const [mainColorError, setMainColorError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [genderError, setGenderError] = useState("");
  const [aggressionError, setAggressionError] = useState("");
  const [kennelPhotoError, setKennelPhotoError] = useState("");

  const navigate = useNavigation();

  //get the dog and set const caseNumber = dog.caseNumber
  useEffect(() => {
    navigation.setOptions({
      title: "Initial Observations",
    });

    axiosRequest(`/dog/${id}/retrieve`, {
      method: "get",
    })
      .then((res) => {
        if (res.data) {
          setDog(res.data);
          setCaseNumber(res.data.caseNumber);
        }
      })
      .catch((err) => {
        if (err.response) {
          alert(JSON.stringify(err.response));
        } else if (err.request) {
          console.log("No response received");
        } else {
          console.log("Error:", err.message);
        }
      });
  }, []);

  const handleKennelPhotoUpload = async () => {
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
        setKennelPhoto(uri);
      }
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
    let errors = {};

    if (!kennelNumber) {
      errors.kennelNumberError = "Please enter a kennel number.";
    }

    // if (!dogName) {
    //     errors.dogNameError = "Please enter dog's name"
    // }

    if (!breed) errors.breedError = "Please enter dog's breed";

    if (!mainColor) {
      errors.mainColorError = "Please select a main color.";
    }

    if (!description) {
      errors.descriptionError = "Please enter a description.";
    }

    if (!gender) {
      errors.genderError = "Please select a gender.";
    }

    if (!aggression) {
      errors.aggressionError = "Please select aggression status.";
    }

    if (!kennelPhoto) {
      errors.kennelPhotoError = "Please upload a kennel photo.";
    }

    setKennelNumberError(errors.kennelNumberError || "");
    // setDogNameError(errors.dogNameError || "")
    setBreedError(errors.breedError || "");
    setMainColorError(errors.mainColorError || "");
    setDescriptionError(errors.descriptionError || "");
    setGenderError(errors.genderError || "");
    setAggressionError(errors.aggressionError || "");
    setKennelPhotoError(errors.kennelPhotoError || "");

    if (Object.keys(errors).length === 0) {
      const formData = new FormData();
      formData.append("kennelId", kennelNumber);
      // formData.append("dogName", dogName);
      formData.append("breed", breed);
      formData.append("mainColor", mainColor);
      formData.append("description", description);
      formData.append("gender", gender);
      formData.append("aggression", aggression);

      const kennelPhotoExt = kennelPhoto.split(".").pop();
      formData.append("kennelPhoto", {
        uri: kennelPhoto,
        type: `image/${kennelPhotoExt}`,
        name: `kennelPhoto.${kennelPhotoExt}`,
      });

      additionalPhotos.forEach((photoUri, index) => {
        let ext = photoUri.split(".").pop();
        formData.append("additionalKennelPhotos[]", {
          uri: photoUri,
          type: `image/${ext}`,
          name: `catcherAdditionalPhoto_${index}.${ext}`,
        });
      });

      axiosRequest(
        `/dog/${id}/initialObservations`,
        {
          method: "post",
          data: formData,
        },
        true
      )
        .then((res) => {
          alert("Initial Observations Noted Successfully!");
          router.back()
        })
        .catch((error) => {
          if (error.response) {
            alert(JSON.stringify(error.response.data.message));
          } else if (error.request) {
            alert("Initial Observations Noted Successfully!");
            router.back()
          } else {
            console.log("Error:", error.message);
          }
        });

      // Reset form fields
      setKennelNumber("");
      setMainColor("");
      setDogName("");
      setBreed("");
      setDescription("");
      setGender("");
      setAggression("");
      setKennelPhoto(null);
      setAdditionalPhotos([]);
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

      {/* Dog Name */}
      {/* <View style={styles.fieldContainer}>
                <Text>
                    Dog's Name <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                    style={styles.input}
                    value={dogName}
                    onChangeText={(text) => setDogName(text)}
                    placeholder="Enter Dog's name"
                />
                <Text style={styles.error}>{dogNameError}</Text>
            </View> */}

      {/* Dog Breed */}
      <View style={styles.fieldContainer}>
        <Text>
          Dog's Breed <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          value={breed}
          onChangeText={(text) => setBreed(text)}
          placeholder="Enter Dog's Breed"
        />
        <Text style={styles.error}>{breedError}</Text>
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
          <Picker.Item label="Black" value="Black" />
          <Picker.Item label="White" value="White" />
          <Picker.Item label="Dark Brown" value="Dark Brown" />
          <Picker.Item label="Light Brown" value="Light Brown" />
          <Picker.Item label="Total Mix" value="Total Mix" />
        </Picker>
        <Text style={styles.error}>{mainColorError}</Text>
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
        <Text style={styles.error}>{descriptionError}</Text>
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
        <Text style={styles.error}>{genderError}</Text>
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
        <Text style={styles.error}>{aggressionError}</Text>
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
              <Text style={styles.placeholderText}>Click Photo</Text>
            </View>
          )}
        </TouchableOpacity>
        <Text style={styles.error}>{kennelPhotoError}</Text>
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
                Click Additional Photos
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
  error: {
    color: "red",
    fontSize: 12,
  },
});
