import React, { useState, useEffect, useRef } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Alert, 
  RefreshControl 
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_BASE_URL = 'https://nearbizbackend3.vercel.app/api';

// Configurar el manejo de notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function NotificationsScreen() {
  const [misCitas, setMisCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [idUsuario, setIdUsuario] = useState(null);
  const notificationListener = useRef();

  useEffect(() => {
    obtenerUsuarioActual();
    setupNotificationListener();
  }, []);

  const obtenerUsuarioActual = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const usuario = JSON.parse(userData);
        setIdUsuario(usuario.IdUsuario);
        cargarMisCitas(usuario.IdUsuario);
      }
    } catch (error) {
      console.error('Error obteniendo usuario:', error);
      setLoading(false);
    }
  };

  const setupNotificationListener = () => {
    // Escuchar notificaciones entrantes sobre citas
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('📱 Notificación recibida:', notification);
      
      // Cuando llega una notificación, recargar las citas
      if (idUsuario) {
        cargarMisCitas(idUsuario);
      }
      
      // Mostrar alerta con la notificación
      if (notification.request.content.title) {
        Alert.alert(
          notification.request.content.title,
          notification.request.content.body
        );
      }
    });
  };

  const cargarMisCitas = async (usuarioId) => {
    try {
      setLoading(true);
      
      // Obtener el cliente asociado al usuario
      const clientesRes = await axios.get(`${API_BASE_URL}/clientes`);
      const cliente = clientesRes.data.find(c => c.IdUsuario === usuarioId);
      
      if (!cliente) {
        setMisCitas([]);
        setLoading(false);
        return;
      }
      
      // Obtener las citas del cliente
      const citasRes = await axios.get(`${API_BASE_URL}/citas?idCliente=${cliente.IdCliente}`);
      
      // Filtrar solo citas confirmadas o canceladas y ordenar por fecha más reciente
      const citasFiltradas = citasRes.data
        .filter(cita => cita.Estado === 'confirmada' || cita.Estado === 'cancelada' || cita.Estado === 'rechazada')
        .sort((a, b) => new Date(b.FechaCita) - new Date(a.FechaCita));
      
      setMisCitas(citasFiltradas);
      
    } catch (error) {
      console.error('Error cargando citas:', error);
      Alert.alert('Error', 'No se pudieron cargar tus citas');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    if (idUsuario) {
      cargarMisCitas(idUsuario);
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'confirmada': return '#10B981'; // verde
      case 'cancelada': return '#EF4444';  // rojo
      case 'rechazada': return '#EF4444';  // rojo
      default: return '#6B7280';           // gris
    }
  };

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case 'confirmada': return 'checkmark-circle';
      case 'cancelada': return 'close-circle';
      case 'rechazada': return 'close-circle';
      default: return 'help-circle';
    }
  };

  const getEstadoTexto = (estado) => {
    switch (estado) {
      case 'confirmada': return 'Confirmada';
      case 'cancelada': return 'Cancelada';
      case 'rechazada': return 'Rechazada';
      default: return estado;
    }
  };

  const formatearFecha = (fecha) => {
    try {
      const fechaObj = new Date(fecha);
      return fechaObj.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return fecha;
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Ionicons name="notifications" size={60} color="#39b58b" />
          <Text style={styles.loadingText}>Cargando tus citas...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="notifications" size={28} color="#39b58b" />
        <Text style={styles.headerTitle}>Estado de Citas</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#39b58b']}
          />
        }
      >
        {misCitas.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={80} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No hay citas confirmadas o canceladas</Text>
            <Text style={styles.emptyText}>
              Aquí verás el estado de tus citas cuando sean confirmadas o canceladas.
            </Text>
          </View>
        ) : (
          <View style={styles.citasContainer}>
            <Text style={styles.sectionTitle}>Tus Citas</Text>
            {misCitas.map((cita) => (
              <View key={cita.IdCita} style={styles.citaCard}>
                <View style={styles.citaHeader}>
                  <View style={styles.estadoContainer}>
                    <Ionicons 
                      name={getEstadoIcon(cita.Estado)} 
                      size={20} 
                      color={getEstadoColor(cita.Estado)} 
                    />
                    <Text 
                      style={[
                        styles.estadoTexto,
                        { color: getEstadoColor(cita.Estado) }
                      ]}
                    >
                      {getEstadoTexto(cita.Estado)}
                    </Text>
                  </View>
                  <Text style={styles.citaId}>#{cita.IdCita}</Text>
                </View>
                
                <View style={styles.citaInfo}>
                  <Text style={styles.fechaTexto}>
                    {formatearFecha(cita.FechaCita)}
                  </Text>
                  <Text style={styles.horaTexto}>
                    {cita.HoraInicio} - {cita.HoraFin}
                  </Text>
                </View>

                {cita.MotivoCancelacion && (
                  <View style={styles.motivoContainer}>
                    <Text style={styles.motivoLabel}>Motivo:</Text>
                    <Text style={styles.motivoTexto}>{cita.MotivoCancelacion}</Text>
                  </View>
                )}

                <View style={styles.footer}>
                  <Text style={styles.footerText}>
                    {cita.Estado === 'confirmada' ? '✅ Tu cita está confirmada' : '❌ Cita no disponible'}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 12,
    color: '#333',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    marginTop: 12,
    color: '#666',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    marginTop: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    color: '#374151',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    marginTop: 8,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  citasContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  citaCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#39b58b',
  },
  citaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  estadoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  estadoTexto: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  citaId: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  citaInfo: {
    marginBottom: 12,
  },
  fechaTexto: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  horaTexto: {
    fontSize: 14,
    color: '#6B7280',
  },
  motivoContainer: {
    backgroundColor: '#FEF2F2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  motivoLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#DC2626',
    marginBottom: 4,
  },
  motivoTexto: {
    fontSize: 14,
    color: '#7F1D1D',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
  },
  footerText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
});