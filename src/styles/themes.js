// styles/themes.js
import { StyleSheet } from 'react-native';

// 🎨 PALETA AZUL PROFESIONAL
const PRIMARY = "#0A2A66";        // Azul marino oscuro
const PRIMARY_LIGHT = "#1A3E8C";   // Azul marino medio  
const PRIMARY_SOFT = "#2D5AA9";    // Azul brillante
const ACCENT = "#3A7BFF";          // Azul eléctrico
const BACKGROUND = "#F8FAFF";      // Fondo azul muy suave
const CARD_BG = "#FFFFFF";         // Blanco puro
const TEXT_PRIMARY = "#0A2A66";    // Texto azul oscuro
const TEXT_SECONDARY = "#64748B";  // Texto gris azulado
const TEXT_LIGHT = "#94A3B8";      // Texto gris claro
const SUCCESS = "#10B981";         // Verde éxito
const ERROR = "#EF4444";           // Rojo error
const WARNING = "#F59E0B";         // Ámbar

export const lightTheme = StyleSheet.create({
  container: {
    backgroundColor: BACKGROUND,
  },
  text: {
    color: TEXT_PRIMARY,
  },
  textSecondary: {
    color: TEXT_SECONDARY,
  },
  textLight: {
    color: TEXT_LIGHT,
  },
  card: {
    backgroundColor: CARD_BG,
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  input: {
    backgroundColor: CARD_BG,
    color: TEXT_PRIMARY,
    borderColor: "#E2E8F0",
  },
  primary: {
    color: PRIMARY,
  },
  accent: {
    color: ACCENT,
  }
});

export const darkTheme = StyleSheet.create({
  container: {
    backgroundColor: "#0F172A",
  },
  text: {
    color: "#F1F5F9",
  },
  textSecondary: {
    color: "#94A3B8",
  },
  textLight: {
    color: "#64748B",
  },
  card: {
    backgroundColor: "#1E293B",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  input: {
    backgroundColor: "#334155",
    color: "#F1F5F9",
    borderColor: "#475569",
  },
  primary: {
    color: "#3B82F6",
  },
  accent: {
    color: "#60A5FA",
  }
});