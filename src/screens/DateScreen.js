import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
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

moment.locale('es');

export default function DateScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { empresa, isDarkMode } = route.params; // Recibir isDarkMode

  // Estados
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedTecnico, setSelectedTecnico] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [notas, setNotas] = useState('');
  const [currentMonth, setCurrentMonth] = useState(moment());

  // Definir estilos del tema
  const themeStyles = isDarkMode ? darkTheme : lightTheme;

  // Simulación de técnicos (Aqui vamos a jalar los técnicos reales)
  const tecnicos = [
    { id: 1, nombre: 'Cualquier técnico' },
    { id: 2, nombre: 'Juan Pérez' },
    { id: 3, nombre: 'María García' },
    { id: 4, nombre: 'Carlos López' },
  ];

  // Horarios disponibles (Aqui vamos a jalar los horarios reales)
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


  // Generar días del mes para el calendario
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

  // Verificar si una fecha está disponible 
  const isDateAvailable = (date) => {
    return date.isSameOrAfter(moment(), 'day');
  };

  // Verificar si un horario está disponible
  const isTimeAvailable = (time) => {
    if (!selectedDate) return false;
    
    const fechaHora = `${selectedDate.format('YYYY-MM-DD')} ${time}`;
    
    // Verificar si ya está ocupado
    if (horariosOcupados.includes(fechaHora)) {
      return false;
    }

    // Verificar si es un horario futuro
    const now = moment();
    const selectedDateTime = moment(`${selectedDate.format('YYYY-MM-DD')} ${time}`, 'YYYY-MM-DD h:mm a');
    
    return selectedDateTime.isAfter(now);
  };

  // Navegación del calendario
  const goToPreviousMonth = () => {
    setCurrentMonth(currentMonth.clone().subtract(1, 'month'));
  };

  const goToNextMonth = () => {
    setCurrentMonth(currentMonth.clone().add(1, 'month'));
  };

  // Confirmar cita
  const confirmarCita = () => {
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

    // En un caso real, aquí enviarías los datos al backend
    const fechaHora = `${selectedDate.format('YYYY-MM-DD')} ${selectedTime}`;
    
    // Simular guardado en el backend
    setHorariosOcupados([...horariosOcupados, fechaHora]);

    Alert.alert(
      '¡Cita Agendada!',
      `Tu cita ha sido agendada para el ${selectedDate.format('DD/MM/YYYY')} a las ${selectedTime} con ${selectedTecnico}`,
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

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

      {/* Información de la empresa */}
      <View style={[styles.empresaInfo, themeStyles.card]}>
        <Text style={[styles.empresaNombre, themeStyles.text]}>{empresa.Nombre}</Text>
        <Text style={[styles.empresaDireccion, themeStyles.text]}>{empresa.Direccion}</Text>
      </View>

      {/* Selector de Técnico */}
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

      {/* Información del Servicio */}
      <View style={[styles.section, themeStyles.card]}>
        <Text style={[styles.sectionTitle, themeStyles.text]}>Servicios a realizar</Text>
        <View style={[styles.servicioInfo, { backgroundColor: isDarkMode ? '#2a2a2a' : '#f8f9fa' }]}>
          <Text style={[styles.servicioTexto, themeStyles.text]}>Actividades de ventas y promoción de negocios</Text>
          <Text style={[styles.servicioTiempo, themeStyles.text]}>Tiempo estimado: 15 min</Text>
        </View>
      </View>

      {/* Selector de Fecha */}
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

        {/* Modal del Calendario */}
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
                {/* Días de la semana */}
                {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day) => (
                  <Text key={day} style={[styles.weekDay, themeStyles.text]}>{day}</Text>
                ))}

                {/* Días del mes */}
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

      {/* Selector de Horario */}
      {selectedDate && (
        <View style={[styles.section, themeStyles.card]}>
          <Text style={[styles.sectionTitle, themeStyles.text]}>
            Selecciona un horario de inicio para su cita ({selectedDate.format('dddd')})
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

          {/* Modal de Horarios */}
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

      {/* Notas adicionales */}
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

      {/* Botón de confirmación */}
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

// Estilos del tema
const lightTheme = StyleSheet.create({
  container: {
    backgroundColor: "#f5f6fa",
  },
  text: {
    color: "#222",
  },
  card: {
    backgroundColor: "#fff",
  },
  input: {
    backgroundColor: "#fff",
    color: "#000",
    borderColor: "#ddd",
  },
});

const darkTheme = StyleSheet.create({
  container: {
    backgroundColor: "#1e272e",
  },
  text: {
    color: "#f5f6fa",
  },
  card: {
    backgroundColor: "#2f3640",
  },
  input: {
    backgroundColor: "#3a3a3a",
    color: "#fff",
    borderColor: "#555",
  },
});

// Estilos base (sin cambios)
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 32,
  },
  empresaInfo: {
    padding: 16,
    marginBottom: 8,
  },
  empresaNombre: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  empresaDireccion: {
    fontSize: 14,
  },
  section: {
    padding: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  tecnicosContainer: {
    flexDirection: 'row',
  },
  tecnicoButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  tecnicoButtonSelected: {
    backgroundColor: '#3843c2',
  },
  tecnicoText: {
    fontSize: 14,
    fontWeight: '500',
  },
  tecnicoTextSelected: {
    color: '#fff',
  },
  servicioInfo: {
    padding: 12,
    borderRadius: 8,
  },
  servicioTexto: {
    fontSize: 16,
    marginBottom: 4,
  },
  servicioTiempo: {
    fontSize: 14,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
  dateSelectorText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  timeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
  timeSelectorText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    borderRadius: 12,
    padding: 16,
    margin: 20,
    width: '90%',
    maxHeight: '80%',
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  calendarTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  weekDay: {
    width: '14.28%',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 12,
    marginBottom: 8,
  },
  dayButton: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  dayText: {
    fontSize: 14,
  },
  otherMonthDay: {
    opacity: 0.3,
  },
  otherMonthText: {
    color: '#999',
  },
  disabledDay: {
    opacity: 0.3,
  },
  disabledText: {
    color: '#999',
  },
  selectedDay: {
    backgroundColor: '#3843c2',
    borderRadius: 20,
  },
  selectedDayText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  closeCalendarButton: {
    backgroundColor: '#3843c2',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeCalendarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  timeSlot: {
    flex: 1,
    margin: 4,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: '30%',
  },
  timeSlotDisabled: {
    opacity: 0.5,
  },
  timeSlotSelected: {
    backgroundColor: '#3843c2',
  },
  timeSlotText: {
    fontSize: 12,
  },
  timeSlotTextDisabled: {
    color: '#999',
  },
  timeSlotTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  closeTimeButton: {
    backgroundColor: '#3843c2',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  closeTimeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  notasInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    textAlignVertical: 'top',
    minHeight: 80,
  },
  confirmButton: {
    backgroundColor: '#39b58b',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: '#ccc',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});