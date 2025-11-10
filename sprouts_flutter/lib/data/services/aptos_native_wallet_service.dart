import 'dart:convert';
import 'dart:io';
import 'package:url_launcher/url_launcher.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'petra_encryption_service.dart';

/// Service for connecting to native Aptos wallets (Petra, Pontem, Martian, Nightly)
class AptosNativeWalletService {
  static const String _connectedWalletKey = 'native_wallet_type';
  static const String _walletAddressKey = 'native_wallet_address';
  static const String _connectionTimeKey = 'native_wallet_connection_time';

  /// Available native Aptos wallets
  static const List<Map<String, String>> availableWallets = [
    {
      'id': 'petra',
      'name': 'Petra Wallet',
      'description': 'Most popular Aptos wallet',
      'deepLink': 'petra://api/v1',
      'installUrl': 'https://petra.app',
    },
    {
      'id': 'pontem',
      'name': 'Pontem Wallet',
      'description': 'Full-featured Aptos wallet',
      'deepLink': 'pontem://',
      'installUrl': 'https://pontem.network',
    },
    {
      'id': 'martian',
      'name': 'Martian Wallet',
      'description': 'Multi-chain wallet with Aptos',
      'deepLink': 'martian://',
      'installUrl': 'https://martianwallet.xyz',
    },
    {
      'id': 'nightly',
      'name': 'Nightly Wallet',
      'description': 'Cross-chain DeFi wallet',
      'deepLink': 'nightly://',
      'installUrl': 'https://nightly.app',
    },
  ];

  /// Check if a specific wallet is installed
  static Future<bool> isWalletInstalled(String walletId) async {
    final wallet = availableWallets.firstWhere(
      (w) => w['id'] == walletId,
      orElse: () => {},
    );

    if (wallet.isEmpty) return false;

    final deepLink = wallet['deepLink']!;
    final uri = Uri.parse(deepLink);

    // Check if the deep link can be launched
    try {
      return await canLaunchUrl(uri);
    } catch (e) {
      return false;
    }
  }

  /// Get list of installed wallets
  static Future<List<Map<String, String>>> getInstalledWallets() async {
    final installed = <Map<String, String>>[];

    for (final wallet in availableWallets) {
      final isInstalled = await isWalletInstalled(wallet['id']!);
      if (isInstalled) {
        installed.add(wallet);
      }
    }

    return installed;
  }

  /// Connect to a specific wallet using official Petra protocol
  /// Returns the wallet address if successful, null otherwise
  static Future<String?> connectWallet(String walletId) async {
    final wallet = availableWallets.firstWhere(
      (w) => w['id'] == walletId,
      orElse: () => {},
    );

    if (wallet.isEmpty) {
      throw Exception('Wallet not found: $walletId');
    }

    // Check if wallet is installed
    final isInstalled = await isWalletInstalled(walletId);
    if (!isInstalled) {
      throw Exception('Wallet not installed: ${wallet['name']}');
    }

    try {
      // For Petra, use official deep link protocol
      if (walletId == 'petra') {
        return await _connectPetraWallet(wallet);
      }

      // For other wallets, use simple deep link format
      final appScheme = 'sprouts://';
      final callbackUrl = Uri.encodeComponent('${appScheme}wallet-callback');
      final deepLink = '${wallet['deepLink']}connect?callback=$callbackUrl';
      final uri = Uri.parse(deepLink);

      // Launch wallet app
      final launched = await launchUrl(
        uri,
        mode: LaunchMode.externalApplication,
      );

      if (!launched) {
        throw Exception('Failed to launch ${wallet['name']}');
      }

      return null;
    } catch (e) {
      print('Error connecting to wallet: $e');
      throw Exception('Failed to connect to ${wallet['name']}: $e');
    }
  }

  /// Connect to Petra wallet using official protocol
  /// https://petra.app/docs/mobile-deeplinks
  static Future<String?> _connectPetraWallet(Map<String, String> wallet) async {
    // Step 1: Generate encryption keys
    final keyPair = await PetraEncryptionService.generateKeyPair();
    final publicKey = keyPair['publicKey']!;

    // Step 2: Prepare connection data
    final connectionData = {
      'appInfo': {
        'domain': 'sprouts.app', // Your app domain
        'name': 'Sprouts AR',
      },
      'redirectLink': 'sprouts://petra-callback',
      'dappEncryptionPublicKey': publicKey,
    };

    // Step 3: Encode data as base64
    final jsonString = jsonEncode(connectionData);
    final base64Data = base64Encode(utf8.encode(jsonString));

    // Step 4: Build Petra deep link
    // Format: petra://api/v1/connect?data=<base64EncodedJSON>
    final deepLink = '${wallet['deepLink']}/connect?data=$base64Data';
    final uri = Uri.parse(deepLink);

    print('🔗 Launching Petra with deep link');
    print('📱 Redirect URL: sprouts://petra-callback');

    // Step 5: Launch Petra wallet
    final launched = await launchUrl(
      uri,
      mode: LaunchMode.externalApplication,
    );

    if (!launched) {
      throw Exception('Failed to launch Petra');
    }

    // Petra will return via deep link: sprouts://petra-callback?data=<encryptedResponse>
    // The response will contain the wallet's public key for encryption
    // The wallet_selection_screen will handle the callback
    return null;
  }

  /// Sign a message with the connected wallet
  /// Returns signature if successful
  static Future<String?> signMessage(String message) async {
    final prefs = await SharedPreferences.getInstance();
    final walletType = prefs.getString(_connectedWalletKey);
    final walletAddress = prefs.getString(_walletAddressKey);

    if (walletType == null || walletAddress == null) {
      throw Exception('No wallet connected');
    }

    final wallet = availableWallets.firstWhere(
      (w) => w['id'] == walletType,
      orElse: () => {},
    );

    if (wallet.isEmpty) {
      throw Exception('Wallet not found: $walletType');
    }

    try {
      // Build deep link to request signature
      final appScheme = Platform.isIOS ? 'sprouts://' : 'sprouts://';
      final callbackUrl = Uri.encodeComponent('${appScheme}sign-callback');
      final encodedMessage = Uri.encodeComponent(message);
      final deepLink = '${wallet['deepLink']}sign?message=$encodedMessage&callback=$callbackUrl';
      final uri = Uri.parse(deepLink);

      // Launch wallet app
      final launched = await launchUrl(
        uri,
        mode: LaunchMode.externalApplication,
      );

      if (!launched) {
        throw Exception('Failed to launch ${wallet['name']}');
      }

      // TODO: Wait for callback with signature
      return null;
    } catch (e) {
      print('Error signing message: $e');
      throw Exception('Failed to sign message: $e');
    }
  }

  /// Save connected wallet info
  static Future<void> saveWalletConnection({
    required String walletType,
    required String walletAddress,
  }) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_connectedWalletKey, walletType);
    await prefs.setString(_walletAddressKey, walletAddress);
    await prefs.setString(_connectionTimeKey, DateTime.now().toIso8601String());
  }

  /// Check if user has connected a native wallet
  static Future<bool> isConnected() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_walletAddressKey) != null;
  }

  /// Get connected wallet info
  static Future<Map<String, String>?> getConnectedWallet() async {
    final prefs = await SharedPreferences.getInstance();
    final walletType = prefs.getString(_connectedWalletKey);
    final walletAddress = prefs.getString(_walletAddressKey);
    final connectionTime = prefs.getString(_connectionTimeKey);

    if (walletType == null || walletAddress == null) {
      return null;
    }

    final wallet = availableWallets.firstWhere(
      (w) => w['id'] == walletType,
      orElse: () => {},
    );

    return {
      'walletType': walletType,
      'walletName': wallet['name'] ?? walletType,
      'walletAddress': walletAddress,
      'connectionTime': connectionTime ?? '',
    };
  }

  /// Disconnect wallet
  static Future<void> disconnect() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_connectedWalletKey);
    await prefs.remove(_walletAddressKey);
    await prefs.remove(_connectionTimeKey);
  }

  /// Open wallet installation page
  static Future<void> installWallet(String walletId) async {
    final wallet = availableWallets.firstWhere(
      (w) => w['id'] == walletId,
      orElse: () => {},
    );

    if (wallet.isEmpty) {
      throw Exception('Wallet not found: $walletId');
    }

    final installUrl = wallet['installUrl']!;
    final uri = Uri.parse(installUrl);

    final launched = await launchUrl(
      uri,
      mode: LaunchMode.externalApplication,
    );

    if (!launched) {
      throw Exception('Failed to open installation page');
    }
  }

  /// Verify wallet address format
  static bool isValidAddress(String address) {
    // Aptos addresses start with 0x and are 66 characters long (with 0x prefix)
    // Also accept 64 characters without prefix
    if (address.startsWith('0x')) {
      final regex = RegExp(r'^0x[a-fA-F0-9]{64}$');
      return regex.hasMatch(address);
    } else {
      final regex = RegExp(r'^[a-fA-F0-9]{64}$');
      return regex.hasMatch(address);
    }
  }
}
