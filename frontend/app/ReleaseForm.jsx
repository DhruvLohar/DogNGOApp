import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet, Image, ScrollView } from "react-native";
import { StatusBar } from 'expo-status-bar';
import { API_URL, axiosRequest } from "../service/api";
import { toFormData } from "axios";
import * as Location from "expo-location";

const ReleaseForm = () => {
  const [releasableDogs, setReleasableDogs] = useState([])
  const [dispatchableDogs, setDispatchableDogs] = useState([])

  const [selectedKennels, setSelectedKennels] = useState([]);
  const [releasedKennels, setReleasedKennels] = useState([]);
  const [showReleaseSheet, setShowReleaseSheet] = useState(false);

  const [releaseLocation, setReleaseLocation] = useState("")

  const handleKennelPress = (kennel) => {
    if (selectedKennels.includes(kennel)) {
      setSelectedKennels(selectedKennels.filter((item) => item !== kennel));
    } else {
      setSelectedKennels([...selectedKennels, kennel]);
    }
  };

  const handleReleaseKennelPress = (kennel) => {
    if (releasedKennels.includes(kennel)) {
      setReleasedKennels(releasedKennels.filter((item) => item !== kennel));
    } else {
      setReleasedKennels([...releasedKennels, kennel]);
    }
  };

  const catchLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

    // Make a request to the Geocoding API
    const apiKey = "AIzaSyBjfILytDucr1FHSAOwR4pwDHuY4Q9D8C4";
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
    );

    const data = await response.json();
    if (data.results && data.results.length > 0) {
      // Assuming the first result contains the region information
      const region = data.results[0].formatted_address;
      setReleaseLocation(region);
      return region;
    }
  }

  const handleRelease = async (dog) => {
    // setReleasedKennels((prev) => prev.filter((kennel) => kennel !== dog));

    const region = await catchLocation();
    console.log(region)

    if (releasedKennels.length > 0) {
      releasedKennels.map(dogId => {
        axiosRequest(
          `/dog/${dogId}/release`,
          {
            method: "post",
            data: { releaseLocation: region || "Cannot track the release location" }
          },
          false
        )
        .then((res) => {
            refreshDogs();
          })
          .catch((error) => {
            if (error.response) {
              alert(JSON.stringify(error.response));
            } else if (error.request) {
              refreshDogs();
            } else {
              console.log("Error:", error.message);
            }
          });
      })
      alert("Dogs were released.")
    } else {
      alert("No dogs selected")
    }

  };

  const refreshDogs = () => {
    axiosRequest(
      "/dog/dispatchable",
      {
        method: "get",
      },
      false
    )
      .then((res) => {
        setDispatchableDogs(res.data);
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

    axiosRequest(
      "/dog/releasable",
      {
        method: "get",
      },
      false
    )
      .then((res) => {
        setReleasableDogs(res.data);
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

  useEffect(() => {
    refreshDogs();
  }, [])

  const handleSubmit = () => {
    if (selectedKennels.length > 0) {
      selectedKennels.map(dog => {
        axiosRequest(
          `/dog/${dog}/dispatch`,
          {
            method: "post",
          },
          false
        )
          .then((res) => {
            refreshDogs();
          })
          .catch((error) => {
            if (error.response) {
              alert(JSON.stringify(error.response));
            } else if (error.request) {
              console.log("No response received");
              refreshDogs();
            } else {
              console.log("Error:", error.message);
            }
          });
      })
      alert('Release Sheet updated.')
    } else {
      alert("No dogs selected.")
    }
  };

  return (
    <ScrollView>
      <StatusBar style="dark" />
      <View style={styles.container}>
        {dispatchableDogs.length > 0 ? (
          <>
            {dispatchableDogs.map((dog, idx) => (
              <TouchableOpacity
                key={dog._id}
                style={[{
                  borderColor: "grey",
                  borderWidth: 2,
                  borderRadius: 10,
                  padding: 10,
                  marginBottom: 10,
                  alignItems: "center",
                  width: "100%"
                },
                selectedKennels.includes(dog._id) && styles.selectedKennelContainer,
                ]}
                onPress={() => handleKennelPress(dog._id)}
              >
                <View style={{ marginBottom: 10 }}>
                  <Image
                    source={{
                      uri: API_URL + "/" + dog?.catcherDetails?.spotPhoto?.path,
                    }}
                    style={{ width: 200, height: 200, aspectRatio: 9 / 16, objectFit: "contain" }}
                  />
                </View>
                <Text style={{ fontWeight: "bold", fontSize: 14 }}>
                  Kennel ID: {dog?.kennel?.kennelId}
                </Text>
                <Text style={{ fontWeight: "bold", fontSize: 14 }}>
                  Case Number: {dog?.caseNumber}
                </Text>
              </TouchableOpacity>
            ))}
          </>
        ) : (<Text>No Dispatchable dogs found.</Text>)}
        <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
          <Text>Dispatch Dogs</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.releaseSheetButton}
          onPress={() => setShowReleaseSheet((prev) => !prev)}
        >
          <Text>Show Release Sheet</Text>
        </TouchableOpacity>
        {showReleaseSheet && (
          <Modal animationType="slide" transparent={false} visible={true}>
            <View style={styles.releaseSheet}>
              {releasableDogs.length > 0 ? (
                <>
                  {releasableDogs.map((dog) => (
                    <TouchableOpacity
                      key={dog._id}
                      style={[{
                        borderColor: "grey",
                        borderWidth: 2,
                        borderRadius: 10,
                        padding: 10,
                        marginBottom: 10,
                        alignItems: "center",
                        width: "80%"
                      },
                      releasedKennels.includes(dog._id) && styles.selectedKennelContainer,
                      ]}
                      onPress={() => handleReleaseKennelPress(dog._id)}
                    >
                      <View style={{ marginBottom: 10 }}>
                        <Image
                          source={{
                            uri: API_URL + "/" + dog?.catcherDetails?.spotPhoto?.path,
                          }}
                          style={{ width: 200, height: 200, aspectRatio: 9 / 16, objectFit: "contain" }}
                        />
                      </View>
                      <Text style={{ fontWeight: "bold", fontSize: 14 }}>
                        Kennel ID: {dog?.kennel?.kennelId}
                      </Text>
                      <Text style={{ fontWeight: "bold", fontSize: 14 }}>
                        Case Number: {dog?.caseNumber}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </>
              ) : (<Text>No dogs found.</Text>)}
              <TouchableOpacity
                onPress={() => handleRelease()}
                style={[styles.closeButton, { backgroundColor: "#FF0000" }]}
              >
                <Text style={{ color: "white" }}>Release Selected Dogs</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setShowReleaseSheet(false)}
                style={styles.closeButton}
              >
                <Text>Close</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        )}
      </View>
    </ScrollView>
  );
};

export default ReleaseForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5F5F5",
  },
  kennelContainer: {
    marginBottom: 20,
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#CCC",
  },
  selectedKennelContainer: {
    backgroundColor: "#007BFF",
  },
  submitButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: "100%",
    marginTop: 20,
  },
  releaseSheet: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
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
  closeButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  releaseSheetButton: {
    marginTop: 15,
    backgroundColor: "lightgreen",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
});
