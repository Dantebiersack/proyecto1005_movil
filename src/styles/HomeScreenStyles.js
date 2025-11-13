import { StyleSheet, Dimensions } from 'react-native';
const { width } = Dimensions.get("window");

// 🎨 Paleta elegante
const PRIMARY = "#0A2A66";      // Azul elegante
const PRIMARY_LIGHT = "#1A3E8C";
const PRIMARY_SOFT = "#E5ECF8";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0046d1ff",
  },

  // ===========================
  // 🔄 Loading
  // ===========================
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: PRIMARY,
    fontWeight: "600",
  },

  // ===========================
  // 📝 Resultados
  // ===========================
  resultsContainer: {
    padding: 16,
  },

  resultsHeader: {
    marginBottom: 16,
  },

  resultsTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: PRIMARY,
  },

  distanceInfo: {
    fontSize: 14,
    opacity: 0.7,
    color: "#1F2937",
  },

  // ===========================
  // ❌ No hay resultados
  // ===========================
  noResults: {
    alignItems: "center",
    padding: 24,
    marginTop: 40,
  },

  noResultsText: {
    textAlign: "center",
    fontSize: 18,
    marginBottom: 6,
    color: PRIMARY,
    fontWeight: "700",
  },

  noResultsSubtext: {
    textAlign: "center",
    fontSize: 14,
    opacity: 0.7,
    color: "#4B5563",
  },

  // ===========================
  // 🧩 Tarjetas profesionales
  // ===========================
  card: {
    width: "100%",
    backgroundColor: "#22007fff",
    padding: 18,
    borderRadius: 16,
    marginBottom: 16,

    // Sombra elegante
    shadowColor: "#0A0A0A",
    shadowOpacity: 0.09,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,

    borderLeftWidth: 4,
    borderLeftColor: PRIMARY,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: PRIMARY,
  },

  cardSubtitle: {
    fontSize: 15,
    color: "#6B7280",
    marginTop: 4,
  },

  // ===========================
  // 🔘 Botón principal
  // ===========================
  button: {
    width: width * 0.88,
    alignSelf: "center",
    paddingVertical: 16,
    backgroundColor: PRIMARY,
    borderRadius: 12,
    alignItems: "center",

    shadowColor: PRIMARY,
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,

    marginTop: 22,
  },

  buttonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "700",
  },

  buttonDisabled: {
    backgroundColor: PRIMARY_LIGHT,
    opacity: 0.6,
  },

  // ===========================
  // 🌙 Modo oscuro
  // ===========================
  darkContainer: {
    backgroundColor: "#0C0C0E",
  },

  darkText: {
    color: "#FFF",
  },

  darkCard: {
    backgroundColor: "#0855eeff",
    borderLeftColor: PRIMARY_LIGHT,
    borderLeftWidth: 4,
    shadowOpacity: 0,
  },

  darkSubtitle: {
    color: "#4f70cbff",
  },
});
