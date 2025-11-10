import 'dart:typed_data';
import 'package:web3auth_flutter/web3auth_flutter.dart';
import 'package:web3auth_flutter/enums.dart';
import 'package:web3auth_flutter/input.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:aptos/aptos.dart';
import 'package:hex/hex.dart';

/// Production Web3Auth service for seamless social login
/// Creates real Aptos wallets without users managing keys
class Web3AuthService {
  static Web3AuthFlutter? _web3auth;
  static const String _walletAddressKey = 'aptos_wallet_address';
  static const String _userIdKey = 'user_id';
  static const String _providerKey = 'auth_provider';

  /// Initialize Web3Auth
  static Future<void> initialize() async {
    if (_web3auth != null) return;

    try {
      await Web3AuthFlutter.init(
        Web3AuthOptions(
          clientId: 'BEaa21r0UJhuBoPxrSPZzkjLDzRqTUnonijx2cS3hXCX0cSdXBs8E46tTyi3pda2cEqrCJ8TOGksjBEbn0SI6dI',
          network: Network.sapphire_devnet,
          redirectUrl: Uri.parse('com.sprouts.app://auth'),
        ),
      );

      _web3auth = Web3AuthFlutter();

      print('✅ Web3Auth initialized successfully');
    } catch (e) {
      print('❌ Error initializing Web3Auth: $e');
      rethrow;
    }
  }

  /// Sign in with Google
  static Future<Map<String, dynamic>?> signInWithGoogle() async {
    await initialize();

    try {
      print('🔐 Signing in with Google...');

      await Web3AuthFlutter.login(
        LoginParams(
          loginProvider: Provider.google,
        ),
      );

      // Get private key
      final privateKey = await Web3AuthFlutter.getPrivKey();
      if (privateKey.isEmpty) {
        throw Exception('No private key returned');
      }

      // Derive Aptos account
      final aptosAccount = _createAptosAccount(privateKey);
      final walletAddress = aptosAccount.address;

      print('✅ Wallet created: $walletAddress');

      // Store locally
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_walletAddressKey, walletAddress);
      await prefs.setString(_providerKey, 'google');

      // Get user info
      final userInfo = await Web3AuthFlutter.getUserInfo();

      // IMPORTANT: Use verifierId as the stable socialProviderId
      // This ensures the same Google account always gets the same user record
      final socialProviderId = userInfo.verifierId ?? userInfo.email ?? walletAddress;

      print('✅ User info - verifierId: ${userInfo.verifierId}, email: ${userInfo.email}');

      return {
        'walletAddress': walletAddress,
        'socialProvider': 'google',
        'socialProviderId': socialProviderId, // Stable ID from Google
        'name': userInfo.name ?? 'Sprout Trainer',
        'email': userInfo.email ?? '',
      };
    } catch (e) {
      print('❌ Error signing in with Google: $e');
      return null;
    }
  }

  /// Sign in with Apple
  static Future<Map<String, dynamic>?> signInWithApple() async {
    await initialize();

    try {
      print('🔐 Signing in with Apple...');

      await Web3AuthFlutter.login(
        LoginParams(
          loginProvider: Provider.apple,
        ),
      );

      // Get private key
      final privateKey = await Web3AuthFlutter.getPrivKey();
      if (privateKey.isEmpty) {
        throw Exception('No private key returned');
      }

      // Derive Aptos account
      final aptosAccount = _createAptosAccount(privateKey);
      final walletAddress = aptosAccount.address;

      print('✅ Wallet created: $walletAddress');

      // Store locally
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_walletAddressKey, walletAddress);
      await prefs.setString(_providerKey, 'apple');

      // Get user info
      final userInfo = await Web3AuthFlutter.getUserInfo();

      // IMPORTANT: Use verifierId as the stable socialProviderId
      // This ensures the same Apple account always gets the same user record
      final socialProviderId = userInfo.verifierId ?? userInfo.email ?? walletAddress;

      print('✅ User info - verifierId: ${userInfo.verifierId}, email: ${userInfo.email}');

      return {
        'walletAddress': walletAddress,
        'socialProvider': 'apple',
        'socialProviderId': socialProviderId, // Stable ID from Apple
        'name': userInfo.name ?? 'Sprout Trainer',
        'email': userInfo.email ?? '',
      };
    } catch (e) {
      print('❌ Error signing in with Apple: $e');
      return null;
    }
  }

  /// Create Aptos account from Web3Auth private key
  static AptosAccount _createAptosAccount(String privateKeyHex) {
    // Remove 0x prefix if present
    final cleanKey = privateKeyHex.startsWith('0x')
        ? privateKeyHex.substring(2)
        : privateKeyHex;

    // Convert hex string to Uint8List and create Aptos account
    final privateKeyBytes = Uint8List.fromList(HEX.decode(cleanKey));
    return AptosAccount(privateKeyBytes);
  }

  /// Check if user is signed in
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

  /// Get auth provider
  static Future<String?> getProvider() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_providerKey);
  }

  /// Sign out
  static Future<void> signOut() async {
    try {
      if (_web3auth != null) {
        await Web3AuthFlutter.logout();
      }

      // Clear local storage
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove(_walletAddressKey);
      await prefs.remove(_userIdKey);
      await prefs.remove(_providerKey);

      print('✅ Signed out successfully');
    } catch (e) {
      print('❌ Error signing out: $e');
    }
  }

  /// Check if Apple Sign In is available (iOS/macOS only)
  static bool isAppleSignInAvailable() {
    // Apple Sign In works on iOS and macOS
    // Web3Auth handles platform check internally
    return true; // Let Web3Auth handle availability
  }
}
