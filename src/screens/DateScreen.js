// screens/DateScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  FlatList,
  TextInput,
  ActivityIndicator
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import 'moment/locale/es';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from "../styles/DateScreenStyles";
import { lightTheme, darkTheme } from "../styles/themes";

moment.locale('es');

// Configuración de axios
const API_BASE_URL = 'https://nearbizbackend3.vercel.app/api';

export default function DateScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { empresa, isDarkMode } = route.params;

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedTecnico, setSelectedTecnico] = useState(null);
  const [selectedServicio, setSelectedServicio] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showServiciosModal, setShowServiciosModal] = useState(false);
  const [notas, setNotas] = useState('');
  const [currentMonth, setCurrentMonth] = useState(moment());
  const [horariosOcupados, setHorariosOcupados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tecnicos, setTecnicos] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [clienteActual, setClienteActual] = useState(null);
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [loadingData, setLoadingData] = useState(true);

  const themeStyles = isDarkMode ? darkTheme : lightTheme;

  // Función para obtener el usuario autenticado
  const obtenerUsuarioAutenticado = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        return JSON.parse(userData);
      }
      return null;
    } catch (error) {
      console.error('Error obteniendo usuario:', error);
      return null;
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    cargarDatosIniciales();
  }, [empresa]);

  const cargarDatosIniciales = async () => {
    try {
      setLoadingData(true);
      
      // 1. OBTENER USUARIO AUTENTICADO
      const usuario = await obtenerUsuarioAutenticado();
      
      if (!usuario) {
        Alert.alert(
          'Sesión requerida', 
          'Debes iniciar sesión para agendar una cita',
          [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
        );
        setLoadingData(false);
        return;
      }
      
      setUsuarioActual(usuario);
      console.log('Usuario autenticado:', usuario);

      // 2. BUSCAR CLIENTE ASOCIADO AL USUARIO
      const clientesRes = await axios.get(`${API_BASE_URL}/clientes`);
      const cliente = clientesRes.data.find(c => c.IdUsuario === usuario.IdUsuario);
      
      if (!cliente) {
        Alert.alert(
          'Cliente no encontrado', 
          'Tu usuario no tiene un cliente asociado. Contacta al administrador.',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
        setLoadingData(false);
        return;
      }
      
      setClienteActual(cliente);
      console.log('Cliente encontrado:', cliente);

      // 3. CARGAR SERVICIOS del negocio
      const serviciosRes = await axios.get(`${API_BASE_URL}/servicios?idNegocio=${empresa.IdNegocio}`);
      if (serviciosRes.data.length === 0) {
        Alert.alert('Info', 'Este negocio no tiene servicios disponibles');
      }
      setServicios(serviciosRes.data);

      // 4. CARGAR TÉCNICOS (personal) del negocio CON SUS NOMBRES REALES
      const personalRes = await axios.get(`${API_BASE_URL}/personal?idNegocio=${empresa.IdNegocio}`);
      
      // Obtener nombres reales de los técnicos
      const tecnicosConNombres = await Promise.all(
        personalRes.data.map(async (persona) => {
          try {
            const usuarioRes = await axios.get(`${API_BASE_URL}/usuarios/${persona.IdUsuario}`);
            return {
              IdPersonal: persona.IdPersonal,
              IdUsuario: persona.IdUsuario,
              Nombre: usuarioRes.data.Nombre,
              RolEnNegocio: persona.RolEnNegocio
            };
          } catch (error) {
            console.error('Error cargando usuario del técnico:', error);
            return {
              IdPersonal: persona.IdPersonal,
              IdUsuario: persona.IdUsuario,
              Nombre: `Técnico ${persona.IdPersonal}`,
              RolEnNegocio: persona.RolEnNegocio
            };
          }
        })
      );
      
      setTecnicos(tecnicosConNombres);

      // 5. Seleccionar primer servicio y técnico por defecto
      if (serviciosRes.data.length > 0) {
        setSelectedServicio(serviciosRes.data[0]);
      }
      if (tecnicosConNombres.length > 0) {
        setSelectedTecnico(tecnicosConNombres[0]);
      }

      console.log('Datos cargados exitosamente');

    } catch (error) {
      console.error('Error cargando datos:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos del negocio');
    } finally {
      setLoadingData(false);
    }
  };

  const horariosDisponibles = [
    '8:00', '8:15', '8:30', '8:45',
    '9:00', '9:15', '9:30', '9:45',
    '10:00', '10:15', '10:30', '10:45',
    '11:00', '11:15', '11:30', '11:45',
    '12:00', '12:15', '12:30', '12:45',
    '13:00', '13:15', '13:30', '13:45',
    '14:00', '14:15', '14:30', '14:45',
    '15:00', '15:15', '15:30', '15:45',
    '16:00', '16:15', '16:30', '16:45',
    '17:00', '17:15', '17:30', '17:45',
  ];

  // Consultar horarios ocupados desde backend
  const cargarHorariosOcupados = async (fecha, tecnicoId) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/citas?idTecnico=${tecnicoId}`);
      
      const citas = res.data.filter(
        c =>
          c.FechaCita === fecha &&
          c.IdTecnico === tecnicoId &&
          c.Estado !== 'cancelada'
      );

      const ocupados = citas.map(c => {
        const hora = c.HoraInicio.split(':').slice(0, 2).join(':');
        return `${fecha} ${hora}`;
      });

      setHorariosOcupados(ocupados);
    } catch (err) {
      console.error('Error al obtener citas:', err.message);
      Alert.alert('Error', 'No se pudieron cargar los horarios ocupados');
    }
  };

  useEffect(() => {
    if (selectedDate && selectedTecnico) {
      cargarHorariosOcupados(selectedDate.format('YYYY-MM-DD'), selectedTecnico.IdPersonal);
    }
  }, [selectedDate, selectedTecnico]);

  const isTimeAvailable = (time) => {
    if (!selectedDate || !selectedTecnico) return false;
    
    const time24h = moment(time, 'HH:mm').format('HH:mm');
    const fechaHora = `${selectedDate.format('YYYY-MM-DD')} ${time24h}`;
    
    if (horariosOcupados.includes(fechaHora)) return false;

    const now = moment();
    const selectedDateTime = moment(`${selectedDate.format('YYYY-MM-DD')} ${time24h}`, 'YYYY-MM-DD HH:mm');
    return selectedDateTime.isAfter(now);
  };

const confirmarCita = async () => {
  if (!selectedTecnico || !selectedDate || !selectedTime || !selectedServicio || !clienteActual) {
    Alert.alert('Error', 'Por favor completa todos los campos requeridos');
    return;
  }

  setLoading(true);
  try {
    const fechaCita = selectedDate.format('YYYY-MM-DD');
    const horaInicio = `${selectedTime}:00`;
    
    // Calcular hora fin basada en la duración del servicio
    const horaFinMoment = moment(selectedTime, 'HH:mm')
      .add(selectedServicio.DuracionMinutos || 30, 'minutes');
    const horaFin = horaFinMoment.format('HH:mm:ss');

    // ✅ CORREGIDO: Usar SNAKE_CASE que espera el backend
    const nuevaCita = {
      id_cliente: Number(clienteActual.IdCliente),        // ✅ snake_case
      id_tecnico: Number(selectedTecnico.IdPersonal),     // ✅ snake_case
      id_servicio: Number(selectedServicio.IdServicio),   // ✅ snake_case
      fecha_cita: fechaCita,                              // ✅ snake_case
      hora_inicio: horaInicio,                            // ✅ snake_case
      hora_fin: horaFin,                                  // ✅ snake_case
      estado: 'pendiente',
      motivo_cancelacion: null                            // ✅ snake_case
    };

    console.log('📤 ENVIANDO CITA CON SNAKE_CASE:', JSON.stringify(nuevaCita, null, 2));

    // 🔍 VERIFICAR QUE LOS DATOS EXISTEN EN LA BD
    console.log('🔄 Verificando existencia en BD...');
    
    try {
      const clienteCheck = await axios.get(`${API_BASE_URL}/clientes/${clienteActual.IdCliente}`);
      console.log('✅ Cliente existe en BD:', clienteCheck.data);
    } catch (error) {
      console.error('❌ Cliente NO existe en BD:', error.response?.data);
      throw new Error(`Cliente con ID ${clienteActual.IdCliente} no encontrado en BD`);
    }

    try {
      const tecnicoCheck = await axios.get(`${API_BASE_URL}/personal/${selectedTecnico.IdPersonal}`);
      console.log('✅ Técnico existe en BD:', tecnicoCheck.data);
    } catch (error) {
      console.error('❌ Técnico NO existe en BD:', error.response?.data);
      throw new Error(`Técnico con ID ${selectedTecnico.IdPersonal} no encontrado en BD`);
    }

    try {
      const servicioCheck = await axios.get(`${API_BASE_URL}/servicios/${selectedServicio.IdServicio}`);
      console.log('✅ Servicio existe en BD:', servicioCheck.data);
    } catch (error) {
      console.error('❌ Servicio NO existe en BD:', error.response?.data);
      throw new Error(`Servicio con ID ${selectedServicio.IdServicio} no encontrado en BD`);
    }

    // 🚀 ENVIAR LA CITA CON SNAKE_CASE
    console.log('🚀 Realizando POST a /citas con snake_case...');
    const response = await axios.post(
      `${API_BASE_URL}/citas`,
      nuevaCita,
      {
        timeout: 15000,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );

    console.log('✅ RESPUESTA EXITOSA DEL BACKEND:', response.data);

    Alert.alert(
      '¡Cita Agendada! 🎉',
      `Tu cita para ${selectedServicio.NombreServicio} ha sido agendada para el ${selectedDate.format('DD/MM/YYYY')} a las ${selectedTime} con ${selectedTecnico.Nombre}`,
      [{ 
        text: 'OK', 
        onPress: () => navigation.navigate('Home')
      }]
    );

  } catch (error) {
    console.error('❌ ERROR COMPLETO AL AGENDAR CITA:');
    
    if (error.response) {
      console.error('🔴 RESPONSE ERROR:');
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      console.error('Payload sent:', error.response.config?.data);
      
      let mensajeError = 'Ocurrió un error al agendar la cita.';
      
      if (error.response.data) {
        if (error.response.data.detail) {
          mensajeError = `Error: ${error.response.data.detail}`;
        } else if (error.response.data.message) {
          mensajeError = `Error: ${error.response.data.message}`;
        }
      }
      
      Alert.alert('Error del Servidor', mensajeError);
      
    } else if (error.request) {
      console.error('🟡 REQUEST ERROR (no response):', error.request);
      Alert.alert('Error de Conexión', 'No se pudo conectar con el servidor.');
    } else {
      console.error('🟠 CONFIG ERROR:', error.message);
      Alert.alert('Error', error.message || 'Error de configuración');
    }
  } finally {
    setLoading(false);
  }
};

// Agrega esta función después de cargarDatosIniciales
const probarConexionBackend = async () => {
  try {
    console.log('🧪 Probando conexión con el backend...');
    
    // Probar endpoint de clientes
    const testClientes = await axios.get(`${API_BASE_URL}/clientes`);
    console.log('✅ Clientes endpoint funciona:', testClientes.data.length, 'clientes encontrados');
    
    // Probar endpoint de citas (GET)
    const testCitas = await axios.get(`${API_BASE_URL}/citas`);
    console.log('✅ Citas endpoint funciona:', testCitas.data.length, 'citas encontradas');
    
    return true;
  } catch (error) {
    console.error('❌ Error en prueba de conexión:', error.message);
    return false;
  }
};

// Llama a esta función en tu useEffect o en un botón de prueba

  const generateCalendarDays = () => {
    const startOfMonth = currentMonth.clone().startOf('month');
    const endOfMonth = currentMonth.clone().endOf('month');
    const startDate = startOfMonth.clone().startOf('week');
    const endDate = endOfMonth.clone().endOf('week');
    const days = [];
    let currentDay = startDate.clone();

    while (currentDay.isBefore(endDate)) {
      days.push(currentDay.clone());
      currentDay.add(1, 'day');
    }
    return days;
  };

  const days = generateCalendarDays();
  const isDateAvailable = (date) => date.isSameOrAfter(moment(), 'day');
  const goToPreviousMonth = () => setCurrentMonth(currentMonth.clone().subtract(1, 'month'));
  const goToNextMonth = () => setCurrentMonth(currentMonth.clone().add(1, 'month'));

  if (loadingData) {
    return (
      <View style={[styles.container, themeStyles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#0A2A66" />
        <Text style={[styles.loadingText, themeStyles.text]}>Cargando datos del negocio...</Text>
      </View>
    );
  }

  if (!clienteActual || !usuarioActual) {
    return (
      <View style={[styles.container, themeStyles.container, styles.loadingContainer]}>
        <Ionicons name="alert-circle" size={48} color="#EF4444" />
        <Text style={[styles.loadingText, themeStyles.text]}>
          {!usuarioActual ? 'Debes iniciar sesión para agendar citas' : 'No se pudo cargar la información del cliente'}
        </Text>
        <TouchableOpacity 
          style={styles.confirmButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.confirmButtonText}>Ir a Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    
    <View style={[styles.container, themeStyles.container]}>
      {/* Header Profesional */}
      <View style={[styles.header, themeStyles.card]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={themeStyles.text.color} />
        </TouchableOpacity>
        
        <Text style={[styles.headerTitle, themeStyles.text]}>Agendar Cita</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.contentContainer}>
        {/* Información del Cliente Autenticado */}
        <View style={[styles.section, themeStyles.card]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="person" size={20} color="#0A2A66" />
            <Text style={[styles.sectionTitle, themeStyles.text]}>Cliente</Text>
          </View>
          <View style={[styles.servicioInfo, { backgroundColor: isDarkMode ? '#2D3748' : '#F8FAFF' }]}>
            <Text style={[styles.servicioTexto, themeStyles.text]}>{usuarioActual.Nombre}</Text>
            <Text style={[styles.servicioTiempo, themeStyles.textSecondary]}>
              <Ionicons name="mail" size={14} color="#64748B" /> {usuarioActual.Email}
            </Text>
          </View>
        </View>

        {/* Información de la Empresa */}
        <View style={[styles.empresaCard, themeStyles.card]}>
          <View style={styles.empresaHeader}>
            <View style={styles.empresaIcon}>
              <Ionicons name="business" size={24} color="#0A2A66" />
            </View>
            <View style={styles.empresaInfo}>
              <Text style={[styles.empresaNombre, themeStyles.text]}>{empresa.Nombre}</Text>
              <Text style={[styles.empresaDireccion, themeStyles.textSecondary]}>{empresa.Direccion}</Text>
            </View>
          </View>
        </View>

        {/* Selección de Servicio */}
        <View style={[styles.section, themeStyles.card]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="construct" size={20} color="#0A2A66" />
            <Text style={[styles.sectionTitle, themeStyles.text]}>Servicio</Text>
          </View>
          <TouchableOpacity
            style={[styles.serviceSelector, themeStyles.input]}
            onPress={() => setShowServiciosModal(true)}
          >
            <Ionicons name="list" size={20} color="#64748B" />
            <Text style={[styles.serviceSelectorText, themeStyles.text]}>
              {selectedServicio ? selectedServicio.NombreServicio : 'Seleccionar servicio'}
            </Text>
            <Ionicons name="chevron-down" size={16} color="#64748B" />
          </TouchableOpacity>

          {/* Modal de Servicios */}
          <Modal visible={showServiciosModal} animationType="slide" transparent={true}>
            <View style={styles.modalOverlay}>
              <View style={[styles.modalContent, themeStyles.card]}>
                <View style={styles.modalHeader}>
                  <Text style={[styles.modalTitle, themeStyles.text]}>Selecciona un servicio</Text>
                </View>
                <FlatList
                  data={servicios}
                  keyExtractor={(item) => item.IdServicio.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.serviceItem,
                        selectedServicio?.IdServicio === item.IdServicio && styles.serviceItemSelected,
                      ]}
                      onPress={() => {
                        setSelectedServicio(item);
                        setShowServiciosModal(false);
                      }}
                    >
                      <View style={styles.serviceInfo}>
                        <Text style={[styles.serviceName, themeStyles.text]}>
                          {item.NombreServicio}
                        </Text>
                        <Text style={[styles.serviceDetails, themeStyles.textSecondary]}>
                          ${item.Precio} • {item.DuracionMinutos} min
                        </Text>
                        {item.Descripcion && (
                          <Text style={[styles.serviceDescription, themeStyles.textSecondary]}>
                            {item.Descripcion}
                          </Text>
                        )}
                      </View>
                    </TouchableOpacity>
                  )}
                />
                <TouchableOpacity
                  style={styles.closeModalButton}
                  onPress={() => setShowServiciosModal(false)}
                >
                  <Text style={styles.closeModalText}>Cerrar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>

        {/* Selección de Técnico */}
        <View style={[styles.section, themeStyles.card]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="people" size={20} color="#0A2A66" />
            <Text style={[styles.sectionTitle, themeStyles.text]}>Técnico</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tecnicosContainer}>
            {tecnicos.map((tecnico) => (
              <TouchableOpacity
                key={tecnico.IdPersonal}
                style={[
                  styles.tecnicoButton,
                  selectedTecnico?.IdPersonal === tecnico.IdPersonal && styles.tecnicoButtonSelected,
                ]}
                onPress={() => setSelectedTecnico(tecnico)}
              >
                <Ionicons 
                  name="person-circle" 
                  size={20} 
                  color={selectedTecnico?.IdPersonal === tecnico.IdPersonal ? "#FFFFFF" : "#0A2A66"} 
                />
                <Text style={[
                  styles.tecnicoText,
                  selectedTecnico?.IdPersonal === tecnico.IdPersonal && styles.tecnicoTextSelected,
                ]}>
                  {tecnico.Nombre}
                </Text>
                <Text style={[
                  styles.tecnicoRol,
                  selectedTecnico?.IdPersonal === tecnico.IdPersonal && styles.tecnicoRolSelected,
                ]}>
                  {tecnico.RolEnNegocio}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Selector de Fecha - CALENDARIO */}
        <View style={[styles.section, themeStyles.card]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="calendar" size={20} color="#0A2A66" />
            <Text style={[styles.sectionTitle, themeStyles.text]}>Selecciona una fecha</Text>
          </View>
          <TouchableOpacity
            style={[styles.dateSelector, themeStyles.input]}
            onPress={() => setShowCalendar(true)}
          >
            <Ionicons name="calendar-outline" size={20} color="#64748B" />
            <Text style={[styles.dateSelectorText, themeStyles.text]}>
              {selectedDate ? selectedDate.format('dddd, DD [de] MMMM') : 'Seleccionar fecha'}
            </Text>
            <Ionicons name="chevron-down" size={16} color="#64748B" />
          </TouchableOpacity>

          {/* Modal del Calendario */}
          <Modal visible={showCalendar} animationType="slide" transparent={true}>
            <View style={styles.modalOverlay}>
              <View style={[styles.modalContent, themeStyles.card]}>
                <View style={styles.calendarHeader}>
                  <TouchableOpacity onPress={goToPreviousMonth} style={styles.calendarNavButton}>
                    <Ionicons name="chevron-back" size={24} color="#0A2A66" />
                  </TouchableOpacity>
                  <Text style={[styles.calendarTitle, themeStyles.text]}>
                    {currentMonth.format('MMMM YYYY')}
                  </Text>
                  <TouchableOpacity onPress={goToNextMonth} style={styles.calendarNavButton}>
                    <Ionicons name="chevron-forward" size={24} color="#0A2A66" />
                  </TouchableOpacity>
                </View>

                <View style={styles.calendarGrid}>
                  {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day) => (
                    <Text key={day} style={[styles.weekDay, themeStyles.textSecondary]}>{day}</Text>
                  ))}

                  {days.map((day) => {
                    const isAvailable = isDateAvailable(day);
                    const isSelected = selectedDate && day.isSame(selectedDate, 'day');
                    const isCurrentMonth = day.month() === currentMonth.month();
                    const isToday = day.isSame(moment(), 'day');

                    return (
                      <TouchableOpacity
                        key={day.format('YYYY-MM-DD')}
                        style={[
                          styles.dayButton,
                          !isCurrentMonth && styles.otherMonthDay,
                          !isAvailable && styles.disabledDay,
                          isToday && styles.todayDay,
                          isSelected && styles.selectedDay,
                        ]}
                        onPress={() => {
                          if (isAvailable) {
                            setSelectedDate(day);
                            setShowCalendar(false);
                          }
                        }}
                        disabled={!isAvailable}
                      >
                        <Text
                          style={[
                            styles.dayText,
                            !isCurrentMonth && styles.otherMonthText,
                            !isAvailable && styles.disabledText,
                            isToday && styles.todayText,
                            isSelected && styles.selectedDayText,
                            themeStyles.text,
                          ]}
                        >
                          {day.date()}
                        </Text>
                        {isToday && <View style={styles.todayIndicator} />}
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <TouchableOpacity
                  style={styles.closeCalendarButton}
                  onPress={() => setShowCalendar(false)}
                >
                  <Text style={styles.closeCalendarText}>Cerrar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>

        {/* Selector de Horario */}
        {selectedDate && (
          <View style={[styles.section, themeStyles.card]}>
            <View style={styles.sectionHeader}>
              <Ionicons name="time" size={20} color="#0A2A66" />
              <Text style={[styles.sectionTitle, themeStyles.text]}>
                Horarios disponibles - {selectedDate.format('dddd')}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.timeSelector, themeStyles.input]}
              onPress={() => setShowTimePicker(true)}
            >
              <Ionicons name="time-outline" size={20} color="#64748B" />
              <Text style={[styles.timeSelectorText, themeStyles.text]}>
                {selectedTime || 'Seleccionar horario'}
              </Text>
              <Ionicons name="chevron-down" size={16} color="#64748B" />
            </TouchableOpacity>

            {/* Modal de Horarios */}
            <Modal visible={showTimePicker} animationType="slide" transparent={true}>
              <View style={styles.modalOverlay}>
                <View style={[styles.modalContent, themeStyles.card]}>
                  <View style={styles.modalHeader}>
                    <Text style={[styles.modalTitle, themeStyles.text]}>Selecciona un horario</Text>
                    <Text style={[styles.modalSubtitle, themeStyles.textSecondary]}>
                      {selectedDate.format('dddd, DD [de] MMMM')}
                    </Text>
                  </View>
                  <FlatList
                    data={horariosDisponibles}
                    numColumns={3}
                    keyExtractor={(item) => item}
                    contentContainerStyle={styles.timeGrid}
                    renderItem={({ item }) => {
                      const isAvailable = isTimeAvailable(item);
                      return (
                        <TouchableOpacity
                          style={[
                            styles.timeSlot,
                            !isAvailable && styles.timeSlotDisabled,
                            selectedTime === item && styles.timeSlotSelected,
                          ]}
                          onPress={() => {
                            if (isAvailable) {
                              setSelectedTime(item);
                              setShowTimePicker(false);
                            }
                          }}
                          disabled={!isAvailable}
                        >
                          <Text
                            style={[
                              styles.timeSlotText,
                              !isAvailable && styles.timeSlotTextDisabled,
                              selectedTime === item && styles.timeSlotTextSelected,
                            ]}
                          >
                            {item}
                          </Text>
                          {!isAvailable && (
                            <Ionicons name="close-circle" size={12} color="#EF4444" style={styles.timeSlotIcon} />
                          )}
                        </TouchableOpacity>
                      );
                    }}
                  />
                  <TouchableOpacity
                    style={styles.closeTimeButton}
                    onPress={() => setShowTimePicker(false)}
                  >
                    <Text style={styles.closeTimeText}>Cerrar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
        )}

        {/* Notas Adicionales */}
        <View style={[styles.section, themeStyles.card]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="document-text" size={20} color="#0A2A66" />
            <Text style={[styles.sectionTitle, themeStyles.text]}>Notas adicionales</Text>
          </View>
          <Text style={[styles.notesLabel, themeStyles.textSecondary]}>
            Información adicional para el técnico (opcional)
          </Text>
          <TextInput
            style={[styles.notasInput, themeStyles.input]}
            placeholder="Ej: Necesito consultar sobre..."
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={4}
            value={notas}
            onChangeText={setNotas}
          />
        </View>

        {/* Botón de Confirmación */}
        <TouchableOpacity
          style={[
            styles.confirmButton,
            (!selectedTecnico || !selectedDate || !selectedTime || !selectedServicio) && styles.confirmButtonDisabled,
          ]}
          onPress={confirmarCita}
          disabled={!selectedTecnico || !selectedDate || !selectedTime || !selectedServicio || loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
              <Text style={styles.confirmButtonText}>
                {selectedServicio ? `Confirmar Cita - $${selectedServicio.Precio}` : 'Confirmar Cita'}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}