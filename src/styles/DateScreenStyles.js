import { StyleSheet } from 'react-native';

export default StyleSheet.create({
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