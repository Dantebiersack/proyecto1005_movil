import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image } from 'react-native';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    
    navigation.navigate('Mapa');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido a NearBiz</Text>
      <Image
  source={require('./assets/LogoNearBiz.jpeg')}
  style={styles.logo}
/>

      <TextInput
        placeholder="Usuario"
        style={styles.input}
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        placeholder="Contraseña"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      <Button title="Iniciar sesión" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fdf6ec',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#7a3e00',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 30,
  },
  input: {
    width: '80%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
});
