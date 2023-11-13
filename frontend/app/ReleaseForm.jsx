import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { axiosRequest } from "../service/api";

const ReleaseForm = () => {
  const [kennels, setKennels] = useState([
    {
      id: 1,
      dogPhoto: "dog1.jpg",
      caretaker: "John Doe",
      phoneNumber: "1234567890",
      surgeryDate: new Date("2023-10-20"),
    },
    {
      id: 2,
      dogPhoto: "dog2.jpg",
      caretaker: "John Doe",
      phoneNumber: "1234567890",
      surgeryDate: new Date("2023-10-20"),
    },
    {
      id: 3,
      dogPhoto: "dog3.jpg",
      caretaker: "John Doe",
      phoneNumber: "1234567890",
      surgeryDate: new Date("2023-10-20"),
    },
  ]);

  const [releasableDogs, setReleasableDogs] = useState([])
  const [dispatchableDogs, setDispatchableDogs] = useState([])

  const [selectedKennels, setSelectedKennels] = useState([]);
  const [releasedKennels, setReleasedKennels] = useState([]);
  const [showReleaseSheet, setShowReleaseSheet] = useState(false);

  const handleKennelPress = (kennel) => {
    if (selectedKennels.includes(kennel)) {
      setSelectedKennels(selectedKennels.filter((item) => item !== kennel));
    } else {
      setSelectedKennels([...selectedKennels, kennel]);
    }
  };

  const handleRelease = (dog) => {
    setReleasedKennels((prev) => prev.filter((kennel) => kennel !== dog));
    axiosRequest(
      `/dog/${id}/release`,
      {
        method: "post",
      },
      false
    )
      .then((res) => {
        alert(res.data.message);
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
  };

  useEffect(() => {
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
  }, [])

  const handleSubmit = () => {
    // const newKennels = kennels.filter(
    //   (kennel) => !selectedKennels.includes(kennel)
    // );
    // setReleasedKennels(selectedKennels);
    // setKennels(newKennels);

    selectedKennels.map(dog => {
      axiosRequest(
        `/dog/${id}/dispatch`,
        {
          method: "post",
        },
        false
      )
        .then((res) => {
          console.log(res.data)
          // alert(res.data.message);
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
    })
    alert('Release Sheet updated.')
  };

  return (
    <View style={styles.container}>

      {dispatchableDogs.map(dog => (
        <TouchableOpacity
          key={dog._id}
          style={[
            styles.kennelContainer,
            selectedKennels.includes(dog._id) && styles.selectedKennelContainer,
          ]}
          onPress={() => handleKennelPress(dog._id)}
        >
          <Text>Kennel ID: {dog?.kennel?._id}</Text>
          <Text>Dog Photo: {dog?.catcherDetails?.spotPhoto?.path}</Text>
          <Text>Caretaker: {dog?.careTakerDetails?.caretaker?.name}</Text>
          <Text>Phone Number: {dog?.careTakerDetails?.caretaker?.contactNumber}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
        <Text>Submit</Text>
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
            {releasableDogs.map((dog) => (
              <View key={dog._id} style={styles.dogContainer}>
                <Text>Dog Photo: {dog?.catcherDetails?.spotPhoto?.path}</Text>
                <Text>Caretaker: {dog?.careTakerDetails?.caretaker?.name}</Text>
                <Text>Phone Number: {dog?.careTakerDetails?.caretaker?.contactNumber}</Text>
                <TouchableOpacity
                  onPress={() => handleRelease(dog._id)}
                  style={styles.releaseButton}
                >
                  <Text>Release</Text>
                </TouchableOpacity>
              </View>
            ))}
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
