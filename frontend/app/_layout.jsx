import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Signup",
        }}
      />
      <Stack.Screen
        name="Catching"
        options={{
          title: "Catching Form",
        }}
      />
      <Stack.Screen
        name="DogPhotos"
        options={{
          title: "Select a Dog",
        }}
      />
      <Stack.Screen
        name="FormPage"
        options={{
          title: "Home Page",
          headerBackVisible: false
        }}
      />
      <Stack.Screen
        name="ReleaseForm"
        options={{
          title: "Release Dog Page",
        }}
      />
      <Stack.Screen
        name="Report"
        options={{
          title: "Generate Reports",
        }}
      />
      <Stack.Screen
        name="LoginAdmin"
        options={{
          title: "Add a new user",
        }}
      />
    </Stack>
  );
};

export default Layout;
