import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    Platform,
    Picker as NativePicker,
    Image,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import { Picker as WebPicker } from "react-native-web";
import { API_URL, axiosRequest } from "../service/api";

const mockDogs = [
    { id: 1, name: "Dog 1", status: "Adopted", date: "2023-10-01" },
    { id: 2, name: "Dog 2", status: "Available", date: "2023-10-05" },
    { id: 3, name: "Dog 3", status: "Operated", date: "2023-10-10" },
    { id: 4, name: "Dog 4", status: "Under Treatments", date: "2023-10-15" },
    { id: 5, name: "Dog 5", status: "Fit for Release", date: "2023-10-20" },
    { id: 6, name: "Dog 6", status: "Despatched", date: "2023-10-25" },
    { id: 7, name: "Dog 7", status: "Released", date: "2023-10-30" },
];

const ViewDogs = () => {
    const [dogs, setDogs] = useState([]);
    const [filteredDogs, setFilteredDogs] = useState([]);
    const [statusFilter, setStatusFilter] = useState("");
    const [dateFilter, setDateFilter] = useState("");

    const [currPage, setCurrPage] = useState(0)

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
    }, [statusFilter, dateFilter, dogs]);

    const applyFilters = () => {
        let filteredData = dogs;

        if (statusFilter !== "All") {
            filteredData = filteredData.filter((dog) => dog.status === statusFilter);
        }

        if (dateFilter !== "All") {
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

        setFilteredDogs(filteredData);
    };

    const renderDogItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <Image
                source={{
                    uri:
                        API_URL +
                        "/" +
                        item?.dogImage,
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
            <ScrollView horizontal showsHorizontalScrollIndicator={false} 
                style={{ maxHeight: 60, marginVertical: 20, flexDirection: 'row', marginLeft: 10 }}>
                <View style={{ flexDirection: 'row', columnGap: 20, justifyContent: "start", alignItems: "center", maxHeight: 60 }}>
                    {Array.from({ length: 80 }).map((_, idx) => (
                        <TouchableOpacity key={idx} style={[(idx === currPage) && paginationStyles.activePage]} onPress={() => setCurrPage(idx)}>
                            <Text style={[{ fontSize: 24 }, (idx === currPage) && paginationStyles.activePagetext]}>{idx + 1}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>

            <FlatList
                data={filteredDogs}
                keyExtractor={(item) => item.id}
                renderItem={renderDogItem}
                style={{ maxHeight: "70%", marginTop: 20 }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
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
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        justifyContent: "flex-start",
        alignItems: "flex-start"
    },
    name: {
        fontSize: 18,
        fontWeight: "bold",
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

export default ViewDogs;