import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
  useWindowDimensions,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useStore } from '../store/useStore';
import { RootStackParamList } from '../../App';

type OrderConfirmationScreenRouteProp = RouteProp<
  RootStackParamList,
  'OrderConfirmation'
>;

type OrderConfirmationScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'OrderConfirmation'
>;

interface OrderDetails {
  orderId: string;
  orderDate: Date;
  totalAmount: number;
  itemsCount: number;
  shippingAddress?: string;
  paymentMethod?: string;
}

const OrderConfirmationScreen = () => {
  const navigation = useNavigation<OrderConfirmationScreenNavigationProp>();
  const route = useRoute<OrderConfirmationScreenRouteProp>();
  const { cart, clearCart } = useStore();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [cartCleared, setCartCleared] = useState(false);
  const { width: windowWidth } = useWindowDimensions();

  const generateOrderDetails = useCallback(() => {
    if (cart.length === 0 && cartCleared) return null;

    const orderId = `ORD-${Date.now().toString().slice(-8)}`;
    const totalAmount = cart.reduce(
      (sum, item) => sum + item.pet.price * item.quantity,
      0,
    );

    return {
      orderId,
      orderDate: new Date(),
      totalAmount,
      itemsCount: cart.length,
      shippingAddress: '123 Pet Street, Animal City, AC 12345',
      paymentMethod: 'Credit Card',
    };
  }, [cart, cartCleared]);

  useEffect(() => {
    // Generate order details only once when component mounts
    const details = generateOrderDetails();
    if (details) {
      setOrderDetails(details);

      // Clear cart only once
      if (!cartCleared) {
        clearCart();
        setCartCleared(true);
      }
    }
  }, [generateOrderDetails, clearCart, cartCleared]);

  const handleContinueShopping = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  const handleViewOrders = () => {
    Alert.alert(
      'Feature Coming Soon',
      'Order history feature will be available soon!',
      [{ text: 'OK' }],
    );
  };

  if (!orderDetails) {
    return (
      <View style={styles.loadingContainer}>
        <Image
          source={require('../assets/images/loading.png')}
          style={{ width: 60, height: 60, tintColor: '#4CAF50' }}
          resizeMode="contain"
        />
        <Text style={styles.loadingText}>Processing your order...</Text>
      </View>
    );
  }

  // Calculate responsive padding based on screen width
  const responsivePadding = windowWidth < 375 ? 15 : 20;
  const responsiveFontSize = windowWidth < 375 ? 12 : 14;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.content, { padding: responsivePadding }]}>
        {/* Success Icon */}
        <View style={styles.successIconContainer}>
          <View style={styles.successIconCircle}>
            <Image
              source={require('../assets/images/check_circle.png')}
              style={styles.successIcon}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Confirmation Message */}
        <View style={styles.messageContainer}>
          <Text style={styles.confirmationTitle}>Order Confirmed!</Text>
          <Text style={styles.confirmationSubtitle}>
            Thank you for your purchase. Your order has been successfully
            placed.
          </Text>
        </View>

        {/* Order Details Card */}
        <View style={styles.detailsCard}>
          <Text style={styles.detailsTitle}>Order Details</Text>

          <View style={styles.detailRowsContainer}>
            {/* Row 1: Order ID and Date */}
            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Image
                  source={require('../assets/images/receipt.png')}
                  style={styles.detailIcon}
                  resizeMode="contain"
                />
                <View style={styles.detailTextContainer}>
                  <Text style={styles.detailLabel}>Order ID:</Text>
                  <Text
                    style={styles.detailValue}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {orderDetails.orderId}
                  </Text>
                </View>
              </View>

              <View style={styles.detailItem}>
                <Image
                  source={require('../assets/images/calender.png')}
                  style={styles.detailIcon}
                  resizeMode="contain"
                />
                <View style={styles.detailTextContainer}>
                  <Text style={styles.detailLabel}>Date:</Text>
                  <Text
                    style={styles.detailValue}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {orderDetails.orderDate.toLocaleDateString()}
                  </Text>
                </View>
              </View>
            </View>

            {/* Row 2: Items and Total Amount */}
            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Image
                  source={require('../assets/images/pets.png')}
                  style={styles.detailIcon}
                  resizeMode="contain"
                />
                <View style={styles.detailTextContainer}>
                  <Text style={styles.detailLabel}>Items:</Text>
                  <Text style={styles.detailValue}>
                    {orderDetails.itemsCount}
                  </Text>
                </View>
              </View>

              <View style={styles.detailItem}>
                <Image
                  source={require('../assets/images/money.png')}
                  style={styles.detailIcon}
                  resizeMode="contain"
                />
                <View style={styles.detailTextContainer}>
                  <Text style={styles.detailLabel}>Total:</Text>
                  <Text style={[styles.detailValue, styles.totalAmount]}>
                    ${orderDetails.totalAmount.toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Shipping Address Section */}
          {orderDetails.shippingAddress && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Image
                  source={require('../assets/images/location.png')}
                  style={styles.sectionIcon}
                  resizeMode="contain"
                />
                <Text style={styles.sectionTitle}>Shipping Address</Text>
              </View>
              <Text
                style={styles.sectionText}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {orderDetails.shippingAddress}
              </Text>
            </View>
          )}

          {/* Payment Method Section */}
          {orderDetails.paymentMethod && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Image
                  source={require('../assets/images/credit_card.png')}
                  style={styles.sectionIcon}
                  resizeMode="contain"
                />
                <Text style={styles.sectionTitle}>Payment Method</Text>
              </View>
              <Text style={styles.sectionText}>
                {orderDetails.paymentMethod}
              </Text>
            </View>
          )}
        </View>

        {/* Next Steps */}
        <View style={styles.nextStepsCard}>
          <Text style={styles.nextStepsTitle}>What's Next?</Text>
          <View style={styles.stepsContainer}>
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <Text style={styles.stepText}>
                You will receive an order confirmation email shortly.
              </Text>
            </View>
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <Text style={styles.stepText}>
                Your pets will be prepared for shipping within 24 hours.
              </Text>
            </View>
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <Text style={styles.stepText}>
                Track your order using the order ID above.
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleContinueShopping}
          >
            <Image
              source={require('../assets/images/shopping_bag.png')}
              style={styles.buttonIcon}
              resizeMode="contain"
            />
            <Text style={styles.primaryButtonText}>Continue Shopping</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleViewOrders}
          >
            <Image
              source={require('../assets/images/history.png')}
              style={[styles.buttonIcon, { tintColor: '#2196F3' }]}
              resizeMode="contain"
            />
            <Text style={styles.secondaryButtonText}>View Order History</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.homeButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.homeButtonText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  content: {
    flex: 1,
  },
  successIconContainer: {
    alignItems: 'center',
    marginVertical: 25,
  },
  successIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  successIcon: {
    width: 60,
    height: 60,
    tintColor: '#FFFFFF',
  },
  messageContainer: {
    alignItems: 'center',
    marginBottom: 25,
    paddingHorizontal: 10,
  },
  confirmationTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  confirmationSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 5,
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  detailRowsContainer: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  detailItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 140, // Minimum width for each item
    marginBottom: 8,
  },
  detailIcon: {
    width: 20,
    height: 20,
    tintColor: '#666',
    marginRight: 10,
  },
  detailTextContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 4,
    flexShrink: 0,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  totalAmount: {
    color: '#4CAF50',
    fontWeight: 'bold',
    fontSize: 16,
  },
  section: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionIcon: {
    width: 20,
    height: 20,
    tintColor: '#666',
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  sectionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  nextStepsCard: {
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  nextStepsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 15,
  },
  stepsContainer: {
    paddingHorizontal: 5,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
    flexShrink: 0,
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: '#2E7D32',
    lineHeight: 20,
    flexWrap: 'wrap',
  },
  actionsContainer: {
    marginBottom: 30,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2196F3',
    paddingVertical: 16,
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2196F3',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  secondaryButtonText: {
    color: '#2196F3',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  homeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  homeButtonText: {
    color: '#666',
    fontSize: 16,
  },
  buttonIcon: {
    width: 20,
    height: 20,
    tintColor: '#FFFFFF',
  },
});

export default OrderConfirmationScreen;
