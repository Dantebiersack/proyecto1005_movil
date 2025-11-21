// components/Header.js
import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import styles from "../styles/componentStyles/HeaderStyles";

export default function Header({ isDarkMode, setIsDarkMode, themeStyles,onPressNotifications }) {
  return (
    <View style={styles.header}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../../assets/LogoNearBiz.jpeg")}
          style={styles.logo}
        />
        <Text style={[styles.companyName, themeStyles.text]}>NearBiz</Text>
      </View>
    <TouchableOpacity onPress={onPressNotifications} style={styles.iconButton}>
          <Ionicons name="notifications-outline" size={26} color="#39b58b" />
        </TouchableOpacity>

      <TouchableOpacity
        style={styles.themeButton}
        onPress={() => setIsDarkMode(!isDarkMode)}
      >
        
        <Ionicons
          name={isDarkMode ? "moon" : "sunny"}
          size={22}
          color={isDarkMode ? "#3B82F6" : "#0A2A66"}
        />
      </TouchableOpacity>
    </View>
  );
}