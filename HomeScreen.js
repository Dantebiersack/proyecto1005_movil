import React, { useState } from 'react';
import {
  View,
  Text,
  Switch,
  TextInput,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function HomeScreen({ navigation }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedKm, setSelectedKm] = useState("2");
  const [search, setSearch] = useState("");

  const themeStyles = isDarkMode ? darkTheme : lightTheme;

  const empresas = [
    {
      id: 1,
      nombre: "Cafeteria",
      categoria: "Restaurante",
      direccion: "Av. Principal #123",
      imagen: ("Imegen"),
      rating: "Aqui van las estrellas",
    },
    {
      id: 2,
      nombre: "Software",
      categoria: "Tecnología",
      direccion: "Calle Norte #45",
      imagen: ("Imagen"),
      rating: "Aqui van las estrellas",
    },
  ];

  return (
    <ScrollView
      style={[styles.container, themeStyles.container]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER SUPERIOR */}
      <View style={styles.header}>
        <Image
          source={require('./assets/LogoNearBiz.jpeg')}
          style={styles.logo}
        />
        <Text style={[styles.companyName, themeStyles.text]}>NearBiz</Text>

        <View style={styles.switchContainer}>
          <Text style={[styles.switchLabel, themeStyles.text]}>
            {isDarkMode ? '🌙' : '☀️'}
          </Text>
          <Switch
            value={isDarkMode}
            onValueChange={() => setIsDarkMode(!isDarkMode)}
          />
        </View>
      </View>

      {/* BUSCADOR Y SELECTOR */}
      <View style={styles.searchSection}>
        <TextInput
          style={[styles.searchInput, themeStyles.input]}
          placeholder="Buscar..."
          placeholderTextColor={isDarkMode ? "#aaa" : "#555"}
          value={search}
          onChangeText={setSearch}
        />

        <View style={styles.pickerContainer}>
          <Text style={[styles.pickerLabel, themeStyles.text]}>
            Por prioridad:
          </Text>
          <Picker
            selectedValue={selectedKm}
            onValueChange={(itemValue) => setSelectedKm(itemValue)}
            style={[styles.picker, themeStyles.input]}
          >
            <Picker.Item label="2 km" value="2" />
            <Picker.Item label="4 km" value="4" />
            <Picker.Item label="6 km" value="6" />
            <Picker.Item label="8 km" value="8" />
            <Picker.Item label="10 km" value="10" />
          </Picker>
        </View>
      </View>

      {/* CATEGORÍAS */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, themeStyles.text]}>Categorías</Text>
        <View style={styles.categoriesContainer}>
          {['Tiendas', 'Restaurantes', 'Tecnología', 'Servicios'].map((item, index) => (
            <View key={index} style={styles.categoryBox}>
              <Text style={themeStyles.text}>{item}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* EMPRESAS */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, themeStyles.text]}>Empresas cercanas</Text>
        {empresas.map((empresa) => (
          <View key={empresa.id} style={[styles.card, themeStyles.card]}>
            <Image source={empresa.imagen} style={styles.cardImage} />
            <View style={styles.cardContent}>
              <Text style={[styles.cardTitle, themeStyles.text]}>{empresa.nombre}</Text>
              <Text style={[styles.cardText, themeStyles.text]}>{empresa.categoria}</Text>
              <Text style={[styles.cardText, themeStyles.text]}>{empresa.direccion}</Text>
              <Text style={[styles.cardRating, themeStyles.text]}>{empresa.rating}</Text>

              <View style={styles.cardButtons}>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: "#d1d1d1" }]}
                  onPress={() => navigation.navigate("Mapa")}
                >
                  <Text style={styles.buttonText}>Ver mapa</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: "#b0e0a8" }]}
                  
                >
                  <Text style={styles.buttonText}>Agendar cita</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

/* 🎨 ESTILOS */
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollContent: {
    padding: 16,
    paddingBottom: 50,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },

  logo: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },

  companyName: {
    fontSize: 22,
    fontWeight: 'bold',
    flex: 1,
    marginLeft: 10,
  },

  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  switchLabel: {
    marginRight: 6,
    fontSize: 18,
  },

  searchSection: {
    marginBottom: 20,
  },

  searchInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },

  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  pickerLabel: {
    marginRight: 8,
    fontSize: 16,
  },

  picker: {
    flex: 1,
    height: 40,
  },

  section: {
    marginTop: 10,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },

  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },

  categoryBox: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
    width: '45%',
  },

  card: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },

  cardImage: {
    width: '100%',
    height: 150,
  },

  cardContent: {
    padding: 10,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  cardText: {
    fontSize: 14,
    marginVertical: 2,
  },

  cardRating: {
    fontSize: 16,
    marginVertical: 4,
  },

  cardButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },

  button: {
    flex: 1,
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },

  buttonText: {
    fontWeight: 'bold',
  },
});

/* 🎨 TEMAS */
const lightTheme = StyleSheet.create({
  container: {
    backgroundColor: '#fdf6ec',
  },
  text: {
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    color: '#000',
  },
  card: {
    backgroundColor: '#fff',
  },
});

const darkTheme = StyleSheet.create({
  container: {
    backgroundColor: '#1c1c1e',
  },
  text: {
    color: '#f5f5f5',
  },
  input: {
    backgroundColor: '#2c2c2e',
    borderColor: '#444',
    color: '#fff',
  },
  card: {
    backgroundColor: '#2c2c2e',
  },
});
