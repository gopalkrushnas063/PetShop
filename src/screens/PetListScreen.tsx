import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-toast-message';

import PetCard from '../components/PetCard';
import { useStore } from '../store/useStore';
import { RootStackParamList } from '../../App';

type PetListScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'PetList'
>;

const PetListScreen = () => {
  const navigation = useNavigation<PetListScreenNavigationProp>();
  const isFocused = useIsFocused();
  const { pets, addToCart, fetchPets, loading, error } = useStore();
  const [refreshing, setRefreshing] = useState(false);

  // Fetch pets when screen is focused
  useEffect(() => {
    if (isFocused) {
      loadPets();
    }
  }, [isFocused]);

  const loadPets = async () => {
    try {
      await fetchPets();
    } catch (error) {
      console.error('Failed to load pets:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPets();
    setRefreshing(false);
  };

  const handleAddToCart = (pet: any) => {
    addToCart(pet);
    Toast.show({
      type: 'success',
      text1: 'Added to cart!',
      text2: `${pet.name} has been added to your cart`,
    });
  };

  const renderPetItem = ({ item }: { item: any }) => (
    <PetCard pet={item} onAddToCart={handleAddToCart} />
  );

  if (loading && !refreshing && pets.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Loading pets...</Text>
      </View>
    );
  }

  if (error && pets.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="error" size={60} color="#F44336" />
        <Text style={styles.errorText}>Failed to load pets</Text>
        <Text style={styles.errorSubtext}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadPets}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Available Pets</Text>
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => navigation.navigate('Cart')}
        >
          <Image
            source={require('../assets/images/shopping_cart.png')}
            style={{
              width: 24,
              height: 24,
              tintColor: '#2196F3',
              marginRight: 10,
            }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {pets.length === 0 ? (
        <View style={styles.emptyState}>
          <Image
            source={require('../assets/images/no-animals.png')}
            style={{
              width: 90,
              height: 90,
              tintColor: '#B0BEC5',
            }}
            resizeMode="contain"
          />
          <Text style={styles.emptyStateText}>No pets available</Text>
          <Text style={styles.emptyStateSubtext}>
            Add your first pet to get started
          </Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('AddPet')}
          >
            <Image
              source={require('../assets/images/pets.png')}
              style={{
                width: 20,
                height: 20,
                tintColor: '#FFFFFF',
              }}
              resizeMode="contain"
            />
            <Text style={styles.addButtonText}>Add New Pet</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={pets}
          renderItem={renderPetItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#2196F3']}
              tintColor="#2196F3"
            />
          }
          ListHeaderComponent={
            <Text style={styles.petCount}>{pets.length} pets available</Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#F44336',
    marginTop: 20,
    marginBottom: 10,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  cartButton: {
    padding: 8,
  },
  list: {
    padding: 15,
  },
  petCount: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    fontStyle: 'italic',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#666',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginBottom: 30,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default PetListScreen;
