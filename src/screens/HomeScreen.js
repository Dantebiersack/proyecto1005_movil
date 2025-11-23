import React, { useState, useEffect } from "react";
import { 
  View, 
  ScrollView, 
  StyleSheet, 
  Text, 
  ActivityIndicator, 
  Alert,
  Image,
  TouchableOpacity 
} from "react-native";
import Header from "../components/Header";
import Categories from "../components/Categories";
import SearchFilters from "../components/SearchFilters";
import BusinessCard from "../components/BusinessCard";
import LocationStatus from "../components/LocationStatus";
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';

// Estilos
import { lightTheme, darkTheme } from "../styles/themes";
import styles from "../styles/HomeScreenStyles";

export default function HomeScreen({ navigation }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategoria, setSelectedCategoria] = useState("todas");
  const [selectedKm, setSelectedKm] = useState("2");

  // Datos backend
  const [empresas, setEmpresas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ubicación
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);

  // ⭐ Valoraciones
  const [valoraciones, setValoraciones] = useState([]);

  // Map categorías
  const categoriasMap = {
    1: "Restaurantes",
    2: "Belleza y Spa",
    3: "Servicios Técnicos",
    4: "Salud",
    5: "Moda y Accesorios",
    6: "Educación",
    7: "Deportes y Fitness",
    8: "Servicios Automotrices",
    todas: "Todas",
  };

  const themeStyles = isDarkMode ? darkTheme : lightTheme;

  // Función distancia (Haversine)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const toRad = (x) => (x * Math.PI) / 180;
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

        if (status !== "granted") {
          setLocationError("Permiso de ubicación denegado");
          return;
        }

        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        setLocationError(null);
      } catch (error) {
        console.error("Error getting location:", error);
        setLocationError("Error obteniendo la ubicación");

        // León Gto default
        setUserLocation({
          latitude: 21.121017,
          longitude: -101.682254,
        });
      }
    };

    getLocation();
  }, []);

  // Obtener negocios
  useEffect(() => {
    const fetchNegocios = async () => {
      try {
        setLoading(true);

        const apiUrl = "https://nearbizbackend3.vercel.app/api/Negocios";
        const response = await fetch(apiUrl);

        if (!response.ok) throw new Error(`Error: ${response.status}`);

        const data = await response.json();
        setEmpresas(data);

        // Categorías únicas
        const catsUnicas = [...new Set(data.map((item) => item.IdCategoria))];
        setCategorias(catsUnicas);
      } catch (error) {
        console.error("Error fetching data:", error);
        Alert.alert("Error", "No se pudieron cargar los negocios.");
      } finally {
        setLoading(false);
      }
    };

    fetchNegocios();
  }, []);

  // ⭐ Obtener valoraciones
  useEffect(() => {
    const fetchValoraciones = async () => {
      try {
        const url = "https://nearbizbackend3.vercel.app/api/Valoraciones";
        const res = await fetch(url);
        const data = await res.json();
        setValoraciones(data);
      } catch (e) {
        console.error("Error cargando valoraciones", e);
      }
    };

    fetchValoraciones();
  }, []);

  // ⭐ Calcular promedio por negocio
  const getPromedio = (idNegocio) => {
    const vals = valoraciones.filter((v) => v.IdNegocio === idNegocio);
    if (vals.length === 0) return 0;

    const suma = vals.reduce((acc, v) => acc + Number(v.Calificacion), 0);
    return suma / vals.length;
  };

  // Parsear horario - MEJORADO para manejar strings JSON escapados
  const parseHorario = (horarioString) => {
    try {
      // Si ya es un objeto, devolverlo directamente
      if (typeof horarioString === 'object' && horarioString !== null) {
        return horarioString;
      }
      
      // Si es string, intentar parsear
      if (typeof horarioString === 'string') {
        const cleanedString = horarioString.trim();
        
        // Si parece ser JSON (empieza con [ o {), intentar parsearlo
        if (cleanedString.startsWith('[') || cleanedString.startsWith('{')) {
          // Intentar parsear directamente
          try {
            return JSON.parse(cleanedString);
          } catch (firstError) {
            // Si falla, puede ser porque tiene comillas escapadas
            // Intentar limpiar el string y parsear nuevamente
            const unescapedString = cleanedString
              .replace(/\\"/g, '"') // Reemplazar \" por "
              .replace(/^"+|"+$/g, ''); // Remover comillas al inicio y final si las hay
            
            try {
              return JSON.parse(unescapedString);
            } catch (secondError) {
              console.warn("No se pudo parsear el horario JSON:", cleanedString);
              return [];
            }
          }
        }
        
        // Si empieza con letras (formato de texto como "L-S 10:00-19:00")
        if (/^[A-Za-z]/.test(cleanedString)) {
          return convertirHorarioTextoAJSON(cleanedString);
        }
      }
      
      // Para cualquier otro caso, devolver array vacío
      return [];
    } catch (error) {
      console.error("Error parsing horario:", error, "Horario string:", horarioString);
      return [];
    }
  };

  // Función para convertir formato de texto a JSON (para horarios en formato texto)
  const convertirHorarioTextoAJSON = (horarioString) => {
    if (!horarioString || typeof horarioString !== 'string') {
      return [];
    }

    const texto = horarioString.trim().toUpperCase();
    
    // Mapeo de días
    const diasMap = {
      'L': 'Lunes',
      'M': 'Martes', 
      'MI': 'Miércoles',
      'J': 'Jueves',
      'V': 'Viernes',
      'S': 'Sábado',
      'D': 'Domingo'
    };

    // Patrones comunes
    const patrones = [
      // Formato: "L-S 10:00-19:00" o "L-D 10:00-20:00"
      /^([A-Z]+)-([A-Z]+)\s+(\d{1,2}:\d{2})-(\d{1,2}:\d{2})$/,
      // Formato: "L-S 10:00 a 9:00" 
      /^([A-Z]+)-([A-Z]+)\s+(\d{1,2}:\d{2})\s+a\s+(\d{1,2}:\d{2})$/
    ];

    for (const patron of patrones) {
      const match = texto.match(patron);
      if (match) {
        const diaInicio = match[1];
        const diaFin = match[2];
        const horaInicio = match[3];
        let horaFin = match[4];

        // Obtener rango de días
        const diasOrden = ['L', 'M', 'MI', 'J', 'V', 'S', 'D'];
        const inicioIndex = diasOrden.indexOf(diaInicio);
        const finIndex = diasOrden.indexOf(diaFin);
        
        if (inicioIndex === -1 || finIndex === -1) {
          return [];
        }

        const horarios = [];
        for (let i = inicioIndex; i <= finIndex; i++) {
          const diaAbrev = diasOrden[i];
          if (diasMap[diaAbrev]) {
            horarios.push({
              dia: diasMap[diaAbrev],
              activo: true,
              inicio: horaInicio,
              fin: horaFin
            });
          }
        }

        return horarios;
      }
    }

    // Si no coincide con ningún patrón, devolver array vacío
    return [];
  };

  // Verificar si está abierto ahora
  const estaAbierto = (horarioString) => {
    const horarios = parseHorario(horarioString);
    
    // Si no hay horarios válidos, considerar cerrado
    if (!horarios || horarios.length === 0) {
      return false;
    }
    
    const ahora = new Date();
    const diaSemana = ahora.getDay();
    const horaActual = ahora.getHours() + ahora.getMinutes() / 60;
    
    const diasMap = {
      0: "Domingo",
      1: "Lunes", 
      2: "Martes",
      3: "Miércoles",
      4: "Jueves",
      5: "Viernes",
      6: "Sábado"
    };
    
    const diaActual = diasMap[diaSemana];
    const horarioHoy = horarios.find(h => h.dia === diaActual);
    
    if (!horarioHoy || !horarioHoy.activo) return false;
    
    const [inicioHora, inicioMinuto] = horarioHoy.inicio.split(':').map(Number);
    const [finHora, finMinuto] = horarioHoy.fin.split(':').map(Number);
    
    const inicioTotal = inicioHora + inicioMinuto / 60;
    const finTotal = finHora + finMinuto / 60;
    
    return horaActual >= inicioTotal && horaActual <= finTotal;
  };

  // Obtener días de atención para mostrar
  const obtenerDiasAtencion = (horarioString) => {
    const horarios = parseHorario(horarioString);
    
    if (!horarios || horarios.length === 0) {
      return "Horario no disponible";
    }
    
    const diasActivos = horarios
      .filter(h => h.activo)
      .map(h => h.dia);
    
    if (diasActivos.length === 0) {
      return "Cerrado temporalmente";
    }
    
    // Si está abierto todos los días
    if (diasActivos.length === 7) {
      return "Todos los días";
    }
    
    // Si está abierto de lunes a viernes
    if (diasActivos.length === 5 && 
        diasActivos.includes('Lunes') && 
        diasActivos.includes('Martes') && 
        diasActivos.includes('Miércoles') && 
        diasActivos.includes('Jueves') && 
        diasActivos.includes('Viernes')) {
      return "Lunes a Viernes";
    }
    
    // Si está abierto de lunes a sábado
    if (diasActivos.length === 6 && 
        diasActivos.includes('Lunes') && 
        diasActivos.includes('Martes') && 
        diasActivos.includes('Miércoles') && 
        diasActivos.includes('Jueves') && 
        diasActivos.includes('Viernes') && 
        diasActivos.includes('Sábado')) {
      return "Lunes a Sábado";
    }
    
    // En otros casos, mostrar los días específicos
    return diasActivos.map(dia => dia.substring(0, 3)).join(', ');
  };

  // Obtener horario de hoy
  const obtenerHorarioHoy = (horarioString) => {
    const horarios = parseHorario(horarioString);
    
    if (!horarios || horarios.length === 0) {
      return "Horario no disponible";
    }
    
    const ahora = new Date();
    const diaSemana = ahora.getDay();
    
    const diasMap = {
      0: "Domingo",
      1: "Lunes", 
      2: "Martes",
      3: "Miércoles",
      4: "Jueves",
      5: "Viernes",
      6: "Sábado"
    };
    
    const diaActual = diasMap[diaSemana];
    const horarioHoy = horarios.find(h => h.dia === diaActual);
    
    if (!horarioHoy || !horarioHoy.activo) {
      return "Cerrado hoy";
    }
    
    return `${horarioHoy.inicio} - ${horarioHoy.fin}`;
  };

  // Actualizar ubicación
  const handleActualizarUbicacion = async () => {
    try {
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      setLocationError(null);
      Alert.alert("Éxito", "Ubicación actualizada correctamente");
    } catch (error) {
      console.error("Error updating location:", error);
      Alert.alert("Error", "No se pudo actualizar la ubicación");
    }
  };

  // Filtrar negocios
  const negociosFiltrados = empresas
    .filter((empresa) => {
      if (!userLocation) return true;

      const distancia = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        parseFloat(empresa.CoordenadasLat),
        parseFloat(empresa.CoordenadasLng)
      );

      const coincideBusqueda =
        empresa.Nombre.toLowerCase().includes(search.toLowerCase()) ||
        empresa.Descripcion.toLowerCase().includes(search.toLowerCase()) ||
        categoriasMap[empresa.IdCategoria]
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const coincideCategoria =
        selectedCategoria === "todas" ||
        empresa.IdCategoria.toString() === selectedCategoria;

      const dentroDeRango = distancia <= parseFloat(selectedKm);

      return coincideBusqueda && coincideCategoria && dentroDeRango;
    })
    .map((empresa) => {
      const distancia = userLocation
        ? calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            parseFloat(empresa.CoordenadasLat),
            parseFloat(empresa.CoordenadasLng)
          )
        : 0;

      return {
        ...empresa,
        distancia,
        estaAbierto: estaAbierto(empresa.HorarioAtencion),
        rating: getPromedio(empresa.IdNegocio),
        diasAtencion: obtenerDiasAtencion(empresa.HorarioAtencion),
        horarioHoy: obtenerHorarioHoy(empresa.HorarioAtencion)
      };
    })
    .sort((a, b) => a.distancia - b.distancia);

  const limpiarFiltros = () => {
    setSearch("");
    setSelectedCategoria("todas");
    setSelectedKm("2");
  };

  const handleVerMapa = (empresa) => {
    if (!userLocation) {
      Alert.alert("Ubicación no disponible", "No se pudo obtener tu ubicación");
      return;
    }

    navigation.navigate("Mapa", {
      empresa: empresa,
      userLocation: userLocation,
      categoria: categoriasMap[empresa.IdCategoria],
    });
  };

  const handleAgendar = (empresa) => {
    navigation.navigate("DateScreen", {
      empresa: empresa,
      isDarkMode: isDarkMode,
    });
  };

  const handleVerDetalles = (empresa) => {
    navigation.navigate("BusinessDetail", {
      empresa: empresa,
      categoria: categoriasMap[empresa.IdCategoria],
      rating: getPromedio(empresa.IdNegocio),
      estaAbierto: estaAbierto(empresa.HorarioAtencion)
    });
  };

  // Renderizar estrellas de rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Ionicons key={i} name="star" size={16} color="#FFD700" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<Ionicons key={i} name="star-half" size={16} color="#FFD700" />);
      } else {
        stars.push(<Ionicons key={i} name="star-outline" size={16} color="#FFD700" />);
      }
    }

    return stars;
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
      <Header
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        themeStyles={themeStyles}
        onPressNotifications={() => navigation.navigate("NotificationsScreen")} 
      />

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* UBICACIÓN */}
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
              {userLocation
                ? `Empresas cercanas (${negociosFiltrados.length})`
                : "Empresas"}
            </Text>

            {userLocation && (
              <Text style={[styles.distanceInfo, themeStyles.text]}>
                En un radio de {selectedKm} km
                {selectedCategoria !== "todas" &&
                  ` • ${categoriasMap[selectedCategoria]}`}
              </Text>
            )}
          </View>

          {negociosFiltrados.length > 0 ? (
            negociosFiltrados.map((empresa) => (
              <TouchableOpacity 
                key={empresa.IdNegocio}
                onPress={() => handleVerDetalles(empresa)}
                activeOpacity={0.9}
              >
                <View style={[
                  localStyles.businessCard,
                  themeStyles.card,
                  { marginBottom: 16 }
                ]}>
                  {/* Imagen del negocio */}
                  {empresa.LinkUrl && (
                    <Image 
                      source={{ uri: empresa.LinkUrl }}
                      style={localStyles.businessImage}
                      resizeMode="cover"
                    />
                  )}
                  
                  <View style={localStyles.businessContent}>
                    {/* Header con nombre y estado */}
                    <View style={localStyles.businessHeader}>
                      <View style={localStyles.nameContainer}>
                        <Text style={[localStyles.businessName, themeStyles.text]}>
                          {empresa.Nombre}
                        </Text>
                        <View style={localStyles.statusContainer}>
                          <View style={[
                            localStyles.statusIndicator,
                            { backgroundColor: empresa.estaAbierto ? '#4CAF50' : '#F44336' }
                          ]} />
                          <Text style={[
                            localStyles.statusText,
                            { color: empresa.estaAbierto ? '#4CAF50' : '#F44336' }
                          ]}>
                            {empresa.estaAbierto ? 'Abierto' : 'Cerrado'}
                          </Text>
                        </View>
                      </View>
                      
                      {/* Rating */}
                      <View style={localStyles.ratingContainer}>
                        {renderStars(empresa.rating)}
                        <Text style={[localStyles.ratingText, themeStyles.text]}>
                          ({empresa.rating.toFixed(1)})
                        </Text>
                      </View>
                    </View>

                    {/* Categoría y distancia */}
                    <View style={localStyles.metaContainer}>
                      <View style={localStyles.categoryTag}>
                        <Ionicons name="pricetag" size={14} color="#666" />
                        <Text style={localStyles.categoryText}>
                          {categoriasMap[empresa.IdCategoria]}
                        </Text>
                      </View>
                      {userLocation && (
                        <View style={localStyles.distanceTag}>
                          <Ionicons name="location" size={14} color="#666" />
                          <Text style={localStyles.distanceText}>
                            {empresa.distancia.toFixed(1)} km
                          </Text>
                        </View>
                      )}
                    </View>

                    {/* Descripción */}
                    <Text 
                      style={[localStyles.businessDescription, themeStyles.textSecondary]}
                      numberOfLines={2}
                    >
                      {empresa.Descripcion}
                    </Text>

                    {/* Información de horarios */}
                    <View style={localStyles.horarioContainer}>
                      <View style={localStyles.horarioItem}>
                        <Ionicons name="calendar" size={14} color="#666" />
                        <Text style={[localStyles.horarioText, themeStyles.textSecondary]}>
                          {empresa.diasAtencion}
                        </Text>
                      </View>
                      <View style={localStyles.horarioItem}>
                        <Ionicons name="time" size={14} color="#666" />
                        <Text style={[localStyles.horarioText, themeStyles.textSecondary]}>
                          {empresa.horarioHoy}
                        </Text>
                      </View>
                    </View>

                    {/* Información de contacto */}
                    <View style={localStyles.contactContainer}>
                      <View style={localStyles.contactItem}>
                        <Ionicons name="call" size={14} color="#666" />
                        <Text style={[localStyles.contactText, themeStyles.textSecondary]}>
                          {empresa.TelefonoContacto}
                        </Text>
                      </View>
                      <View style={localStyles.contactItem}>
                        <Ionicons name="mail" size={14} color="#666" />
                        <Text style={[localStyles.contactText, themeStyles.textSecondary]}>
                          {empresa.CorreoContacto}
                        </Text>
                      </View>
                    </View>

                    {/* Botones de acción */}
                    <View style={localStyles.actionsContainer}>
                      <TouchableOpacity 
                        style={[localStyles.actionButton, localStyles.mapButton]}
                        onPress={() => handleVerMapa(empresa)}
                      >
                        <Ionicons name="map" size={16} color="#007AFF" />
                        <Text style={localStyles.mapButtonText}>Ver Mapa</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        style={[localStyles.actionButton, localStyles.scheduleButton]}
                        onPress={() => handleAgendar(empresa)}
                      >
                        <Ionicons name="calendar" size={16} color="#FFFFFF" />
                        <Text style={localStyles.scheduleButtonText}>Agendar</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.noResults}>
              <Ionicons name="business-outline" size={64} color="#666" />
              <Text style={[styles.noResultsText, themeStyles.text]}>
                {userLocation
                  ? "No se encontraron negocios con los filtros aplicados"
                  : "Esperando ubicación..."}
              </Text>

              {(search ||
                selectedCategoria !== "todas" ||
                selectedKm !== "2") && (
                <Text style={[styles.noResultsSubtext, themeStyles.text]}>
                  Intenta con otros filtros o limpia los filtros
                </Text>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const localStyles = StyleSheet.create({
  businessCard: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  businessImage: {
    width: '100%',
    height: 160,
  },
  businessContent: {
    padding: 16,
  },
  businessHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  nameContainer: {
    flex: 1,
  },
  businessName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    marginLeft: 4,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  distanceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  distanceText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  businessDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  horarioContainer: {
    marginBottom: 12,
  },
  horarioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  horarioText: {
    fontSize: 12,
    marginLeft: 6,
  },
  contactContainer: {
    marginBottom: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  contactText: {
    fontSize: 12,
    marginLeft: 6,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  mapButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  scheduleButton: {
    backgroundColor: '#007AFF',
  },
  mapButtonText: {
    color: '#007AFF',
    fontWeight: '600',
    marginLeft: 6,
  },
  scheduleButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 6,
  },
});