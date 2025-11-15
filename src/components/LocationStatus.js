// components/LocationStatus.js
import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import styles from "../styles/componentStyles/LocationStatusStyles";

export default function LocationStatus({ themeStyles, userLocation, locationError, onUpdateLocation }) {
  return (
    <View style={[styles.container, themeStyles.card]}>
      <View style={styles.row}>
        <View style={styles.iconContainer}>
          <Ionicons name="navigate-circle" size={20} color="#0A2A66" />
        </View>
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
          <Text style={[styles.text, themeStyles.textSecondary]}>
            Ubicación obtenida correctamente
          </Text>
          <TouchableOpacity style={styles.refreshButton} onPress={onUpdateLocation}>
            <Text style={styles.refreshButtonText}>Actualizar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.loadingRow}>
          <ActivityIndicator size="small" color="#0A2A66" />
          <Text style={[styles.text, themeStyles.textSecondary]}>Obteniendo ubicación...</Text>
        </View>
      )}
    </View>
  );
}