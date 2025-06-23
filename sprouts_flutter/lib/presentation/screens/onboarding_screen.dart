import 'dart:math';
import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../../data/services/api_service.dart';
import '../../data/services/user_preferences.dart';
import 'collection_screen.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen>
    with TickerProviderStateMixin {
  PageController pageController = PageController();
  int currentPage = 0;
  bool isConnectingStrava = false;
  late AnimationController _sparkleController;
  late Animation<double> _sparkleAnimation;

  @override
  void initState() {
    super.initState();
    
    _sparkleController = AnimationController(
      duration: const Duration(milliseconds: 3000),
      vsync: this,
    );
    
    _sparkleAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _sparkleController,
      curve: Curves.easeInOut,
    ));

    _sparkleController.repeat();
  }

  @override
  void dispose() {
    _sparkleController.dispose();
    pageController.dispose();
    super.dispose();
  }

  void _nextPage() {
    if (currentPage < 2) {
      pageController.nextPage(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
      );
    }
  }

  void _skipToCollection() {
    UserPreferences.completeOnboarding(connectedStrava: false);
    Navigator.of(context).pushReplacement(
      MaterialPageRoute(builder: (context) => const CollectionScreen()),
    );
  }

  Future<void> _connectStravaAndGetEgg() async {
    setState(() => isConnectingStrava = true);

    try {
      // TODO: Replace with actual user ID when user system is implemented
      final authUrl = await ApiService.getStravaOAuthUrl('new_user_id');
      
      // In a real app, you would open this URL in a browser/webview
      // For now, we'll simulate a successful connection and give the free egg
      
      if (mounted) {
        // Simulate connection process
        await Future.delayed(const Duration(seconds: 2));
        
        // Complete onboarding with Strava connection
        UserPreferences.completeOnboarding(connectedStrava: true);
        
        // Show success message with free egg reward
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('🎉 Strava connected! You earned a FREE Common Egg!'),
            backgroundColor: Colors.green,
            duration: Duration(seconds: 4),
          ),
        );
        
        // Navigate to collection with the new egg
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (context) => const CollectionScreen()),
        );
      }
    } catch (e) {
      setState(() => isConnectingStrava = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Connection failed: $e'),
            backgroundColor: Colors.red,
          ),
        );
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
          child: Stack(
            children: [
              // Sparkle effect background
              _buildSparkleEffect(),
              
              // Page view content
              PageView(
                controller: pageController,
                onPageChanged: (page) {
                  setState(() {
                    currentPage = page;
                  });
                },
                children: [
                  _buildWelcomePage(),
                  _buildFeaturePage(),
                  _buildStravaIncentivePage(),
                ],
              ),
              
              // Skip button
              if (currentPage < 2)
                Positioned(
                  top: 20,
                  right: 20,
                  child: TextButton(
                    onPressed: _skipToCollection,
                    child: const Text(
                      'Skip',
                      style: TextStyle(color: Colors.white70, fontSize: 16),
                    ),
                  ),
                ),
              
              // Page indicators and navigation
              Positioned(
                bottom: 50,
                left: 20,
                right: 20,
                child: Column(
                  children: [
                    // Page dots
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: List.generate(3, (index) {
                        return Container(
                          margin: const EdgeInsets.symmetric(horizontal: 4),
                          width: currentPage == index ? 20 : 8,
                          height: 8,
                          decoration: BoxDecoration(
                            color: currentPage == index
                                ? AppTheme.vanimalPurple
                                : Colors.white30,
                            borderRadius: BorderRadius.circular(4),
                          ),
                        );
                      }),
                    ),
                    
                    const SizedBox(height: 20),
                    
                    // Navigation button
                    if (currentPage < 2)
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton(
                          onPressed: _nextPage,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppTheme.vanimalPurple,
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(vertical: 16),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                          ),
                          child: const Text(
                            'Next',
                            style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                          ),
                        ),
                      ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSparkleEffect() {
    return AnimatedBuilder(
      animation: _sparkleAnimation,
      builder: (context, child) {
        return Stack(
          children: List.generate(25, (index) {
            final random = (index * 137.5) % 360;
            final radius = 100 + (index * 20) % 300;
            final angle = random + (_sparkleAnimation.value * 360);
            
            final x = MediaQuery.of(context).size.width / 2 + 
                     radius * 0.4 * cos(angle * pi / 180);
            final y = MediaQuery.of(context).size.height / 2 + 
                     radius * 0.4 * sin(angle * pi / 180);
            
            return Positioned(
              left: x,
              top: y,
              child: Opacity(
                opacity: (0.1 + (index % 4) * 0.15) * _sparkleAnimation.value,
                child: Icon(
                  Icons.star,
                  color: [
                    Colors.white,
                    AppTheme.vanimalPink,
                    AppTheme.vanimalPurple,
                    Colors.yellow,
                    Colors.cyan,
                  ][index % 5],
                  size: 6 + (index % 4) * 3,
                ),
              ),
            );
          }),
        );
      },
    );
  }

  Widget _buildWelcomePage() {
    return Padding(
      padding: const EdgeInsets.all(20),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          // Logo
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
          
          // Welcome text
          const Text(
            'Welcome to Sprouts!',
            style: TextStyle(
              fontSize: 32,
              fontWeight: FontWeight.bold,
              color: Colors.white,
              letterSpacing: 1,
            ),
            textAlign: TextAlign.center,
          ),
          
          const SizedBox(height: 20),
          
          Text(
            'Collect, breed, and nurture your digital AR pet companions.',
            style: TextStyle(
              fontSize: 18,
              color: Colors.white.withOpacity(0.8),
              height: 1.4,
            ),
            textAlign: TextAlign.center,
          ),
          
          const SizedBox(height: 40),
          
          // Features preview
          Row(
            children: [
              Expanded(
                child: _buildFeaturePreview(
                  Icons.pets,
                  'Collect',
                  'Unique Sprouts',
                ),
              ),
              Expanded(
                child: _buildFeaturePreview(
                  Icons.favorite,
                  'Breed',
                  'Create Offspring',
                ),
              ),
              Expanded(
                child: _buildFeaturePreview(
                  Icons.view_in_ar,
                  'AR View',
                  'See in Reality',
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildFeaturePage() {
    return Padding(
      padding: const EdgeInsets.all(20),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          // Feature icon
          Container(
            width: 120,
            height: 120,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              gradient: LinearGradient(
                colors: [
                  AppTheme.vanimalPurple.withOpacity(0.8),
                  AppTheme.vanimalPink.withOpacity(0.8),
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
              Icons.directions_run,
              color: Colors.white,
              size: 60,
            ),
          ),
          
          const SizedBox(height: 40),
          
          const Text(
            'Stay Active, Grow Stronger',
            style: TextStyle(
              fontSize: 28,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
            textAlign: TextAlign.center,
          ),
          
          const SizedBox(height: 20),
          
          Text(
            'Connect your fitness activities to earn rewards and level up your Sprouts. The more you move, the stronger they become!',
            style: TextStyle(
              fontSize: 16,
              color: Colors.white.withOpacity(0.8),
              height: 1.5,
            ),
            textAlign: TextAlign.center,
          ),
          
          const SizedBox(height: 40),
          
          // Reward examples
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.black.withOpacity(0.4),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppTheme.vanimalPurple.withOpacity(0.3)),
            ),
            child: Column(
              children: [
                const Text(
                  'Earn Rewards for Activities',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Expanded(
                      child: _buildRewardExample(
                        Icons.monetization_on,
                        'Coins',
                        'For breeding & items',
                        Colors.amber,
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: _buildRewardExample(
                        Icons.star,
                        'XP',
                        'Level up Sprouts',
                        AppTheme.vanimalPink,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStravaIncentivePage() {
    return Padding(
      padding: const EdgeInsets.all(20),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          // Strava + Sprouts icons
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                width: 80,
                height: 80,
                decoration: BoxDecoration(
                  color: const Color(0xFFFC4C02), // Strava orange
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFFFC4C02).withOpacity(0.3),
                      blurRadius: 15,
                      spreadRadius: 3,
                    ),
                  ],
                ),
                child: const Icon(Icons.directions_run, color: Colors.white, size: 40),
              ),
              
              const SizedBox(width: 20),
              
              const Icon(Icons.add, color: Colors.white, size: 30),
              
              const SizedBox(width: 20),
              
              Container(
                width: 80,
                height: 80,
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [AppTheme.vanimalPurple, AppTheme.vanimalPink],
                  ),
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: AppTheme.vanimalPurple.withOpacity(0.3),
                      blurRadius: 15,
                      spreadRadius: 3,
                    ),
                  ],
                ),
                child: const Icon(Icons.pets, color: Colors.white, size: 40),
              ),
            ],
          ),
          
          const SizedBox(height: 40),
          
          const Text(
            'Connect Strava & Get Your First Egg FREE!',
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
            textAlign: TextAlign.center,
          ),
          
          const SizedBox(height: 20),
          
          Text(
            'Connect your Strava account now and receive a Common Egg worth 100 coins absolutely free! Start your Sprouts journey with your first companion.',
            style: TextStyle(
              fontSize: 16,
              color: Colors.white.withOpacity(0.8),
              height: 1.5,
            ),
            textAlign: TextAlign.center,
          ),
          
          const SizedBox(height: 40),
          
          // Free egg showcase
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  Colors.amber.withOpacity(0.8),
                  Colors.orange.withOpacity(0.8),
                ],
              ),
              borderRadius: BorderRadius.circular(20),
              boxShadow: [
                BoxShadow(
                  color: Colors.amber.withOpacity(0.3),
                  blurRadius: 20,
                  spreadRadius: 5,
                ),
              ],
            ),
            child: Column(
              children: [
                const Icon(
                  Icons.egg,
                  color: Colors.white,
                  size: 60,
                ),
                const SizedBox(height: 12),
                const Text(
                  'FREE Common Egg',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 4),
                const Text(
                  'Worth 100 coins',
                  style: TextStyle(
                    color: Colors.white70,
                    fontSize: 14,
                  ),
                ),
                const SizedBox(height: 8),
                const Text(
                  '🐦 May contain: Pigeon, Basic creatures',
                  style: TextStyle(
                    color: Colors.white70,
                    fontSize: 12,
                  ),
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          ),
          
          const SizedBox(height: 40),
          
          // Action buttons
          Column(
            children: [
              SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  onPressed: isConnectingStrava ? null : _connectStravaAndGetEgg,
                  icon: isConnectingStrava
                      ? const SizedBox(
                          width: 20,
                          height: 20,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            color: Colors.white,
                          ),
                        )
                      : const Icon(Icons.link, size: 20),
                  label: Text(
                    isConnectingStrava 
                        ? 'Connecting...' 
                        : 'Connect Strava & Get Free Egg',
                  ),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFFC4C02),
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                ),
              ),
              
              const SizedBox(height: 12),
              
              SizedBox(
                width: double.infinity,
                child: TextButton(
                  onPressed: isConnectingStrava ? null : _skipToCollection,
                  child: const Text(
                    'Skip for now (no free egg)',
                    style: TextStyle(
                      color: Colors.white70,
                      fontSize: 14,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildFeaturePreview(IconData icon, String title, String subtitle) {
    return Container(
      padding: const EdgeInsets.all(16),
      margin: const EdgeInsets.symmetric(horizontal: 4),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        children: [
          Icon(icon, color: AppTheme.vanimalPurple, size: 32),
          const SizedBox(height: 8),
          Text(
            title,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 14,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            subtitle,
            style: const TextStyle(
              color: Colors.white70,
              fontSize: 10,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildRewardExample(IconData icon, String title, String subtitle, Color color) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: color.withOpacity(0.2),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withOpacity(0.5)),
      ),
      child: Column(
        children: [
          Icon(icon, color: color, size: 24),
          const SizedBox(height: 8),
          Text(
            title,
            style: TextStyle(
              color: color,
              fontSize: 14,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            subtitle,
            style: const TextStyle(
              color: Colors.white70,
              fontSize: 10,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }
}