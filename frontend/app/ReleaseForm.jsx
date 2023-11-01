import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";

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
  };

  const handleSubmit = () => {
    const newKennels = kennels.filter(
      (kennel) => !selectedKennels.includes(kennel)
    );
    setReleasedKennels(selectedKennels);
    setKennels(newKennels);

    // setShowReleaseSheet(true);
  };

  return (
    <View style={styles.container}>
      {kennels
        .filter(
          (kennel) =>
            (new Date() - kennel.surgeryDate) / (1000 * 60 * 60 * 24) > 3
        )
        .map((kennel) => (
          <TouchableOpacity
            key={kennel.id}
            style={[
              styles.kennelContainer,
              selectedKennels.includes(kennel) &&
                styles.selectedKennelContainer,
            ]}
            onPress={() => handleKennelPress(kennel)}
          >
            <Text>Kennel ID: {kennel.id}</Text>
            <Text>Dog Photo: {kennel.dogPhoto}</Text>
            <Text>Caretaker: {kennel.caretaker}</Text>
            <Text>Phone Number: {kennel.phoneNumber}</Text>
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
            {releasedKennels.map((dog) => (
              <View key={dog.id} style={styles.dogContainer}>
                <Text>Dog Photo: {dog.dogPhoto}</Text>
                <Text>Caretaker: {dog.caretaker}</Text>
                <Text>Phone Number: {dog.phoneNumber}</Text>
                <TouchableOpacity
                  onPress={() => handleRelease(dog)}
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
