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

  // ============================
  // 🔹 Consultar horarios ocupados desde backend
  // ============================
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
      console.log('🔹 Horarios ocupados:', ocupados);
    } catch (err) {
      console.error('❌ Error al obtener citas:', err.message);
    }
  };

  // Si cambia la fecha o técnico, recarga disponibilidad
  useEffect(() => {
    if (selectedDate && selectedTecnico) {
      const tecnicoId = tecnicos.find(t => t.nombre === selectedTecnico)?.id || 1;
      cargarHorariosOcupados(selectedDate.format('YYYY-MM-DD'), tecnicoId);
    }
  }, [selectedDate, selectedTecnico]);

  // ============================
  // 🔹 Validar horarios disponibles
  // ============================
  const isTimeAvailable = (time) => {
    if (!selectedDate || !selectedTecnico) return false;
    const fechaHora = `${selectedDate.format('YYYY-MM-DD')} ${time}`;
    if (horariosOcupados.includes(fechaHora)) return false;

    const now = moment();
    const selectedDateTime = moment(`${selectedDate.format('YYYY-MM-DD')} ${time}`, 'YYYY-MM-DD h:mm a');
    return selectedDateTime.isAfter(now);
  };

  // ============================
  // 🔹 Crear cita en backend
  // ============================
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

  try {
    // 🗓️ Fecha correcta
    const fechaCita = selectedDate.format('YYYY-MM-DD');

    // 🔧 Asegurar formato de hora correcto (24h)
    const horaInicioMoment = moment(selectedTime, ['h:mm A', 'HH:mm']);
    const horaInicio = horaInicioMoment.format('HH:mm:ss');

    // ⏰ Sumar 15 minutos (asegurando que horaFin > horaInicio)
    const horaFinMoment = horaInicioMoment.clone().add(15, 'minutes');
    const horaFin = horaFinMoment.format('HH:mm:ss');

    // 🧍 IDs (usa los reales si ya los tienes)
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

    console.log('📤 Enviando cita:', nuevaCita);

    const response = await axios.post(
      'https://nearbizbackend2.onrender.com/api/citas',
      nuevaCita
    );

    console.log('✅ Cita creada:', response.data);

    Alert.alert(
      '¡Cita Agendada!',
      `Tu cita ha sido agendada para el ${selectedDate.format('DD/MM/YYYY')} a las ${selectedTime} con ${selectedTecnico}`,
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  } catch (error) {
    console.error('❌ Error al agendar cita:', error.response?.data || error.message);
    Alert.alert(
      'Error',
      error.response?.data?.message || 'Ocurrió un error al agendar la cita.'
    );
  }
};

  // ============================
  // 🔹 Generar calendario
  // ============================
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

  // ============================
  // 🔹 Render
  // ============================
  return (
    <ScrollView style={[styles.container, themeStyles.container]} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={[styles.header, themeStyles.card]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={isDarkMode ? "#fff" : "#333"} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, themeStyles.text]}>Agendar Cita</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Empresa info */}
      <View style={[styles.empresaInfo, themeStyles.card]}>
        <Text style={[styles.empresaNombre, themeStyles.text]}>{empresa.Nombre}</Text>
        <Text style={[styles.empresaDireccion, themeStyles.text]}>{empresa.Direccion}</Text>
      </View>

      {/* Técnicos */}
      <View style={[styles.section, themeStyles.card]}>
        <Text style={[styles.sectionTitle, themeStyles.text]}>Técnico que te atenderá</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tecnicosContainer}>
          {tecnicos.map((tecnico) => (
            <TouchableOpacity
              key={tecnico.id}
              style={[
                styles.tecnicoButton,
                { borderColor: '#3843c2' },
                selectedTecnico === tecnico.nombre && styles.tecnicoButtonSelected,
              ]}
              onPress={() => setSelectedTecnico(tecnico.nombre)}
            >
              <Text
                style={[
                  styles.tecnicoText,
                  selectedTecnico === tecnico.nombre && styles.tecnicoTextSelected,
                ]}
              >
                {tecnico.nombre}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Selector de fecha */}
      <View style={[styles.section, themeStyles.card]}>
        <Text style={[styles.sectionTitle, themeStyles.text]}>Selecciona una fecha</Text>
        <TouchableOpacity
          style={[styles.dateSelector, themeStyles.input]}
          onPress={() => setShowCalendar(true)}
        >
          <Ionicons name="calendar-outline" size={20} color={isDarkMode ? "#aaa" : "#666"} />
          <Text style={[styles.dateSelectorText, themeStyles.text]}>
            {selectedDate ? selectedDate.format('DD/MM/YYYY') : 'Seleccionar fecha'}
          </Text>
          <Ionicons name="chevron-down" size={16} color={isDarkMode ? "#aaa" : "#666"} />
        </TouchableOpacity>

        {/* Modal calendario */}
        <Modal visible={showCalendar} animationType="slide" transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, themeStyles.card]}>
              <View style={styles.calendarHeader}>
                <TouchableOpacity onPress={goToPreviousMonth}>
                  <Ionicons name="chevron-back" size={24} color="#3843c2" />
                </TouchableOpacity>
                <Text style={[styles.calendarTitle, themeStyles.text]}>
                  {currentMonth.format('MMMM YYYY').toUpperCase()}
                </Text>
                <TouchableOpacity onPress={goToNextMonth}>
                  <Ionicons name="chevron-forward" size={24} color="#3843c2" />
                </TouchableOpacity>
              </View>

              <View style={styles.calendarGrid}>
                {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day) => (
                  <Text key={day} style={[styles.weekDay, themeStyles.text]}>{day}</Text>
                ))}

                {days.map((day) => {
                  const isAvailable = isDateAvailable(day);
                  const isSelected = selectedDate && day.isSame(selectedDate, 'day');
                  const isCurrentMonth = day.month() === currentMonth.month();

                  return (
                    <TouchableOpacity
                      key={day.format('YYYY-MM-DD')}
                      style={[
                        styles.dayButton,
                        !isCurrentMonth && styles.otherMonthDay,
                        !isAvailable && styles.disabledDay,
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
                          isSelected && styles.selectedDayText,
                          themeStyles.text,
                        ]}
                      >
                        {day.date()}
                      </Text>
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

      {/* Horarios */}
      {selectedDate && (
        <View style={[styles.section, themeStyles.card]}>
          <Text style={[styles.sectionTitle, themeStyles.text]}>
            Selecciona un horario de inicio ({selectedDate.format('dddd')})
          </Text>
          <TouchableOpacity
            style={[styles.timeSelector, themeStyles.input]}
            onPress={() => setShowTimePicker(true)}
          >
            <Ionicons name="time-outline" size={20} color={isDarkMode ? "#aaa" : "#666"} />
            <Text style={[styles.timeSelectorText, themeStyles.text]}>
              {selectedTime || 'Seleccionar horario'}
            </Text>
            <Ionicons name="chevron-down" size={16} color={isDarkMode ? "#aaa" : "#666"} />
          </TouchableOpacity>

          <Modal visible={showTimePicker} animationType="slide" transparent={true}>
            <View style={styles.modalOverlay}>
              <View style={[styles.modalContent, themeStyles.card]}>
                <Text style={[styles.modalTitle, themeStyles.text]}>Selecciona un horario</Text>
                <FlatList
                  data={horariosDisponibles}
                  numColumns={3}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => {
                    const isAvailable = isTimeAvailable(item);
                    return (
                      <TouchableOpacity
                        style={[
                          styles.timeSlot,
                          { backgroundColor: isDarkMode ? '#3a3a3a' : '#f0f0f0' },
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
                            { color: isDarkMode ? '#fff' : '#333' },
                            !isAvailable && styles.timeSlotTextDisabled,
                            selectedTime === item && styles.timeSlotTextSelected,
                          ]}
                        >
                          {item}
                        </Text>
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

      {/* Notas */}
      <View style={[styles.section, themeStyles.card]}>
        <Text style={[styles.sectionTitle, themeStyles.text]}>Notas adicionales (opcional)</Text>
        <TextInput
          style={[styles.notasInput, themeStyles.input]}
          placeholder="Agrega alguna nota o comentario especial..."
          placeholderTextColor={isDarkMode ? "#aaa" : "#999"}
          multiline
          numberOfLines={3}
          value={notas}
          onChangeText={setNotas}
        />
      </View>

      {/* Botón confirmar */}
      <TouchableOpacity
        style={[
          styles.confirmButton,
          (!selectedTecnico || !selectedDate || !selectedTime) && styles.confirmButtonDisabled,
        ]}
        onPress={confirmarCita}
        disabled={!selectedTecnico || !selectedDate || !selectedTime}
      >
        <Text style={styles.confirmButtonText}>Confirmar Cita</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
