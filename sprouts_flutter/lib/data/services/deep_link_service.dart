import 'dart:async';
import 'dart:convert';
import 'package:uni_links/uni_links.dart';
import 'package:flutter/services.dart';
import 'petra_encryption_service.dart';

/// Service for handling deep links from wallet apps
class DeepLinkService {
  static StreamSubscription? _linkSubscription;
  static Function(Uri)? _onLinkReceived;

  /// Initialize deep link listener
  static Future<void> initialize({required Function(Uri) onLinkReceived}) async {
    _onLinkReceived = onLinkReceived;

    // Handle initial link if app was opened from a deep link
    try {
      final initialLink = await getInitialUri();
      if (initialLink != null) {
        _onLinkReceived?.call(initialLink);
      }
    } on PlatformException {
      // Handle exception
    }

    // Listen for deep links while app is running
    _linkSubscription = uriLinkStream.listen(
      (Uri? uri) {
        if (uri != null) {
          _onLinkReceived?.call(uri);
        }
      },
      onError: (err) {
        print('Deep link error: $err');
      },
    );
  }

  /// Dispose the listener
  static void dispose() {
    _linkSubscription?.cancel();
    _linkSubscription = null;
    _onLinkReceived = null;
  }

  /// Parse wallet callback URI
  static Map<String, dynamic>? parseWalletCallback(Uri uri) {
    // Expected format: sprouts://wallet-callback?address=0x...&signature=...
    if (uri.scheme != 'sprouts') return null;

    if (uri.host == 'wallet-callback' || uri.path == '/wallet-callback') {
      final address = uri.queryParameters['address'];
      final signature = uri.queryParameters['signature'];
      final publicKey = uri.queryParameters['publicKey'];
      final walletName = uri.queryParameters['wallet'];

      if (address != null) {
        return {
          'address': address,
          'signature': signature,
          'publicKey': publicKey,
          'walletName': walletName,
        };
      }
    }

    return null;
  }

  /// Parse Petra wallet official encrypted callback
  /// Format: sprouts://petra-callback?data=<base64EncryptedResponse>
  static Future<Map<String, dynamic>?> parsePetraCallback(Uri uri) async {
    if (uri.scheme != 'sprouts') return null;

    // Check for petra-callback host
    if (uri.host == 'petra-callback' || uri.path == '/petra-callback') {
      final encryptedData = uri.queryParameters['data'];

      if (encryptedData != null) {
        try {
          // Decode from base64
          final decodedBytes = base64Decode(encryptedData);
          final jsonString = utf8.decode(decodedBytes);
          final responseData = jsonDecode(jsonString) as Map<String, dynamic>;

          print('📦 Received Petra response: ${responseData.keys}');

          // Check if this is the initial connection response
          // Petra returns petraPublicEncryptedKey for encryption
          final petraPublicKey = responseData['petraPublicEncryptedKey'] as String? ??
                                 responseData['publicKey'] as String?;

          if (petraPublicKey != null) {
            print('🔐 Computing shared secret with Petra public key...');

            // Compute shared secret for future encrypted communication
            await PetraEncryptionService.computeSharedSecret(petraPublicKey);
          }

          // Extract wallet address if present
          final address = responseData['address'] as String?;
          if (address != null) {
            return {
              'address': address,
              'publicKey': responseData['publicKey'], // User's account public key
              'petraPublicKey': petraPublicKey, // Petra's encryption key
              'walletName': 'Petra',
            };
          }

          // Handle encrypted response after shared secret is established
          if (responseData.containsKey('encryptedData')) {
            final encrypted = responseData['encryptedData'] as String;
            final decrypted = await PetraEncryptionService.decryptData(encrypted);

            return {
              'address': decrypted['address'],
              'walletName': 'Petra',
              ...decrypted,
            };
          }

          return responseData;
        } catch (e) {
          print('❌ Error parsing Petra callback: $e');
          return null;
        }
      }
    }

    return null;
  }

  /// Parse Petra wallet connect response (fallback for simple format)
  /// Petra uses format: sprouts://connect?address=0x...&publicKey=...
  static Map<String, dynamic>? parsePetraConnect(Uri uri) {
    if (uri.scheme != 'sprouts') return null;

    // Check for both /connect and /wallet-callback paths
    if (uri.host == 'connect' || uri.path == '/connect' ||
        uri.host == 'wallet-callback' || uri.path == '/wallet-callback') {
      final address = uri.queryParameters['address'] ??
                     uri.queryParameters['account'];
      final publicKey = uri.queryParameters['publicKey'] ??
                       uri.queryParameters['public_key'];

      if (address != null) {
        return {
          'address': address,
          'publicKey': publicKey,
          'walletName': 'Petra',
        };
      }
    }

    return null;
  }
}
