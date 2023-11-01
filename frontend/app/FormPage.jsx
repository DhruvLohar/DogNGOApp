import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { React, useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { getUserRole } from "../service/api";

const FormCard = ({ title, navigate }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={() => navigate(title)}>
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
    if (r) {
      setRole(r);
    }
  };

  useEffect(() => {
    role();
  }, []);

  const navigateToForm = (title) => {
    router.push(`${title}`);
  };

  return (
    <View style={styles.container}>
      <FormCard
        title="Catch Form"
        navigate={() => navigateToForm("/Catching")}
      />
      <FormCard title="Daily Form" navigate={() => navigateToForm("/Day")} />
      <FormCard
        title="Initial Observations Form"
        navigate={() => navigateToForm("/InitialObservations")}
      />
      <FormCard
        title="Surgery Details Form"
        navigate={() => navigateToForm("/SurgeryDetails")}
      />
      <FormCard
        title="Surgery Notes Form"
        navigate={() => navigateToForm("/SurgeryNotes")}
      />
      <FormCard
        title="Release"
        navigate={() => navigateToForm("/ReleaseForm")}
      />
      {userRole === "admin" ? (
        <FormCard
          title="Add a User"
          navigate={() => navigateToForm("/LoginAdmin")}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    padding: 20,
  },
  card: {
    width: "40%",
    height: 120,
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
});

export default FormPage;
