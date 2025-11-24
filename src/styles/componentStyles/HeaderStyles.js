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
    // ❌ REMOVIMOS: backgroundColor y sombras fijas
    // ✅ Ahora se controlan por el tema
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
  },

  companyName: {
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: -0.5,
    // ❌ REMOVIMOS: color fijo
    // ✅ Ahora se controla por themeStyles.text
  },

  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    // El color de fondo ahora se controla por el tema
  },

  themeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    // ❌ REMOVIMOS: backgroundColor y sombras fijas
    // ✅ Ahora se controlan por themeStyles.themeButton
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