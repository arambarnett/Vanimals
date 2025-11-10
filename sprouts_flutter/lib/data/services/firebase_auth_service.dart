import 'dart:convert';
import 'package:crypto/crypto.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:sign_in_with_apple/sign_in_with_apple.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'dart:io' show Platform;

/// Production Firebase authentication service with social login
/// Generates deterministic Aptos wallet addresses from Firebase UIDs
class FirebaseAuthService {
  static final FirebaseAuth _auth = FirebaseAuth.instance;
  static final GoogleSignIn _googleSignIn = GoogleSignIn(
    scopes: ['email', 'profile'],
  );

  // Local storage keys
  static const String _walletAddressKey = 'aptos_wallet_address';
  static const String _userIdKey = 'user_id';

  /// Get current Firebase user
  static User? get currentUser => _auth.currentUser;

  /// Check if user is signed in
  static Future<bool> isSignedIn() async {
    final user = _auth.currentUser;
    return user != null;
  }

  /// Get stored wallet address
  static Future<String?> getWalletAddress() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_walletAddressKey);
  }

  /// Get stored user ID
  static Future<String?> getUserId() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_userIdKey);
  }

  /// Sign in with Google
  static Future<Map<String, dynamic>?> signInWithGoogle() async {
    try {
      // Trigger Google Sign In flow
      final GoogleSignInAccount? googleUser = await _googleSignIn.signIn();
      if (googleUser == null) {
        // User canceled the sign-in
        return null;
      }

      // Obtain auth details
      final GoogleSignInAuthentication googleAuth = await googleUser.authentication;

      // Create Firebase credential
      final credential = GoogleAuthProvider.credential(
        accessToken: googleAuth.accessToken,
        idToken: googleAuth.idToken,
      );

      // Sign in to Firebase
      final UserCredential userCredential = await _auth.signInWithCredential(credential);
      final User? user = userCredential.user;

      if (user == null) {
        throw Exception('Failed to get user from Firebase');
      }

      // Generate deterministic wallet address from Firebase UID
      final walletAddress = _generateWalletAddress(user.uid);

      // Store credentials
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_walletAddressKey, walletAddress);

      return {
        'walletAddress': walletAddress,
        'name': user.displayName ?? 'Sprout Trainer',
        'email': user.email ?? '',
        'photoUrl': user.photoURL,
        'socialProvider': 'google',
        'socialProviderId': user.uid,
        'isNewUser': userCredential.additionalUserInfo?.isNewUser ?? false,
      };
    } catch (e) {
      print('Error signing in with Google: $e');
      return null;
    }
  }

  /// Sign in with Apple
  static Future<Map<String, dynamic>?> signInWithApple() async {
    try {
      // Check if Apple Sign In is available (iOS 13+, macOS 10.15+)
      if (!kIsWeb && !Platform.isIOS && !Platform.isMacOS) {
        throw UnsupportedError('Apple Sign In is only supported on iOS and macOS');
      }

      // Request Apple ID credential
      final appleCredential = await SignInWithApple.getAppleIDCredential(
        scopes: [
          AppleIDAuthorizationScopes.email,
          AppleIDAuthorizationScopes.fullName,
        ],
      );

      // Create OAuth provider
      final oAuthProvider = OAuthProvider('apple.com');
      final credential = oAuthProvider.credential(
        idToken: appleCredential.identityToken,
        accessToken: appleCredential.authorizationCode,
      );

      // Sign in to Firebase
      final UserCredential userCredential = await _auth.signInWithCredential(credential);
      final User? user = userCredential.user;

      if (user == null) {
        throw Exception('Failed to get user from Firebase');
      }

      // Generate deterministic wallet address from Firebase UID
      final walletAddress = _generateWalletAddress(user.uid);

      // Get name from Apple credential (only provided on first sign in)
      String? displayName = user.displayName;
      if (displayName == null && appleCredential.givenName != null) {
        displayName = '${appleCredential.givenName} ${appleCredential.familyName ?? ''}'.trim();
        // Update Firebase profile with name
        await user.updateDisplayName(displayName);
      }

      // Store credentials
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_walletAddressKey, walletAddress);

      return {
        'walletAddress': walletAddress,
        'name': displayName ?? 'Sprout Trainer',
        'email': user.email ?? appleCredential.email ?? '',
        'photoUrl': user.photoURL,
        'socialProvider': 'apple',
        'socialProviderId': user.uid,
        'isNewUser': userCredential.additionalUserInfo?.isNewUser ?? false,
      };
    } catch (e) {
      print('Error signing in with Apple: $e');
      return null;
    }
  }

  /// Store backend user ID after registration
  static Future<void> setUserId(String userId) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_userIdKey, userId);
  }

  /// Sign out
  static Future<void> signOut() async {
    await _auth.signOut();
    await _googleSignIn.signOut();

    // Clear local storage
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_walletAddressKey);
    await prefs.remove(_userIdKey);
  }

  /// Get Firebase ID token for backend authentication
  static Future<String?> getIdToken() async {
    final user = _auth.currentUser;
    if (user == null) return null;
    return await user.getIdToken();
  }

  /// Listen to auth state changes
  static Stream<User?> authStateChanges() {
    return _auth.authStateChanges();
  }

  /// Get user data for display
  static Future<Map<String, dynamic>?> getUserData() async {
    final user = _auth.currentUser;
    if (user == null) return null;

    final prefs = await SharedPreferences.getInstance();
    final walletAddress = prefs.getString(_walletAddressKey);
    final userId = prefs.getString(_userIdKey);

    if (walletAddress == null) return null;

    // Determine social provider
    String? socialProvider;
    for (final info in user.providerData) {
      if (info.providerId == 'google.com') {
        socialProvider = 'google';
        break;
      } else if (info.providerId == 'apple.com') {
        socialProvider = 'apple';
        break;
      }
    }

    return {
      'walletAddress': walletAddress,
      'name': user.displayName ?? 'Sprout Trainer',
      'email': user.email ?? '',
      'photoUrl': user.photoURL,
      'socialProvider': socialProvider ?? 'unknown',
      'socialProviderId': user.uid,
      'userId': userId,
    };
  }

  /// Generate deterministic Aptos wallet address from Firebase UID
  /// In production, this would integrate with Aptos Keyless Accounts
  /// For now, generates a consistent address for each Firebase UID
  static String _generateWalletAddress(String firebaseUid) {
    // Generate deterministic wallet address from Firebase UID
    // This ensures the same Firebase user always gets the same wallet address
    final bytes = utf8.encode('aptos:$firebaseUid');
    final digest = sha256.convert(bytes);

    // Aptos addresses are 32 bytes (64 hex chars) prefixed with 0x
    // Take first 64 chars of hash
    return '0x${digest.toString().substring(0, 64)}';
  }

  /// Verify that the wallet address matches the current Firebase UID
  static bool verifyWalletAddress(String walletAddress, String firebaseUid) {
    return walletAddress == _generateWalletAddress(firebaseUid);
  }

  /// Re-authenticate user (required for sensitive operations)
  static Future<bool> reauthenticate() async {
    try {
      final user = _auth.currentUser;
      if (user == null) return false;

      // Determine which provider to use for reauthentication
      final providerData = user.providerData;

      for (final info in providerData) {
        if (info.providerId == 'google.com') {
          final result = await signInWithGoogle();
          return result != null;
        } else if (info.providerId == 'apple.com') {
          final result = await signInWithApple();
          return result != null;
        }
      }

      return false;
    } catch (e) {
      print('Error reauthenticating: $e');
      return false;
    }
  }

  /// Delete user account (requires reauthentication first)
  static Future<void> deleteAccount() async {
    final user = _auth.currentUser;
    if (user == null) {
      throw Exception('No user signed in');
    }

    // Delete Firebase account
    await user.delete();

    // Clear local storage
    await signOut();
  }

  /// Link additional sign-in providers to existing account
  static Future<bool> linkGoogleAccount() async {
    try {
      final user = _auth.currentUser;
      if (user == null) return false;

      final GoogleSignInAccount? googleUser = await _googleSignIn.signIn();
      if (googleUser == null) return false;

      final GoogleSignInAuthentication googleAuth = await googleUser.authentication;
      final credential = GoogleAuthProvider.credential(
        accessToken: googleAuth.accessToken,
        idToken: googleAuth.idToken,
      );

      await user.linkWithCredential(credential);
      return true;
    } catch (e) {
      print('Error linking Google account: $e');
      return false;
    }
  }

  /// Get provider display name
  static String getProviderDisplayName(String provider) {
    switch (provider.toLowerCase()) {
      case 'google':
      case 'google.com':
        return 'Google';
      case 'apple':
      case 'apple.com':
        return 'Apple';
      default:
        return provider;
    }
  }

  /// Check if Apple Sign In is available on current platform
  static bool isAppleSignInAvailable() {
    if (kIsWeb) return false;
    return Platform.isIOS || Platform.isMacOS;
  }
}
