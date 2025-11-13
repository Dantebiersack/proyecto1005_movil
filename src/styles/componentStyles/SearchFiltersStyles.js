import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  searchSection: {
    marginTop: 10,
    paddingHorizontal: 16,
  },

  searchInput: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },

  filtersRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10
  },

  pickerContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d1d5db",
    overflow: "hidden",
  },

  pickerLabel: {
    marginBottom: 4,
    fontWeight: "600",
  },

  picker: {
    height: 45,
  },

  clearFiltersButton: {
    backgroundColor: '#e63946',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
  },

  clearFiltersText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
});
