// src/screens/LoginScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ImageBackground,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Acción no funcional — solo cambia de pantalla
  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.navigate("Home");
    }, 300);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Fondo general */}
      <ImageBackground
        source={require("../../assets/fondoLogin.png")}
        style={styles.background}
        resizeMode="cover"
      >
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {/* LOGO + TÍTULO */}
          <View style={styles.leftSection}>
            <Image
              source={require("../../assets/LogoNearBiz.jpeg")}
              style={styles.logo}
            />
          </View>

          {/* FORMULARIO */}
          <View style={styles.rightSection}>
            <View style={styles.card}>
              <Text style={styles.label}>CORREO</Text>
              <TextInput
                style={styles.input}
                placeholder="Ingresa tu email"
                placeholderTextColor="#ccc"
                value={username}
                onChangeText={setUsername}
              />

              <Text style={styles.label}>CONTRASEÑA</Text>
              <TextInput
                style={styles.input}
                placeholder="********"
                placeholderTextColor="#ccc"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />

              <TouchableOpacity
                style={styles.loginButton}
                onPress={handleLogin}
                disabled={loading}
              >
                <Text style={styles.loginButtonText}>
                  {loading ? "Ingresando..." : "INGRESAR"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  leftSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  logo: {
    width: 180,
    height: 180,
    borderRadius: 20,
    marginBottom: 10,
    resizeMode: "contain",
  },
  subtitle: {
    fontSize: 16,
    color: "#39b58b",
    marginTop: 4,
    fontWeight: "500",
  },
  rightSection: {
    width: "100%",
    alignItems: "center",
  },
  card: {
    width: "95%",
    maxWidth: 420,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 30,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
    alignItems: "center",
  },
  label: {
    color: "#fff",
    fontWeight: "600",
    alignSelf: "flex-start",
    marginTop: 10,
  },
  input: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
    color: "#000",
  },
  loginButton: {
    backgroundColor: "#3843c2",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
  loginButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
