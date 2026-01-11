# PetShop - Pet Store Mobile Application

## 📱 Overview
PetShop is a React Native mobile application for managing a pet store. It allows users to browse available pets, add new pets with images, manage shopping carts, and complete purchases.

## 🚀 Features
- **Pet Management**: View, add, and manage pet listings
- **Shopping Cart**: Add pets to cart, adjust quantities, and checkout
- **Image Upload**: Upload pet images from camera, gallery, or random dog API
- **Form Validation**: Robust form validation with Zod schema
- **State Management**: Centralized state management with Zustand
- **Responsive UI**: Fully responsive design across different screen sizes
- **Order Confirmation**: Complete order flow with confirmation screen

## 🛠️ Tech Stack

### Core Framework
- **React Native** (0.72.0+) - Cross-platform mobile framework
- **TypeScript** - Type-safe JavaScript
- **React Navigation** - Navigation between screens

### State Management
- **Zustand** - Lightweight state management
- **React Hook Form** - Form state management
- **Zod** - Schema validation

### UI & Styling
- **React Native Vector Icons** - Icon library
- **React Native Safe Area Context** - Safe area handling
- **React Native Toast Message** - Toast notifications

### API & Networking
- **Axios** - HTTP client
- **Mock API Integration** - External API for pet data
- **Dog CEO API** - Random dog images

### Image Handling
- **React Native Image Picker** - Camera and gallery access
- **React Native Gesture Handler** - Gesture support

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 📁 Project Structure

```
PetShop/
├── src/
│   ├── assets/
│   │   ├── images/          # App images and icons
│   │   └── imageMap.ts      # Image mapping utility
│   ├── components/
│   │   └── PetCard.tsx      # Reusable pet card component
│   ├── screens/
│   │   ├── HomeScreen.tsx   # Home dashboard
│   │   ├── AddPetScreen.tsx # Add pet form
│   │   ├── PetListScreen.tsx# Browse pets
│   │   ├── CartScreen.tsx   # Shopping cart
│   │   └── OrderConfirmationScreen.tsx # Order confirmation
│   ├── services/
│   │   └── api.ts           # API service layer
│   ├── store/
│   │   └── useStore.ts      # Zustand store
│   ├── schemas/
│   │   └── petSchema.ts     # Zod validation schemas
│   └── types/
│       └── index.ts         # TypeScript type definitions
├── App.tsx                  # Main app component
├── index.js                 # App entry point
└── package.json             # Dependencies
```

## 🏗️ Architecture

### 1. **Component Architecture**
```
App (Root)
├── Navigation Container
├── Stack Navigator
│   ├── HomeScreen
│   ├── AddPetScreen
│   ├── PetListScreen
│   ├── CartScreen
│   └── OrderConfirmationScreen
└── Toast Container
```

### 2. **State Management Flow**
```
UI Components → Actions → Zustand Store → State Updates → UI Re-render
```

### 3. **Data Flow**
```
User Input → Form Validation → API Call → State Update → UI Update
```

### 4. **Navigation Flow**
```
Splash → Home → [AddPet, PetList, Cart] → OrderConfirmation
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v16+)
- npm or yarn
- React Native CLI
- iOS Simulator (Mac) or Android Studio (Android)

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd PetShop
```

### Step 2: Install Dependencies
```bash
npm install
# or
yarn install
```

### Step 3: Install iOS Dependencies (Mac only)
```bash
cd ios && pod install && cd ..
```

### Step 4: Configure Environment
Create a `.env` file in the root directory (if needed):
```env
MOCK_API_URL=https://69627558d9d64c761907f422.mockapi.io/pets
DOG_API_URL=https://dog.ceo/api
```

### Step 5: Run the Application

#### iOS
```bash
npx react-native run-ios
# or for specific simulator
npx react-native run-ios --simulator="iPhone 14"
```

#### Android
```bash
npx react-native run-android
```

#### Development Server
```bash
npx react-native start
```

## 📱 Platform Support

### iOS
- **Minimum Version**: iOS 12.0+
- **Tested On**: iOS 15, 16, 17
- **Devices**: iPhone, iPad

### Android
- **Minimum Version**: Android 5.0 (API 21)
- **Tested On**: Android 11, 12, 13
- **Devices**: Various screen sizes

## 🚀 Key Libraries & Their Purpose

| Library | Version | Purpose |
|---------|---------|---------|
| `@react-navigation/native` | ^6.x | Navigation framework |
| `@react-navigation/native-stack` | ^6.x | Stack navigation |
| `zustand` | ^4.x | State management |
| `react-hook-form` | ^7.x | Form handling |
| `zod` | ^3.x | Schema validation |
| `axios` | ^1.x | HTTP requests |
| `react-native-image-picker` | ^5.x | Image selection |
| `react-native-toast-message` | ^2.x | Toast notifications |
| `react-native-vector-icons` | ^10.x | Icons |
| `react-native-safe-area-context` | ^4.x | Safe area handling |
| `react-native-gesture-handler` | ^2.x | Gesture support |

## 🔐 Permissions

### iOS (Info.plist)
```xml
<key>NSCameraUsageDescription</key>
<string>App needs camera access to take pet photos</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>App needs photo library access to select pet photos</string>
<key>NSPhotoLibraryAddUsageDescription</key>
<string>App needs to save photos to library</string>
```

### Android (AndroidManifest.xml)
```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

## 📊 API Integration

### 1. **Mock API**
- **Base URL**: `https://69627558d9d64c761907f422.mockapi.io/pets`
- **Endpoints**:
  - `GET /pets` - Fetch all pets
  - `POST /pets` - Add new pet
  - `PUT /pets/:id` - Update pet
  - `DELETE /pets/:id` - Delete pet

### 2. **Dog CEO API**
- **Base URL**: `https://dog.ceo/api`
- **Endpoints**:
  - `GET /breeds/image/random` - Get random dog image

## 🧪 Testing

### Run Tests
```bash
npm test
# or
yarn test
```

### Test Coverage
```bash
npm test -- --coverage
```

## 🚀 Build & Deployment

### Android APK Build
```bash
cd android && ./gradlew assembleRelease
```

### iOS Archive
1. Open `ios/PetShop.xcworkspace` in Xcode
2. Select Product → Archive
3. Distribute via App Store or TestFlight

## 📝 Code Quality

### Linting
```bash
npm run lint
```

### Formatting
```bash
npm run format
```

### Type Checking
```bash
npx tsc --noEmit
```

## 🐛 Troubleshooting

### Common Issues

1. **iOS Build Fails**
   ```bash
   cd ios && pod deintegrate && pod install && cd ..
   ```

2. **Android Build Fails**
   ```bash
   cd android && ./gradlew clean && cd ..
   ```

3. **Metro Bundler Issues**
   ```bash
   watchman watch-del-all && rm -rf node_modules && npm install
   ```

4. **Cache Issues**
   ```bash
   npx react-native start --reset-cache
   ```

### Debugging
- Use React Native Debugger
- Enable remote debugging in developer menu
- Check logs with `console.log()`

