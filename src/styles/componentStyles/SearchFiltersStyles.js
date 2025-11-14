// styles/componentStyles/SearchFiltersStyles.js
import { StyleSheet, Dimensions, Platform } from 'react-native';
const { width } = Dimensions.get("window");

export default StyleSheet.create({
  searchSection: {
    marginTop: 16,
    paddingHorizontal: 20,
  },

  searchContainer: {
    position: 'relative',
    marginBottom: 16,
  },

  searchIcon: {
    position: 'absolute',
    left: 16,
    top: 14,
    zIndex: 2,
  },

  searchInput: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    paddingLeft: 48,
    fontSize: 16,
    fontWeight: '500',
    color: "#0A2A66",
    
    // Sombra y borde
    shadowColor: "#0A2A66",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,

    borderWidth: 1.5,
    borderColor: "#F1F5F9",
  },

  filtersRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  filterGroup: {
    flex: 1,
  },

  pickerLabel: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: "600",
    color: "#0A2A66",
  },

  pickerContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#F1F5F9",
    overflow: "hidden",
    
    // CONTENEDOR ANCHO Y LARGO
    width: '100%',
    
    // Sombra sutil
    shadowColor: "#0A2A66",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  picker: {
    height: 56,
    // AÑADIMOS MÁS ESPACIO INTERNO PARA QUE SE VEA MEJOR EL TEXTO
    paddingHorizontal: Platform.OS === 'ios' ? 16 : 12,
    
    // Aseguramos que el texto tenga suficiente espacio
    minWidth: '100%',
  },

  clearFiltersButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    
    // Sombra botón
    shadowColor: "#EF4444",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },

  clearFiltersText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
    letterSpacing: 0.3,
  },

  // 🆕 Versión alternativa si necesitas MÁXIMA visibilidad
  widePickerContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#F1F5F9",
    overflow: "hidden",
    
    // CONTENEDOR EXTRA ANCHO
    width: '100%',
    minWidth: 160,
    maxWidth: 200,
    
    shadowColor: "#0A2A66",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
});