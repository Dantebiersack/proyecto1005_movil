// components/BusinessCard.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import styles from "../styles/componentStyles/BusinessCardStyles";

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

