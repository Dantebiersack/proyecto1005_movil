import React, { useState, useEffect } from "react";
import { View, ScrollView, StyleSheet, Text, ActivityIndicator, Alert } from "react-native";
import Header from "../components/Header";
import Categories from "../components/Categories";
import SearchFilters from "../components/SearchFilters";
import BusinessCard from "../components/BusinessCard";
import LocationStatus from "../components/LocationStatus";
import * as Location from 'expo-location';


//Estilos
import { lightTheme, darkTheme } from "../styles/themes";
import styles from "../styles/HomeScreenStyles";

export default function HomeScreen({ navigation }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategoria, setSelectedCategoria] = useState("todas");
  const [selectedKm, setSelectedKm] = useState("2");
  
  // Estados para datos del backend
  const [empresas, setEmpresas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);

  // Mapa de categorías
  const categoriasMap = {
    1: "Restaurantes",
    2: "Belleza y Spa", 
    3: "Servicios Técnicos",
    4: "Salud",
    5: "Moda y Accesorios",
    6: "Educación",
    7: "Deportes y Fitness",
    8: "Servicios Automotrices",
    todas: "Todas"
  };

  const themeStyles = isDarkMode ? darkTheme : lightTheme;

  // Función para calcular distancia real usando Haversine
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
        let { status } = await Location.requestForegroundPermissionsAsync();
        
        if (status !== 'granted') {
          setLocationError('Permiso de ubicación denegado');
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
          ? 'https://37b3ca65363e.ngrok-free.app/api/Negocios'
          : 'https://37b3ca65363e.ngrok-free.app/api/Negocios';
        
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

  // Función para actualizar ubicación
  const handleActualizarUbicacion = async () => {
    try {
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
    }
  };

  // Filtrar empresas basado en búsqueda, distancia, ubicación y categoría
  const negociosFiltrados = empresas.filter((empresa) => {
    // Si no tenemos ubicación, mostrar todas las empresas
    if (!userLocation) {
      return true;
    }

    // Calcular distancia
    const distancia = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      empresa.CoordenadasLat,
      empresa.CoordenadasLng
    );

    // Aplicar filtros
    const coincideBusqueda = 
      empresa.Nombre.toLowerCase().includes(search.toLowerCase()) ||
      empresa.Descripcion.toLowerCase().includes(search.toLowerCase()) ||
      (categoriasMap[empresa.IdCategoria]?.toLowerCase().includes(search.toLowerCase()));

    const coincideCategoria =
      selectedCategoria === "todas" || 
      empresa.IdCategoria.toString() === selectedCategoria;

    const dentroDeRango = distancia <= parseFloat(selectedKm);

    return coincideBusqueda && coincideCategoria && dentroDeRango;
  }).map(empresa => {
    // Calcular distancia para cada empresa
    const distancia = userLocation ? calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      empresa.CoordenadasLat,
      empresa.CoordenadasLng
    ) : 0;

    return {
      ...empresa,
      distancia
    };
  }).sort((a, b) => a.distancia - b.distancia); // Ordenar por distancia

  const limpiarFiltros = () => {
    setSearch("");
    setSelectedCategoria("todas");
    setSelectedKm("2");
  };

  // Función para manejar ver mapa
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

  // Función para manejar agendar cita
  const handleAgendar = (empresa) => {
  navigation.navigate("DateScreen", { 
    empresa: empresa,
    isDarkMode: isDarkMode
  });
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
    <View style={[styles.container, themeStyles.container]}>
      {/* HEADER */}
      <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} themeStyles={themeStyles} />

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* ESTADO DE UBICACIÓN */}
        <LocationStatus 
          themeStyles={themeStyles}
          userLocation={userLocation}
          locationError={locationError}
          onUpdateLocation={handleActualizarUbicacion}
        />

        {/* FILTROS */}
        <SearchFilters
          search={search}
          setSearch={setSearch}
          selectedKm={selectedKm}
          setSelectedKm={setSelectedKm}
          limpiarFiltros={limpiarFiltros}
          isDarkMode={isDarkMode}
          themeStyles={themeStyles}
        />

        {/* CATEGORÍAS */}
        <Categories
          categorias={categorias}
          selectedCategoria={selectedCategoria}
          setSelectedCategoria={setSelectedCategoria}
          categoriasMap={categoriasMap}
          themeStyles={themeStyles}
        />

        {/* RESULTADOS */}
        <View style={styles.resultsContainer}>
          <View style={styles.resultsHeader}>
            <Text style={[styles.resultsTitle, themeStyles.text]}>
              {userLocation ? `Empresas cercanas (${negociosFiltrados.length})` : 'Empresas'}
            </Text>
            {userLocation && (
              <Text style={[styles.distanceInfo, themeStyles.text]}>
                En un radio de {selectedKm} km
                {selectedCategoria !== "todas" && ` • ${categoriasMap[selectedCategoria]}`}
              </Text>
            )}
          </View>

          {negociosFiltrados.length > 0 ? (
            negociosFiltrados.map((empresa) => (
              <BusinessCard 
                key={empresa.IdNegocio} 
                negocio={{
                  id: empresa.IdNegocio,
                  nombre: empresa.Nombre,
                  categoriaId: empresa.IdCategoria,
                  distancia: empresa.distancia,
                  descripcion: empresa.Descripcion,
                  direccion: empresa.Direccion,
                  telefonoContacto: empresa.TelefonoContacto,
                  horarioAtencion: empresa.HorarioAtencion,
                  coordenadas: {
                    lat: empresa.CoordenadasLat,
                    lng: empresa.CoordenadasLng
                  }
                }}
                categoriasMap={categoriasMap}
                themeStyles={themeStyles}
                onVerMapa={() => handleVerMapa(empresa)}
                onAgendar={() => handleAgendar(empresa)}
              />
            ))
          ) : (
            <View style={styles.noResults}>
              <Text style={[styles.noResultsText, themeStyles.text]}>
                {userLocation 
                  ? 'No se encontraron negocios con los filtros aplicados'
                  : 'Esperando ubicación...'}
              </Text>
              {(search || selectedCategoria !== "todas") && (
                <Text style={[styles.noResultsSubtext, themeStyles.text]}>
                  Intenta con otros filtros o limpia los filtros actuales
                </Text>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

