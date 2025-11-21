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

    // Validación básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Por favor ingresa un email válido.");
      return;
    }

    // Validación de contraseña
    if (contrasena.length < 6) {
      Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setLoading(true);

    try {
      console.log('📤 Enviando datos de registro:', {
        Nombre: nombre,
        Email: email,
        ContrasenaHash: contrasena,
        IdRol: 4,
        Token: null
      });

      const response = await fetch("https://nearbizbackend3.vercel.app/api/registroapp", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          Nombre: nombre,           // ✅ PascalCase
          Email: email,             // ✅ PascalCase  
          ContrasenaHash: contrasena, // ✅ PascalCase (corregido)
          IdRol: 4,                 // ✅ PascalCase
          Token: null               // ✅ PascalCase
        }),
      });

      console.log('📨 Respuesta del servidor - Status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Registro exitoso:', data);
        
        Alert.alert(
          "Registro exitoso", 
          "Tu cuenta ha sido creada correctamente.",
          [{ text: 'OK', onPress: () => navigation.navigate("Login") }]
        );
      } else {
        const errorText = await response.text();
        console.error('❌ Error en registro:', errorText);
        
        let mensajeError = "No se pudo registrar. Intenta nuevamente.";
        
        if (errorText.includes('duplicate key') || errorText.includes('email')) {
          mensajeError = "Este email ya está registrado.";
        } else if (errorText.includes('nombre')) {
          mensajeError = "El nombre es requerido.";
        }
        
        Alert.alert("Error", mensajeError);
      }
    } catch (error) {
      console.error('❌ Error de conexión:', error);
      Alert.alert("Error", "No se pudo conectar con el servidor. Verifica tu conexión.");
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
              autoCapitalize="words"
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
              autoComplete="email"
            />

            <Text style={styles.label}>CONTRASEÑA</Text>
            <TextInput
              style={styles.input}
              placeholder="Mínimo 6 caracteres"
              placeholderTextColor="#ccc"
              secureTextEntry
              value={contrasena}
              onChangeText={setContrasena}
              autoComplete="password"
            />

            <TouchableOpacity
              style={[styles.registerButton, loading && styles.registerButtonDisabled]}
              onPress={handleRegister}
              disabled={loading}
            >
              <Text style={styles.registerButtonText}>
                {loading ? "Registrando..." : "REGISTRARSE"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.loginLinkButton}
              onPress={() => navigation.navigate("Login")}
            >
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
    fontSize: 16,
  },

  registerButton: {
    backgroundColor: "#3843C2",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 25,
    width: "100%",
    alignItems: "center",
  },

  registerButtonDisabled: {
    backgroundColor: "#6B7280",
    opacity: 0.7,
  },

  registerButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },

  loginLinkButton: {
    marginTop: 18,
    padding: 8,
  },

  loginText: {
    color: "#ddd",
    textAlign: "center",
    fontSize: 14,
  },

  loginLink: {
    color: "#39b58b",
    fontWeight: "700",
  },
});