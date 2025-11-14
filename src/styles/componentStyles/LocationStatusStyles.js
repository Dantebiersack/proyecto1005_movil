// styles/componentStyles/LocationStatusStyles.js
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    margin: 20,
    marginBottom: 12,
    padding: 20,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    
    // Sombra elegante
    shadowColor: "#0A2A66",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,

    borderLeftWidth: 4,
    borderLeftColor: "#0A2A66",
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
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

  title: {
    fontSize: 16,
    fontWeight: '700',
    color: "#0A2A66",
    flex: 1,
  },

  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },

  text: {
    fontSize: 14,
    color: "#64748B",
    flex: 1,
    lineHeight: 20,
  },

  errorText: {
    color: '#EF4444',
    flex: 1,
    lineHeight: 20,
  },

  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  refreshButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#0A2A66",
    borderRadius: 10,
    
    // Sombra botón
    shadowColor: "#0A2A66",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },

  refreshButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  // 🆕 Estado de precisión
  accuracyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  accuracyText: {
    fontSize: 11,
    fontWeight: '600',
    color: "#92400E",
    marginLeft: 4,
  },
});