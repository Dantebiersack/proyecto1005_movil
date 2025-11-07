import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import styles from "../styles/componentStyles/HeaderStyles";


export default function Header({ isDarkMode, setIsDarkMode, themeStyles }) {
  return (
    <View style={styles.header}>
      <Image
        source={require("../../assets/LogoNearBiz.jpeg")}
        style={styles.logo}
      />

      <Text style={[styles.companyName, themeStyles.text]}>NearBiz</Text>

      <TouchableOpacity
        style={styles.themeButton}
        onPress={() => setIsDarkMode(!isDarkMode)}
      >
        <Ionicons
          name={isDarkMode ? "moon" : "sunny"}
          size={28}
          color={isDarkMode ? "#fff" : "#000"}
        />
      </TouchableOpacity>
    </View>
  );
}


