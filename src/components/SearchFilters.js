// components/SearchFilters.js
import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function SearchFilters({
  search,
  setSearch,
  selectedKm,
  setSelectedKm,
  limpiarFiltros,
  isDarkMode,
  themeStyles
}) {
  return (
    <View style={styles.searchSection}>
      <TextInput
        style={[styles.searchInput, themeStyles.input]}
        placeholder="Buscar negocio, categoría..."
        placeholderTextColor={isDarkMode ? "#aaa" : "#555"}
        value={search}
        onChangeText={setSearch}
      />

      <View style={styles.filtersRow}>
        <View style={styles.pickerContainer}>
          <Text style={[styles.pickerLabel, themeStyles.text]}>
            Radio:
          </Text>
          <Picker
            selectedValue={selectedKm}
            onValueChange={(itemValue) => setSelectedKm(itemValue)}
            style={[styles.picker, themeStyles.input]}
            dropdownIconColor={isDarkMode ? "#fff" : "#000"}
          >
            <Picker.Item label="2 km" value="2" />
            <Picker.Item label="5 km" value="5" />
            <Picker.Item label="10 km" value="10" />
            <Picker.Item label="15 km" value="15" />
            <Picker.Item label="20 km" value="20" />
          </Picker>
        </View>
      </View>

      {/* Botón para limpiar filtros */}
      {(search || selectedKm !== "2") && (
        <TouchableOpacity 
          style={styles.clearFiltersButton}
          onPress={limpiarFiltros}
        >
          <Text style={styles.clearFiltersText}>🗑️ Limpiar filtros</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchSection: { marginBottom: 20 },
  searchInput: { 
    borderWidth: 1, 
    borderRadius: 8, 
    padding: 12, 
    marginBottom: 10, 
    fontSize: 16 
  },
  filtersRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between' 
  },
  pickerContainer: { 
    flex: 1, 
    marginHorizontal: 4 
  },
  pickerLabel: { 
    marginBottom: 4, 
    fontSize: 14, 
    fontWeight: '500' 
  },
  picker: { 
    height: 40 
  },
  clearFiltersButton: { 
    backgroundColor: '#ff6b6b', 
    padding: 10, 
    borderRadius: 8, 
    alignItems: 'center', 
    marginTop: 10 
  },
  clearFiltersText: { 
    color: 'white', 
    fontWeight: 'bold' 
  },
});