import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ScrollView,
  Image,
} from "react-native";
import { StatusBar } from 'expo-status-bar';
import DateTimePicker from "@react-native-community/datetimepicker";
import { API_URL, axiosRequest, getAccessToken } from "../service/api";
import * as FileSystem from "expo-file-system";
import { shareAsync } from "expo-sharing";
import axios from "axios";

const DogCard = ({ caseNumber, dogName, photoUrl, onDownloadReport }) => {
  return (
    <View style={cardStyles.cardContainer}>
      <Image source={{ uri: photoUrl }} style={cardStyles.photo} />
      <View style={cardStyles.detailsContainer}>
        <Text style={cardStyles.caseNumber}>Case Number: {caseNumber}</Text>
        <Text style={cardStyles.dogName}>Dog's Name: {dogName}</Text>
      </View>
      <TouchableOpacity
        style={cardStyles.downloadButton}
        onPress={onDownloadReport}
      >
        <Text style={cardStyles.buttonText}>Download Report</Text>
      </TouchableOpacity>
    </View>
  );
};

const Report = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const [dogs, setDogs] = useState([]);
  const [currPage, setCurrPage] = useState(0)

  const isWeb = Platform.OS === "web";

  const handleStartDateChange = (event, selectedDate) => {
    setShowStartDatePicker(Platform.OS === "ios");
    const currentDate =
      selectedDate || new Date(event.target.value) || startDate;
    setStartDate(currentDate);
  };

  const handleEndDateChange = (event, selectedDate) => {
    setShowEndDatePicker(Platform.OS === "ios");
    const currentDate = selectedDate || new Date(event.target.value) || endDate;
    // Check if the selected end date is not earlier than the start date
    if (currentDate < startDate) {
      alert("End Date cannot be earlier than Start Date");
    } else {
      setEndDate(currentDate);
    }
  };

  const showStartDatePickerModal = () => {
    setShowStartDatePicker(true);
  };

  const showEndDatePickerModal = () => {
    setShowEndDatePicker(true);
  };

  const formatDateString = (date) => {
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const save = async (uri, filename, mimetype) => {
    if (!isWeb) {
      const permissions =
        await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (permissions.granted) {
        const base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        await FileSystem.StorageAccessFramework.createFileAsync(
          permissions.directoryUri,
          filename,
          mimetype
        )
          .then(async (uri) => {
            await FileSystem.writeAsStringAsync(uri, base64, {
              encoding: FileSystem.EncodingType.Base64,
            });
          })
          .catch((e) => console.log(e));
      } else {
        shareAsync(uri);
      }
    } else {
      shareAsync(uri);
    }
  };

  const downloadReport = async (dogs) => {
    try {
      const token = await getAccessToken();
      const dogIds = dogs.flat().map((dog) => dog._id).join(",");
      const url = API_URL + `/dog/generate/report/${dogIds}/xlsx/`;
      const header = {
        Authorization: token,
      };
      const filename = `Dogs Report (${startDate.toDateString()} - ${endDate.toDateString()}).xlsx`;

      if (isWeb) {
        const res = await axios.get(url, {
          headers: header,
          responseType: "blob",
        });

        const blob = new Blob([res.data], {
          type: res.headers["Content-Type"],
        });

        // Create a download link and trigger download
        const downloadLink = document.createElement("a");
        downloadLink.href = window.URL.createObjectURL(blob);
        downloadLink.download = filename;

        // Append the anchor element to the body and trigger the download
        document.body.appendChild(downloadLink);
        downloadLink.click();

        // Clean up: Remove the anchor element
        document.body.removeChild(downloadLink);
      } else {
        const res = await FileSystem.downloadAsync(
          url,
          FileSystem.documentDirectory + filename,
          {
            headers: header,
          }
        );

        save(res.uri, filename, res.headers["Content-Type"]);
      }
    } catch (err) {
      console.log("Smmthn went wrong : " + err.message);
    }
  };

  const chunk = (arr, size) => {
    return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
      arr.slice(i * size, i * size + size)
    );
  }

  const handleSubmit = () => {
    if (startDate && endDate) {
      axiosRequest(
        "/dog/report/xlsx",
        {
          method: "post",
          data: {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
          },
        },
        false
      )
        .then((res) => {
          let dogs_chunks = chunk(res.data, 10); 
          setDogs(dogs_chunks);
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

  return (
    <>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <View style={styles.dateContainer}>
          <Text style={styles.heading} onPress={showStartDatePickerModal}>
            Start Date : {formatDateString(startDate)}
          </Text>

          {isWeb && (
            <input
              type="date"
              value={startDate.toISOString().split("T")[0]}
              onChange={handleStartDateChange}
              name="startDate"
              id="startDate"
            />
          )}
          {!isWeb && showStartDatePicker && (
            <DateTimePicker
              value={startDate}
              mode="date"
              display="default"
              onChange={handleStartDateChange}
            />
          )}
        </View>
        <View style={styles.dateContainer}>
          <Text style={styles.heading} onPress={showEndDatePickerModal}>
            End Date : {formatDateString(endDate)}
          </Text>
          {isWeb && (
            <input
              type="date"
              value={endDate.toISOString().split("T")[0]}
              onChange={handleEndDateChange}
              name="endDate"
              id="endDate"
            />
          )}
          {!isWeb && showEndDatePicker && (
            <DateTimePicker
              value={endDate}
              mode="date"
              display="default"
              onChange={handleEndDateChange}
            />
          )}
        </View>
        <TouchableOpacity onPress={handleSubmit} style={styles.button}>
          <Text style={styles.buttonText}>Generate Report</Text>
        </TouchableOpacity>

        {dogs.length > 0 ? (
          <View style={{ width: "85%", marginTop: 20, maxHeight: "64%" }}>
            <Text style={{ fontSize: 20, marginBottom: 10 }}>
              Dogs Found :{" "}
            </Text>
            <ScrollView>
              {dogs[currPage]?.map((dog, idx) => (
                <View key={idx} style={styles.dogContainer}>
                  <Image
                    source={{
                      uri: API_URL + "/" + dog?.dogImage,
                    }}
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 50,
                      marginBottom: 20,
                    }}
                  />
                  <View>
                    <Text>Case Number:</Text>
                    <Text> {dog.caseNumber}</Text>
                  </View>
                  {/* <Text>Dog's Name: {dog.dogName}</Text> */}
                </View>
              ))}
            </ScrollView>
            <View style={{ justifyContent: "center", alignItems: "center", flexDirection: "row", gap: 30, marginTop: 20 }}>
              {Array.from({ length: dogs.length }).map((_, idx) => (
                <TouchableOpacity key={idx} style={[(idx === currPage) && paginationStyles.activePage]} onPress={() => setCurrPage(idx)}>
                  <Text style={[{ fontSize: 24 }, (idx === currPage) && paginationStyles.activePagetext]}>{idx + 1}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={() => downloadReport(dogs)}
            >
              <Text style={{color: "white"}}>Generate and Download Report</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  dateContainer: {
    marginBottom: 20,
    marginTop: 20,
  },
  heading: {
    fontSize: 20,
    marginBottom: 10,
    textDecorationLine: "underline",
    color: "#007BFF",
  },
  button: {
    padding: 10,
    fontSize: 16,
    backgroundColor: "#007BFF",
    borderRadius: 5,
    marginTop: 20,
    marginBottom: 20,
  },
  buttonText: {
    color: "white",
  },
  dogContainer: {
    marginBottom: 20,
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#CCC",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    gap: 2,
  },
  releaseButton: {
    backgroundColor: "#DC3545",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginTop: 10,
  },
});

const cardStyles = StyleSheet.create({
  cardContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    margin: 10,
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 10,
  },
  caseNumber: {
    fontSize: 16,
    fontWeight: "bold",
  },
  dogName: {
    fontSize: 14,
  },
  downloadButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
  },
});

const paginationStyles = StyleSheet.create({
  activePage: {
    width: 40, height: 40,
    justifyContent: "center", alignItems: "center",
    fontWeight: "bold",
    borderRadius: 30,
    backgroundColor: "#007BFF",
    // padding: 2,
  },
  activePagetext: {
    textAlign: "center",
    color: "white",
  }
})

export default Report;
