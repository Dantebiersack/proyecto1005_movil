// screens/MapScreen.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import { useRoute, useNavigation } from '@react-navigation/native';

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  backButton: {
    marginRight: 12,
  },
  backButtonText: {
    fontSize: 16,
    color: '#3843c2',
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  map: {
    flex: 1,
  },
  userMarker: {
    backgroundColor: '#3843c2',
    borderRadius: 20,
    padding: 8,
  },
  businessMarker: {
    backgroundColor: '#39b58b',
    borderRadius: 20,
    padding: 8,
  },
  markerText: {
    fontSize: 16,
  },
  infoCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  businessName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  businessCategory: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  businessAddress: {
    fontSize: 14,
    marginBottom: 4,
  },
  businessPhone: {
    fontSize: 14,
  },
});