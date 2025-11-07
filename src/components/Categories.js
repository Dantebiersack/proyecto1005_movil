import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function Categories({
  categorias,
  selectedCategoria,
  setSelectedCategoria,
  categoriasMap,
  themeStyles,
}) {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, themeStyles.text]}>Categorías</Text>
      <View style={styles.categoriesContainer}>
        {categorias.map((categoriaId) => (
          <TouchableOpacity
            key={categoriaId}
            style={[
              styles.categoryBox,
              themeStyles.card,
              selectedCategoria === categoriaId.toString() && styles.selectedCategory,
            ]}
            onPress={() =>
              setSelectedCategoria(
                selectedCategoria === categoriaId.toString() ? "todas" : categoriaId.toString()
              )
            }
          >
            <Text
              style={[
                styles.categoryText,
                themeStyles.text,
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

const styles = StyleSheet.create({
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },
  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  categoryBox: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
  },
  selectedCategory: {
    backgroundColor: "#3843c2",
  },
  selectedCategoryText: {
    color: "#fff",
  },
});
