export interface Pet {
  id: string;
  name: string;
  breed: string;
  age: number;
  price: number;
  image: string;
  createdAt: Date;
}

export interface CartItem {
  pet: Pet;
  quantity: number;
}

export interface PetFormData {
  name: string;
  breed: string;
  age: string;
  price: string;
  image: string;
}

export interface OrderDetails {
  orderId: string;
  orderDate: Date;
  totalAmount: number;
  itemsCount: number;
  shippingAddress?: string;
  paymentMethod?: string;
}

export interface OrderItem {
  pet: Pet;
  quantity: number;
  price: number;
}