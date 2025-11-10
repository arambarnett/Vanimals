# Aptos Wallet Integration Options for Flutter (2025)

## Research Summary

After extensive research, here are the available options for implementing Aptos wallet integration with social login in Flutter mobile apps.

---

## Option 1: Aptos Connect (Flutter Package) ❌ NOT WORKING

**Package:** `aptos_connect` v0.0.4
**Status:** Early development, incomplete API
**Last Updated:** March 2025

### What It Promises:
- Native Flutter package for Aptos Connect
- Google & Apple Sign In support
- Keyless account creation

### Issues Found:
- ❌ Incomplete API (factory methods don't exist)
- ❌ Transaction signing not implemented
- ❌ Poor documentation
- ❌ Version 0.0.4 suggests very early stage

### Verdict:
**NOT PRODUCTION READY** - Package exists but is too early stage for production use.

---

## Option 2: Web3Auth + Aptos ✅ RECOMMENDED

**Package:** `web3auth_flutter`
**Status:** Production-ready, actively maintained
**Aptos Support:** Yes (documented)

### How It Works:
1. User signs in with social provider (Google, Apple, Facebook, etc.)
2. Web3Auth returns private key
3. Derive Aptos account from private key
4. Use Aptos Dart SDK for transactions

### Pros:
- ✅ Production-ready and battle-tested
- ✅ Extensive social login support (10+ providers)
- ✅ Works with Aptos (documented integration)
- ✅ Flutter SDK available
- ✅ Non-custodial (user owns private key)
- ✅ Good documentation

### Cons:
- Requires deriving Aptos account manually
- Not native Aptos Keyless (uses traditional private keys)

### Implementation Steps:

#### 1. Install Packages
```yaml
dependencies:
  web3auth_flutter: ^latest
  aptos: ^latest  # Dart SDK for Aptos
```

#### 2. Initialize Web3Auth
```dart
await Web3AuthFlutter.init(
  network: Network.sapphire_mainnet,
  clientId: "YOUR_WEB3AUTH_CLIENT_ID",
);
```

#### 3. Social Login
```dart
final result = await Web3AuthFlutter.login(
  LoginParams(
    loginProvider: Provider.google,
  ),
);
```

#### 4. Derive Aptos Account
```dart
// Get private key from Web3Auth
final privateKey = await web3auth.getPrivKey();

// Convert to Uint8List
final privateKeyBytes = hexToUint8List(privateKey);

// Create Aptos account
final aptosAccount = AptosAccount.fromPrivateKey(privateKeyBytes);
final walletAddress = aptosAccount.address().hex();
```

#### 5. Sign Transactions
```dart
// Use aptosAccount to sign transactions
```

### Setup Requirements:
1. Create Web3Auth account: https://dashboard.web3auth.io/
2. Get Client ID
3. Configure OAuth providers (Google, Apple)
4. Add to Flutter app

### Resources:
- Web3Auth Flutter Docs: https://web3auth.io/docs/sdk/mobile/pnp/flutter/
- Aptos Integration: https://web3auth.io/docs/connect-blockchain/other/aptos
- Flutter Package: https://pub.dev/packages/web3auth_flutter

---

## Option 3: Build Custom Solution with Aptos TypeScript SDK

### Approach:
- Use Firebase/Supabase for social OAuth
- Call Aptos TypeScript SDK via REST API bridge
- Store wallet info in database

### Pros:
- Full control over implementation
- Can use Aptos Keyless properly

### Cons:
- ❌ Requires building custom bridge
- ❌ Complex architecture
- ❌ More maintenance overhead

---

## Option 4: Wait for Official Aptos Flutter SDK

### Status:
Currently, there is **no official Aptos Flutter SDK with Keyless support**.

The official Aptos Keyless SDK is TypeScript-only (as of 2025).

### Timeline:
Unknown - community packages like `aptos_connect` suggest development is happening, but not ready.

---

## Recommendation: Use Web3Auth

### Why Web3Auth is the Best Choice Right Now:

1. **Production-Ready**: Used by thousands of apps, well-tested
2. **Social Login Built-In**: Supports Google, Apple, Facebook, Twitter, Discord, etc.
3. **Aptos Support**: Documented integration with Aptos blockchain
4. **Flutter Support**: Native Flutter SDK available
5. **Non-Custodial**: Users own their private keys
6. **Easy Integration**: Can be set up in a few hours

### Implementation Plan:

#### Phase 1: Set Up Web3Auth (1-2 hours)
- [ ] Create Web3Auth account
- [ ] Get Client ID
- [ ] Configure OAuth providers
- [ ] Add `web3auth_flutter` package

#### Phase 2: Implement Social Login (2-3 hours)
- [ ] Initialize Web3Auth in Flutter app
- [ ] Implement Google Sign In flow
- [ ] Implement Apple Sign In flow
- [ ] Handle auth state

#### Phase 3: Derive Aptos Accounts (1-2 hours)
- [ ] Add `aptos` Dart SDK
- [ ] Convert Web3Auth private key to Aptos account
- [ ] Get wallet address
- [ ] Store wallet info

#### Phase 4: Backend Integration (2-3 hours)
- [ ] Update backend to accept wallet addresses
- [ ] Implement user registration
- [ ] Mint NFTs to user wallets
- [ ] Test end-to-end flow

**Total Estimated Time: 6-10 hours**

---

## Code Example: Complete Web3Auth + Aptos Integration

```dart
import 'package:web3auth_flutter/web3auth_flutter.dart';
import 'package:aptos/aptos.dart';

class AptosWalletService {
  static Web3AuthFlutter? _web3auth;

  // Initialize Web3Auth
  static Future<void> initialize() async {
    _web3auth = Web3AuthFlutter();

    await _web3auth!.init(
      network: Network.sapphire_mainnet,
      clientId: "YOUR_CLIENT_ID_FROM_WEB3AUTH_DASHBOARD",
      redirectUrl: Uri.parse("com.sprouts.app://auth"),
    );
  }

  // Sign in with Google
  static Future<String?> signInWithGoogle() async {
    try {
      final result = await _web3auth!.login(
        LoginParams(
          loginProvider: Provider.google,
        ),
      );

      if (result == null) return null;

      // Get private key
      final privateKey = await _web3auth!.getPrivKey();

      // Derive Aptos account
      final aptosAccount = _createAptosAccount(privateKey);
      final walletAddress = aptosAccount.address().hex();

      return walletAddress;
    } catch (e) {
      print('Error: $e');
      return null;
    }
  }

  // Sign in with Apple
  static Future<String?> signInWithApple() async {
    try {
      final result = await _web3auth!.login(
        LoginParams(
          loginProvider: Provider.apple,
        ),
      );

      if (result == null) return null;

      final privateKey = await _web3auth!.getPrivKey();
      final aptosAccount = _createAptosAccount(privateKey);
      return aptosAccount.address().hex();
    } catch (e) {
      print('Error: $e');
      return null;
    }
  }

  // Create Aptos account from private key
  static AptosAccount _createAptosAccount(String privateKeyHex) {
    // Remove 0x prefix if present
    final cleanKey = privateKeyHex.startsWith('0x')
      ? privateKeyHex.substring(2)
      : privateKeyHex;

    // Convert hex string to Uint8List
    final privateKeyBytes = _hexToBytes(cleanKey);

    // Create Aptos account
    return AptosAccount.fromPrivateKey(privateKeyBytes);
  }

  // Helper: Convert hex string to bytes
  static Uint8List _hexToBytes(String hex) {
    final length = hex.length;
    final bytes = Uint8List(length ~/ 2);
    for (var i = 0; i < length; i += 2) {
      bytes[i ~/ 2] = int.parse(hex.substring(i, i + 2), radix: 16);
    }
    return bytes;
  }

  // Sign out
  static Future<void> signOut() async {
    await _web3auth!.logout();
  }
}
```

---

## Next Steps

1. **Decide**: Confirm Web3Auth approach
2. **Register**: Create Web3Auth account
3. **Integrate**: Follow implementation plan above
4. **Test**: Test social login and wallet creation
5. **Deploy**: Push to production

---

## Additional Resources

- **Web3Auth Dashboard**: https://dashboard.web3auth.io/
- **Web3Auth Flutter Docs**: https://web3auth.io/docs/sdk/mobile/pnp/flutter/
- **Aptos Dart SDK**: https://pub.dev/packages/aptos
- **Web3Auth Community**: https://web3auth.io/community

---

## Comparison Table

| Feature | aptos_connect | Web3Auth | Custom Solution |
|---------|---------------|----------|-----------------|
| Production Ready | ❌ No | ✅ Yes | ⚠️ Depends |
| Social Login | ✅ Yes | ✅ Yes (10+ providers) | ⚠️ DIY |
| Aptos Support | ✅ Yes | ✅ Yes | ✅ Yes |
| Flutter SDK | ⚠️ Incomplete | ✅ Complete | ⚠️ DIY |
| Documentation | ❌ Poor | ✅ Excellent | ⚠️ N/A |
| Maintenance | ❌ Community | ✅ Professional | ❌ You |
| Setup Time | - | 1-2 hours | 10+ hours |
| **Verdict** | **Skip** | **Use This** | **Only if necessary** |

---

## Conclusion

**Use Web3Auth** for Sprouts production app. It's the only production-ready solution that supports:
- ✅ Flutter mobile apps
- ✅ Social login (Google, Apple)
- ✅ Aptos blockchain
- ✅ Non-custodial wallets

The `aptos_connect` package is too early stage, and building a custom solution is overkill when Web3Auth exists and is battle-tested.
