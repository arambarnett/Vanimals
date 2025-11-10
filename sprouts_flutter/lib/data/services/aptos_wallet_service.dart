import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:crypto/crypto.dart';

/// Aptos wallet service for social login and wallet management
/// Replaces Privy authentication with Aptos Keyless accounts
class AptosWalletService {
  static const String _walletAddressKey = 'aptos_wallet_address';
  static const String _socialProviderKey = 'social_provider';
  static const String _socialProviderIdKey = 'social_provider_id';
  static const String _userNameKey = 'user_name';
  static const String _userEmailKey = 'user_email';
  static const String _userIdKey = 'user_id';

  /// Check if user has connected wallet
  static Future<bool> isConnected() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_walletAddressKey) != null;
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

  /// Get stored user data
  static Future<Map<String, dynamic>?> getUserData() async {
    final prefs = await SharedPreferences.getInstance();
    final walletAddress = prefs.getString(_walletAddressKey);
    final name = prefs.getString(_userNameKey);
    final email = prefs.getString(_userEmailKey);
    final provider = prefs.getString(_socialProviderKey);
    final userId = prefs.getString(_userIdKey);

    if (walletAddress == null) return null;

    return {
      'walletAddress': walletAddress,
      'name': name,
      'email': email,
      'socialProvider': provider,
      'userId': userId,
    };
  }

  /// Connect wallet with social login
  /// In production, this would integrate with Aptos Keyless SDK
  /// For now, simulates wallet creation
  static Future<bool> connectWithSocial({
    required String provider, // 'google', 'apple', 'facebook'
    required String providerId,
    required String name,
    String? email,
  }) async {
    try {
      // Generate deterministic wallet address from social ID
      // In production, Aptos Keyless would handle this
      final walletAddress = _generateWalletAddress(provider, providerId);

      // Store wallet data
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_walletAddressKey, walletAddress);
      await prefs.setString(_socialProviderKey, provider);
      await prefs.setString(_socialProviderIdKey, providerId);
      await prefs.setString(_userNameKey, name);
      if (email != null) {
        await prefs.setString(_userEmailKey, email);
      }

      return true;
    } catch (e) {
      print('Error connecting wallet: $e');
      return false;
    }
  }

  /// Store user ID after backend registration
  static Future<void> setUserId(String userId) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_userIdKey, userId);
  }

  /// Sign a message with wallet
  /// In production, this would use Aptos Keyless signing
  static Future<String?> signMessage(String message) async {
    try {
      final walletAddress = await getWalletAddress();
      if (walletAddress == null) return null;

      // Simulate signature
      // In production, use Aptos SDK for signing
      final messageBytes = utf8.encode(message + walletAddress);
      final digest = sha256.convert(messageBytes);
      return '0x${digest.toString()}';
    } catch (e) {
      print('Error signing message: $e');
      return null;
    }
  }

  /// Disconnect wallet
  static Future<void> disconnect() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_walletAddressKey);
    await prefs.remove(_socialProviderKey);
    await prefs.remove(_socialProviderIdKey);
    await prefs.remove(_userNameKey);
    await prefs.remove(_userEmailKey);
    await prefs.remove(_userIdKey);
  }

  /// Generate wallet address from social credentials
  /// In production, Aptos Keyless generates this
  static String _generateWalletAddress(String provider, String providerId) {
    final combined = '$provider:$providerId';
    final bytes = utf8.encode(combined);
    final digest = sha256.convert(bytes);
    return '0x${digest.toString().substring(0, 64)}';
  }

  /// Get display name for social provider
  static String getProviderDisplayName(String provider) {
    switch (provider.toLowerCase()) {
      case 'google':
        return 'Google';
      case 'apple':
        return 'Apple';
      case 'facebook':
        return 'Facebook';
      default:
        return provider;
    }
  }
}
