import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Platform,
  Picker as NativePicker,
  Image,
} from "react-native";
import { Picker as WebPicker } from "react-native-web";
import { API_URL, axiosRequest } from "../service/api";

const ITEMS_PER_PAGE = 10; // Number of dogs to display per page

const ViewDogs = () => {
  const [dogs, setDogs] = useState([]);
  const [filteredDogs, setFilteredDogs] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    axiosRequest(
      "/dog",
      {
        method: "get",
      },
      false
    )
      .then((res) => {
        setDogs(Array.from(res.data));
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

    // setDogs(mockDogs);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [statusFilter, dateFilter, dogs, currentPage]);

  const applyFilters = () => {
    let filteredData = dogs;

    if (statusFilter && statusFilter !== "All") {
      filteredData = filteredData.filter((dog) => dog.status === statusFilter);
    }

    if (dateFilter && dateFilter !== "All") {
      const cutoffDate = new Date();
      switch (dateFilter) {
        case "1":
          cutoffDate.setDate(cutoffDate.getDate() - 7);
          break;
        case "2":
          cutoffDate.setDate(cutoffDate.getDate() - 14);
          break;
        case "3":
          cutoffDate.setDate(cutoffDate.getDate() - 21);
          break;
        case "4":
          cutoffDate.setDate(cutoffDate.getDate() - 28);
          break;
        default:
          break;
      }
      filteredData = filteredData.filter(
        (dog) => new Date(dog?.catcherDetails?.catchingDate) > cutoffDate
      );
    }

    // Pagination logic
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    setFilteredDogs(filteredData.slice(startIndex, endIndex));
  };

  const renderDogItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image
        source={{
          uri: API_URL + "/" + item?.dogImage,
        }}
        style={{
          width: 200,
          height: 200,
          aspectRatio: 9 / 16,
        }}
        resizeMode="contain"
      />
      <Text style={styles.name}>{item.caseNumber}</Text>
      <Text>Status: {item.status}</Text>
    </View>
  );

  const Picker = Platform.OS === "web" ? WebPicker : NativePicker;

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <View style={styles.filter}>
          <Text>Status:</Text>
          <Picker
            style={styles.picker}
            selectedValue={statusFilter}
            onValueChange={(itemValue) => setStatusFilter(itemValue)}
          >
            <Picker.Item label="All" value="All" />
            <Picker.Item label="Adopted" value="Adopted" />
            <Picker.Item label="Available" value="Available" />
            <Picker.Item label="Operated" value="Operated" />
            <Picker.Item label="Under Treatments" value="UnderTreatment" />
            <Picker.Item label="Fit for Release" value="FitForRelease" />
            <Picker.Item label="Dispatched" value="Dispatched" />
            <Picker.Item label="Released" value="Released" />
          </Picker>
        </View>
        <View style={styles.filter}>
          <Text>Date:</Text>
          <Picker
            style={styles.picker}
            selectedValue={dateFilter}
            onValueChange={(itemValue) => setDateFilter(itemValue)}
          >
            <Picker.Item label="All" value="All" />
            <Picker.Item label="1 week" value="1" />
            <Picker.Item label="2 weeks" value="2" />
            <Picker.Item label="3 weeks" value="3" />
            <Picker.Item label="4 weeks" value="4" />
          </Picker>
        </View>
      </View>

      <FlatList
        data={filteredDogs}
        keyExtractor={(item) => item._id}
        renderItem={renderDogItem}
        ListFooterComponent={() => (
          <View>
            <Text style={{ display: "flex", justifyContent: "center" }}>
              Page: {currentPage}
            </Text>
            <View style={styles.page}>
              <Text
                onPress={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                style={{ color: "blue", fontSize: 20 }}
              >
                Previous Page
              </Text>
              <Text
                onPress={() =>
                  setCurrentPage((prev) =>
                    Math.min(prev + 1, Math.ceil(dogs.length / ITEMS_PER_PAGE))
                  )
                }
                style={{ color: "blue", fontSize: 20 }}
              >
                Next Page
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    marginTop: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  container: {
    flex: 1,
    padding: 10,
  },
  filterContainer: {
    flexDirection: "row",
  },
  filter: {
    flexDirection: "column",
    justifyContent: "space-between",
    padding: 10,
  },
  picker: {
    flex: 1,
  },
  itemContainer: {
    display: "flex",
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ViewDogs;
