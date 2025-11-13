import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  section: {
    marginTop: 25,
    paddingHorizontal: 16,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },

  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  categoryBox: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    backgroundColor: "#f1f2f6",
    minWidth: 110,
    alignItems: "center",
  },

  selectedCategory: {
    backgroundColor: '#3843c2',
  },

  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },

  selectedCategoryText: {
    color: '#fff',
    fontWeight: '700',
  },
});
