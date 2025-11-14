// components/Categories.js
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import styles from "../styles/componentStyles/CategoriesStyles";

export default function Categories({
  categorias,
  selectedCategoria,
  setSelectedCategoria,
  categoriasMap,
  themeStyles,
}) {
  // Iconos para cada categoría
  const categoryIcons = {
    1: "restaurant",
    2: "spa", 
    3: "construct",
    4: "medical",
    5: "shirt",
    6: "school",
    7: "barbell",
    8: "car-sport",
  };

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, themeStyles.text]}>Categorías</Text>
      <View style={styles.categoriesContainer}>
        {categorias.map((categoriaId) => (
          <TouchableOpacity
            key={categoriaId}
            style={[
              styles.categoryBox,
              selectedCategoria === categoriaId.toString() && styles.selectedCategory,
            ]}
            onPress={() =>
              setSelectedCategoria(
                selectedCategoria === categoriaId.toString() ? "todas" : categoriaId.toString()
              )
            }
          >
            <Ionicons 
              name={categoryIcons[categoriaId] || "business"} 
              size={20} 
              color={selectedCategoria === categoriaId.toString() ? "#fff" : "#64748B"} 
              style={styles.categoryIcon}
            />
            <Text
              style={[
                styles.categoryText,
                selectedCategoria === categoriaId.toString() && styles.selectedCategoryText,
              ]}
            >
              {categoriasMap[categoriaId] || `Categoría ${categoriaId}`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}