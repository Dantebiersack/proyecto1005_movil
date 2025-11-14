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
  TextInput
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import 'moment/locale/es';
import axios from 'axios';
import styles from "../styles/DateScreenStyles";
import { lightTheme, darkTheme } from "../styles/themes";

moment.locale('es');

export default function DateScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { empresa, isDarkMode } = route.params;

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedTecnico, setSelectedTecnico] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [notas, setNotas] = useState('');
  const [currentMonth, setCurrentMonth] = useState(moment());
  const [horariosOcupados, setHorariosOcupados] = useState([]);
  const [loading, setLoading] = useState(false);

  const themeStyles = isDarkMode ? darkTheme : lightTheme;

  const tecnicos = [
    { id: 1, nombre: 'Juan Pérez' },
    { id: 2, nombre: 'María García' },
    { id: 3, nombre: 'Carlos López' },
  ];

  const horariosDisponibles = [
    '8:00 am', '8:15 am', '8:30 am', '8:45 am',
    '9:00 am', '9:15 am', '9:30 am', '9:45 am',
    '10:00 am', '10:15 am', '10:30 am', '10:45 am',
    '11:00 am', '11:15 am', '11:30 am', '11:45 am',
    '12:00 pm', '12:15 pm', '12:30 pm', '12:45 pm',
    '1:00 pm', '1:15 pm', '1:30 pm', '1:45 pm',
    '2:00 pm', '2:15 pm', '2:30 pm', '2:45 pm',
    '3:00 pm', '3:15 pm', '3:30 pm', '3:45 pm',
    '4:00 pm', '4:15 pm', '4:30 pm', '4:45 pm',
    '5:00 pm', '5:15 pm', '5:30 pm', '5:45 pm',
  ];

  // Consultar horarios ocupados desde backend
  const cargarHorariosOcupados = async (fecha, tecnicoId) => {
    try {
      const res = await axios.get('https://nearbizbackend3.vercel.app/api/citas');
      const citas = res.data.filter(
        c =>
          c.fechaCita === fecha &&
          c.idTecnico === tecnicoId &&
          c.estado !== 'cancelada'
      );

      const ocupados = citas.map(c => {
        const start = moment(c.horaInicio, 'HH:mm:ss').format('h:mm a');
        return `${fecha} ${start}`;
      });

      setHorariosOcupados(ocupados);
    } catch (err) {
      console.error('Error al obtener citas:', err.message);
    }
  };

  useEffect(() => {
    if (selectedDate && selectedTecnico) {
      const tecnicoId = tecnicos.find(t => t.nombre === selectedTecnico)?.id || 1;
      cargarHorariosOcupados(selectedDate.format('YYYY-MM-DD'), tecnicoId);
    }
  }, [selectedDate, selectedTecnico]);

  const isTimeAvailable = (time) => {
    if (!selectedDate || !selectedTecnico) return false;
    const fechaHora = `${selectedDate.format('YYYY-MM-DD')} ${time}`;
    if (horariosOcupados.includes(fechaHora)) return false;

    const now = moment();
    const selectedDateTime = moment(`${selectedDate.format('YYYY-MM-DD')} ${time}`, 'YYYY-MM-DD h:mm a');
    return selectedDateTime.isAfter(now);
  };

  const confirmarCita = async () => {
    if (!selectedTecnico) {
      Alert.alert('Error', 'Por favor selecciona un técnico');
      return;
    }
    if (!selectedDate) {
      Alert.alert('Error', 'Por favor selecciona una fecha');
      return;
    }
    if (!selectedTime) {
      Alert.alert('Error', 'Por favor selecciona un horario');
      return;
    }

    setLoading(true);
    try {
      const fechaCita = selectedDate.format('YYYY-MM-DD');
      const horaInicioMoment = moment(selectedTime, ['h:mm A', 'HH:mm']);
      const horaInicio = horaInicioMoment.format('HH:mm:ss');
      const horaFinMoment = horaInicioMoment.clone().add(15, 'minutes');
      const horaFin = horaFinMoment.format('HH:mm:ss');

      const id_cliente = 1;
      const id_tecnico = tecnicos.find(t => t.nombre === selectedTecnico)?.id || 1;
      const id_servicio = 1;

      const nuevaCita = {
        id_cliente,
        id_tecnico,
        id_servicio,
        fecha_cita: fechaCita,
        hora_inicio: horaInicio,
        hora_fin: horaFin,
        estado: 'pendiente',
        motivo_cancelacion: null
      };

      const response = await axios.post(
        'https://nearbizbackend2.onrender.com/api/citas',
        nuevaCita
      );

      Alert.alert(
        '¡Cita Agendada! 🎉',
        `Tu cita ha sido agendada para el ${selectedDate.format('DD/MM/YYYY')} a las ${selectedTime} con ${selectedTecnico}`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Error al agendar cita:', error.response?.data || error.message);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Ocurrió un error al agendar la cita.'
      );
    } finally {
      setLoading(false);
    }
  };

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

        {/* Selección de Técnico */}
        <View style={[styles.section, themeStyles.card]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="people" size={20} color="#0A2A66" />
            <Text style={[styles.sectionTitle, themeStyles.text]}>Técnico que te atenderá</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tecnicosContainer}>
            {tecnicos.map((tecnico) => (
              <TouchableOpacity
                key={tecnico.id}
                style={[
                  styles.tecnicoButton,
                  selectedTecnico === tecnico.nombre && styles.tecnicoButtonSelected,
                ]}
                onPress={() => setSelectedTecnico(tecnico.nombre)}
              >
                <Ionicons 
                  name="person-circle" 
                  size={20} 
                  color={selectedTecnico === tecnico.nombre ? "#FFFFFF" : "#0A2A66"} 
                />
                <Text style={[
                  styles.tecnicoText,
                  selectedTecnico === tecnico.nombre && styles.tecnicoTextSelected,
                ]}>
                  {tecnico.nombre}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Información del Servicio */}
        <View style={[styles.section, themeStyles.card]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="construct" size={20} color="#0A2A66" />
            <Text style={[styles.sectionTitle, themeStyles.text]}>Servicio a realizar</Text>
          </View>
          <View style={[styles.servicioInfo, { backgroundColor: isDarkMode ? '#2D3748' : '#F8FAFF' }]}>
            <Text style={[styles.servicioTexto, themeStyles.text]}>Consulta y asesoramiento profesional</Text>
            <View style={styles.servicioMeta}>
              <Text style={[styles.servicioTiempo, themeStyles.textSecondary]}>
                <Ionicons name="time" size={14} color="#64748B" /> 15 min aprox.
              </Text>
            </View>
          </View>
        </View>

        {/* Selector de Fecha */}
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
            (!selectedTecnico || !selectedDate || !selectedTime) && styles.confirmButtonDisabled,
          ]}
          onPress={confirmarCita}
          disabled={!selectedTecnico || !selectedDate || !selectedTime || loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
              <Text style={styles.confirmButtonText}>Confirmar Cita</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}