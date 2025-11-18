import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function NotificationsScreen() {
  return (
    <View style={styles.container}>
      <Ionicons name="notifications" size={60} color="#39b58b" />
      <Text style={styles.title}>Notificaciones</Text>
      <Text style={styles.text}>Aquí verás tus alertas y avisos.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff"
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginTop: 10,
    color: "#333"
  },
  text: {
    fontSize: 16,
    marginTop: 6,
    color: "#666"
  }
});
