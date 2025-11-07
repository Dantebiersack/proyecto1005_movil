// components/BusinessCard.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function BusinessCard({ negocio, categoriasMap, themeStyles, onVerMapa, onAgendar }) {
  return (
    <View style={[styles.card, themeStyles.card]}>
      {/* Header con nombre y distancia */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Ionicons name="storefront" size={24} color="#39b58b" />
          <Text style={[styles.name, themeStyles.text]}>{negocio.nombre}</Text>
        </View>
        {negocio.distancia > 0 && (
          <Text style={styles.distanceBadge}>
            {negocio.distancia.toFixed(1)} km
          </Text>
        )}
      </View>

      {/* Categoría */}
      <Text style={[styles.category, themeStyles.text]}>
        {categoriasMap[negocio.categoriaId] || `Categoría ${negocio.categoriaId}`}
      </Text>

      {/* Descripción */}
      <Text style={[styles.description, themeStyles.text]}>
        {negocio.descripcion}
      </Text>

      {/* Información adicional */}
      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={16} color="#888" />
          <Text style={[styles.infoText, themeStyles.text]}>{negocio.direccion}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Ionicons name="call-outline" size={16} color="#888" />
          <Text style={[styles.infoText, themeStyles.text]}>{negocio.telefonoContacto}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Ionicons name="time-outline" size={16} color="#888" />
          <Text style={[styles.infoText, themeStyles.text]}>{negocio.horarioAtencion}</Text>
        </View>
      </View>

      {/* Botones de acción */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.mapButton]} 
          onPress={onVerMapa}
        >
          <Ionicons name="map-outline" size={18} color="#fff" />
          <Text style={styles.buttonText}>Ver mapa</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.appointmentButton]} 
          onPress={onAgendar}
        >
          <Ionicons name="calendar-outline" size={18} color="#fff" />
          <Text style={styles.buttonText}>Agendar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 8,
    flex: 1,
  },
  distanceBadge: {
    backgroundColor: "#3843c2",
    color: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: "bold",
  },
  category: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    opacity: 0.8,
  },
  description: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 12,
  },
  infoContainer: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    marginLeft: 6,
    opacity: 0.7,
    flex: 1,
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: 8,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingVertical: 10,
    gap: 6,
  },
  mapButton: {
    backgroundColor: "#3843c2",
  },
  appointmentButton: {
    backgroundColor: "#39b58b",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});