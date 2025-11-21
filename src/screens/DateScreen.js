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

// Configuración API
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
  const [loadingData, setLoadingData] = useState(true);

  const [tecnicos, setTecnicos] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [clienteActual, setClienteActual] = useState(null);
  const [usuarioActual, setUsuarioActual] = useState(null);

  const themeStyles = isDarkMode ? darkTheme : lightTheme;

  // Obtener usuario autenticado
  const obtenerUsuarioAutenticado = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) return JSON.parse(userData);
      return null;
    } catch (error) {
      console.error('Error obteniendo usuario:', error);
      return null;
    }
  };

  // OBTENER CLIENTE POR ID USUARIO
  const obtenerClientePorUsuario = async (idUsuario) => {
    try {
      console.log('🔍 Buscando cliente para IdUsuario:', idUsuario);
      
      const response = await axios.get(`${API_BASE_URL}/clientes`);
      console.log('📋 Todos los clientes:', response.data);
      
      // Buscar cliente que coincida con el IdUsuario
      const clienteEncontrado = response.data.find(
        cliente => Number(cliente.IdUsuario) === Number(idUsuario)
      );
      
      console.log('✅ Cliente encontrado:', clienteEncontrado);
      
      if (clienteEncontrado) {
        return {
          IdCliente: Number(clienteEncontrado.IdCliente),
          IdUsuario: Number(clienteEncontrado.IdUsuario),
          Estado: clienteEncontrado.Estado
        };
      }
      
      console.log('❌ No se encontró cliente para IdUsuario:', idUsuario);
      return null;
      
    } catch (error) {
      console.error('❌ Error obteniendo cliente:', error);
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

      const usuario = await obtenerUsuarioAutenticado();
      console.log('👤 Usuario autenticado:', usuario);
      
      if (!usuario) {
        Alert.alert(
          'Sesión requerida',
          'Debes iniciar sesión para agendar una cita',
          [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
        );
        return;
      }

      setUsuarioActual(usuario);

      // OBTENER CLIENTE
      const cliente = await obtenerClientePorUsuario(usuario.IdUsuario);
      
      if (!cliente) {
        Alert.alert(
          'Cliente no encontrado',
          'Tu usuario no tiene un cliente asociado. Contacta al administrador.'
        );
        return;
      }

      console.log('✅ Cliente asignado:', cliente);
      setClienteActual(cliente);

      // CARGAR SERVICIOS
      const serviciosRes = await axios.get(`${API_BASE_URL}/servicios?idNegocio=${empresa.IdNegocio}`);
      setServicios(serviciosRes.data);

      // CARGAR TÉCNICOS
      const personalRes = await axios.get(`${API_BASE_URL}/Personal/by-negocio/${empresa.IdNegocio}`);
      
      const tecnicosConNombres = personalRes.data.map(persona => ({
        IdPersonal: persona.IdPersonal,
        IdUsuario: persona.IdUsuario,
        Nombre: persona.Nombre,
        RolEnNegocio: persona.RolEnNegocio
      }));

      setTecnicos(tecnicosConNombres);

      // Establecer valores por defecto
      if (serviciosRes.data.length > 0) setSelectedServicio(serviciosRes.data[0]);
      if (tecnicosConNombres.length > 0) setSelectedTecnico(tecnicosConNombres[0]);

    } catch (error) {
      console.error('❌ Error cargando datos iniciales:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos del negocio');
    } finally {
      setLoadingData(false);
    }
  };

  // Horarios posibles
  const horariosDisponibles = [
    '8:00','8:15','8:30','8:45','9:00','9:15','9:30','9:45',
    '10:00','10:15','10:30','10:45','11:00','11:15','11:30','11:45',
    '12:00','12:15','12:30','12:45','13:00','13:15','13:30','13:45',
    '14:00','14:15','14:30','14:45','15:00','15:15','15:30','15:45',
    '16:00','16:15','16:30','16:45','17:00','17:15','17:30','17:45'
  ];

  // Cargar horarios ocupados
  const cargarHorariosOcupados = async (fecha, tecnicoId) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/citas?idTecnico=${tecnicoId}`);
      const citas = res.data.filter(
        c => c.FechaCita === fecha && c.IdTecnico === tecnicoId && c.Estado !== 'cancelada'
      );

      const ocupados = citas.map(c => {
        const hora = c.HoraInicio.split(':').slice(0, 2).join(':');
        return `${fecha} ${hora}`;
      });

      setHorariosOcupados(ocupados);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'No se pudieron cargar los horarios ocupados');
    }
  };

  useEffect(() => {
    if (selectedDate && selectedTecnico) {
      cargarHorariosOcupados(selectedDate.format('YYYY-MM-DD'), selectedTecnico.IdPersonal);
    }
  }, [selectedDate, selectedTecnico]);

  const isTimeAvailable = (time) => {
    const fechaHora = `${selectedDate.format('YYYY-MM-DD')} ${moment(time, 'HH:mm').format('HH:mm')}`;
    if (horariosOcupados.includes(fechaHora)) return false;

    const now = moment();
    const selectedDateTime = moment(fechaHora, 'YYYY-MM-DD HH:mm');
    return selectedDateTime.isAfter(now);
  };

  // FUNCIONES DEL CALENDARIO
  const goToNextMonth = () => {
    setCurrentMonth(prev => prev.clone().add(1, 'month'));
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(prev => prev.clone().subtract(1, 'month'));
  };

  // Generar días del calendario
  const generateCalendarDays = () => {
    const days = [];
    const start = currentMonth.clone().startOf('month').startOf('week');
    const end = currentMonth.clone().endOf('month').endOf('week');

    let day = start.clone();
    while (day.isBefore(end)) {
      days.push(day.clone());
      day.add(1, 'day');
    }
    return days;
  };

  const isDateAvailable = (day) => {
    const isPast = day.isBefore(moment(), 'day');
    return !isPast;
  };

  // CONFIRMAR CITA - CORREGIDO CON CAMELCASE
  const confirmarCita = async () => {
    console.log('🔍 INICIANDO CONFIRMACIÓN DE CITA');
    console.log('📋 Estado actual:', {
      selectedTecnico: selectedTecnico?.IdPersonal,
      selectedDate: selectedDate?.format('YYYY-MM-DD'),
      selectedTime: selectedTime,
      selectedServicio: selectedServicio?.IdServicio,
      clienteActual: clienteActual
    });

    if (!selectedTecnico || !selectedDate || !selectedTime || !selectedServicio || !clienteActual) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    
    try {
      const fechaCita = selectedDate.format('YYYY-MM-DD');
      const horaInicio = `${selectedTime}:00`;

      const horaFinMoment = moment(selectedTime, 'HH:mm')
        .add(selectedServicio.DuracionMinutos || 30, 'minutes');
      const horaFin = horaFinMoment.format('HH:mm:ss');

      // FORMATO CORRECTO PARA EL BACKEND - CAMELCASE
      const nuevaCita = {
        idCliente: Number(clienteActual.IdCliente),        // ← camelCase
        idTecnico: Number(selectedTecnico.IdPersonal),     // ← camelCase  
        idServicio: Number(selectedServicio.IdServicio),   // ← camelCase
        fechaCita: fechaCita,                              // ← camelCase
        horaInicio: horaInicio,                            // ← camelCase
        horaFin: horaFin,                                  // ← camelCase
        estado: 'pendiente',
        motivoCancelacion: null
      };

      console.log('📤 ENVIANDO CITA (CAMELCASE):', JSON.stringify(nuevaCita, null, 2));
      console.log('🔍 VERIFICACIÓN FINAL:', {
        idCliente: nuevaCita.idCliente,
        tipo: typeof nuevaCita.idCliente,
        esNumeroValido: !isNaN(nuevaCita.idCliente) && nuevaCita.idCliente > 0
      });

      // POST CON FORMATO CORRECTO
      const response = await axios.post(`${API_BASE_URL}/citas`, nuevaCita, {
        timeout: 15000,
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log('✅ CITA CREADA EXITOSAMENTE:', response.data);

      Alert.alert(
        '¡Cita Agendada! 🎉',
        `Tu cita para ${selectedServicio.NombreServicio} ha sido agendada para el ${selectedDate.format('DD/MM/YYYY')} a las ${selectedTime} con ${selectedTecnico.Nombre}`,
        [{ text: 'OK', onPress: () => navigation.navigate('Home') }]
      );

    } catch (error) {
      console.error('❌ ERROR AL CREAR CITA:', {
        mensaje: error.message,
        respuesta: error.response?.data,
        estado: error.response?.status,
        config: error.config?.data
      });
      
      let mensajeError = 'No se pudo agendar la cita. ';
      
      if (error.response?.data?.detail) {
        mensajeError += `Error del servidor: ${error.response.data.detail}`;
      } else if (error.response?.data?.message) {
        mensajeError += `Error: ${error.response.data.message}`;
      } else if (error.message) {
        mensajeError += `Error de conexión: ${error.message}`;
      }
      
      Alert.alert('Error', mensajeError);
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#246BFD" />
        <Text>Cargando datos...</Text>
      </View>
    );
  }

  const days = generateCalendarDays();

  return (
    <View style={[styles.container, themeStyles.background]}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* SERVICIOS */}
        <View style={[styles.section, themeStyles.card]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="briefcase" size={20} color="#0A2A66" />
            <Text style={[styles.sectionTitle, themeStyles.text]}>Servicio</Text>
          </View>

          <TouchableOpacity
            style={[styles.servicioSelector, themeStyles.input]}
            onPress={() => setShowServiciosModal(true)}
          >
            <Text style={[styles.servicioSelectorText, themeStyles.text]}>
              {selectedServicio ? selectedServicio.NombreServicio : 'Seleccionar servicio'}
            </Text>
            <Ionicons name="chevron-down" size={16} color="#64748B" />
          </TouchableOpacity>

          {/* MODAL SERVICIOS */}
          <Modal visible={showServiciosModal} animationType="slide" transparent>
            <View style={styles.modalOverlay}>
              <View style={[styles.modalContent, themeStyles.card]}>
                <Text style={[styles.modalTitle, themeStyles.text]}>Selecciona un servicio</Text>
                <FlatList
                  data={servicios}
                  keyExtractor={(item) => item.IdServicio.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.servicioItem}
                      onPress={() => {
                        setSelectedServicio(item);
                        setShowServiciosModal(false);
                      }}
                    >
                      <Text style={[styles.servicioItemText, themeStyles.text]}>
                        {item.NombreServicio} - ${item.Precio}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
                <TouchableOpacity
                  style={styles.closeTimeButton}
                  onPress={() => setShowServiciosModal(false)}
                >
                  <Text style={styles.closeTimeText}>Cerrar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>

        {/* TÉCNICOS */}
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

        {/* CALENDARIO */}
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

          {/* MODAL CALENDARIO */}
          <Modal visible={showCalendar} animationType="slide" transparent>
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
                        <Text style={[
                          styles.dayText,
                          !isCurrentMonth && styles.otherMonthText,
                          !isAvailable && styles.disabledText,
                          isToday && styles.todayText,
                          isSelected && styles.selectedDayText,
                          themeStyles.text,
                        ]}>
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

        {/* HORARIOS */}
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

            {/* MODAL HORARIOS */}
            <Modal visible={showTimePicker} animationType="slide" transparent>
              <View style={styles.modalOverlay}>
                <View style={[styles.modalContent, themeStyles.card]}>

                  <Text style={[styles.modalTitle, themeStyles.text]}>Selecciona un horario</Text>
                  <Text style={[styles.modalSubtitle, themeStyles.textSecondary]}>
                    {selectedDate.format('dddd, DD [de] MMMM')}
                  </Text>

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
                          <Text style={[
                            styles.timeSlotText,
                            !isAvailable && styles.timeSlotTextDisabled,
                            selectedTime === item && styles.timeSlotTextSelected,
                          ]}>
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

        {/* NOTAS */}
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

        {/* CONFIRMAR */}
        <TouchableOpacity
          style={[
            styles.confirmButton,
            (!selectedTecnico || !selectedDate || !selectedTime || !selectedServicio) &&
            styles.confirmButtonDisabled,
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