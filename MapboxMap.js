import * as React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
//Mapa
export default function MapboxMap({ route }) {
  const { empresa, userLocation } = route.params;

  const [region, setRegion] = React.useState(null);
  const [currentUserLocation, setCurrentUserLocation] = React.useState(null);
  const [errorMsg, setErrorMsg] = React.useState(null);
  const [distance, setDistance] = React.useState(null);
  const [duration, setDuration] = React.useState(null);
  const [routeCoords, setRouteCoords] = React.useState([]);
  const [travelMode, setTravelMode] = React.useState('driving');

  const MAPBOX_TOKEN =
    'pk.eyJ1IjoibGluay1taW5pc2gtMDMxMiIsImEiOiJjbWdpbmE4YWMwYjBrMmtvaW1ja2tmbzM5In0.5jHjask85M6t795e1D808g';

  // Obtener ruta desde Mapbox Directions API
  const fetchRouteFromMapbox = async (start, end, mode = 'driving') => {
    try {
      const url = `https://api.mapbox.com/directions/v5/mapbox/${mode}/${start.longitude},${start.latitude};${end.longitude},${end.latitude}?geometries=geojson&overview=full&access_token=${MAPBOX_TOKEN}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const coords = route.geometry.coordinates.map(([lng, lat]) => ({
          latitude: lat,
          longitude: lng,
        }));

        setRouteCoords(coords);
        setDistance((route.distance / 1000).toFixed(2)); // km
        setDuration((route.duration / 60).toFixed(1)); // min
      } else {
        console.warn('No se encontró ruta');
        setRouteCoords([]);
      }
    } catch (error) {
      console.error('Error fetching route:', error);
    }
  };

  //  Obtener ubicación actual del usuario
  React.useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permiso de ubicación denegado.');
          if (userLocation) {
            setCurrentUserLocation(userLocation);
            calculateMapRegion(userLocation, empresa);
          }
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        const coords = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };

        setCurrentUserLocation(coords);
        calculateMapRegion(coords, empresa);

        if (empresa) {
          fetchRouteFromMapbox(
            coords,
            {
              latitude: empresa.CoordenadasLat,
              longitude: empresa.CoordenadasLng,
            },
            travelMode
          );
        }
      } catch (error) {
        console.error('Error getting location:', error);
      }
    })();
  }, []);

  // Recalcular ruta al cambiar modo de transporte
  React.useEffect(() => {
    if (currentUserLocation && empresa) {
      fetchRouteFromMapbox(
        currentUserLocation,
        {
          latitude: empresa.CoordenadasLat,
          longitude: empresa.CoordenadasLng,
        },
        travelMode
      );
    }
  }, [travelMode]);

  // Calcular la región visible del mapa
  const calculateMapRegion = (userCoords, business) => {
    if (!userCoords || !business) return;

    const midLat = (userCoords.latitude + business.CoordenadasLat) / 2;
    const midLng = (userCoords.longitude + business.CoordenadasLng) / 2;

    const latDelta =
      Math.abs(userCoords.latitude - business.CoordenadasLat) * 1.5 + 0.01;
    const lngDelta =
      Math.abs(userCoords.longitude - business.CoordenadasLng) * 1.5 + 0.01;

    setRegion({
      latitude: midLat,
      longitude: midLng,
      latitudeDelta: Math.max(latDelta, 0.05),
      longitudeDelta: Math.max(lngDelta, 0.05),
    });
  };

  if (errorMsg && !userLocation) {
    return (
      <View style={styles.center}>
        <Text>{errorMsg}</Text>
      </View>
    );
  }

  if (!region && !errorMsg) {
    return (
      <View style={styles.center}>
        <Text>Obteniendo tu ubicación...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={styles.map}
        initialRegion={region}
        region={region}
        showsUserLocation={true}
        onRegionChangeComplete={setRegion}
      >
        {/* Marcadores */}
        {currentUserLocation && (
          <Marker
            coordinate={currentUserLocation}
            title="Mi ubicación"
            pinColor="blue"
          />
        )}
        {empresa && (
          <Marker
            coordinate={{
              latitude: empresa.CoordenadasLat,
              longitude: empresa.CoordenadasLng,
            }}
            title={empresa.Nombre}
            description={empresa.Direccion}
            pinColor="red"
          />
        )}

        {/* Ruta */}
        {routeCoords.length > 0 && (
          <Polyline
            coordinates={routeCoords}
            strokeColor="#007AFF"
            strokeWidth={4}
          />
        )}
      </MapView>

      {/* 🔹 Panel de información abajo */}
      <View style={styles.bottomInfoCard}>
        <Text style={styles.businessName}>{empresa.Nombre}</Text>
        <Text style={styles.businessAddress}>{empresa.Direccion}</Text>
        <Text style={styles.businessPhone}>📞 {empresa.TelefonoContacto}</Text>

        <Text style={styles.distanceText}>
          {distance && duration
            ? `Distancia: ${distance} km | Tiempo: ${duration} min`
            : 'Calculando ruta...'}
        </Text>

        {/* Selector de modo de transporte */}
        <View style={styles.modeSelector}>
          <TouchableOpacity
            style={[
              styles.modeButton,
              travelMode === 'driving' && styles.modeSelected,
            ]}
            onPress={() => setTravelMode('driving')}
          >
            <Text style={styles.modeIcon}>🚗</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.modeButton,
              travelMode === 'walking' && styles.modeSelected,
            ]}
            onPress={() => setTravelMode('walking')}
          >
            <Text style={styles.modeIcon}>🚶‍♂️</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.modeButton,
              travelMode === 'cycling' && styles.modeSelected,
            ]}
            onPress={() => setTravelMode('cycling')}
          >
            <Text style={styles.modeIcon}>🚴‍♂️</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  map: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  bottomInfoCard: {
    position: 'absolute',
    bottom: 20,
    left: 10,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },

  businessName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  businessAddress: {
    fontSize: 14,
    color: '#555',
    marginBottom: 3,
  },
  businessPhone: {
    fontSize: 14,
    color: '#007AFF',
    marginBottom: 8,
  },
  distanceText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 8,
  },

  modeSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  modeButton: {
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 50,
  },
  modeSelected: {
    backgroundColor: '#007AFF',
  },
  modeIcon: {
    fontSize: 20,
  },
});