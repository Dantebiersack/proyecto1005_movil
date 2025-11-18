import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import MapboxMap from './MapboxMap';
import DateScreen from './src/screens/DateScreen';
import RegisterScreen from "./src/screens/RegisterScreen";
import NotificationsScreen from "./src/screens/NotificationsScreen";



const Stack = createNativeStackNavigator();

export default function App() {
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
