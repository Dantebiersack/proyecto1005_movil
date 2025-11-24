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
  Alert,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔐 Función para iniciar sesión con el backend real
  // En tu LoginScreen.js - actualiza el handleLogin
// En tu LoginScreen.js - actualiza el handleLogin
const handleLogin = async () => {
  if (!username || !password) {
    Alert.alert("Campos requeridos", "Por favor ingresa tu correo y contraseña");
    return;
  }

  setLoading(true);

  try {
    const response = await fetch("https://nearbizbackend3.vercel.app/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userOrEmail: username,
        password: password,
      }),
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || "Usuario o contraseña incorrectos");
    }

    const data = await response.json();
    ('Respuesta completa del servidor:', data);

    //  MANEJO SEGURO DE ASYNCSTORAGE - Verificar que los datos existen
 const userToken = data.token || data.Token || data.user?.Token || data.usuario?.Token;
if (userToken) {
  await AsyncStorage.setItem('userToken', userToken);
  ('Token guardado:', userToken);
} else {
  console.warn('No se recibió token en la respuesta');
}



    if (data.user) {
      await AsyncStorage.setItem('userData', JSON.stringify(data.user));
      ('Usuario guardado:', data.user);
    } else {
      // Si no viene user, pero viene otro campo con la información del usuario
      // Buscar cualquier campo que pueda contener la información del usuario
      const userData = data.usuario || data.userData || data;
      if (userData && userData.IdUsuario) {
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
        ('Usuario guardado (formato alternativo):', userData);
      } else {
        throw new Error('No se recibió información del usuario en la respuesta');
      }
    }

    // Verificar que los datos se guardaron correctamente
    const savedToken = await AsyncStorage.getItem('userToken');
    const savedUser = await AsyncStorage.getItem('userData');
    
    ('Token guardado en AsyncStorage:', savedToken);
    ('Usuario guardado en AsyncStorage:', savedUser);
    
    navigation.navigate("Home");

  } catch (error) {
    console.error('Error completo en login:', error);
    Alert.alert(
      "Error", 
      error.message || "Usuario o contraseña incorrectos"
    );
  } finally {
    setLoading(false);
  }
};
  // Nueva función para registrarse
  const handleRegister = () => {
    navigation.navigate("RegisterScreen");
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
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.leftSection}>
            <Image
              source={require("../../assets/LogoNearBiz.jpeg")}
              style={styles.logo}
            />
          </View>

          <View style={styles.rightSection}>
            <View style={styles.card}>
              <Text style={styles.label}>CORREO</Text>
              <TextInput
                style={styles.input}
                placeholder="Ingresa tu email"
                placeholderTextColor="#ccc"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
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

              <TouchableOpacity onPress={handleRegister} style={styles.registerButton}>
                <Text style={styles.registerText}>
                  ¿No tienes cuenta?{" "}
                  <Text style={styles.registerLink}>Regístrate</Text>
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
  registerButton: {
    marginTop: 20,
  },
  registerText: {
    color: "#ccc",
    fontSize: 14,
  },
  registerLink: {
    color: "#39b58b",
    fontWeight: "600",
  },
});
