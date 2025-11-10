# Firebase Setup for Sprouts Social Login

This guide walks through setting up Firebase Authentication for Google Sign In and Apple Sign In.

---

## Prerequisites

- [ ] Google Account (for Firebase Console)
- [ ] Apple Developer Account ($99/year - required for Apple Sign In)
- [ ] Xcode installed (for iOS setup)
- [ ] Android Studio installed (for Android setup)

---

## Part 1: Create Firebase Project

### 1.1 Go to Firebase Console

Visit: https://console.firebase.google.com/

### 1.2 Create New Project

1. Click **"Add project"**
2. **Project name:** `sprouts-app` (or your preferred name)
3. **Google Analytics:** Enable (recommended)
4. **Analytics account:** Create new or use existing
5. Click **"Create project"**

### 1.3 Navigate to Authentication

1. In left sidebar, click **"Build" → "Authentication"**
2. Click **"Get started"**

---

## Part 2: Configure Sign-In Methods

### 2.1 Enable Google Sign In

1. In **"Sign-in method"** tab, click **"Google"**
2. Toggle **"Enable"**
3. **Project support email:** Select your email
4. Click **"Save"**

✅ Google Sign In is now enabled!

### 2.2 Enable Apple Sign In

1. In **"Sign-in method"** tab, click **"Apple"**
2. Toggle **"Enable"**
3. Click **"Save"** (we'll configure iOS settings later)

✅ Apple Sign In is now enabled!

---

## Part 3: Add Flutter App to Firebase

### 3.1 Add iOS App

1. In Firebase Console, click **"Project Overview"**
2. Click **iOS icon** (⊕)
3. **iOS bundle ID:** `com.sprouts.app` (or your bundle ID from Xcode)
   - To find: Open `sprouts_flutter/ios/Runner.xcworkspace` in Xcode
   - Select **Runner** → **General** → **Bundle Identifier**
4. **App nickname:** `Sprouts iOS`
5. **App Store ID:** Leave blank (we'll add later)
6. Click **"Register app"**

### 3.2 Download iOS Config File

1. Download **`GoogleService-Info.plist`**
2. Open Xcode: `sprouts_flutter/ios/Runner.xcworkspace`
3. Drag `GoogleService-Info.plist` into **Runner** folder in Xcode
4. ✅ Check **"Copy items if needed"**
5. ✅ Check **Runner** target
6. Click **"Finish"**

### 3.3 Add Android App

1. In Firebase Console, click **Android icon** (⊕)
2. **Android package name:** `com.sprouts.app`
   - Found in: `sprouts_flutter/android/app/build.gradle` → `applicationId`
3. **App nickname:** `Sprouts Android`
4. **Debug signing certificate SHA-1:** (Optional for now)
   - Get with: `keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android`
5. Click **"Register app"**

### 3.4 Download Android Config File

1. Download **`google-services.json`**
2. Move file to: `sprouts_flutter/android/app/google-services.json`

---

## Part 4: Apple Sign In Configuration (iOS)

### 4.1 Apple Developer Portal Setup

1. Go to: https://developer.apple.com/account/
2. Navigate to **"Certificates, Identifiers & Profiles"**

### 4.2 Enable Sign In with Apple Capability

1. Click **"Identifiers"** → Select your App ID (`com.sprouts.app`)
2. Scroll to **"Sign In with Apple"**
3. ✅ Check **"Sign In with Apple"**
4. Click **"Edit"** if needed to configure
5. Click **"Save"**

### 4.3 Configure Xcode

1. Open `sprouts_flutter/ios/Runner.xcworkspace` in Xcode
2. Select **Runner** project → **Runner** target
3. Go to **"Signing & Capabilities"** tab
4. Click **"+ Capability"**
5. Add **"Sign In with Apple"**

### 4.4 Configure Firebase with Apple Service ID

1. In Firebase Console → **Authentication** → **Sign-in method** → **Apple**
2. You'll need:
   - **Service ID:** Create at https://developer.apple.com/account/resources/identifiers/list/serviceId
   - **OAuth code flow:** Configure redirect URI from Firebase
3. Follow Firebase instructions for Apple Service ID setup

**Note:** This part requires an active Apple Developer Program membership ($99/year).

---

## Part 5: Install Flutter Firebase Packages

Run these commands in the Flutter project directory:

```bash
cd sprouts_flutter

# Add Firebase packages
flutter pub add firebase_core
flutter pub add firebase_auth
flutter pub add google_sign_in
flutter pub add sign_in_with_apple

# For easier integration
flutter pub add flutter_firebase_ui
```

---

## Part 6: Configure Firebase in Flutter

### 6.1 Initialize FlutterFire CLI (Optional but Recommended)

```bash
# Install FlutterFire CLI globally
dart pub global activate flutterfire_cli

# Configure Firebase for Flutter
flutterfire configure
```

This will:
- Auto-detect your Firebase project
- Generate `firebase_options.dart` with all config
- Configure iOS and Android automatically

**OR manually configure (see next section)**

---

## Part 7: Environment Variables

Create/update `.env` files:

### Backend `.env`

Add Firebase Admin SDK credentials (for backend verification):

```env
# Firebase Admin SDK
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

To get Firebase Admin credentials:
1. Firebase Console → **Project Settings** (gear icon)
2. **"Service accounts"** tab
3. Click **"Generate new private key"**
4. Download JSON file
5. Copy values to `.env`

---

## Part 8: Testing Checklist

### iOS Testing

- [ ] Run `flutter run -d iPhone` (simulator or device)
- [ ] Tap "Sign In with Google"
- [ ] Verify Google OAuth popup appears
- [ ] Verify successful login and wallet creation
- [ ] Tap "Sign In with Apple"
- [ ] Verify Apple Sign In sheet appears
- [ ] Verify successful login

### Android Testing

- [ ] Run `flutter run -d Android` (emulator or device)
- [ ] Test Google Sign In flow
- [ ] Verify successful login and backend registration

---

## Troubleshooting

### iOS: "No FirebaseApp '[DEFAULT]' has been created"
- Ensure `GoogleService-Info.plist` is in Runner folder in Xcode
- Ensure Firebase.initializeApp() is called in main.dart

### Android: "Default FirebaseApp is not initialized"
- Ensure `google-services.json` is in `android/app/`
- Ensure `google-services` plugin is applied in `android/app/build.gradle`

### Apple Sign In: "Not available"
- Apple Sign In only works on iOS 13+ and macOS 10.15+
- Must have Sign In with Apple capability in Xcode
- Must be configured in Apple Developer Portal

### Google Sign In: "Developer Error"
- Check SHA-1 fingerprint is added to Firebase
- Check OAuth Client ID is configured correctly

---

## Security Notes

### Production Considerations

1. **Never commit:**
   - `GoogleService-Info.plist`
   - `google-services.json`
   - Firebase Admin private key
   - `.env` files

2. **Add to `.gitignore`:**
   ```
   **/GoogleService-Info.plist
   **/google-services.json
   **/.env
   ```

3. **Firebase Security Rules:**
   - Configure Firestore/Storage rules if used
   - Enable App Check for production

4. **Rate Limiting:**
   - Firebase has built-in abuse prevention
   - Consider additional rate limiting on backend

---

## Next Steps

After Firebase is configured:

1. ✅ Update Flutter app with Firebase Auth implementation
2. ✅ Test social login on iOS/Android
3. ✅ Integrate with backend wallet creation
4. ✅ Test end-to-end onboarding flow

---

## Useful Links

- [Firebase Console](https://console.firebase.google.com/)
- [FlutterFire Documentation](https://firebase.flutter.dev/)
- [Firebase Auth Flutter](https://firebase.flutter.dev/docs/auth/usage)
- [Apple Developer Portal](https://developer.apple.com/account/)
- [Google Sign In Flutter](https://pub.dev/packages/google_sign_in)
- [Sign In with Apple Flutter](https://pub.dev/packages/sign_in_with_apple)

---

## Support

If you encounter issues:
1. Check Firebase Console logs
2. Check Flutter console output
3. Check Xcode console (iOS)
4. Check Android Logcat (Android)
