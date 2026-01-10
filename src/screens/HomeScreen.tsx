import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Image,
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useStore } from '../store/useStore';
import { RootStackParamList } from '../../App';
import { MaterialIcons } from '@react-native-vector-icons/material-icons';
import { imageMap } from '../assets/imageMap';

type MenuIcon = keyof typeof imageMap;

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const isFocused = useIsFocused();
  const { cart, pets, fetchPets, loading } = useStore();

  useEffect(() => {
    if (isFocused && pets.length === 0) {
      fetchPets();
    }
  }, [isFocused]);

  const onRefresh = () => {
    fetchPets();
  };

  const calculateAveragePrice = () => {
    if (pets.length === 0) return 0;
    const total = pets.reduce((sum, pet) => sum + pet.price, 0);
    return total / pets.length;
  };

  const calculateCartValue = () => {
    return cart.reduce((sum, item) => sum + item.pet.price * item.quantity, 0);
  };

  const menuItems: {
    title: string;
    icon: MenuIcon;
    screen: keyof RootStackParamList;
    description: string;
  }[] = [
    {
      title: 'Add New Pet',
      icon: 'pets',
      screen: 'AddPet',
      description: 'Upload pet details and image',
    },
    {
      title: 'View Pets',
      icon: 'view-list',
      screen: 'PetList',
      description: 'Browse available pets',
    },
    {
      title: 'Shopping Cart',
      icon: 'shopping-cart',
      screen: 'Cart',
      description: `View your cart (${cart.length} items)`,
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={onRefresh}
          colors={['#4CAF50']}
          tintColor="#4CAF50"
        />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to PetShop</Text>
        <Text style={styles.subtitle}>Your one-stop pet shop</Text>
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => navigation.navigate(item.screen)}
          >
            <View style={styles.menuIconContainer}>
              <Image
                source={imageMap[item.icon]}
                style={styles.menuIcon}
                resizeMode="contain"
              />
            </View>

            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuDescription}>{item.description}</Text>
            </View>
            <Image
              source={require('../assets/images/arrow_forward.png')}
              style={styles.arrow_forward}
              resizeMode="contain"
            />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Image
            source={require('../assets/images/pets.png')}
            style={{ width: 30, height: 30, tintColor: '#4CAF50' }}
            resizeMode="contain"
          />
          <Text style={styles.statNumber}>{pets.length}</Text>
          <Text style={styles.statLabel}>Total Pets</Text>
        </View>
        <View style={styles.statCard}>
          <Image
            source={require('../assets/images/shopping_cart.png')}
            style={{ width: 30, height: 30, tintColor: '#2196F3' }}
            resizeMode="contain"
          />
          <Text style={styles.statNumber}>{cart.length}</Text>
          <Text style={styles.statLabel}>In Cart</Text>
        </View>
        <View style={styles.statCard}>
          <Image
            source={require('../assets/images/money.png')}
            style={{ width: 30, height: 30, tintColor: '#FF9800' }}
            resizeMode="contain"
          />
          <Text style={styles.statNumber}>
            ${calculateAveragePrice().toFixed(0)}
          </Text>
          <Text style={styles.statLabel}>Avg Price</Text>
        </View>
      </View>

      {/* Cart Value Summary */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryHeader}>
          <Image
            source={require('../assets/images/shopping_cart.png')}
            style={{ width: 30, height: 30, tintColor: '#4CAF50' }}
            resizeMode="contain"
          />
          <Text style={styles.summaryTitle}>Cart Summary</Text>
        </View>
        <View style={styles.summaryContent}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Items in Cart:</Text>
            <Text style={styles.summaryValue}>{cart.length}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Value:</Text>
            <Text style={[styles.summaryValue, styles.totalValue]}>
              ${calculateCartValue().toFixed(2)}
            </Text>
          </View>
          {cart.length > 0 && (
            <TouchableOpacity
              style={styles.viewCartButton}
              onPress={() => navigation.navigate('Cart')}
            >
              <Text style={styles.viewCartButtonText}>View Cart</Text>
              <MaterialIcons name="arrow-forward" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  menuIcon: {
    width: 30,
    height: 30,
    tintColor: '#000',
  },
  arrow_forward: {
    width: 20,
    height: 20,
    tintColor: '#000',
  },

  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  menuContainer: {
    marginHorizontal: 15,
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  menuIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  menuDescription: {
    fontSize: 14,
    color: '#666',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 15,
    marginBottom: 30,
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 10,
  },
  summaryContent: {
    paddingHorizontal: 5,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  viewCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 15,
  },
  viewCartButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
});

export default HomeScreen;
