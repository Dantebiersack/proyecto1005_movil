// styles/HomeScreenStyles.js
import { StyleSheet, Dimensions } from 'react-native';
const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  
  // 🔄 Loading States
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFF",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: "600",
    color: "#0A2A66",
  },

  // 📊 Results Section
  resultsContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  resultsHeader: {
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  resultsTitle: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 8,
    color: "#0A2A66",
  },
  distanceInfo: {
    fontSize: 15,
    fontWeight: "500",
    color: "#64748B",
  },

  //  No Results
  noResults: {
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  noResultsIcon: {
    fontSize: 64,
    marginBottom: 16,
    color: "#94A3B8",
  },
  noResultsText: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
    color: "#0A2A66",
    lineHeight: 24,
  },
  noResultsSubtext: {
    textAlign: "center",
    fontSize: 15,
    color: "#64748B",
    lineHeight: 22,
  },

  // 🆕 Floating Action Button (opcional)
  fabContainer: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    zIndex: 1000,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#0A2A66",
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#0A2A66",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },

  // 📱 Responsive Design
  responsiveCard: {
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
});