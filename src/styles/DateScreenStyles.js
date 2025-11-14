// styles/DateScreenStyles.js
import { StyleSheet, Dimensions, Platform } from 'react-native';
const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 40,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#F8FAFF',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0A2A66',
  },
  headerPlaceholder: {
    width: 40,
  },

  // Empresa Card
  empresaCard: {
    margin: 20,
    marginBottom: 16,
    padding: 20,
    borderRadius: 20,
  },
  empresaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  empresaIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  empresaInfo: {
    flex: 1,
  },
  empresaNombre: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  empresaDireccion: {
    fontSize: 14,
    color: '#64748B',
  },

  // Sections
  section: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
    borderRadius: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0A2A66',
  },

  // Técnicos
  tecnicosContainer: {
    flexDirection: 'row',
  },
  tecnicoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: '#F8FAFF',
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#F1F5F9',
    minWidth: 140,
  },
  tecnicoButtonSelected: {
    backgroundColor: '#0A2A66',
    borderColor: '#0A2A66',
  },
  tecnicoText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0A2A66',
  },
  tecnicoTextSelected: {
    color: '#FFFFFF',
  },

  // Servicio Info
  servicioInfo: {
    padding: 16,
    borderRadius: 12,
  },
  servicioTexto: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
  },
  servicioMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  servicioTiempo: {
    fontSize: 13,
    fontWeight: '500',
  },

  // Selectors
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  dateSelectorText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    fontWeight: '500',
  },
  timeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  timeSelectorText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    fontWeight: '500',
  },

  // Modals
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    borderRadius: 20,
    padding: 20,
    margin: 20,
    width: width - 40,
    maxHeight: height * 0.8,
  },
  modalHeader: {
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },

  // Calendar
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  calendarNavButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#F8FAFF',
  },
  calendarTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0A2A66',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  weekDay: {
    width: '14.28%',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 12,
    marginBottom: 12,
    color: '#64748B',
  },
  dayButton: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    position: 'relative',
  },
  dayText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  otherMonthDay: {
    opacity: 0.3,
  },
  otherMonthText: {
    color: '#9CA3AF',
  },
  disabledDay: {
    opacity: 0.3,
  },
  disabledText: {
    color: '#9CA3AF',
  },
  todayDay: {
    backgroundColor: '#EFF6FF',
    borderRadius: 20,
  },
  todayText: {
    color: '#0A2A66',
    fontWeight: '700',
  },
  todayIndicator: {
    position: 'absolute',
    top: 2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#0A2A66',
  },
  selectedDay: {
    backgroundColor: '#0A2A66',
    borderRadius: 20,
  },
  selectedDayText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  closeCalendarButton: {
    backgroundColor: '#0A2A66',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeCalendarText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },

  // Time Picker
  timeGrid: {
    paddingBottom: 8,
  },
  timeSlot: {
    flex: 1,
    margin: 4,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: (width - 120) / 3,
    backgroundColor: '#F8FAFF',
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
    position: 'relative',
  },
  timeSlotDisabled: {
    backgroundColor: '#F3F4F6',
    borderColor: '#E5E7EB',
    opacity: 0.6,
  },
  timeSlotSelected: {
    backgroundColor: '#0A2A66',
    borderColor: '#0A2A66',
  },
  timeSlotText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  timeSlotTextDisabled: {
    color: '#9CA3AF',
  },
  timeSlotTextSelected: {
    color: '#FFFFFF',
  },
  timeSlotIcon: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
  closeTimeButton: {
    backgroundColor: '#0A2A66',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  closeTimeText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },

  // Notes
  notesLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  notasInput: {
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    textAlignVertical: 'top',
    minHeight: 100,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },

  // Confirm Button
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#0A2A66',
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 20,
    padding: 18,
    borderRadius: 16,
    shadowColor: '#0A2A66',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  confirmButtonDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0.1,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});