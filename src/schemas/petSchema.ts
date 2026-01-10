import { z } from 'zod';

export const petSchema = z.object({
  name: z.string().min(1, 'Pet name is required'),
  breed: z.string().min(1, 'Breed is required'),
  age: z.string().refine((val) => {
    const num = parseInt(val);
    return !isNaN(num) && num > 0 && num <= 30;
  }, 'Age must be between 1 and 30'),
  price: z.string().refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num > 0;
  }, 'Price must be a positive number'),
  image: z.string().url('Please upload a valid image'),
});

export type PetFormData = z.infer<typeof petSchema>;