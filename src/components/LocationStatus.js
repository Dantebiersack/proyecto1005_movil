// components/LocationStatus.js
import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

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

const styles = StyleSheet.create({
  container: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 6,
  },
  statusContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  text: {
    fontSize: 14,
    flex: 1,
  },
  errorText: {
    color: "#e63946",
    flex: 1,
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  refreshButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#007AFF",
    borderRadius: 6,
  },
  refreshButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
});