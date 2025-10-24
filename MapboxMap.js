import * as React from 'react';
import { StyleSheet, View, Text, TextInput, Button, FlatList, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export default function MapboxMap() {
  const [region, setRegion] = React.useState({
    latitude: 40.7128,
    longitude: -74.0060,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [userLocation, setUserLocation] = React.useState(null);
  const [errorMsg, setErrorMsg] = React.useState(null);

  const [destinations, setDestinations] = React.useState([]); // Lista de destinos
  const [destinationInput, setDestinationInput] = React.useState("");

  // Obtener ubicación del usuario
  React.useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permiso de ubicación denegado.');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setRegion(prev => ({ ...prev, ...coords, latitudeDelta: 0.04, longitudeDelta: 0.02 }));
      setUserLocation(coords);
    })();
  }, []);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = x => (x * Math.PI) / 180;
    const R = 6371; // km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const addDestination = () => {
    if (!destinationInput) return Alert.alert("Error", "Ingresa coordenadas lat,lng");
    const parts = destinationInput.split(',');
    if (parts.length !== 2) return Alert.alert("Error", "Formato incorrecto, usar lat,lng");
    const lat = parseFloat(parts[0]);
    const lng = parseFloat(parts[1]);

    if (!userLocation) return Alert.alert("Error", "Ubicación del usuario no disponible");

    const distance = calculateDistance(userLocation.latitude, userLocation.longitude, lat, lng);

    const newDestination = { latitude: lat, longitude: lng, distance };
    const updatedDestinations = [...destinations, newDestination].sort((a, b) => a.distance - b.distance);

    setDestinations(updatedDestinations);
    setDestinationInput("");
  };

  if (errorMsg) {
    return <View style={styles.center}><Text>{errorMsg}</Text></View>;
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={styles.map}
        initialRegion={region}
        region={region}
        showsUserLocation={true}
        followsUserLocation={true}
        onRegionChangeComplete={setRegion}
      >
        <Marker
          coordinate={region}
          title="Mi Ubicación"
          description="Aquí estoy"
        />
        {destinations.map((dest, index) => (
          <Marker
            key={index}
            coordinate={{ latitude: dest.latitude, longitude: dest.longitude }}
            title={`Destino ${index + 1}`}
            description={`${dest.distance.toFixed(2)} km de ti`}
            pinColor="green"
          />
        ))}
      </MapView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Latitud,Longitud"
          value={destinationInput}
          onChangeText={setDestinationInput}
        />
        <Button title="Agregar Destino" onPress={addDestination} />
      </View>

      <View style={styles.listContainer}>
        <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Destinos más cercanos:</Text>
        <FlatList
          data={destinations}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <Text>{index + 1}. ({item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}) - {item.distance.toFixed(2)} km</Text>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  map: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  inputContainer: {
    position: 'absolute',
    bottom: 100,
    left: 10,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', marginRight: 10, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  listContainer: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    maxHeight: 90,
  },
});
