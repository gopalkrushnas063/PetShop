import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { StatusBar, StyleSheet, View, Image, Animated } from 'react-native';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import AddPetScreen from './src/screens/AddPetScreen';
import CartScreen from './src/screens/CartScreen';
import PetListScreen from './src/screens/PetListScreen';
import OrderConfirmationScreen from './src/screens/OrderConfirmationScreen';

export type RootStackParamList = {
  Home: undefined;
  AddPet: undefined;
  PetList: undefined;
  Cart: undefined;
  OrderConfirmation: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <SafeAreaProvider>
        <StatusBar hidden />
        <View style={styles.splashContainer}>
          <Animated.View style={[styles.splashContent, { opacity: fadeAnim }]}>
            <Image
              source={require('./src/assets/images/pets.png')}
              style={styles.splashIcon}
              resizeMode="contain"
            />
            <Animated.Text style={[styles.splashTitle, { opacity: fadeAnim }]}>
              PetShop
            </Animated.Text>
          </Animated.View>
        </View>
      </SafeAreaProvider>
    );
  }

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
          <Stack.Screen
            name="OrderConfirmation"
            component={OrderConfirmationScreen}
            options={{
              title: 'Order Confirmation',
              headerBackTitle: 'Back',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashContent: {
    alignItems: 'center',
  },
  splashIcon: {
    width: 120,
    height: 120,
    tintColor: '#FFFFFF',
    marginBottom: 20,
  },
  splashTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default App;
