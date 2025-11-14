// styles/componentStyles/HeaderStyles.js
import { StyleSheet, Dimensions } from 'react-native';
const { width } = Dimensions.get("window");

export default StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
    
    // Sombra inferior
    shadowColor: "#0A2A66",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 1000,
  },

  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  logo: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#0A2A66", // Placeholder color
  },

  companyName: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0A2A66",
    letterSpacing: -0.5,
  },

  themeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F8FAFF",
    justifyContent: 'center',
    alignItems: 'center',
    
    // Sombra botón
    shadowColor: "#0A2A66",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  // 🆕 Badge de notificaciones
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: "#EF4444",
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});