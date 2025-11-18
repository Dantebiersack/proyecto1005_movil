// components/BusinessCard.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import styles from "../styles/componentStyles/BusinessCardStyles";

/* ⭐ Componente de medias estrellas */
function HalfStarRating({ rating }) {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 !== 0;

  for (let i = 0; i < fullStars; i++) {
    stars.push(<Text key={`full-${i}`} style={{ fontSize: 18, color: "#FFD700" }}>★</Text>);
  }

  if (hasHalf) {
    stars.push(<Text key="half" style={{ fontSize: 18, color: "#FFD700" }}>☆</Text>);
  }

  while (stars.length < 5) {
    stars.push(<Text key={`empty-${stars.length}`} style={{ fontSize: 18, color: "#ccc" }}>★</Text>);
  }

  return <View style={{ flexDirection: "row", marginTop: 4 }}>{stars}</View>;
}

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

      {/* ⭐ Rating */}
    {negocio.rating != null && (
  <HalfStarRating rating={Number(negocio.rating)} />
)}


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

      {/* Botones */}
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
