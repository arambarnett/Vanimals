import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'presentation/theme/app_theme.dart';
import 'presentation/screens/collection_screen.dart';
import 'presentation/screens/onboarding_screen.dart';
import 'presentation/screens/starter_egg_screen.dart';
import 'presentation/screens/wallet_selection_screen.dart';
import 'presentation/screens/hatch_waitlist_screen.dart';
import 'presentation/screens/hatch_now_screen.dart';
import 'data/services/user_preferences.dart';
import 'data/services/web3auth_service.dart';
import 'core/constants/app_constants.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize Web3Auth
  try {
    await Web3AuthService.initialize();
    print('✅ Web3Auth initialized successfully');
  } catch (e) {
    print('⚠️ Web3Auth initialization error: $e');
  }

  runApp(const VanimalsApp());
}

class VanimalsApp extends StatelessWidget {
  const VanimalsApp({super.key});

  // Hatch Day: February 1st, 2026, 5:00 PM PST (TESTING)
  static final DateTime hatchDay = DateTime(2026, 2, 1, 17, 0, 0);

  @override
  Widget build(BuildContext context) {
    // Set system UI overlay style for dark theme
    SystemChrome.setSystemUIOverlayStyle(
      const SystemUiOverlayStyle(
        statusBarColor: Colors.transparent,
        statusBarIconBrightness: Brightness.light,
        systemNavigationBarColor: Colors.black,
        systemNavigationBarIconBrightness: Brightness.light,
      ),
    );

    // Check if it's before Hatch Day
    final now = DateTime.now();
    final isBeforeHatchDay = now.isBefore(hatchDay);

    return MaterialApp(
      title: AppConstants.appName,
      theme: AppTheme.lightTheme,
      debugShowCheckedModeBanner: false,
      home: isBeforeHatchDay
          ? const HatchWaitlistScreen()
          : const HatchDayRouter(),
    );
  }
}

// Router to determine if user should see Hatch Now screen or normal app flow
class HatchDayRouter extends StatelessWidget {
  const HatchDayRouter({super.key});

  @override
  Widget build(BuildContext context) {
    // TODO: Check if user has eggs to hatch from waitlist
    // For now, show Hatch Now screen if they joined waitlist
    // Otherwise show normal onboarding flow

    return UserPreferences.hasCompletedOnboarding
        ? const CollectionScreen()
        : const VanimalHomeScreen();
  }
}

class VanimalHomeScreen extends StatefulWidget {
  const VanimalHomeScreen({super.key});

  @override
  State<VanimalHomeScreen> createState() => _VanimalHomeScreenState();
}

class _VanimalHomeScreenState extends State<VanimalHomeScreen> with SingleTickerProviderStateMixin {
  bool isAuthenticating = false;
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    _checkAuthStatus();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _checkAuthStatus() async {
    final isAuthenticated = await Web3AuthService.isConnected();
    if (isAuthenticated && mounted) {
      // User is already authenticated, go to collection
      Navigator.of(context).pushReplacement(
        MaterialPageRoute(builder: (context) => const CollectionScreen()),
      );
    }
  }

  Future<bool> _registerWithBackend(Map<String, dynamic> authResult) async {
    try {
      final response = await http.post(
        Uri.parse('${AppConstants.baseUrl}/api/auth/connect-wallet'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(authResult),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        // Store backend user ID
        await Web3AuthService.setUserId(data['user']['id']);

        final isNewUser = data['isNewUser'] ?? false;
        print('✅ User ${isNewUser ? 'registered' : 'logged in'}: ${data['user']['id']}');

        // Return whether this is a new user
        return isNewUser;
      } else {
        throw Exception('Backend registration failed: ${response.statusCode}');
      }
    } catch (e) {
      print('❌ Backend registration error: $e');
      throw Exception('Failed to register with backend: $e');
    }
  }

  Future<void> _signInWithGoogle() async {
    setState(() {
      isAuthenticating = true;
    });

    try {
      final result = await Web3AuthService.signInWithGoogle();

      if (result == null) {
        throw Exception('Sign in canceled or failed');
      }

      // Register with backend and check if new user
      final isNewUser = await _registerWithBackend(result);

      // After successful authentication, navigate based on whether user is new
      if (mounted) {
        if (isNewUser) {
          // New user - go directly to egg hatching screen
          Navigator.of(context).pushReplacement(
            MaterialPageRoute(
              builder: (context) => const StarterEggScreen(),
            ),
          );
        } else {
          // Existing user - skip onboarding, go straight to collection
          UserPreferences.setOnboardingCompleted(true);
          Navigator.of(context).pushReplacement(
            MaterialPageRoute(
              builder: (context) => const CollectionScreen(),
            ),
          );
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Authentication failed: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          isAuthenticating = false;
        });
      }
    }
  }

  Future<void> _signInWithApple() async {
    setState(() {
      isAuthenticating = true;
    });

    try {
      if (!Web3AuthService.isAppleSignInAvailable()) {
        throw Exception('Apple Sign In is not available on this device');
      }

      final result = await Web3AuthService.signInWithApple();

      if (result == null) {
        throw Exception('Sign in canceled or failed');
      }

      // Register with backend and check if new user
      final isNewUser = await _registerWithBackend(result);

      // After successful authentication, navigate based on whether user is new
      if (mounted) {
        if (isNewUser) {
          // New user - go directly to egg hatching screen
          Navigator.of(context).pushReplacement(
            MaterialPageRoute(
              builder: (context) => const StarterEggScreen(),
            ),
          );
        } else {
          // Existing user - skip onboarding, go straight to collection
          UserPreferences.setOnboardingCompleted(true);
          Navigator.of(context).pushReplacement(
            MaterialPageRoute(
              builder: (context) => const CollectionScreen(),
            ),
          );
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Authentication failed: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          isAuthenticating = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
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
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // App Logo
              Container(
                width: 150,
                height: 150,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  gradient: LinearGradient(
                    colors: [
                      AppTheme.vanimalPurple,
                      AppTheme.vanimalPink,
                    ],
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: AppTheme.vanimalPurple.withOpacity(0.3),
                      blurRadius: 20,
                      spreadRadius: 5,
                    ),
                  ],
                ),
                child: const Icon(
                  Icons.pets,
                  color: Colors.white,
                  size: 80,
                ),
              ),
              const SizedBox(height: 40),
              
              // Title
              const Text(
                'Sprouts',
                style: TextStyle(
                  fontSize: 36,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                  letterSpacing: 2,
                ),
              ),
              const SizedBox(height: 10),

              // Subtitle
              Text(
                'Digital AR Pet Companions',
                style: TextStyle(
                  fontSize: 18,
                  color: Colors.white.withOpacity(0.8),
                ),
              ),
              const SizedBox(height: 30),

              // Tab Bar for Sign Up / Login
              Container(
                margin: const EdgeInsets.symmetric(horizontal: 40),
                decoration: BoxDecoration(
                  color: Colors.black.withOpacity(0.3),
                  borderRadius: BorderRadius.circular(25),
                ),
                child: TabBar(
                  controller: _tabController,
                  indicator: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        AppTheme.vanimalPurple,
                        AppTheme.vanimalPink,
                      ],
                    ),
                    borderRadius: BorderRadius.circular(25),
                  ),
                  indicatorSize: TabBarIndicatorSize.tab,
                  dividerColor: Colors.transparent,
                  labelColor: Colors.white,
                  unselectedLabelColor: Colors.white.withOpacity(0.6),
                  labelStyle: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                  tabs: const [
                    Tab(text: 'Sign Up'),
                    Tab(text: 'Login'),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // Tab View Content
              SizedBox(
                height: 350,
                child: TabBarView(
                  controller: _tabController,
                  children: [
                    // Sign Up Tab
                    _buildAuthContent(isSignUp: true),
                    // Login Tab
                    _buildAuthContent(isSignUp: false),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildAuthContent({required bool isSignUp}) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 32),
      child: Column(
        children: [
          // Welcome message
          Text(
            isSignUp
                ? 'Create your account and start\nyour Sprouts journey! 🌱'
                : 'Welcome back!\nContinue growing your Sprouts 🌳',
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 14,
              color: Colors.white.withOpacity(0.7),
              height: 1.5,
            ),
          ),
          const SizedBox(height: 24),

          // Sign In Buttons
          Column(
            children: [
              // Google Sign In
              ElevatedButton.icon(
                onPressed: isAuthenticating ? null : _signInWithGoogle,
                icon: const Icon(Icons.mail_outline, size: 24),
                label: Text(
                  isSignUp ? 'Sign up with Google' : 'Sign in with Google',
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.white,
                  foregroundColor: Colors.black87,
                  padding: const EdgeInsets.symmetric(
                    horizontal: 24,
                    vertical: 14,
                  ),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(25),
                  ),
                  elevation: 8,
                  minimumSize: const Size(double.infinity, 50),
                ),
              ),
              const SizedBox(height: 16),

              // Apple Sign In (only show on iOS/macOS)
              if (Web3AuthService.isAppleSignInAvailable())
                ElevatedButton.icon(
                  onPressed: isAuthenticating ? null : _signInWithApple,
                  icon: const Icon(Icons.apple, size: 24),
                  label: Text(
                    isSignUp ? 'Sign up with Apple' : 'Sign in with Apple',
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.black,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(
                      horizontal: 24,
                      vertical: 14,
                    ),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(25),
                    ),
                    elevation: 8,
                    minimumSize: const Size(double.infinity, 50),
                  ),
                ),
              const SizedBox(height: 16),

              // Divider
              Row(
                children: [
                  Expanded(child: Divider(color: Colors.white.withOpacity(0.3))),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    child: Text(
                      'OR',
                      style: TextStyle(
                        color: Colors.white.withOpacity(0.5),
                        fontSize: 14,
                      ),
                    ),
                  ),
                  Expanded(child: Divider(color: Colors.white.withOpacity(0.3))),
                ],
              ),
              const SizedBox(height: 16),

              // Connect Aptos Wallet
              ElevatedButton.icon(
                onPressed: isAuthenticating
                    ? null
                    : () {
                        Navigator.of(context).push(
                          MaterialPageRoute(
                            builder: (context) => const WalletSelectionScreen(),
                          ),
                        );
                      },
                icon: const Icon(Icons.account_balance_wallet, size: 24),
                label: const Text(
                  'Connect Aptos Wallet',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.vanimalPurple,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(
                    horizontal: 24,
                    vertical: 14,
                  ),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(25),
                  ),
                  elevation: 8,
                  minimumSize: const Size(double.infinity, 50),
                ),
              ),

              if (isAuthenticating)
                const Padding(
                  padding: EdgeInsets.only(top: 16),
                  child: CircularProgressIndicator(
                    strokeWidth: 2,
                    color: Colors.white,
                  ),
                ),
            ],
          ),
        ],
      ),
    );
  }
}