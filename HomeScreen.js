import React, { useState, useEffect } from 'react'; 
import {
  View,
  Text,
  Switch,
  TextInput,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as Location from 'expo-location';

export default function HomeScreen({ navigation }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedKm, setSelectedKm] = useState("2");
  const [search, setSearch] = useState("");
  const [empresas, setEmpresas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locationLoading, setLocationLoading] = useState(true);
  const [filteredEmpresas, setFilteredEmpresas] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [selectedCategoria, setSelectedCategoria] = useState("todas"); // Nuevo estado para categoría seleccionada

  const themeStyles = isDarkMode ? darkTheme : lightTheme;

  // Mapa opcional de nombres bonitos de categorías
  const categoriasMap = {
    1: "Restaurantes",
    2: "Belleza y Spa",
    3: "Servicios Técnicos",
    4: "Salud",
    5: "Moda y Accesorios",
    6: "Educación",
    7: "Deportes y Fitness",
    8: "Servicios Automotrices"
  };

  // Función para calcular distancia real usando la fórmula de Haversine
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

  // Obtener ubicación del usuario
  useEffect(() => {
    const getLocation = async () => {
      try {
        setLocationLoading(true);
        let { status } = await Location.requestForegroundPermissionsAsync();
        
        if (status !== 'granted') {
          setLocationError('Permiso de ubicación denegado');
          setLocationLoading(false);
          return;
        }

        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced
        });
        
        const coords = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        
        setUserLocation(coords);
        setLocationError(null);
        
      } catch (error) {
        console.error('Error getting location:', error);
        setLocationError('Error obteniendo la ubicación');
        
        // Ubicación por defecto (León, Guanajuato)
        setUserLocation({
          latitude: 21.121017,
          longitude: -101.682254
        });
      } finally {
        setLocationLoading(false);
      }
    };

    getLocation();
  }, []);

  // Consumir la API de negocios
  useEffect(() => {
    const fetchNegocios = async () => {
      try {
        setLoading(true);
        const apiUrl = __DEV__ 
          ? 'https://32e1074aa67d.ngrok-free.app/api/Negocios'
          : 'https://32e1074aa67d.ngrok-free.app/api/Negocios';
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        setEmpresas(data);
        
        // Extraer categorías únicas desde los datos
        const catsUnicas = [...new Set(data.map(item => item.IdCategoria))];
        setCategorias(catsUnicas);
        
      } catch (error) {
        console.error('Error fetching data:', error);
        Alert.alert(
          'Error',
          'No se pudieron cargar los negocios desde la base de datos.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNegocios();
  }, []);

  // Filtrar empresas basado en búsqueda, distancia, ubicación y categoría
  useEffect(() => {
    if (!userLocation || empresas.length === 0) {
      setFilteredEmpresas([]);
      return;
    }

    let resultados = [...empresas];

    // Filtrar por categoría
    if (selectedCategoria !== "todas") {
      resultados = resultados.filter(empresa => 
        empresa.IdCategoria.toString() === selectedCategoria
      );
    }

    // Filtrar por búsqueda
    if (search) {
      resultados = resultados.filter(empresa =>
        empresa.Nombre.toLowerCase().includes(search.toLowerCase()) ||
        empresa.Descripcion.toLowerCase().includes(search.toLowerCase()) ||
        categoriasMap[empresa.IdCategoria]?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filtrar por distancia real
    const distanciaMaxima = parseInt(selectedKm);
    resultados = resultados
      .map(empresa => {
        const distancia = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          empresa.CoordenadasLat,
          empresa.CoordenadasLng
        );
        return { ...empresa, distancia };
      })
      .filter(empresa => empresa.distancia <= distanciaMaxima)
      .sort((a, b) => a.distancia - b.distancia);

    setFilteredEmpresas(resultados);
  }, [search, selectedKm, empresas, userLocation, selectedCategoria]);

  const handleVerMapa = (empresa) => {
    if (!userLocation) {
      Alert.alert('Ubicación no disponible', 'No se pudo obtener tu ubicación actual');
      return;
    }
    
    navigation.navigate("Mapa", { 
      empresa: empresa,
      userLocation: userLocation,
      categoria: categoriasMap[empresa.IdCategoria]
    });
  };

  const handleActualizarUbicacion = async () => {
    try {
      setLocationLoading(true);
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced
      });
      
      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      
      setUserLocation(coords);
      setLocationError(null);
      Alert.alert('Éxito', 'Ubicación actualizada correctamente');
      
    } catch (error) {
      console.error('Error updating location:', error);
      Alert.alert('Error', 'No se pudo actualizar la ubicación');
    } finally {
      setLocationLoading(false);
    }
  };

  // Función para limpiar todos los filtros
  const limpiarFiltros = () => {
    setSearch("");
    setSelectedCategoria("todas");
    setSelectedKm("2");
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, themeStyles.container]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={[styles.loadingText, themeStyles.text]}>
          Cargando negocios...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, themeStyles.container]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <Image
          source={require('./assets/LogoNearBiz.jpeg')}
          style={styles.logo}
        />
        <Text style={[styles.companyName, themeStyles.text]}>NearBiz</Text>

        <View style={styles.switchContainer}>
          <Text style={[styles.switchLabel, themeStyles.text]}>
            {isDarkMode ? '🌙' : '☀️'}
          </Text>
          <Switch
            value={isDarkMode}
            onValueChange={() => setIsDarkMode(!isDarkMode)}
          />
        </View>
      </View>

      {/* UBICACIÓN */}
      <View style={styles.locationSection}>
        {locationLoading ? (
          <View style={styles.locationStatus}>
            <ActivityIndicator size="small" color="#007AFF" />
            <Text style={[styles.locationText, themeStyles.text]}>
              Obteniendo ubicación...
            </Text>
          </View>
        ) : userLocation ? (
          <View style={styles.locationStatus}>
            <Text style={[styles.locationText, themeStyles.text]}>
              📍 Ubicación detectada
            </Text>
            <TouchableOpacity 
              style={styles.refreshButton}
              onPress={handleActualizarUbicacion}
            >
              <Text style={styles.refreshButtonText}>Actualizar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.locationStatus}>
            <Text style={[styles.locationError, themeStyles.text]}>
              ⚠️ {locationError || 'Ubicación no disponible'}
            </Text>
            <TouchableOpacity 
              style={styles.refreshButton}
              onPress={handleActualizarUbicacion}
            >
              <Text style={styles.refreshButtonText}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* BUSCADOR Y FILTROS */}
      <View style={styles.searchSection}>
        <TextInput
          style={[styles.searchInput, themeStyles.input]}
          placeholder="Buscar negocio, categoría..."
          placeholderTextColor={isDarkMode ? "#aaa" : "#555"}
          value={search}
          onChangeText={setSearch}
        />

        <View style={styles.filtersRow}>
          <View style={styles.pickerContainer}>
            <Text style={[styles.pickerLabel, themeStyles.text]}>
              Radio:
            </Text>
            <Picker
              selectedValue={selectedKm}
              onValueChange={(itemValue) => setSelectedKm(itemValue)}
              style={[styles.picker, themeStyles.input]}
              dropdownIconColor={isDarkMode ? "#fff" : "#000"}
            >
              <Picker.Item label="2 km" value="2" />
              <Picker.Item label="5 km" value="5" />
              <Picker.Item label="10 km" value="10" />
              <Picker.Item label="15 km" value="15" />
              <Picker.Item label="20 km" value="20" />
            </Picker>
          </View>

         
        </View>

        {/* Botón para limpiar filtros */}
        {(search || selectedCategoria !== "todas" || selectedKm !== "2") && (
          <TouchableOpacity 
            style={styles.clearFiltersButton}
            onPress={limpiarFiltros}
          >
            <Text style={styles.clearFiltersText}>🗑️ Limpiar filtros</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* CATEGORÍAS */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, themeStyles.text]}>Categorías</Text>
        <View style={styles.categoriesContainer}>
          {categorias.map((categoriaId) => (
            <TouchableOpacity 
              key={categoriaId} 
              style={[
                styles.categoryBox, 
                themeStyles.card,
                selectedCategoria === categoriaId.toString() && styles.selectedCategory
              ]}
              onPress={() => setSelectedCategoria(
                selectedCategoria === categoriaId.toString() ? "todas" : categoriaId.toString()
              )}
            >
              <Text style={[
                styles.categoryText, 
                themeStyles.text,
                selectedCategoria === categoriaId.toString() && styles.selectedCategoryText
              ]}>
                {categoriasMap[categoriaId] || `Categoría ${categoriaId}`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* EMPRESAS */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, themeStyles.text]}>
            {userLocation ? `Empresas cercanas (${filteredEmpresas.length})` : 'Empresas'}
          </Text>
          {userLocation && (
            <Text style={[styles.distanceInfo, themeStyles.text]}>
              En un radio de {selectedKm} km
              {selectedCategoria !== "todas" && ` • ${categoriasMap[selectedCategoria] || `Categoría ${selectedCategoria}`}`}
            </Text>
          )}
        </View>

        {filteredEmpresas.length === 0 ? (
          <View style={styles.noResults}>
            <Text style={[styles.noResultsText, themeStyles.text]}>
              {userLocation 
                ? 'No se encontraron negocios con los filtros aplicados'
                : 'Esperando ubicación...'}
            </Text>
            {(search || selectedCategoria !== "todas") && (
              <TouchableOpacity 
                style={styles.clearFiltersButton}
                onPress={limpiarFiltros}
              >
                <Text style={styles.clearFiltersText}>Limpiar filtros</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          filteredEmpresas.map((empresa) => (
            <View key={empresa.IdNegocio} style={[styles.card, themeStyles.card]}>
              <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, themeStyles.text]}>
                  {empresa.Nombre}
                </Text>
                {userLocation && (
                  <Text style={styles.distanceBadge}>
                    {empresa.distancia.toFixed(1)} km
                  </Text>
                )}
              </View>
              
              <Text style={[styles.cardCategory, themeStyles.text]}>
                {categoriasMap[empresa.IdCategoria] || `Categoría ${empresa.IdCategoria}`}
              </Text>
              
              <Text style={[styles.cardText, themeStyles.text]}>
                📍 {empresa.Direccion}
              </Text>
              
              <Text style={[styles.cardDescription, themeStyles.text]}>
                {empresa.Descripcion}
              </Text>
              
              <View style={styles.cardInfoRow}>
                <Text style={[styles.cardInfo, themeStyles.text]}>
                  📞 {empresa.TelefonoContacto}
                </Text>
                <Text style={[styles.cardInfo, themeStyles.text]}>
                  🕒 {empresa.HorarioAtencion}
                </Text>
              </View>

              <View style={styles.cardButtons}>
                <TouchableOpacity
                  style={[styles.button, styles.mapButton]}
                  onPress={() => handleVerMapa(empresa)}
                >
                  <Text style={styles.buttonText}>🗺️ Ver mapa</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.appointmentButton]}
                  onPress={() => {
                    Alert.alert(
                      "Agendar cita",
                      `¿Deseas agendar una cita en ${empresa.Nombre}?\n\nTeléfono: ${empresa.TelefonoContacto}`,
                      [
                        { text: "Cancelar", style: "cancel" },
                        { text: "Llamar", onPress: () => {
                          Alert.alert("Llamar", `Llamando a ${empresa.TelefonoContacto}`);
                        }}
                      ]
                    );
                  }}
                >
                  <Text style={styles.buttonText}>📅 Agendar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

/* 🎨 ESTILOS */
const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 50 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15 },
  logo: { width: 60, height: 60, borderRadius: 10 },
  companyName: { fontSize: 22, fontWeight: 'bold', flex: 1, marginLeft: 10 },
  switchContainer: { flexDirection: 'row', alignItems: 'center' },
  switchLabel: { marginRight: 6, fontSize: 18 },
  locationSection: { marginBottom: 15 },
  locationStatus: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10, borderRadius: 8, backgroundColor: 'rgba(0,122,255,0.1)' },
  locationText: { fontSize: 14, fontWeight: '500' },
  locationError: { fontSize: 14, color: '#ff3b30' },
  refreshButton: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#007AFF', borderRadius: 6 },
  refreshButtonText: { color: 'white', fontSize: 12, fontWeight: '500' },
  searchSection: { marginBottom: 20 },
  searchInput: { borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 10, fontSize: 16 },
  filtersRow: { flexDirection: 'row', justifyContent: 'space-between' },
  pickerContainer: { flex: 1, marginHorizontal: 4 },
  pickerLabel: { marginBottom: 4, fontSize: 14, fontWeight: '500' },
  picker: { height: 40 },
  clearFiltersButton: { backgroundColor: '#ff6b6b', padding: 10, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  clearFiltersText: { color: 'white', fontWeight: 'bold' },
  section: { marginTop: 10 },
  sectionHeader: { marginBottom: 12 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold' },
  distanceInfo: { fontSize: 14, marginTop: 4, opacity: 0.7 },
  categoriesContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  categoryBox: { borderWidth: 1, borderRadius: 10, padding: 15, marginBottom: 10, alignItems: 'center', width: '48%' },
  selectedCategory: { backgroundColor: '#007AFF', borderColor: '#007AFF' },
  categoryText: { fontSize: 14, fontWeight: '500', textAlign: 'center' },
  selectedCategoryText: { color: 'white', fontWeight: 'bold' },
  card: { borderRadius: 12, padding: 15, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 6, elevation: 3 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', flex: 1, marginRight: 10 },
  distanceBadge: { backgroundColor: '#007AFF', color: 'white', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, fontSize: 12, fontWeight: 'bold' },
  cardCategory: { fontSize: 14, fontWeight: '600', marginBottom: 6, color: '#666' },
  cardText: { fontSize: 14, marginVertical: 2 },
  cardDescription: { fontSize: 13, marginVertical: 6, fontStyle: 'italic' },
  cardInfoRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  cardInfo: { fontSize: 12, marginVertical: 1, flex: 1 },
  cardButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  button: { flex: 1, padding: 12, borderRadius: 8, alignItems: 'center', marginHorizontal: 4 },
  mapButton: { backgroundColor: "#d1d1d1" },
  appointmentButton: { backgroundColor: "#b0e0a8" },
  buttonText: { fontWeight: 'bold', fontSize: 14 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, fontSize: 16 },
  noResults: { padding: 20, alignItems: 'center' },
  noResultsText: { fontSize: 16, textAlign: 'center', opacity: 0.7, marginBottom: 10 },
});

/* 🎨 TEMAS */
const lightTheme = StyleSheet.create({
  container: { backgroundColor: "#fff" },
  text: { color: "#000" },
  card: { backgroundColor: "#fff", borderColor: "#ddd" },
  input: { backgroundColor: "#f9f9f9", borderColor: "#ccc", color: "#000" },
});

const darkTheme = StyleSheet.create({
  container: { backgroundColor: "#121212" },
  text: { color: "#fff" },
  card: { backgroundColor: "#1e1e1e", borderColor: "#333" },
  input: { backgroundColor: "#2a2a2a", borderColor: "#555", color: "#fff" },
});