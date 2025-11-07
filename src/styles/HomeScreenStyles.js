import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  resultsContainer: {
    padding: 16,
  },
  resultsHeader: {
    marginBottom: 16,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  distanceInfo: {
    fontSize: 14,
    opacity: 0.7,
  },
  noResults: {
    alignItems: "center",
    padding: 20,
  },
  noResultsText: {
    textAlign: "center",
    fontSize: 16,
    marginBottom: 8,
    opacity: 0.8,
  },
  noResultsSubtext: {
    textAlign: "center",
    fontSize: 14,
    opacity: 0.6,
  },
});