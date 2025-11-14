// components/SearchFilters.js
import React from "react";
import { View, Text, TextInput, TouchableOpacity, Platform } from "react-native";
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
      {/* Barra de búsqueda con icono */}
      <View style={styles.searchContainer}>
        <Ionicons 
          name="search" 
          size={20} 
          color="#64748B" 
          style={styles.searchIcon}
        />
        <TextInput
          style={[styles.searchInput, themeStyles.input]}
          placeholder="Buscar negocio, categoría..."
          placeholderTextColor="#94A3B8"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Fila de filtros - AHORA MÁS ANCHA */}
      <View style={styles.filtersRow}>
        <View style={styles.filterGroup}>
          <Text style={[styles.pickerLabel, themeStyles.text]}>Radio de búsqueda</Text>
          <View style={[styles.pickerContainer, themeStyles.input]}>
            <Picker
              selectedValue={selectedKm}
              onValueChange={(value) => setSelectedKm(value)}
              style={[
                styles.picker, 
                { 
                  color: themeStyles.text.color,
                  // Añadimos más ancho específicamente para el Picker
                  minWidth: Platform.OS === 'ios' ? 120 : 140,
                }
              ]}
              dropdownIconColor={isDarkMode ? "#94A3B8" : "#64748B"}
              mode={Platform.OS === 'android' ? 'dropdown' : 'dialog'}
            >
              <Picker.Item label="5 km" value="5" />
              <Picker.Item label="10 km" value="10" />
              <Picker.Item label="15 km" value="15" />
              <Picker.Item label="20 km" value="20" />
            </Picker>
          </View>
        </View>
      </View>

      {/* Botón limpiar filtros */}
      {(search || selectedKm !== "10") && (
        <TouchableOpacity style={styles.clearFiltersButton} onPress={limpiarFiltros}>
          <Ionicons name="trash-outline" size={18} color="#fff" />
          <Text style={styles.clearFiltersText}>Limpiar filtros</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}