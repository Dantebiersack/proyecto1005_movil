import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Image,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

export default function RegisterScreen({ navigation }) {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!nombre || !email || !contrasena) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("https://nearbizbackend3.vercel.app/api/Usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          email,
          contrasenaHash: contrasena,
          idRol: 4,
          token: null,
        }),
      });

      if (response.ok) {
        Alert.alert("Registro exitoso", "Tu cuenta ha sido creada.");
        navigation.navigate("Login");
      } else {
        const errorText = await response.text();
        Alert.alert("Error", errorText || "No se pudo registrar.");
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo conectar con el servidor.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ImageBackground
        source={require("../../assets/fondoLogin.png")}
        style={styles.background}
        resizeMode="cover"
      >
        <ScrollView contentContainerStyle={styles.container}>
          
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={require("../../assets/LogoNearBiz.jpeg")}
              style={styles.logo}
            />
          </View>

          {/* Card */}
          <View style={styles.card}>
            <Text style={styles.title}>Crear Cuenta</Text>

            <Text style={styles.label}>NOMBRE COMPLETO</Text>
            <TextInput
              style={styles.input}
              placeholder="Juan Pérez"
              placeholderTextColor="#ccc"
              value={nombre}
              onChangeText={setNombre}
            />

            <Text style={styles.label}>CORREO ELECTRÓNICO</Text>
            <TextInput
              style={styles.input}
              placeholder="correo@ejemplo.com"
              placeholderTextColor="#ccc"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.label}>CONTRASEÑA</Text>
            <TextInput
              style={styles.input}
              placeholder="********"
              placeholderTextColor="#ccc"
              secureTextEntry
              value={contrasena}
              onChangeText={setContrasena}
            />

            <TouchableOpacity
              style={styles.registerButton}
              onPress={handleRegister}
              disabled={loading}
            >
              <Text style={styles.registerButtonText}>
                {loading ? "Registrando..." : "REGISTRARSE"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.loginText}>
                ¿Ya tienes cuenta?{" "}
                <Text style={styles.loginLink}>Inicia sesión</Text>
              </Text>
            </TouchableOpacity>
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
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },

  logoContainer: {
    marginBottom: 20,
    alignItems: "center",
  },

  logo: {
    width: 160,
    height: 160,
    borderRadius: 20,
    resizeMode: "contain",
  },

  card: {
    width: "95%",
    maxWidth: 420,
    backgroundColor: "rgba(0, 0, 0, 0.55)",
    padding: 28,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },

  title: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
  },

  label: {
    color: "#fff",
    fontWeight: "600",
    marginTop: 10,
  },

  input: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 8,
    padding: 12,
    marginTop: 6,
    color: "#000",
  },

  registerButton: {
    backgroundColor: "#3843C2",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 25,
    width: "100%",
    alignItems: "center",
  },

  registerButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },

  loginText: {
    color: "#ddd",
    textAlign: "center",
    marginTop: 18,
    fontSize: 14,
  },

  loginLink: {
    color: "#39b58b",
    fontWeight: "700",
  },
});
