// screens/MapScreen.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import { useRoute, useNavigation } from '@react-navigation/native';
import styles from "../styles/MapScreenStyles";

MapboxGL.setAccessToken('pk.eyJ1IjoibGluay1taW5pc2gtMDMxMiIsImEiOiJjbWdpbmE4YWMwYjBrMmtvaW1ja2tmbzM5In0.5jHjask85M6t795e1D808g');

export default function MapScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { empresa, userLocation, categoria } = route.params;

  const [coordinates] = useState([
    userLocation.longitude,
    userLocation.latitude
  ]);

  const [empresaCoordinates] = useState([
    empresa.CoordenadasLng,
    empresa.CoordenadasLat
  ]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{empresa.Nombre}</Text>
      </View>

      {/* Mapa */}
      <MapboxGL.MapView style={styles.map}>
        <MapboxGL.Camera
          zoomLevel={12}
          centerCoordinate={coordinates}
          animationMode={'flyTo'}
          animationDuration={2000}
        />
        
        {/* Marcador del usuario */}
        <MapboxGL.PointAnnotation
          id="user"
          coordinate={coordinates}
        >
          <View style={styles.userMarker}>
            <Text style={styles.markerText}>📍</Text>
          </View>
        </MapboxGL.PointAnnotation>

        {/* Marcador de la empresa */}
        <MapboxGL.PointAnnotation
          id="empresa"
          coordinate={empresaCoordinates}
        >
          <View style={styles.businessMarker}>
            <Text style={styles.markerText}>🏢</Text>
          </View>
        </MapboxGL.PointAnnotation>

        {/* Línea entre usuario y empresa */}
        <MapboxGL.ShapeSource
          id="line"
          shape={{
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: [coordinates, empresaCoordinates],
            },
          }}
        >
          <MapboxGL.LineLayer
            id="lineFill"
            style={{
              lineColor: '#3843c2',
              lineWidth: 3,
              lineOpacity: 0.7,
            }}
          />
        </MapboxGL.ShapeSource>
      </MapboxGL.MapView>

      {/* Información de la empresa */}
      <View style={styles.infoCard}>
        <Text style={styles.businessName}>{empresa.Nombre}</Text>
        <Text style={styles.businessCategory}>{categoria}</Text>
        <Text style={styles.businessAddress}>📍 {empresa.Direccion}</Text>
        <Text style={styles.businessPhone}>📞 {empresa.TelefonoContacto}</Text>
      </View>
    </View>
  );
}

