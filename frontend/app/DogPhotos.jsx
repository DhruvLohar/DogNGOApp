import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Button,
} from "react-native";

const DogPhotos = () => {
  const router = useRouter();
  const [selectedDogId, setSelectedDogId] = useState(null);

  // Sample data of dogs (replace with data fetched from backend)
  const dogs = [
    {
      id: 1,
      name: "Max",
      breed: "Labrador",
      age: 5,
      photoUrl: "https://example.com/max.jpg",
      kennelNumber: null,
    },
    {
      id: 2,
      name: "Buddy",
      breed: "Golden Retriever",
      age: 3,
      photoUrl: "https://example.com/buddy.jpg",
      kennelNumber: "K001",
    },
    {
      id: 3,
      name: "Charlie",
      breed: "Poodle",
      age: 4,
      photoUrl: "https://example.com/charlie.jpg",
      kennelNumber: null,
    },
    // Add more dog objects here
  ];

  const handleSelectDog = (dogId) => {
    setSelectedDogId(dogId);
  };

  const handleSubmit = () => {
    if (selectedDogId) {
      const selectedDog = dogs.find((dog) => dog.id === selectedDogId);
      console.log(selectedDog);
      router.push("/InitialObservations");
    } else {
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {dogs.map((dog) => (
          <TouchableOpacity
            key={dog.id}
            onPress={() => handleSelectDog(dog.id)}
            style={{
              borderColor: selectedDogId === dog.id ? "#007BFF" : "grey",
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
                source={{ uri: dog.photoUrl }}
                style={{ width: 100, height: 100, borderRadius: 50 }}
              />
            </View>
            <Text style={{ fontWeight: "bold" }}>{dog.name}</Text>
            <Text>{dog.breed}</Text>
            <Text>{dog.age} years old</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Button title="Submit" onPress={handleSubmit} disabled={!selectedDogId} />
    </View>
  );
};

export default DogPhotos;
