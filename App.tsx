import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { StatusBar, StyleSheet } from 'react-native';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import AddPetScreen from './src/screens/AddPetScreen';
import CartScreen from './src/screens/CartScreen';
import PetListScreen from './src/screens/PetListScreen';

export type RootStackParamList = {
  Home: undefined;
  AddPet: undefined;
  PetList: undefined;
  Cart: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ title: 'PetShop' }}
          />
          <Stack.Screen 
            name="AddPet" 
            component={AddPetScreen} 
            options={{ title: 'Add New Pet' }}
          />
          <Stack.Screen 
            name="PetList" 
            component={PetListScreen} 
            options={{ title: 'Available Pets' }}
          />
          <Stack.Screen 
            name="Cart" 
            component={CartScreen} 
            options={{ title: 'Shopping Cart' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </SafeAreaProvider>
  );
}

export default App;