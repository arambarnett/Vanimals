import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'presentation/theme/app_theme.dart';
import 'presentation/screens/collection_screen.dart';
import 'presentation/screens/onboarding_screen.dart';
import 'data/services/user_preferences.dart';
import 'data/services/privy_auth_service.dart';
import 'core/constants/app_constants.dart';

void main() {
  runApp(const VanimalsApp());
}

class VanimalsApp extends StatelessWidget {
  const VanimalsApp({super.key});

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

    return MaterialApp(
      title: AppConstants.appName,
      theme: AppTheme.lightTheme,
      debugShowCheckedModeBanner: false,
      home: UserPreferences.hasCompletedOnboarding 
          ? const CollectionScreen()
          : const VanimalHomeScreen(),
    );
  }
}

class VanimalHomeScreen extends StatefulWidget {
  const VanimalHomeScreen({super.key});

  @override
  State<VanimalHomeScreen> createState() => _VanimalHomeScreenState();
}

class _VanimalHomeScreenState extends State<VanimalHomeScreen> {
  bool isAuthenticating = false;

  @override
  void initState() {
    super.initState();
    _checkAuthStatus();
  }

  Future<void> _checkAuthStatus() async {
    final isAuthenticated = await PrivyAuthService.isAuthenticated();
    if (isAuthenticated && mounted) {
      // User is already authenticated, go to collection
      Navigator.of(context).pushReplacement(
        MaterialPageRoute(builder: (context) => const CollectionScreen()),
      );
    }
  }

  Future<void> _signInWithPrivy() async {
    setState(() {
      isAuthenticating = true;
    });

    try {
      await PrivyAuthService.authenticate(context);
      
      // After successful authentication, navigate to onboarding or collection
      if (mounted) {
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(
            builder: (context) => UserPreferences.hasCompletedOnboarding 
                ? const CollectionScreen()
                : const OnboardingScreen(),
          ),
        );
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
              const SizedBox(height: 40),
              
              // Sign In Button
              ElevatedButton(
                onPressed: isAuthenticating ? null : _signInWithPrivy,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF6e67f4),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(
                    horizontal: 32,
                    vertical: 16,
                  ),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(25),
                  ),
                  elevation: 8,
                ),
                child: isAuthenticating
                    ? const SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          color: Colors.white,
                        ),
                      )
                    : const Text(
                        'Sign In with Privy',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
              ),
              const SizedBox(height: 16),
              
              // Demo/Guest Access Button
              TextButton(
                onPressed: () {
                  Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (context) => const OnboardingScreen(),
                    ),
                  );
                },
                child: Text(
                  'Continue as Guest',
                  style: TextStyle(
                    color: Colors.white.withOpacity(0.7),
                    fontSize: 16,
                  ),
                ),
              ),
              const SizedBox(height: 60),
              
              // Status
              Text(
                'Welcome to Sprouts ✅',
                style: TextStyle(
                  color: Colors.white.withOpacity(0.6),
                  fontSize: 14,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}