import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import MapboxMap from './MapboxMap';
import DateScreen from './src/screens/DateScreen';
import RegisterScreen from "./src/screens/RegisterScreen";
import NotificationsScreen from "./src/screens/NotificationsScreen";
import * as Notifications from 'expo-notifications';

const Stack = createNativeStackNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function App() {
  React.useEffect(() => {
    // Solicitar permisos al iniciar la app
    const setupNotifications = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        await Notifications.requestPermissionsAsync();
      }
    };

    setupNotifications();
  }, []);

  // Agrega esta función a tu NotificationsScreen
const probarCambioEstatusCita = async () => {
  try {
    const citaId = 1; // Reemplaza con un ID de cita real
    
    // Cambiar a "confirmada"
    const response = await axios.patch(
      `${API_BASE_URL}/citas/${citaId}/estatus`,
      {
        estatus: "confirmada"
        // Para rechazar: estatus: "rechazada", motivo: "Motivo de prueba"
      }
    );
    
    console.log('Respuesta del backend:', response.data);
    Alert.alert('Éxito', 'Solicitud enviada. Deberías recibir una notificación pronto.');
    
  } catch (error) {
    console.error('Error cambiando estatus:', error);
    Alert.alert('Error', 'No se pudo cambiar el estatus de la cita');
  }
};

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Mapa" component={MapboxMap} />
        <Stack.Screen name="DateScreen" component={DateScreen} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        <Stack.Screen 
          name="NotificationsScreen" 
          component={NotificationsScreen} 
          options={{ title: "Notificaciones" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}