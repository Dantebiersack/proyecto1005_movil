import { StyleSheet } from 'react-native';

export const lightTheme = StyleSheet.create({
  container: {
    backgroundColor: "#f5f6fa",
  },
  text: {
    color: "#222",
  },
  card: {
    backgroundColor: "#fff",
  },
  input: {
    backgroundColor: "#fff",
    color: "#000",
    borderColor: "#ddd",
  },
});

export const darkTheme = StyleSheet.create({
  container: {
    backgroundColor: "#1e272e",
  },
  text: {
    color: "#f5f6fa",
  },
  card: {
    backgroundColor: "#2f3640",
  },
  input: {
    backgroundColor: "#3a3a3a",
    color: "#fff",
    borderColor: "#555",
  },
});