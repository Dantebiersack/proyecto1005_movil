import * as React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Linking, Platform, ActivityIndicator } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

export default function AppMap({ route, navigation }) {
  const { empresa, userLocation } = route.params;

  const mapRef = React.useRef(null);
  const [region, setRegion] = React.useState(null);
  const [currentUserLocation, setCurrentUserLocation] = React.useState(null);
  const [errorMsg, setErrorMsg] = React.useState(null);
  const [distance, setDistance] = React.useState(null);
  const [duration, setDuration] = React.useState(null);
  const [routeCoords, setRouteCoords] = React.useState([]);
  const [travelMode, setTravelMode] = React.useState('driving'); // "driving", "walking", "cycling"
  const [isLoading, setIsLoading] = React.useState(true);
  const [mapReady, setMapReady] = React.useState(false);

  // Valida coordenadas
  const isValidCoordinate = (lat, lng) => {
    return (
      lat !== null &&
      lng !== null &&
      !isNaN(lat) &&
      !isNaN(lng) &&
      typeof lat === 'number' &&
      typeof lng === 'number' &&
      Math.abs(lat) <= 90 &&
      Math.abs(lng) <= 180
    );
  };

  const getSafeCoordinates = (coords, fallback = null) => {
    if (!coords || !isValidCoordinate(coords.latitude, coords.longitude)) {
      return fallback || { latitude: 21.121017, longitude: -101.682254 };
    }
    return coords;
  };

  const fitToMarkers = () => {
    if (!mapRef.current || !mapReady) return;

    const markers = [];

    if (currentUserLocation && isValidCoordinate(currentUserLocation.latitude, currentUserLocation.longitude)) {
      markers.push(currentUserLocation);
    }

    const empresaLat = parseFloat(empresa.CoordenadasLat);
    const empresaLng = parseFloat(empresa.CoordenadasLng);
    if (isValidCoordinate(empresaLat, empresaLng)) {
      markers.push({
        latitude: empresaLat,
        longitude: empresaLng,
      });
    }

    if (markers.length > 0) {
      mapRef.current.fitToCoordinates(markers, {
        edgePadding: { top: 50, right: 50, bottom: 300, left: 50 },
        animated: true,
      });
    }
  };

  // Función para obtener una ruta real desde OSRM
  const fetchRealRoute = async (start, end, mode) => {
    try {
      // Mapear modo
      const modeMap = {
        driving: 'driving',
        walking: 'foot',
        cycling: 'bike',
      };
      const osrmMode = modeMap[mode] || 'driving';

      const url = `https://router.project-osrm.org/route/v1/${osrmMode}/${start.longitude},${start.latitude};${end.longitude},${end.latitude}?overview=full&geometries=geojson`;
      const response = await fetch(url);
      const data = await response.json();

      if (!data.routes || data.routes.length === 0) {
        console.warn('OSRM: no hay rutas');
        return null;
      }

      const route = data.routes[0];
      const coords = route.geometry.coordinates.map(([lon, lat]) => ({
        latitude: lat,
        longitude: lon,
      }));

      const distKm = (route.distance / 1000).toFixed(2);
      const durMin = Math.round(route.duration / 60);

      return { coords, distance: distKm, duration: durMin };
    } catch (error) {
      console.error('Error fetchRealRoute:', error);
      return null;
    }
  };

  const calculateRoute = React.useCallback(async (start, end) => {
    const safeStart = getSafeCoordinates(start);
    const empresaLat = parseFloat(empresa.CoordenadasLat);
    const empresaLng = parseFloat(empresa.CoordenadasLng);
    const safeEnd = { latitude: empresaLat, longitude: empresaLng };

    if (!isValidCoordinate(safeEnd.latitude, safeEnd.longitude)) {
      console.error('Coordenadas de la empresa no válidas para ruta');
      return;
    }

    const route = await fetchRealRoute(safeStart, safeEnd, travelMode);
    if (route) {
      setRouteCoords(route.coords);
      setDistance(route.distance);
      setDuration(route.duration);
    } else {
      // Fallback a línea recta si no se pudo obtener ruta real
      setRouteCoords([safeStart, safeEnd]);
    }
  }, [travelMode, empresa]);

  const requestLocationPermission = React.useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permiso de ubicación denegado.');
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error pidiendo permiso de ubicación', error);
      setErrorMsg('Error al solicitar permiso de ubicación.');
      return false;
    }
  }, []);

  const getCurrentLocation = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const hasPerm = await requestLocationPermission();
      if (!hasPerm) {
        // Si no tiene permiso, usa userLocation o fallback
        const defaultLoc = userLocation || { latitude: 21.121017, longitude: -101.682254 };
        setCurrentUserLocation(defaultLoc);
        setRegion({
          latitude: defaultLoc.latitude,
          longitude: defaultLoc.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
        return;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeout: 15000,
      });

      if (!loc || !loc.coords) throw new Error('No coords');
      const { latitude, longitude } = loc.coords;

      setCurrentUserLocation({ latitude, longitude });
      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });

    } catch (error) {
      console.warn('No se pudo obtener la ubicación precisa:', error);
      const defaultLoc = userLocation || { latitude: 21.121017, longitude: -101.682254 };
      setCurrentUserLocation(defaultLoc);
      setRegion({
        latitude: defaultLoc.latitude,
        longitude: defaultLoc.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
      setErrorMsg('Ubicación por defecto usada.');
    } finally {
      setIsLoading(false);
    }
  }, [requestLocationPermission, userLocation]);

  // Cuando cambie modo o ubicación, recalcúlala
  React.useEffect(() => {
    if (currentUserLocation && empresa) {
      calculateRoute(currentUserLocation, {
        latitude: parseFloat(empresa.CoordenadasLat),
        longitude: parseFloat(empresa.CoordenadasLng),
      });
    }
  }, [travelMode, currentUserLocation, empresa, calculateRoute]);

  // Fit al mapa cuando esté listo y tengamos cosas
  React.useEffect(() => {
    if (mapReady && currentUserLocation) {
      fitToMarkers();
    }
  }, [mapReady, currentUserLocation, routeCoords]);

  React.useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  const openInMapsApp = React.useCallback(() => {
    if (!currentUserLocation) return;

    const user = getSafeCoordinates(currentUserLocation);
    const empresaLat = parseFloat(empresa.CoordenadasLat);
    const empresaLng = parseFloat(empresa.CoordenadasLng);
    const dest = { latitude: empresaLat, longitude: empresaLng };

    const url = Platform.select({
      ios: `http://maps.apple.com/?saddr=${user.latitude},${user.longitude}&daddr=${dest.latitude},${dest.longitude}`,
      android: `https://www.google.com/maps/dir/${user.latitude},${user.longitude}/${dest.latitude},${dest.longitude}`,
    });

    Linking.openURL(url).catch(err => console.error('Error abriendo app de mapas', err));
  }, [currentUserLocation, empresa]);

  const handleCenterMap = () => {
    fitToMarkers();
  };

  // Render
  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Obteniendo tu ubicación…</Text>
      </View>
    );
  }

  const safeUser = getSafeCoordinates(currentUserLocation);
  const empresaLat = parseFloat(empresa.CoordenadasLat);
  const empresaLng = parseFloat(empresa.CoordenadasLng);
  const safeEmpresa = { latitude: empresaLat, longitude: empresaLng };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        style={styles.map}
        region={region}
        onMapReady={() => setMapReady(true)}
      >
        {/* Marcador usuario */}
        {isValidCoordinate(safeUser.latitude, safeUser.longitude) && (
          <Marker coordinate={safeUser} title="Tú">
            <FontAwesome5 name="map-marker-alt" size={30} color="#007AFF" />
          </Marker>
        )}

        {/* Marcador empresa */}
        {isValidCoordinate(empresaLat, empresaLng) && (
          <Marker coordinate={safeEmpresa} title={empresa.Nombre}>
            <FontAwesome5 name="map-marker-alt" size={30} color="#FF3B30" />
          </Marker>
        )}

        {/* Ruta real */}
        {routeCoords.length > 1 && (
          <Polyline
            coordinates={routeCoords}
            strokeColor={
              travelMode === 'walking'
                ? '#4CAF50'
                : travelMode === 'cycling'
                ? '#FF9800'
                : '#007AFF'
            }
            strokeWidth={6}
          />
        )}
      </MapView>

      {/* Botón centrar */}
      <TouchableOpacity style={styles.centerButton} onPress={handleCenterMap}>
        <FontAwesome5 name="crosshairs" size={20} color="#007AFF" />
      </TouchableOpacity>

      {/* Tarjeta info inferior */}
      <View style={styles.bottomInfoCard}>
        <Text style={styles.businessName}>{empresa.Nombre}</Text>
        <Text style={styles.businessAddress}>{empresa.Direccion}</Text>
        <Text style={styles.businessPhone}>📞 {empresa.TelefonoContacto}</Text>
        <Text style={styles.distanceText}>
          {distance && duration
            ? `📏 ${distance} km · ⏱ ${duration} min (${getModeText(travelMode)})`
            : 'Calculando ruta...'}
        </Text>

        {/* Selector de modo */}
        <View style={styles.modeSelector}>
          {[
            { mode: 'driving', icon: 'car', text: 'Auto' },
            { mode: 'walking', icon: 'walking', text: 'Caminar' },
            { mode: 'cycling', icon: 'bicycle', text: 'Bici' },
          ].map(item => (
            <TouchableOpacity
              key={item.mode}
              style={[
                styles.modeButton,
                travelMode === item.mode && styles.modeSelected,
              ]}
              onPress={() => setTravelMode(item.mode)}
            >
              <FontAwesome5
                name={item.icon}
                size={18}
                color={travelMode === item.mode ? '#FFF' : '#555'}
              />
              <Text
                style={[
                  styles.modeText,
                  travelMode === item.mode && styles.modeTextSelected,
                ]}
              >
                {item.text}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        
      </View>

      {/* Mensaje de error si hay */}
      {errorMsg && (
        <View style={styles.errorCard}>
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      )}
    </View>
  );
}

function getModeText(mode) {
  switch (mode) {
    case 'driving':
      return 'en auto';
    case 'walking':
      return 'caminando';
    case 'cycling':
      return 'en bicicleta';
    default:
      return '';
  }
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  centerButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'white',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  bottomInfoCard: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  businessName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 6,
    color: '#1a1a1a',
  },
  businessAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  businessPhone: {
    fontSize: 14,
    color: '#007AFF',
    marginBottom: 12,
  },
  distanceText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 16,
    textAlign: 'center',
    backgroundColor: '#E8F4FF',
    padding: 10,
    borderRadius: 8,
  },
  modeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  modeButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  modeSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  modeText: {
    marginLeft: 6,
    fontSize: 13,
    color: '#555',
    fontWeight: '600',
  },
  modeTextSelected: {
    color: 'white',
  },
  mapsButton: {
    backgroundColor: '#34C759',
    padding: 14,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapsButtonText: {
    marginLeft: 6,
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  errorCard: {
    position: 'absolute',
    top: 60,
    left: 10,
    right: 10,
    backgroundColor: '#FFE5E5',
    borderRadius: 10,
    padding: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#FF3B30',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  errorText: {
    fontSize: 16,
    color: '#D32F2F',
  },
});
