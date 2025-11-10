import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';

export default function MapboxMap({ route }) {
  const { empresa, userLocation } = route.params;
  
  const [region, setRegion] = React.useState(null);
  const [currentUserLocation, setCurrentUserLocation] = React.useState(null);
  const [errorMsg, setErrorMsg] = React.useState(null);
  const [distance, setDistance] = React.useState(null);

  // Calcular distancia entre dos puntos
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = x => (x * Math.PI) / 180;
    const R = 6371; // Radio de la Tierra en km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Obtener ubicación actual del usuario
  React.useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permiso de ubicación denegado.');
          // Usar la ubicación que viene del HomeScreen como fallback
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
        
      } catch (error) {
        console.error('Error getting location:', error);
        // Usar la ubicación del HomeScreen si hay error
        if (userLocation) {
          setCurrentUserLocation(userLocation);
          calculateMapRegion(userLocation, empresa);
        }
      }
    })();
  }, []);

  // Calcular región del mapa para mostrar ambos puntos
  const calculateMapRegion = (userCoords, business) => {
    if (!userCoords || !business) return;

    // Calcular distancia
    const dist = calculateDistance(
      userCoords.latitude,
      userCoords.longitude,
      business.CoordenadasLat,
      business.CoordenadasLng
    );
    setDistance(dist.toFixed(2));

    // Calcular región que incluya ambos puntos
    const midLat = (userCoords.latitude + business.CoordenadasLat) / 2;
    const midLng = (userCoords.longitude + business.CoordenadasLng) / 2;
    
    // Calcular deltas para asegurar que ambos puntos sean visibles
    const latDelta = Math.abs(userCoords.latitude - business.CoordenadasLat) * 1.5 + 0.01;
    const lngDelta = Math.abs(userCoords.longitude - business.CoordenadasLng) * 1.5 + 0.01;

    setRegion({
      latitude: midLat,
      longitude: midLng,
      latitudeDelta: Math.max(latDelta, 0.05),
      longitudeDelta: Math.max(lngDelta, 0.05),
    });
  };

  // Coordenadas para la línea entre usuario y restaurante
  const routeCoordinates = currentUserLocation && empresa ? [
    {
      latitude: currentUserLocation.latitude,
      longitude: currentUserLocation.longitude,
    },
    {
      latitude: empresa.CoordenadasLat,
      longitude: empresa.CoordenadasLng,
    }
  ] : [];

  if (errorMsg && !userLocation) {
    return (
      <View style={styles.center}>
        <Text>{errorMsg}</Text>
      </View>
    );
  }

  // Mostrar loading mientras se obtiene la ubicación
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
        {/* Marcador del usuario */}
        {currentUserLocation && (
          <Marker
            coordinate={currentUserLocation}
            title="Mi Ubicación"
            description="Estás aquí"
            pinColor="blue"
          />
        )}

        {/* Marcador del restaurante/negocio */}
        {empresa && (
          <Marker
            coordinate={{
              latitude: empresa.CoordenadasLat,
              longitude: empresa.CoordenadasLng,
            }}
            title={empresa.Nombre}
            description={`${empresa.Direccion} - ${distance} km`}
            pinColor="red"
          />
        )}

        {/* Línea de ruta entre usuario y restaurante */}
        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="#007AFF"
            strokeWidth={3}
            lineDashPattern={[5, 5]}
          />
        )}
      </MapView>

      {/* Panel de información */}
      {empresa && currentUserLocation && (
        <View style={styles.infoPanel}>
          <Text style={styles.businessName}>{empresa.Nombre}</Text>
          <Text style={styles.distanceText}>Distancia: {distance} km</Text>
          <Text style={styles.addressText}>{empresa.Direccion}</Text>
          {empresa.TelefonoContacto && (
            <Text style={styles.phoneText}>📞 {empresa.TelefonoContacto}</Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  map: { 
    flex: 1 
  },
  center: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  infoPanel: {
    position: 'absolute',
    top: 20,
    left: 10,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  businessName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  distanceText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 5,
  },
  addressText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  phoneText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
});