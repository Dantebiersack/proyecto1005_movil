// App.js (React Native)
import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapboxMap from './MapboxMap'; // Aunque ahora será un componente de mapa diferente

export default function App() {
  return (
    // Reemplazamos <div> por <View>
    <View style={styles.container}>
      <MapboxMap />
    </View>
  );
}

const styles = StyleSheet.create({
  // Ocupa toda la pantalla
  container: {
    flex: 1, 
  },
});