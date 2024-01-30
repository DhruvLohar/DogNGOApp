import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
  Button,
  ScrollView,
} from "react-native";
import { StatusBar } from 'expo-status-bar';
import { React, useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { getUserRole, logOutUser } from "../service/api";
import Catching from "../assets/catching.png";
import InitialObservations from "../assets/initialObservations.png";
import Release from "../assets/release.png";
import Surgery from "../assets/surgery.png";
import Treatment from "../assets/treatment.png";
import AddUser from "../assets/adduser.png";
import Reports from "../assets/reports.png";

const FormCard = ({ title, navigate, image }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={() => navigate(title)}>
      <Image style={styles.cardImage} source={image} />
      <Text style={styles.cardText}>{title}</Text>
    </TouchableOpacity>
  );
};

const FormPage = () => {
  const router = useRouter();

  //access token logic
  const [userRole, setRole] = useState();

  const role = async () => {
    let r = await getUserRole();
    console.log(r);
    if (r) {
      setRole(r);
    }
  };

  const handleLogout = () => {
    logOutUser().then((res) => {
      if (res) {
        router.replace("/");
      }
    });
  };

  useEffect(() => {
    role();
  }, []);

  const navigateToForm = (title) => {
    router.push(`${title}`);
  };

  return (
    <ImageBackground
      source={require("../assets/logo.jpg")}
      style={styles.backgroundImage}
    >
      <StatusBar style="dark" />
      <ScrollView>
        <Button title="Logout User" onPress={() => handleLogout()}></Button>
        <View style={styles.container}>
          {userRole === "admin" || userRole === "catcher" ? (
            <>
              <FormCard
                title="Catching"
                image={Catching}
                navigate={() => navigateToForm("/Catching")}
              />
              <FormCard
                title="Initial Observations "
                image={InitialObservations}
                navigate={() => navigateToForm("/DogPhotos")}
              />
            </>
          ) : null}

          {userRole === "admin" || userRole === "caretaker" ? (
            <FormCard
              title="Daily Treatment"
              image={Treatment}
              navigate={() => navigateToForm("/Day")}
            />
          ) : null}

          {userRole === "admin" || userRole === "vet" ? (
            <>
              <FormCard
                title="Surgery"
                image={Surgery}
                navigate={() => navigateToForm("/SurgeryNotes")}
              />
              <FormCard
                image={Surgery}
                title="Medicines"
                navigate={() => navigateToForm("/Medicines")}
              />
            </>
          ) : null}
          {userRole === "admin" || userRole === "catcher" ? (
            <FormCard
              image={Release}
              title="Release"
              navigate={() => navigateToForm("/ReleaseForm")}
            />
          ) : null}
          {userRole === "admin" ? (
            <>
              <FormCard
                image={AddUser}
                title="Add a User"
                navigate={() => navigateToForm("/LoginAdmin")}
              />
              <FormCard
                image={Release}
                title="View Dogs"
                navigate={() => navigateToForm("/ViewDogs")}
              />
            </>
          ) : null}
          {userRole === "admin" ? (
            <FormCard
              image={Reports}
              title="Generate Reports"
              navigate={() => navigateToForm("/Report")}
            />
          ) : null}
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100vw",
    justifyContent: "center",
    objectFit: "cover",
    height: "100vh",
  },
  container: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "40%",
    height: 200,
    backgroundColor: "#fff",
    borderRadius: 10,
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  cardImage: {
    height: 100,
    width: 100,
    marginBottom: 10,
    // objectFit,
  },
});

export default FormPage;
