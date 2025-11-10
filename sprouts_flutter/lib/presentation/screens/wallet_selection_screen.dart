import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'dart:async';
import '../theme/app_theme.dart';
import '../../data/services/aptos_native_wallet_service.dart';
import '../../data/services/user_preferences.dart';
import '../../data/services/web3auth_service.dart';
import '../../data/services/deep_link_service.dart';
import '../../core/constants/app_constants.dart';
import 'collection_screen.dart';
import 'starter_egg_screen.dart';

class WalletSelectionScreen extends StatefulWidget {
  const WalletSelectionScreen({super.key});

  @override
  State<WalletSelectionScreen> createState() => _WalletSelectionScreenState();
}

class _WalletSelectionScreenState extends State<WalletSelectionScreen> {
  List<Map<String, dynamic>> walletStatus = [];
  bool isLoading = true;
  bool isConnecting = false;
  String? errorMessage;
  String? pendingWalletName;

  // Manual wallet address input
  final TextEditingController _addressController = TextEditingController();
  bool showManualInput = false;

  @override
  void initState() {
    super.initState();
    _checkWalletAvailability();
    _setupDeepLinkListener();
  }

  @override
  void dispose() {
    _addressController.dispose();
    DeepLinkService.dispose();
    super.dispose();
  }

  void _setupDeepLinkListener() {
    DeepLinkService.initialize(
      onLinkReceived: (Uri uri) async {
        print('📱 Deep link received: $uri');

        // Try parsing as Petra official callback first (with encryption)
        final petraCallbackData = await DeepLinkService.parsePetraCallback(uri);
        if (petraCallbackData != null && petraCallbackData['address'] != null) {
          print('✅ Petra wallet address received: ${petraCallbackData['address']}');
          await _handleWalletCallback(petraCallbackData);
          return;
        }

        // Try parsing as generic wallet callback
        final walletData = DeepLinkService.parseWalletCallback(uri);
        if (walletData != null && walletData['address'] != null) {
          print('✅ Wallet address received: ${walletData['address']}');
          await _handleWalletCallback(walletData);
          return;
        }

        // Try parsing as simple Petra format (fallback)
        final petraData = DeepLinkService.parsePetraConnect(uri);
        if (petraData != null && petraData['address'] != null) {
          print('✅ Petra wallet address received: ${petraData['address']}');
          await _handleWalletCallback(petraData);
          return;
        }

        print('⚠️ Invalid deep link format');
      },
    );
  }

  Future<void> _handleWalletCallback(Map<String, dynamic> data) async {
    if (!mounted) return;

    setState(() {
      isConnecting = true;
      errorMessage = null;
    });

    try {
      final address = data['address'] as String;
      final walletName = data['walletName'] ?? pendingWalletName ?? 'External';

      // Register with backend
      final response = await http.post(
        Uri.parse('${AppConstants.baseUrl}/api/auth/connect-external-wallet'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'walletAddress': address,
          'walletType': 'external',
          'walletName': walletName,
        }),
      );

      if (response.statusCode == 200) {
        final responseData = jsonDecode(response.body);
        final isNewUser = responseData['isNewUser'] ?? false;

        // Save wallet connection
        await AptosNativeWalletService.saveWalletConnection(
          walletType: walletName.toLowerCase(),
          walletAddress: address,
        );

        // Also save to Web3Auth service for compatibility
        final savedUserId = responseData['user']['id'];
        await Web3AuthService.setUserId(savedUserId);

        print('🎉 Wallet connected successfully!');
        print('📝 Saved userId: $savedUserId');

        // Navigate based on whether user is new
        if (mounted) {
          if (isNewUser) {
            Navigator.of(context).pushReplacement(
              MaterialPageRoute(
                builder: (context) => const StarterEggScreen(),
              ),
            );
          } else {
            UserPreferences.setOnboardingCompleted(true);
            Navigator.of(context).pushReplacement(
              MaterialPageRoute(
                builder: (context) => const CollectionScreen(),
              ),
            );
          }
        }
      } else {
        throw Exception('Backend connection failed: ${response.statusCode}');
      }
    } catch (e) {
      print('❌ Error handling wallet callback: $e');
      if (mounted) {
        setState(() {
          errorMessage = 'Failed to connect: $e';
          isConnecting = false;
        });
      }
    }
  }

  Future<void> _checkWalletAvailability() async {
    setState(() {
      isLoading = true;
      errorMessage = null;
    });

    try {
      final status = <Map<String, dynamic>>[];

      for (final wallet in AptosNativeWalletService.availableWallets) {
        final isInstalled = await AptosNativeWalletService.isWalletInstalled(wallet['id']!);
        status.add({
          ...wallet,
          'isInstalled': isInstalled,
        });
      }

      setState(() {
        walletStatus = status;
        isLoading = false;
      });
    } catch (e) {
      setState(() {
        errorMessage = 'Failed to check wallet availability: $e';
        isLoading = false;
      });
    }
  }

  Future<void> _connectWallet(String walletId, String walletName) async {
    setState(() {
      isConnecting = true;
      errorMessage = null;
      pendingWalletName = walletName;
    });

    try {
      // Show connecting dialog
      showDialog(
        context: context,
        barrierDismissible: false,
        builder: (context) => AlertDialog(
          backgroundColor: Colors.black87,
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const CircularProgressIndicator(color: Colors.white),
              const SizedBox(height: 16),
              Text(
                'Opening $walletName...\n\nPlease approve the connection in your wallet.',
                textAlign: TextAlign.center,
                style: const TextStyle(color: Colors.white70),
              ),
            ],
          ),
        ),
      );

      // Launch wallet app with deep link
      await AptosNativeWalletService.connectWallet(walletId);

      // Close dialog after a brief delay
      await Future.delayed(const Duration(seconds: 2));
      if (mounted) {
        Navigator.of(context).pop();
      }

      // The deep link listener will handle the callback automatically
      // If no callback is received after 30 seconds, show manual input option
      Future.delayed(const Duration(seconds: 30), () {
        if (mounted && isConnecting) {
          setState(() {
            showManualInput = true;
            isConnecting = false;
            errorMessage = 'Connection timeout. You can manually enter your wallet address below.';
          });
        }
      });
    } catch (e) {
      if (mounted) {
        // Close dialog if it's open
        Navigator.of(context).pop();
        setState(() {
          errorMessage = e.toString();
          isConnecting = false;
          showManualInput = true;
        });
      }
    }
  }

  Future<void> _connectWithManualAddress() async {
    final address = _addressController.text.trim();

    if (address.isEmpty) {
      setState(() {
        errorMessage = 'Please enter a wallet address';
      });
      return;
    }

    if (!AptosNativeWalletService.isValidAddress(address)) {
      setState(() {
        errorMessage = 'Invalid wallet address format';
      });
      return;
    }

    setState(() {
      isConnecting = true;
      errorMessage = null;
    });

    try {
      // Register with backend
      final response = await http.post(
        Uri.parse('${AppConstants.baseUrl}/api/auth/connect-external-wallet'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'walletAddress': address,
          'walletType': 'external',
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final isNewUser = data['isNewUser'] ?? false;

        // Save wallet connection
        await AptosNativeWalletService.saveWalletConnection(
          walletType: 'external',
          walletAddress: address,
        );

        // Also save to Web3Auth service for compatibility
        await Web3AuthService.setUserId(data['user']['id']);

        // Navigate based on whether user is new
        if (mounted) {
          if (isNewUser) {
            Navigator.of(context).pushReplacement(
              MaterialPageRoute(
                builder: (context) => const StarterEggScreen(),
              ),
            );
          } else {
            UserPreferences.setOnboardingCompleted(true);
            Navigator.of(context).pushReplacement(
              MaterialPageRoute(
                builder: (context) => const CollectionScreen(),
              ),
            );
          }
        }
      } else {
        throw Exception('Backend connection failed: ${response.statusCode}');
      }
    } catch (e) {
      setState(() {
        errorMessage = 'Failed to connect: $e';
        isConnecting = false;
      });
    }
  }

  Future<void> _installWallet(String walletId) async {
    try {
      await AptosNativeWalletService.installWallet(walletId);
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to open installation page: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Connect Aptos Wallet'),
        backgroundColor: AppTheme.vanimalPurple,
        foregroundColor: Colors.white,
      ),
      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              AppTheme.spaceBackground,
              Color(0xFF1a1a2e),
            ],
          ),
        ),
        child: SafeArea(
          child: isLoading
              ? const Center(
                  child: CircularProgressIndicator(color: Colors.white),
                )
              : SingleChildScrollView(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Header
                      const Text(
                        'Select Your Wallet',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Connect your existing Aptos wallet to get started',
                        style: TextStyle(
                          color: Colors.white.withOpacity(0.7),
                          fontSize: 14,
                        ),
                      ),
                      const SizedBox(height: 24),

                      // Error message
                      if (errorMessage != null) ...[
                        Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: Colors.red.withOpacity(0.2),
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(color: Colors.red),
                          ),
                          child: Row(
                            children: [
                              const Icon(Icons.error_outline, color: Colors.red),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Text(
                                  errorMessage!,
                                  style: const TextStyle(color: Colors.red),
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 16),
                      ],

                      // Manual address input section
                      if (showManualInput) ...[
                        Container(
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              colors: [
                                AppTheme.vanimalPurple.withOpacity(0.2),
                                AppTheme.vanimalPink.withOpacity(0.2),
                              ],
                            ),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(
                              color: AppTheme.vanimalPurple.withOpacity(0.5),
                              width: 2,
                            ),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  const Icon(Icons.account_balance_wallet, color: Colors.white, size: 20),
                                  const SizedBox(width: 8),
                                  const Text(
                                    'Paste Your Wallet Address',
                                    style: TextStyle(
                                      color: Colors.white,
                                      fontSize: 16,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 8),
                              Text(
                                'Open Petra and copy your wallet address, then paste it here',
                                style: TextStyle(
                                  color: Colors.white.withOpacity(0.7),
                                  fontSize: 12,
                                ),
                              ),
                              const SizedBox(height: 12),
                              TextField(
                                controller: _addressController,
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontFamily: 'monospace',
                                ),
                                decoration: InputDecoration(
                                  hintText: '0x...',
                                  hintStyle: TextStyle(
                                    color: Colors.white.withOpacity(0.3),
                                  ),
                                  filled: true,
                                  fillColor: Colors.black.withOpacity(0.5),
                                  border: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(8),
                                    borderSide: BorderSide(
                                      color: Colors.white.withOpacity(0.2),
                                    ),
                                  ),
                                  suffixIcon: IconButton(
                                    icon: const Icon(Icons.paste, color: Colors.white70),
                                    onPressed: () async {
                                      final data = await Clipboard.getData('text/plain');
                                      if (data != null && data.text != null) {
                                        _addressController.text = data.text!;
                                      }
                                    },
                                  ),
                                ),
                              ),
                              const SizedBox(height: 12),
                              SizedBox(
                                width: double.infinity,
                                child: ElevatedButton(
                                  onPressed: isConnecting ? null : _connectWithManualAddress,
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: AppTheme.vanimalPurple,
                                    foregroundColor: Colors.white,
                                    padding: const EdgeInsets.symmetric(vertical: 14),
                                  ),
                                  child: isConnecting
                                      ? const SizedBox(
                                          height: 20,
                                          width: 20,
                                          child: CircularProgressIndicator(
                                            strokeWidth: 2,
                                            color: Colors.white,
                                          ),
                                        )
                                      : const Text('Connect'),
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 24),
                      ],

                      // Wallet list
                      ...walletStatus.map((wallet) {
                        final isInstalled = wallet['isInstalled'] as bool;
                        return Padding(
                          padding: const EdgeInsets.only(bottom: 12),
                          child: _buildWalletCard(
                            walletId: wallet['id'] as String,
                            name: wallet['name'] as String,
                            description: wallet['description'] as String,
                            isInstalled: isInstalled,
                          ),
                        );
                      }).toList(),

                      const SizedBox(height: 16),

                      // Manual input toggle
                      if (!showManualInput)
                        TextButton(
                          onPressed: () {
                            setState(() {
                              showManualInput = true;
                            });
                          },
                          child: Text(
                            'Or enter wallet address manually',
                            style: TextStyle(
                              color: Colors.white.withOpacity(0.7),
                            ),
                          ),
                        ),
                    ],
                  ),
                ),
        ),
      ),
    );
  }

  Widget _buildWalletCard({
    required String walletId,
    required String name,
    required String description,
    required bool isInstalled,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.black.withOpacity(0.3),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: isInstalled
              ? AppTheme.vanimalPurple.withOpacity(0.5)
              : Colors.white.withOpacity(0.1),
        ),
      ),
      child: ListTile(
        contentPadding: const EdgeInsets.all(16),
        leading: Container(
          width: 48,
          height: 48,
          decoration: BoxDecoration(
            color: isInstalled ? AppTheme.vanimalPurple : Colors.grey,
            borderRadius: BorderRadius.circular(12),
          ),
          child: const Icon(
            Icons.account_balance_wallet,
            color: Colors.white,
            size: 24,
          ),
        ),
        title: Text(
          name,
          style: const TextStyle(
            color: Colors.white,
            fontSize: 16,
            fontWeight: FontWeight.bold,
          ),
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 4),
            Text(
              description,
              style: TextStyle(
                color: Colors.white.withOpacity(0.7),
                fontSize: 12,
              ),
            ),
            if (isInstalled) ...[
              const SizedBox(height: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: Colors.green.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(4),
                  border: Border.all(color: Colors.green),
                ),
                child: const Text(
                  'Installed',
                  style: TextStyle(
                    color: Colors.green,
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ],
        ),
        trailing: isInstalled
            ? ElevatedButton(
                onPressed: isConnecting ? null : () => _connectWallet(walletId, name),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.vanimalPurple,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                ),
                child: const Text('Connect'),
              )
            : TextButton(
                onPressed: () => _installWallet(walletId),
                child: const Text(
                  'Install',
                  style: TextStyle(color: Colors.white70),
                ),
              ),
      ),
    );
  }
}
