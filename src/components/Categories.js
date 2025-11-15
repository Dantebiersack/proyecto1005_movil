// components/Categories.js
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import styles from "../styles/componentStyles/CategoriesStyles";

export default function Categories({
  categorias,
  selectedCategoria,
  setSelectedCategoria,
  categoriasMap,
  themeStyles,
}) {
  // ICONOS CORRECTOS DE FONTAWESOME5
  const categoryIcons = {
    1: "utensils",         // Comida
    2: "spa",              // Belleza / Spa
    3: "tools",            // Construcción / Servicios
    4: "clinic-medical",   // Salud
    5: "tshirt",           // Ropa
    6: "school",           // Educación
    7: "dumbbell",         // Gimnasio
    8: "car",              // Autos / Mecánico
  };

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, themeStyles.text]}>Categorías</Text>

      <View style={styles.categoriesContainer}>
        {categorias.map((categoriaId) => {
          const isSelected = selectedCategoria === categoriaId.toString();

          return (
            <TouchableOpacity
              key={categoriaId}
              style={[
                styles.categoryBox,
                isSelected && styles.selectedCategory,
              ]}
              onPress={() =>
                setSelectedCategoria(
                  isSelected ? "todas" : categoriaId.toString()
                )
              }
            >
              <FontAwesome5
                name={categoryIcons[categoriaId] || "store"}
                size={20}
                solid
                color={isSelected ? "#fff" : "#64748B"}
                style={styles.categoryIcon}
              />

              <Text
                style={[
                  styles.categoryText,
                  isSelected && styles.selectedCategoryText,
                ]}
              >
                {categoriasMap[categoriaId] || `Categoría ${categoriaId}`}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
