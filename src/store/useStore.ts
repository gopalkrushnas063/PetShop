import { create } from 'zustand';
import { Pet, CartItem } from '../types';
import { api } from '../services/api';

interface StoreState {
  pets: Pet[];
  cart: CartItem[];
  loading: boolean;
  error: string | null;
  addPet: (pet: Pet) => void;
  addToCart: (pet: Pet) => void;
  removeFromCart: (petId: string) => void;
  updateCartQuantity: (petId: string, quantity: number) => void;
  clearCart: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchPets: () => Promise<void>;
}

export const useStore = create<StoreState>((set, get) => ({
  pets: [],
  cart: [],
  loading: false,
  error: null,
  
  fetchPets: async () => {
    try {
      set({ loading: true, error: null });
      const response = await api.getAllPets();
      
      // Convert API response to our Pet type
      const pets: Pet[] = response.map((item: any) => ({
        id: item.id,
        name: item.name,
        breed: item.breed,
        age: item.age,
        price: item.price,
        image: item.image,
        createdAt: new Date(item.createdAt * 1000), // Convert from seconds to Date
      }));
      
      set({ pets, loading: false });
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to fetch pets',
        loading: false 
      });
    }
  },
  
  addPet: (pet) => 
    set((state) => ({ pets: [...state.pets, pet] })),
    
  addToCart: (pet) =>
    set((state) => {
      const existingItem = state.cart.find((item) => item.pet.id === pet.id);
      if (existingItem) {
        return {
          cart: state.cart.map((item) =>
            item.pet.id === pet.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return { cart: [...state.cart, { pet, quantity: 1 }] };
    }),
    
  removeFromCart: (petId) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.pet.id !== petId),
    })),
    
  updateCartQuantity: (petId, quantity) =>
    set((state) => ({
      cart: state.cart.map((item) =>
        item.pet.id === petId ? { ...item, quantity } : item
      ),
    })),
    
  clearCart: () => set({ cart: [] }),
    
  setLoading: (loading) => set({ loading }),
    
  setError: (error) => set({ error }),
}));