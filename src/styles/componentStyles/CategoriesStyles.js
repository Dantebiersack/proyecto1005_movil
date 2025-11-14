// styles/componentStyles/CategoriesStyles.js
import { StyleSheet, Dimensions } from 'react-native';
const { width } = Dimensions.get("window");

export default StyleSheet.create({
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 16,
    color: "#0A2A66",
    letterSpacing: -0.5,
  },

  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },

  categoryBox: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    minWidth: (width - 80) / 2, // Responsive para 2 columnas
    alignItems: "center",
    
    // Sombra sutil
    shadowColor: "#0A2A66",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,

    borderWidth: 1.5,
    borderColor: "#F1F5F9",
  },

  selectedCategory: {
    backgroundColor: '#0A2A66',
    borderColor: '#0A2A66',
    
    shadowColor: "#0A2A66",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },

  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: "#64748B",
    textAlign: 'center',
  },

  selectedCategoryText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  // 🆕 Icono en categorías
  categoryIcon: {
    marginBottom: 6,
  },
});