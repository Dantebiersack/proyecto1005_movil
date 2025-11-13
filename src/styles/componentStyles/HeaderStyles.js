import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 18,
  },

  logo: {
    width: 48,
    height: 48,
    borderRadius: 14,
  },

  companyName: {
    fontSize: 22,
    fontWeight: "800",
  },

  themeButton: {
    padding: 8,
    borderRadius: 50,
  }
});
