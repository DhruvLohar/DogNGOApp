import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Button,
} from "react-native";
import { StatusBar } from 'expo-status-bar';
import { API_URL, axiosRequest } from "../service/api";

const DogPhotos = () => {
  const router = useRouter();
  const [selectedDogId, setSelectedDogId] = useState(null);
  const [Dogs, setDogs] = useState([]);

  useEffect(() => {
    //Make an API call to get all dogs who are captured but not assigned a kennel. I would suggest make another
    //state for dog ['released', 'dispatched', 'caught', 'treating'] and call dogs with caught, and put them in 'treatng'
    axiosRequest(
      "/dog/observable",
      {
        method: "get",
      },
      true
    )
      .then((res) => {
        setDogs(Array.from(res.data).reverse());
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
  }, []);

  const handleSelectDog = (dogId) => {
    setSelectedDogId(dogId);
  };

  const handleSubmit = () => {
    if (selectedDogId) {
      console.log(selectedDogId);
      router.push(`/initialObservations/${selectedDogId}`);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <StatusBar style="dark" />

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {Dogs.length === 0
          ? <Text style={{marginBottom: 20}}>No dogs found for Initial Observations</Text>
          : Dogs.map((dog) => (
            <TouchableOpacity
              key={dog._id}
              onPress={() => handleSelectDog(dog._id)}
              style={{
                borderColor: selectedDogId === dog._id ? "#007BFF" : "grey",
                borderWidth: 2,
                borderRadius: 10,
                padding: 10,
                margin: 10,
                alignItems: "center",
                minWidth: 120,
                maxWidth: 160, // Adjust the max width as needed
              }}
            >
              <View style={{ marginBottom: 10 }}>
                <Image
                  source={{
                    uri: API_URL + "/" + dog?.dogImage,
                  }}
                  style={{ width: 100, height: 100, borderRadius: 50 }}
                />
              </View>
              <Text style={{ fontWeight: "bold", fontSize: 14 }}>
                Case Number: {dog?.caseNumber}
              </Text>
              <Text style={{ fontWeight: "bold", fontSize: 14 }}>
                Caught: {dog?.createdAt?.slice(0, 10)}
              </Text>
            </TouchableOpacity>
          ))}

      </ScrollView>
      <Button title="Submit" onPress={handleSubmit} disabled={!selectedDogId} />
    </View>
  );
};

export default DogPhotos;
