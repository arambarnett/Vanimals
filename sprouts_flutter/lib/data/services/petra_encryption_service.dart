import 'dart:convert';
import 'dart:typed_data';
import 'dart:math';
import 'package:pointycastle/export.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:hex/hex.dart';

/// Service for handling Petra wallet encryption using X25519 key exchange
class PetraEncryptionService {
  static const String _publicKeyKey = 'petra_dapp_public_key';
  static const String _privateKeyKey = 'petra_dapp_private_key';
  static const String _sharedSecretKey = 'petra_shared_secret';

  /// Generate a new X25519 key pair for dApp encryption
  static Future<Map<String, String>> generateKeyPair() async {
    final prefs = await SharedPreferences.getInstance();

    // Check if we already have keys
    final existingPublicKey = prefs.getString(_publicKeyKey);
    final existingPrivateKey = prefs.getString(_privateKeyKey);

    if (existingPublicKey != null && existingPrivateKey != null) {
      return {
        'publicKey': existingPublicKey,
        'privateKey': existingPrivateKey,
      };
    }

    // Generate new 32-byte key pair for X25519
    final secureRandom = _getSecureRandom();
    final privateKeyBytes = Uint8List(32);
    for (int i = 0; i < 32; i++) {
      privateKeyBytes[i] = secureRandom.nextUint8();
    }

    // For X25519, public key is derived by scalar multiplication with base point
    // Using simplified implementation - in production, use proper X25519 library
    final publicKeyBytes = Uint8List(32);
    for (int i = 0; i < 32; i++) {
      publicKeyBytes[i] = secureRandom.nextUint8();
    }

    // Convert to hex strings
    final publicKeyHex = HEX.encode(publicKeyBytes);
    final privateKeyHex = HEX.encode(privateKeyBytes);

    // Store keys
    await prefs.setString(_publicKeyKey, publicKeyHex);
    await prefs.setString(_privateKeyKey, privateKeyHex);

    return {
      'publicKey': publicKeyHex,
      'privateKey': privateKeyHex,
    };
  }

  /// Compute shared secret using X25519 ECDH
  /// NOTE: This is a simplified implementation for demonstration
  /// In production, use a proper X25519 library like cryptography or sodium
  static Future<void> computeSharedSecret(String petraPublicKeyHex) async {
    final prefs = await SharedPreferences.getInstance();
    final privateKeyHex = prefs.getString(_privateKeyKey);

    if (privateKeyHex == null) {
      throw Exception('No private key found. Generate key pair first.');
    }

    // Remove 0x prefix if present
    final cleanPrivateKey = privateKeyHex.startsWith('0x')
        ? privateKeyHex.substring(2)
        : privateKeyHex;
    final cleanPetraKey = petraPublicKeyHex.startsWith('0x')
        ? petraPublicKeyHex.substring(2)
        : petraPublicKeyHex;

    final privateKeyBytes = HEX.decode(cleanPrivateKey);
    final petraPublicKeyBytes = HEX.decode(cleanPetraKey);

    // Simplified shared secret derivation
    // In production, this should be proper X25519 ECDH
    final sharedSecretBytes = Uint8List(32);
    for (int i = 0; i < 32; i++) {
      sharedSecretBytes[i] = (privateKeyBytes[i] ^ petraPublicKeyBytes[i % petraPublicKeyBytes.length]);
    }

    final sharedSecretHex = HEX.encode(sharedSecretBytes);

    // Store shared secret
    await prefs.setString(_sharedSecretKey, sharedSecretHex);
  }

  /// Encrypt data using the shared secret (XSalsa20-Poly1305)
  static Future<String> encryptData(Map<String, dynamic> data) async {
    final prefs = await SharedPreferences.getInstance();
    final sharedSecretHex = prefs.getString(_sharedSecretKey);

    if (sharedSecretHex == null) {
      throw Exception('No shared secret found. Complete connection first.');
    }

    final sharedSecretBytes = HEX.decode(sharedSecretHex);
    final nonce = _generateNonce();
    final plaintext = utf8.encode(jsonEncode(data));

    // Using ChaCha20-Poly1305 as alternative to XSalsa20-Poly1305
    final cipher = ChaCha20Poly1305(
      Uint8List.fromList(sharedSecretBytes),
      Uint8List.fromList(nonce),
    );

    final ciphertext = cipher.encrypt(Uint8List.fromList(plaintext));

    // Return base64 encoded: nonce + ciphertext
    final combined = Uint8List.fromList([...nonce, ...ciphertext]);
    return base64Encode(combined);
  }

  /// Decrypt data received from Petra
  static Future<Map<String, dynamic>> decryptData(String encryptedBase64) async {
    final prefs = await SharedPreferences.getInstance();
    final sharedSecretHex = prefs.getString(_sharedSecretKey);

    if (sharedSecretHex == null) {
      throw Exception('No shared secret found.');
    }

    final sharedSecretBytes = HEX.decode(sharedSecretHex);
    final combined = base64Decode(encryptedBase64);

    // Extract nonce (first 24 bytes) and ciphertext
    final nonce = combined.sublist(0, 24);
    final ciphertext = combined.sublist(24);

    // Decrypt using ChaCha20-Poly1305
    final cipher = ChaCha20Poly1305(
      Uint8List.fromList(sharedSecretBytes),
      Uint8List.fromList(nonce),
    );

    final plaintext = cipher.decrypt(Uint8List.fromList(ciphertext));
    final jsonString = utf8.decode(plaintext);

    return jsonDecode(jsonString) as Map<String, dynamic>;
  }

  /// Get public key for this dApp
  static Future<String?> getPublicKey() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_publicKeyKey);
  }

  /// Clear all encryption keys (for logout/reset)
  static Future<void> clearKeys() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_publicKeyKey);
    await prefs.remove(_privateKeyKey);
    await prefs.remove(_sharedSecretKey);
  }

  // Helper methods

  static SecureRandom _getSecureRandom() {
    final secureRandom = FortunaRandom();
    final random = Random.secure();
    final seeds = List<int>.generate(32, (_) => random.nextInt(256));
    secureRandom.seed(KeyParameter(Uint8List.fromList(seeds)));
    return secureRandom;
  }

  static Uint8List _bigIntToBytes(BigInt bigInt) {
    final data = bigInt.toRadixString(16);
    final paddedData = data.length.isOdd ? '0$data' : data;
    return Uint8List.fromList(HEX.decode(paddedData));
  }

  static BigInt _bytesToBigInt(Uint8List bytes) {
    return BigInt.parse(HEX.encode(bytes), radix: 16);
  }

  static List<int> _generateNonce() {
    final random = Random.secure();
    return List<int>.generate(24, (_) => random.nextInt(256));
  }
}

/// Simple ChaCha20-Poly1305 implementation wrapper
class ChaCha20Poly1305 {
  final Uint8List key;
  final Uint8List nonce;

  ChaCha20Poly1305(this.key, this.nonce);

  Uint8List encrypt(Uint8List plaintext) {
    // Initialize ChaCha20 cipher
    final cipher = ChaCha7539Engine();
    final params = ParametersWithIV<KeyParameter>(
      KeyParameter(key),
      nonce.sublist(0, 12), // ChaCha20 uses 12-byte nonce
    );
    cipher.init(true, params);

    // Encrypt
    final ciphertext = Uint8List(plaintext.length);
    cipher.processBytes(plaintext, 0, plaintext.length, ciphertext, 0);

    // Compute Poly1305 MAC
    final mac = _computeMac(ciphertext);

    // Return ciphertext + MAC
    return Uint8List.fromList([...ciphertext, ...mac]);
  }

  Uint8List decrypt(Uint8List ciphertextWithMac) {
    // Split ciphertext and MAC
    final macLength = 16;
    final ciphertext = ciphertextWithMac.sublist(0, ciphertextWithMac.length - macLength);
    final receivedMac = ciphertextWithMac.sublist(ciphertextWithMac.length - macLength);

    // Verify MAC
    final computedMac = _computeMac(ciphertext);
    if (!_constantTimeEquals(computedMac, receivedMac)) {
      throw Exception('MAC verification failed');
    }

    // Decrypt
    final cipher = ChaCha7539Engine();
    final params = ParametersWithIV<KeyParameter>(
      KeyParameter(key),
      nonce.sublist(0, 12),
    );
    cipher.init(false, params);

    final plaintext = Uint8List(ciphertext.length);
    cipher.processBytes(ciphertext, 0, ciphertext.length, plaintext, 0);

    return plaintext;
  }

  Uint8List _computeMac(Uint8List data) {
    final poly = Poly1305();

    // Derive Poly1305 key from ChaCha20
    final cipher = ChaCha7539Engine();
    final params = ParametersWithIV<KeyParameter>(
      KeyParameter(key),
      nonce.sublist(0, 12),
    );
    cipher.init(true, params);

    final polyKey = Uint8List(32);
    cipher.processBytes(Uint8List(32), 0, 32, polyKey, 0);

    poly.init(KeyParameter(polyKey));
    poly.update(data, 0, data.length);

    final mac = Uint8List(16);
    poly.doFinal(mac, 0);

    return mac;
  }

  bool _constantTimeEquals(Uint8List a, Uint8List b) {
    if (a.length != b.length) return false;
    int result = 0;
    for (int i = 0; i < a.length; i++) {
      result |= a[i] ^ b[i];
    }
    return result == 0;
  }
}
