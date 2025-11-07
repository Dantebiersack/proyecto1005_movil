import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import Ionicons from "react-native-vector-icons/Ionicons";
import styles from "../styles/componentStyles/SearchFiltersStyles";

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
        <Text style={[styles.label, themeStyles.text]}>Radio:</Text>
        <Picker
          selectedValue={selectedKm}
          onValueChange={(value) => setSelectedKm(value)}
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

      {(search || selectedKm !== "2") && (
        <TouchableOpacity style={styles.clearFiltersButton} onPress={limpiarFiltros}>
          <Ionicons name="trash" size={20} color="#fff" style={{ marginRight: 6 }} />
          <Text style={styles.clearFiltersText}>Limpiar filtros</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

