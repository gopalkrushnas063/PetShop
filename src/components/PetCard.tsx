import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface Pet {
  id: string;
  name: string;
  breed: string;
  age: number;
  price: number;
  image: string;
  createdAt: Date;
}

interface PetCardProps {
  pet: Pet;
  onAddToCart: (pet: Pet) => void;
}

const PetCard: React.FC<PetCardProps> = ({ pet, onAddToCart }) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: pet.image }} style={styles.image} />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{pet.name}</Text>
          <Text style={styles.price}>${pet.price.toFixed(2)}</Text>
        </View>

        <Text style={styles.breed}>{pet.breed}</Text>

        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Image
              source={require('../assets/images/calender.png')}
              style={{
                width: 16,
                height: 16,
                tintColor: '#666',
              }}
              resizeMode="contain"
            />
            <Text style={styles.detailText}>{pet.age} years</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => onAddToCart(pet)}
        >
          <Image
            source={require('../assets/images/add_shopping_cart.png')}
            style={{
              width: 20,
              height: 20,
              tintColor: '#FFFFFF',
            }}
            resizeMode="contain"
          />
          <Text style={styles.addButtonText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  content: {
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  breed: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default PetCard;
