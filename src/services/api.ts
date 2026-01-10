import axios from 'axios';

const MOCK_API = 'https://69627558d9d64c761907f422.mockapi.io/pets';
const DOG_API = 'https://dog.ceo/api';

export const api = {
  // Submit pet details to mock API
  async submitPetDetails(data: any) {
    try {
      console.log('Submitting pet data to API:', data);
      
      // Format data to match the mock API structure
      const petData = {
        name: data.name,
        breed: data.breed,
        age: data.age,
        price: data.price,
        image: data.image,
        createdAt: Math.floor(Date.now() / 1000), // Current timestamp in seconds
      };

      console.log('Formatted pet data:', petData);
      
      const response = await axios.post(MOCK_API, petData);
      console.log('API Response:', response.data);
      
      return response.data;
    } catch (error: any) {
      console.error('API Error Details:');
      console.error('Error Message:', error.message);
      console.error('Response Status:', error.response?.status);
      console.error('Response Data:', error.response?.data);
      console.error('Response Headers:', error.response?.headers);
      
      throw new Error(`Failed to submit pet: ${error.message}`);
    }
  },

  // Get random dog image
  async getRandomDogImage() {
    try {
      const response = await axios.get(`${DOG_API}/breeds/image/random`);
      return response.data.message;
    } catch (error: any) {
      console.error('Dog API Error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get all pets from API (optional - for fetching existing pets)
  async getAllPets() {
    try {
      const response = await axios.get(MOCK_API);
      return response.data;
    } catch (error: any) {
      console.error('Get Pets API Error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Update pet (optional)
  async updatePet(id: string, data: any) {
    try {
      const response = await axios.put(`${MOCK_API}/${id}`, data);
      return response.data;
    } catch (error: any) {
      console.error('Update Pet API Error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Delete pet (optional)
  async deletePet(id: string) {
    try {
      const response = await axios.delete(`${MOCK_API}/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Delete Pet API Error:', error.response?.data || error.message);
      throw error;
    }
  },
};