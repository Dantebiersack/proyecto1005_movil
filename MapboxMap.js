import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import Mapbox from "@rnmapbox/maps";
import * as Location from "expo-location";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

// ⬅ Asegúrate de poner aquí tu token de Mapbox
Mapbox.setAccessToken(
  "pk.eyJ1IjoibGluay1taW5pc2gtMDMxMiIsImEiOiJjbWdpbmE4YWMwYjBrMmtvaW1ja2tmbzM5In0.5jHjask85M6t795e1D808g"
);

export default function MapboxMap({ route }) {
  const { empresa } = route.params;

  const [currentUserLocation, setCurrentUserLocation] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const [travelMode, setTravelMode] = useState("driving");
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);

  // ===========================================
  // 🧭 FUNCION PARA OBTENER RUTA DESDE MAPBOX
  // ===========================================
  const fetchRouteFromMapbox = async (start, end, mode = "driving") => {
    try {
      const url = `https://api.mapbox.com/directions/v5/mapbox/${mode}/${start.longitude},${start.latitude};${end.longitude},${end.latitude}?geometries=geojson&overview=full&access_token=${Mapbox.getAccessToken()}`;

      const response = await fetch(url);
      const data = await response.json();

      if (!data.routes || data.routes.length === 0) {
        console.log("❌ NO SE ENCONTRÓ RUTA", data);
        return;
      }

      const route = data.routes[0];

      setRouteCoords(route.geometry.coordinates);
      setDistance((route.distance / 1000).toFixed(2)); // km
      setDuration((route.duration / 60).toFixed(1)); // min
    } catch (e) {
      console.log("Error fetching route:", e);
      Alert.alert("Error", "No se pudo generar la ruta.");
    }
  };

  // ===========================================
  // 📍 OBTENER UBICACIÓN DEL USUARIO
  // ===========================================
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permiso de ubicación denegado");
        return;
      }

      const loc = await Location.getCurrentPositionAsync();

      const coords = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      };

      setCurrentUserLocation(coords);

      // Llamar ruta
      fetchRouteFromMapbox(
        coords,
        {
          latitude: Number(empresa.CoordenadasLat),
          longitude: Number(empresa.CoordenadasLng),
        },
        travelMode
      );
    })();
  }, []);

  // ===========================================
  // 🚴 CAMBIO DE MODO DE TRANSPORTE
  // ===========================================
  useEffect(() => {
    if (currentUserLocation) {
      fetchRouteFromMapbox(
        currentUserLocation,
        {
          latitude: Number(empresa.CoordenadasLat),
          longitude: Number(empresa.CoordenadasLng),
        },
        travelMode
      );
    }
  }, [travelMode]);

  return (
    <View style={{ flex: 1 }}>
      {/* MAPA */}
      <Mapbox.MapView
        style={styles.map}
        styleURL={Mapbox.StyleURL.Street}
      >
        {/* Cámara posicionada en el usuario */}
        {currentUserLocation && (
          <Mapbox.Camera
            zoomLevel={13}
            centerCoordinate={[
              currentUserLocation.longitude,
              currentUserLocation.latitude,
            ]}
          />
        )}

        {/* 🟦 Marcador del usuario */}
        {currentUserLocation && (
          <Mapbox.PointAnnotation
            id="user"
            coordinate={[
              currentUserLocation.longitude,
              currentUserLocation.latitude,
            ]}
          >
            <FontAwesome5 name="map-marker-alt" size={30} color="#007AFF" />
          </Mapbox.PointAnnotation>
        )}

        {/* 🔴 Marcador de empresa */}
        <Mapbox.PointAnnotation
          id="empresa"
          coordinate={[
            Number(empresa.CoordenadasLng),
            Number(empresa.CoordenadasLat),
          ]}
        >
          <FontAwesome5 name="map-marker-alt" size={30} color="#FF3B30" />
        </Mapbox.PointAnnotation>

        {/* 🛣️ Línea de ruta */}
        {routeCoords.length > 0 && (
          <Mapbox.ShapeSource
            id="routeSource"
            shape={{
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: routeCoords,
              },
            }}
          >
            <Mapbox.LineLayer
              id="routeLine"
              style={{
                lineWidth: 4,
                lineJoin: "round",
                lineColor: "#007AFF",
              }}
            />
          </Mapbox.ShapeSource>
        )}
      </Mapbox.MapView>

      {/* PANEL INFERIOR */}
      <View style={styles.bottomInfoCard}>
        <Text style={styles.businessName}>{empresa.Nombre}</Text>
        <Text style={styles.businessAddress}>{empresa.Direccion}</Text>
        <Text style={styles.businessPhone}>📞 {empresa.TelefonoContacto}</Text>

        <Text style={styles.distanceText}>
          {distance && duration
            ? `Distancia: ${distance} km | Tiempo: ${duration} min`
            : "Calculando ruta..."}
        </Text>

        {/* Selector de modo */}
        <View style={styles.modeSelector}>
          {[
            { id: "driving", icon: "car" },
            { id: "walking", icon: "walking" },
            { id: "cycling", icon: "bicycle" },
          ].map((m) => (
            <TouchableOpacity
              key={m.id}
              style={[
                styles.modeButton,
                travelMode === m.id && styles.modeSelected,
              ]}
              onPress={() => setTravelMode(m.id)}
            >
              <FontAwesome5
                name={m.icon}
                size={18}
                color={travelMode === m.id ? "white" : "black"}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  map: { flex: 1 },

  bottomInfoCard: {
    position: "absolute",
    bottom: 20,
    left: 10,
    right: 10,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    elevation: 5,
  },

  businessName: { fontSize: 18, fontWeight: "700" },
  businessAddress: { fontSize: 14, color: "#555" },
  businessPhone: { fontSize: 14, color: "#007AFF" },

  distanceText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#007AFF",
    marginBottom: 8,
  },

  modeSelector: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },

  modeButton: {
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 50,
  },

  modeSelected: {
    backgroundColor: "#007AFF",
  },
});
