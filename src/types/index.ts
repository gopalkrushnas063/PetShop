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