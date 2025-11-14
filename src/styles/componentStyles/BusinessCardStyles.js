// styles/componentStyles/BusinessCardStyles.js
import { StyleSheet, Dimensions } from 'react-native';
const { width } = Dimensions.get("window");

export default StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    backgroundColor: "#FFFFFF",
    
    // Sombra elegante
    shadowColor: "#0A2A66",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,

    // Borde sutil
    borderWidth: 1,
    borderColor: "#F1F5F9",

    // Responsive
    maxWidth: 400,
    alignSelf: 'center',
    width: width - 40,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },

  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },

  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#EFF6FF",
    justifyContent: 'center',
    alignItems: 'center',
  },

  name: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
    color: "#0A2A66",
    lineHeight: 24,
  },

  distanceBadge: {
    backgroundColor: "#0A2A66",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },

  distanceText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },

  category: {
    fontSize: 14,
    fontWeight: '600',
    color: "#3A7BFF",
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  description: {
    fontSize: 15,
    color: "#64748B",
    marginBottom: 16,
    lineHeight: 22,
  },

  infoContainer: {
    marginBottom: 16,
    gap: 8,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: "center",
    gap: 8,
  },

  infoIcon: {
    width: 16,
    textAlign: 'center',
  },

  infoText: {
    fontSize: 14,
    color: "#64748B",
    flex: 1,
    lineHeight: 20,
  },

  buttonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },

  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
    
    // Sombra botón
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  mapButton: {
    backgroundColor: '#0A2A66',
  },

  appointmentButton: {
    backgroundColor: '#10B981',
  },

  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 0.3,
  },

  // 🆕 Badge para estado del negocio
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: "#166534",
    marginLeft: 4,
  },
});