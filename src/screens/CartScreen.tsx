import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Add this import
import { NativeStackNavigationProp } from '@react-navigation/native-stack'; // Add this import
import { useStore } from '../store/useStore';
import { RootStackParamList } from '../../App'; // Add this import

// Add this type definition
type CartScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Cart'
>;

const CartScreen = () => {
  const navigation = useNavigation<CartScreenNavigationProp>(); // Add this line
  const { cart, removeFromCart, updateCartQuantity, clearCart } = useStore(); // Keep only this line - remove the duplicate

  const handleRemoveItem = (petId: string, petName: string) => {
    Alert.alert(
      'Remove Item',
      `Are you sure you want to remove ${petName} from cart?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          onPress: () => removeFromCart(petId),
          style: 'destructive',
        },
      ],
    );
  };

  const handleClearCart = () => {
    if (cart.length === 0) return;

    Alert.alert(
      'Clear Cart',
      'Are you sure you want to clear all items from cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear All', onPress: () => clearCart(), style: 'destructive' },
      ],
    );
  };

  const calculateTotal = () => {
    return cart.reduce(
      (total, item) => total + item.pet.price * item.quantity,
      0,
    );
  };

  const renderCartItem = ({ item }: { item: any }) => (
    <View style={styles.cartItem}>
      <View style={styles.itemImageContainer}>
        <Image source={{ uri: item.pet.image }} style={styles.itemImage} />
      </View>

      <View style={styles.itemDetails}>
        <View style={styles.itemHeader}>
          <Text style={styles.itemName}>{item.pet.name}</Text>
          <TouchableOpacity
            onPress={() => handleRemoveItem(item.pet.id, item.pet.name)}
          >
            <Image
              source={require('../assets/images/cancel.png')}
              style={{
                width: 24,
                height: 24,
                tintColor: '#F44336',
              }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.itemBreed}>{item.pet.breed}</Text>
        <Text style={styles.itemPrice}>${item.pet.price.toFixed(2)} each</Text>

        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() =>
              updateCartQuantity(item.pet.id, Math.max(1, item.quantity - 1))
            }
          >
            <Image
              source={require('../assets/images/remove.png')}
              style={{
                width: 20,
                height: 20,
                tintColor: '#666',
              }}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <Text style={styles.quantityText}>{item.quantity}</Text>

          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => updateCartQuantity(item.pet.id, item.quantity + 1)}
          >
            <Image
              source={require('../assets/images/add.png')}
              style={{
                width: 20,
                height: 20,
                tintColor: '#666',
              }}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <Text style={styles.itemTotal}>
            Total: ${(item.pet.price * item.quantity).toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Shopping Cart</Text>
        {cart.length > 0 && (
          <TouchableOpacity onPress={handleClearCart}>
            <Text style={styles.clearButton}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {cart.length === 0 ? (
        <View style={styles.emptyCart}>
          <Image
            source={require('../assets/images/shopping_cart_off.png')}
            style={{
              width: 80,
              height: 80,
              tintColor: '#B0BEC5',
            }}
            resizeMode="contain"
          />
          <Text style={styles.emptyCartText}>Your cart is empty</Text>
          <Text style={styles.emptyCartSubtext}>
            Add some pets to get started!
          </Text>
        </View>
      ) : (
        <>
          <FlatList
            data={cart}
            renderItem={renderCartItem}
            keyExtractor={item => item.pet.id}
            contentContainerStyle={styles.cartList}
          />

          <View style={styles.footer}>
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total Amount:</Text>
              <Text style={styles.totalAmount}>
                ${calculateTotal().toFixed(2)}
              </Text>
            </View>

            {/* Updated Checkout Button */}
            <TouchableOpacity 
              style={[styles.checkoutButton, cart.length === 0 && styles.checkoutButtonDisabled]}
              onPress={() => {
                if (cart.length === 0) {
                  Alert.alert('Empty Cart', 'Your cart is empty. Add some pets first!');
                  return;
                }
                navigation.navigate('OrderConfirmation');
              }}
              disabled={cart.length === 0}
            >
              <Image
                source={require('../assets/images/shopping_cart.png')}
                style={{
                  width: 20,
                  height: 20,
                  tintColor: '#FFFFFF',
                }}
                resizeMode="contain"
              />
              <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
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
  clearButton: {
    fontSize: 16,
    color: '#F44336',
    fontWeight: '500',
  },
  cartList: {
    padding: 15,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 15,
  },
  itemImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  itemDetails: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  itemBreed: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 14,
    color: '#4CAF50',
    marginBottom: 10,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 15,
    minWidth: 30,
    textAlign: 'center',
  },
  itemTotal: {
    marginLeft: 'auto',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  footer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 18,
    color: '#666',
  },
  totalAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  checkoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 8,
  },
  checkoutButtonDisabled: {
    backgroundColor: '#A5D6A7',
    opacity: 0.7,
  },
  checkoutButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyCartText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#666',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyCartSubtext: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});

export default CartScreen;