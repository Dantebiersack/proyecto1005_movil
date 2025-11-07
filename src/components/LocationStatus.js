// components/LocationStatus.js
import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import styles from "../styles/componentStyles/LocationStatusStyles";

export default function LocationStatus({ themeStyles, userLocation, locationError, onUpdateLocation }) {
  return (
    <View style={[styles.container, themeStyles.card]}>
      <View style={styles.row}>
        <Ionicons name="navigate-circle" size={24} color="#39b58b" />
        <Text style={[styles.title, themeStyles.text]}>Estado de ubicación</Text>
      </View>

      {locationError ? (
        <View style={styles.statusContainer}>
          <Text style={[styles.errorText, themeStyles.text]}>⚠️ {locationError}</Text>
          <TouchableOpacity style={styles.refreshButton} onPress={onUpdateLocation}>
            <Text style={styles.refreshButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : userLocation ? (
        <View style={styles.statusContainer}>
          <Text style={[styles.text, themeStyles.text]}>
            ✅ Ubicación obtenida ({userLocation.latitude.toFixed(3)}, {userLocation.longitude.toFixed(3)})
          </Text>
          <TouchableOpacity style={styles.refreshButton} onPress={onUpdateLocation}>
            <Text style={styles.refreshButtonText}>Actualizar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.loadingRow}>
          <ActivityIndicator size="small" color="#39b58b" />
          <Text style={[styles.text, themeStyles.text]}>Obteniendo ubicación...</Text>
        </View>
      )}
    </View>
  );
}

