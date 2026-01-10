import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { petSchema, PetFormData } from '../schemas/petSchema';
import { api } from '../services/api';
import { useStore } from '../store/useStore';
import { RootStackParamList } from '../../App';

type AddPetScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'AddPet'
>;

const AddPetScreen = () => {
  const navigation = useNavigation<AddPetScreenNavigationProp>();
  const [loading, setLoading] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [fetchingImage, setFetchingImage] = useState(false);
  const { addPet } = useStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<PetFormData>({
    resolver: zodResolver(petSchema),
    defaultValues: {
      name: '',
      breed: '',
      age: '',
      price: '',
      image: '',
    },
  });

  const handleImagePick = (fromCamera: boolean) => {
    const options = {
      mediaType: 'photo' as const,
      quality: 1 as const,
      maxWidth: 800,
      maxHeight: 800,
      includeBase64: false,
      saveToPhotos: false,
    };

    const launchFunction = fromCamera ? launchCamera : launchImageLibrary;

    launchFunction(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: response.errorMessage || 'Failed to pick image',
        });
      } else if (
        response.assets &&
        response.assets.length > 0 &&
        response.assets[0].uri
      ) {
        const uri = response.assets[0].uri;
        setImageUri(uri);
        setValue('image', uri, { shouldValidate: true });
      }
    });
  };

  const fetchRandomDogImage = async () => {
    try {
      setFetchingImage(true);
      const imageUrl = await api.getRandomDogImage();
      setImageUri(imageUrl);
      setValue('image', imageUrl, { shouldValidate: true });
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Random dog image fetched!',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to fetch random image',
      });
    } finally {
      setFetchingImage(false);
    }
  };

  const onSubmit = async (data: PetFormData) => {
    if (!imageUri) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please upload or fetch an image',
      });
      return;
    }

    try {
      setLoading(true);

      // Prepare pet data
      const petData = {
        name: data.name,
        breed: data.breed,
        age: parseInt(data.age),
        price: parseFloat(data.price),
        image: imageUri,
      };

      console.log('Submitting pet to API:', petData);

      // Submit to mock API
      const response = await api.submitPetDetails(petData);
      console.log('API Response:', response);

      // Create new pet object from API response
      const newPet = {
        id: response.id,
        name: response.name,
        breed: response.breed,
        age: response.age,
        price: response.price,
        image: response.image,
        createdAt: new Date(response.createdAt * 1000), // Convert from seconds to Date
      };

      // Add to local store
      addPet(newPet);

      Toast.show({
        type: 'success',
        text1: 'Success!',
        text2: 'Pet added successfully',
        position: 'bottom',
      });

      // Reset form
      reset();
      setImageUri(null);

      // Navigate to pet list after a short delay
      setTimeout(() => {
        navigation.navigate('PetList');
      }, 1500);
    } catch (error: any) {
      console.error('Submit error:', error);

      // Show detailed error message
      let errorMessage = 'Failed to submit pet details';
      if (error.message) {
        errorMessage = error.message;
      }

      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errorMessage,
        position: 'bottom',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        {/* Image Upload Section */}
        <View style={styles.imageSection}>
          <Text style={styles.sectionTitle}>Pet Image</Text>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Image
                source={require('../assets/images/no_img.png')}
                style={{ width: 50, height: 50, tintColor: '#B0BEC5' }}
                resizeMode="contain"
              />
              <Text style={styles.placeholderText}>No image selected</Text>
            </View>
          )}

          <View style={styles.imageButtons}>
            <TouchableOpacity
              style={[styles.imageButton, styles.cameraButton]}
              onPress={() => handleImagePick(true)}
            >
              <Image
                source={require('../assets/images/camera.png')}
                style={{ width: 20, height: 20, tintColor: '#FFFFFF' }}
                resizeMode="contain"
              />
              <Text style={styles.buttonText}>Camera</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.imageButton, styles.galleryButton]}
              onPress={() => handleImagePick(false)}
            >
              <Image
                source={require('../assets/images/gallery.png')}
                style={{ width: 20, height: 20, tintColor: '#FFFFFF' }}
                resizeMode="contain"
              />
              <Text style={styles.buttonText}>Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.imageButton, styles.randomButton]}
              onPress={fetchRandomDogImage}
              disabled={fetchingImage}
            >
              {fetchingImage ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <>
                  <Image
                    source={require('../assets/images/random.png')}
                    style={{ width: 20, height: 20, tintColor: '#FFFFFF' }}
                    resizeMode="contain"
                  />
                  <Text style={styles.buttonText}>Random</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
          {errors.image && (
            <Text style={styles.errorText}>{errors.image.message}</Text>
          )}
        </View>

        {/* Form Fields */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Pet Name *</Text>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <View
                style={[
                  styles.inputContainer,
                  errors.name && styles.inputError,
                ]}
              >
                <Image
                  source={require('../assets/images/person.png')}
                  style={{
                    width: 20,
                    height: 20,
                    tintColor: '#999',
                    marginRight: 10,
                  }}
                  resizeMode="contain"
                />
                <TextInput
                  style={styles.input}
                  value={value}
                  onChangeText={onChange}
                  placeholder="Enter pet name"
                  placeholderTextColor="#999"
                />
              </View>
            )}
          />
          {errors.name && (
            <Text style={styles.errorText}>{errors.name.message}</Text>
          )}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Breed *</Text>
          <Controller
            control={control}
            name="breed"
            render={({ field: { onChange, value } }) => (
              <View
                style={[
                  styles.inputContainer,
                  errors.breed && styles.inputError,
                ]}
              >
                <Image
                  source={require('../assets/images/breed.png')}
                  style={{
                    width: 20,
                    height: 20,
                    tintColor: '#999',
                    marginRight: 10,
                  }}
                  resizeMode="contain"
                />
                <TextInput
                  style={styles.input}
                  value={value}
                  onChangeText={onChange}
                  placeholder="Enter breed"
                  placeholderTextColor="#999"
                />
              </View>
            )}
          />
          {errors.breed && (
            <Text style={styles.errorText}>{errors.breed.message}</Text>
          )}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Age (Years) *</Text>
          <Controller
            control={control}
            name="age"
            render={({ field: { onChange, value } }) => (
              <View
                style={[styles.inputContainer, errors.age && styles.inputError]}
              >
                <Image
                  source={require('../assets/images/calender.png')}
                  style={{
                    width: 20,
                    height: 20,
                    tintColor: '#999',
                    marginRight: 10,
                  }}
                  resizeMode="contain"
                />
                <TextInput
                  style={styles.input}
                  value={value}
                  onChangeText={onChange}
                  placeholder="Enter age between 1-30"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                />
              </View>
            )}
          />
          {errors.age && (
            <Text style={styles.errorText}>{errors.age.message}</Text>
          )}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Price ($) *</Text>
          <Controller
            control={control}
            name="price"
            render={({ field: { onChange, value } }) => (
              <View
                style={[
                  styles.inputContainer,
                  errors.price && styles.inputError,
                ]}
              >
                <Image
                  source={require('../assets/images/money.png')}
                  style={{
                    width: 20,
                    height: 20,
                    tintColor: '#999',
                    marginRight: 10,
                  }}
                  resizeMode="contain"
                />
                <TextInput
                  style={styles.input}
                  value={value}
                  onChangeText={onChange}
                  placeholder="Enter price"
                  placeholderTextColor="#999"
                  keyboardType="decimal-pad"
                />
              </View>
            )}
          />
          {errors.price && (
            <Text style={styles.errorText}>{errors.price.message}</Text>
          )}
        </View>

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit(onSubmit)}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Image
                source={require('../assets/images/submit.png')}
                style={{
                  width: 20,
                  height: 20,
                  tintColor: '#fff',
                  marginRight: 10,
                }}
                resizeMode="contain"
              />
              <Text style={styles.submitButtonText}>Submit Pet Details</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  formContainer: {
    padding: 20,
  },
  imageSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  imagePreview: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    marginBottom: 15,
    resizeMode: 'stretch',
    backgroundColor: '#E0E0E0',
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#B0BEC5',
    borderStyle: 'dashed',
  },
  placeholderText: {
    marginTop: 10,
    color: '#666',
    fontSize: 14,
  },
  imageButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  imageButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  cameraButton: {
    backgroundColor: '#2196F3',
  },
  galleryButton: {
    backgroundColor: '#4CAF50',
  },
  randomButton: {
    backgroundColor: '#FF9800',
  },
  buttonText: {
    color: '#FFFFFF',
    marginLeft: 8,
    fontWeight: '500',
    fontSize: 14,
  },
  fieldGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    paddingHorizontal: 15,
  },
  inputError: {
    borderColor: '#F44336',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    color: '#F44336',
    fontSize: 12,
    marginTop: 5,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 10,
  },
  submitButtonDisabled: {
    backgroundColor: '#81C784',
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
  cancelButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#999',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default AddPetScreen;
