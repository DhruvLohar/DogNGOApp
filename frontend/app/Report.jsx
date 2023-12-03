import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, ScrollView, Image } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { API_URL, axiosRequest, getAccessToken } from '../service/api';
import * as FileSystem from 'expo-file-system';
import { shareAsync } from 'expo-sharing';

const DogCard = ({ caseNumber, dogName, photoUrl, onDownloadReport }) => {
  return (
    <View style={cardStyles.cardContainer}>
      <Image source={{ uri: photoUrl }} style={cardStyles.photo} />
      <View style={cardStyles.detailsContainer}>
        <Text style={cardStyles.caseNumber}>Case Number: {caseNumber}</Text>
        <Text style={cardStyles.dogName}>Dog's Name: {dogName}</Text>
      </View>
      <TouchableOpacity style={cardStyles.downloadButton} onPress={onDownloadReport}>
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

  const [dogs, setDogs] = useState([])

  const handleStartDateChange = (event, selectedDate) => {
    setShowStartDatePicker(Platform.OS === 'ios');
    const currentDate = selectedDate || startDate;
    setStartDate(currentDate);
  };

  const handleEndDateChange = (event, selectedDate) => {
    setShowEndDatePicker(Platform.OS === 'ios');
    const currentDate = selectedDate || endDate;
    // Check if the selected end date is not earlier than the start date
    if (currentDate < startDate) {
      // Display an alert
      alert('End Date cannot be earlier than Start Date');
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
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const dummyData = [
    {
      "caseNumber": "123-ABC-456",
      "dogName": "Buddy",
      "photoUrl": "https://example.com/buddy.jpg"
    },
    {
      "caseNumber": "789-XYZ-012",
      "dogName": "Charlie",
      "photoUrl": "https://example.com/charlie.jpg"
    },
    {
      "caseNumber": "456-PQR-789",
      "dogName": "Max",
      "photoUrl": "https://example.com/max.jpg"
    },
    {
      "caseNumber": "321-LMN-654",
      "dogName": "Lucy",
      "photoUrl": "https://example.com/lucy.jpg"
    }
  ];

  const save = async (uri, filename, mimetype) => {
    if (Platform.OS === "android") {
      const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (permissions.granted) {
        const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
        await FileSystem.StorageAccessFramework.createFileAsync(permissions.directoryUri, filename, mimetype)
          .then(async (uri) => {
            await FileSystem.writeAsStringAsync(uri, base64, { encoding: FileSystem.EncodingType.Base64 });
          })
          .catch(e => console.log(e));
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
      const dogIds = dogs.map(dog => dog._id).join(',');
      const filename = `Dogs Report (${new Date().toString()}).xlsx`
  
      const res = await FileSystem.downloadAsync(
        API_URL + `/dog/generate/report/${dogIds}/xlsx/`,
        FileSystem.documentDirectory + filename,
        {
          headers: {
            Authorization: token
          }
        }
      )
  
      save(res.uri, filename, res.headers["Content-Type"])
    } catch (err) {
      console.log("Smmthn went wrong : " + err.message);
    }
  }

  const handleSubmit = () => {
    if (startDate && endDate) {
      axiosRequest("/dog/report/xlsx", {
        method: "post",
        data: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        }
      }, false)
        .then(res => {
          setDogs(res.data)
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
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.dateContainer}>
          <Text style={styles.heading} onPress={showStartDatePickerModal}>
            Start Date : {formatDateString(startDate)}
          </Text>
          {showStartDatePicker && (
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
          {showEndDatePicker && (
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
          <View style={{ width: "85%", marginTop: 20 }}>
            <Text style={{ fontSize: 20, marginBottom: 10 }}>Dogs Found : </Text>
            {dogs?.map((dog, idx) => (
              <View key={idx} style={styles.dogContainer}>
                <Image
                  source={{ uri: API_URL + '/' + dog?.catcherDetails?.spotPhoto?.path }}
                  style={{ width: 100, height: 100, borderRadius: 50, marginBottom: 20 }}
                />
                <Text>Case Number: {dog.caseNumber}</Text>
                {/* <Text>Dog's Name: {dog.dogName}</Text> */}
              </View>
            ))}
            <TouchableOpacity
              style={styles.button}
              onPress={() => downloadReport(dogs)}
            >
              <Text>Generate and Download Report</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateContainer: {
    marginBottom: 20,
    marginTop: 20
  },
  heading: {
    fontSize: 20,
    marginBottom: 10,
    textDecorationLine: 'underline',
    color: '#007BFF',
  },
  button: {
    padding: 10,
    fontSize: 16,
    backgroundColor: '#007BFF',
    color: 'white',
    borderRadius: 5,
    marginTop: 20,
    marginBottom: 20
  },
  buttonText: {
    color: 'white',
  },
  dogContainer: {
    marginBottom: 20,
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#CCC",
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
    borderColor: '#ddd',
    borderRadius: 8,
    margin: 10,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    fontWeight: 'bold',
  },
  dogName: {
    fontSize: 14,
  },
  downloadButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default Report;
