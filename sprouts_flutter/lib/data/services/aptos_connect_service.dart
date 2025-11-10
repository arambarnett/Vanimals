import 'package:aptos_connect/aptos_connect.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:io' show Platform;
import 'package:flutter/foundation.dart' show kIsWeb;

/// Production Aptos Connect service with Keyless accounts
/// Provides real self-custodial wallets via social login
class AptosConnectService {
  static AptosConnectClient? _client;
  static const String _walletAddressKey = 'aptos_wallet_address';
  static const String _userIdKey = 'user_id';
  static const String _providerKey = 'auth_provider';

  /// Initialize Aptos Connect client
  static Future<void> initialize() async {
    if (_client != null) return;

    try {
      final storage = _SecureStorageAdapter();

      if (kIsWeb) {
        // Web configuration
        final factory = AptosConnectClientFactory.web(
          dAppName: 'Sprouts',
          dAppImageUrl: 'https://sprouts.app/icon.png',
          storage: storage,
        );
        _client = factory.make();
      } else {
        // Mobile configuration (iOS/Android)
        final factory = AptosConnectClientFactory.io(
          dAppName: 'Sprouts',
          dAppImageUrl: 'https://sprouts.app/icon.png',
          storage: storage,
        );
        _client = factory.make();
      }

      print('✅ Aptos Connect initialized');
    } catch (e) {
      print('❌ Error initializing Aptos Connect: $e');
      rethrow;
    }
  }

  /// Connect wallet with Google Sign In
  static Future<Map<String, dynamic>?> connectWithGoogle() async {
    await initialize();

    try {
      print('🔐 Connecting with Google via Aptos Connect...');

      // Connect with Google provider
      final accountInfo = await _client!.connect(AptosProvider.google);

      if (accountInfo == null) {
        print('❌ No account info returned');
        return null;
      }

      final address = accountInfo.address.toString();
      print('✅ Wallet connected: $address');

      // Store locally
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_walletAddressKey, address);
      await prefs.setString(_providerKey, 'google');

      return {
        'walletAddress': address,
        'socialProvider': 'google',
        'socialProviderId': address, // Use wallet address as identifier
        'name': accountInfo.name ?? 'Sprout Trainer',
      };
    } catch (e) {
      print('❌ Error connecting with Google: $e');
      return null;
    }
  }

  /// Connect wallet with Apple Sign In
  static Future<Map<String, dynamic>?> connectWithApple() async {
    // Check platform support
    if (!kIsWeb && !Platform.isIOS && !Platform.isMacOS) {
      throw UnsupportedError('Apple Sign In is only supported on iOS and macOS');
    }

    await initialize();

    try {
      print('🔐 Connecting with Apple via Aptos Connect...');

      // Connect with Apple provider
      final accountInfo = await _client!.connect(AptosProvider.apple);

      if (accountInfo == null) {
        print('❌ No account info returned');
        return null;
      }

      final address = accountInfo.address.toString();
      print('✅ Wallet connected: $address');

      // Store locally
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_walletAddressKey, address);
      await prefs.setString(_providerKey, 'apple');

      return {
        'walletAddress': address,
        'socialProvider': 'apple',
        'socialProviderId': address, // Use wallet address as identifier
        'name': accountInfo.name ?? 'Sprout Trainer',
      };
    } catch (e) {
      print('❌ Error connecting with Apple: $e');
      return null;
    }
  }

  /// Check if wallet is connected
  static Future<bool> isConnected() async {
    final prefs = await SharedPreferences.getInstance();
    final address = prefs.getString(_walletAddressKey);
    return address != null;
  }

  /// Get current wallet address
  static Future<String?> getWalletAddress() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_walletAddressKey);
  }

  /// Get stored user ID (from backend)
  static Future<String?> getUserId() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_userIdKey);
  }

  /// Store backend user ID after registration
  static Future<void> setUserId(String userId) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_userIdKey, userId);
  }

  /// Sign a message (for authentication/verification)
  static Future<String?> signMessage(String message) async {
    await initialize();

    try {
      final request = SigningMessageRequest.fromStringAndNowNonce(message);
      final response = await _client!.signMessage(request);
      return response?.signature.toString();
    } catch (e) {
      print('❌ Error signing message: $e');
      return null;
    }
  }

  /// Disconnect wallet
  static Future<void> disconnect() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_walletAddressKey);
    await prefs.remove(_userIdKey);
    await prefs.remove(_providerKey);

    if (_client != null) {
      await _client!.disconnectAll();
    }

    _client = null;
    print('✅ Wallet disconnected');
  }

  /// Get auth provider name
  static Future<String?> getProvider() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_providerKey);
  }

  /// Check if Apple Sign In is available
  static bool isAppleSignInAvailable() {
    if (kIsWeb) return false;
    return Platform.isIOS || Platform.isMacOS;
  }
}

/// Adapter for Aptos Connect storage using SharedPreferences
class _SecureStorageAdapter implements KVStorage {
  @override
  Future<void> removeValue(String key) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('aptos_$key');
  }

  @override
  Future<String?> getValue(String key) async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('aptos_$key');
  }

  @override
  Future<void> setValue(String key, String value) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('aptos_$key', value);
  }
}
