import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'dart:async';
import 'dart:math' as math;
import '../theme/app_theme.dart';
import 'connect_strava_screen.dart';
import 'wallet_selection_screen.dart';
import '../../data/services/web3auth_service.dart';
import '../../data/services/waitlist_service.dart';
import '../../data/services/shopify_service.dart';
import '../../core/constants/app_constants.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class HatchWaitlistScreen extends StatefulWidget {
  const HatchWaitlistScreen({super.key});

  @override
  State<HatchWaitlistScreen> createState() => _HatchWaitlistScreenState();
}

class _HatchWaitlistScreenState extends State<HatchWaitlistScreen>
    with TickerProviderStateMixin {
  late AnimationController _starController;
  late AnimationController _sparkleController;
  late AnimationController _floatController;
  late Timer _countdownTimer;

  Duration timeUntilHatch = Duration.zero;
  bool isAuthenticating = false;
  bool hasJoinedWaitlist = false;
  bool hasConnectedStrava = false;
  bool hasPrism = false;

  // Rewards tracking
  int eggsGranted = 0;
  int feedGranted = 0;
  String? userId;
  WaitlistStatus? waitlistStatus;

  // Hatch Day: February 1st, 2026, 5:00 PM PST (TESTING)
  final DateTime hatchDay = DateTime(2026, 2, 1, 17, 0, 0);

  @override
  void initState() {
    super.initState();
    _setupAnimations();
    _startCountdown();
    _checkWaitlistStatus();
  }

  void _setupAnimations() {
    _starController = AnimationController(
      duration: const Duration(seconds: 20),
      vsync: this,
    )..repeat();

    _sparkleController = AnimationController(
      duration: const Duration(milliseconds: 1500),
      vsync: this,
    )..repeat();

    _floatController = AnimationController(
      duration: const Duration(seconds: 3),
      vsync: this,
    )..repeat(reverse: true);
  }

  void _startCountdown() {
    _updateCountdown();
    _countdownTimer = Timer.periodic(const Duration(seconds: 1), (_) {
      _updateCountdown();
    });
  }

  void _updateCountdown() {
    setState(() {
      final now = DateTime.now();
      timeUntilHatch = hatchDay.difference(now);
    });
  }

  Future<void> _checkWaitlistStatus() async {
    final isAuthenticated = await Web3AuthService.isConnected();
    if (isAuthenticated) {
      userId = await Web3AuthService.getUserId();

      if (userId != null) {
        final status = await WaitlistService.getStatus(userId!);

        if (status != null) {
          setState(() {
            hasJoinedWaitlist = true;
            hasConnectedStrava = status.stravaConnected;
            hasPrism = status.hasPrism;
            eggsGranted = status.eggsGranted;
            feedGranted = status.feedGranted;
            waitlistStatus = status;
          });
        } else {
          setState(() {
            hasJoinedWaitlist = true;
          });
        }
      }
    }
  }

  @override
  void dispose() {
    _starController.dispose();
    _sparkleController.dispose();
    _floatController.dispose();
    _countdownTimer.cancel();
    super.dispose();
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
              Color(0xFF000000),
              Color(0xFF1a1a1a),
              Color(0xFF2a2a2a),
              Color(0xFF1a1a1a),
              Color(0xFF000000),
            ],
          ),
        ),
        child: Stack(
          children: [
            // Animated stars background
            _buildStarField(),

            // Logout button (top-right)
            if (hasJoinedWaitlist)
              Positioned(
                top: 50,
                right: 20,
                child: IconButton(
                  onPressed: _handleLogout,
                  icon: const Icon(
                    Icons.logout,
                    color: Colors.white,
                    size: 24,
                  ),
                  style: IconButton.styleFrom(
                    backgroundColor: Colors.white.withOpacity(0.1),
                    padding: const EdgeInsets.all(12),
                  ),
                ),
              ),

            // Content
            SafeArea(
              child: SingleChildScrollView(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  child: Column(
                    children: [
                      const SizedBox(height: 40),
                      _buildLogo(),
                      const SizedBox(height: 40),
                      if (hasJoinedWaitlist) ...[
                        _buildRewardsTracker(),
                        const SizedBox(height: 20),
                        _buildReferralCard(),
                        const SizedBox(height: 30),
                      ],
                      _buildCountdown(),
                      const SizedBox(height: 40),
                      _buildMysteryMessage(),
                      const SizedBox(height: 60),
                      _buildActionButtons(),
                      const SizedBox(height: 40),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStarField() {
    return AnimatedBuilder(
      animation: _starController,
      builder: (context, child) {
        return CustomPaint(
          size: Size.infinite,
          painter: StarFieldPainter(
            _starController.value,
            _sparkleController.value,
          ),
        );
      },
    );
  }

  Widget _buildLogo() {
    return AnimatedBuilder(
      animation: _floatController,
      builder: (context, child) {
        return Transform.translate(
          offset: Offset(0, math.sin(_floatController.value * math.pi * 2) * 10),
          child: Column(
            children: [
              // Mysterious egg icon with glow - BIGGER!
              Container(
                width: hasJoinedWaitlist ? 200 : 150,
                height: hasJoinedWaitlist ? 250 : 180,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: Colors.white.withOpacity(0.3),
                      blurRadius: 40,
                      spreadRadius: 10,
                    ),
                    BoxShadow(
                      color: Colors.purple.withOpacity(0.2),
                      blurRadius: 60,
                      spreadRadius: 20,
                    ),
                  ],
                ),
                child: Center(
                  child: Text(
                    '🥚',
                    style: TextStyle(
                      fontSize: hasJoinedWaitlist ? 140 : 100,
                      shadows: [
                        Shadow(
                          color: Colors.white.withOpacity(0.5),
                          blurRadius: 20,
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 24),
              Text(
                'Sprouts',
                style: TextStyle(
                  fontSize: 42,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                  letterSpacing: 4,
                  shadows: [
                    Shadow(
                      color: Colors.white.withOpacity(0.5),
                      blurRadius: 10,
                    ),
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildCountdown() {
    final days = timeUntilHatch.inDays;
    final hours = timeUntilHatch.inHours % 24;
    final minutes = timeUntilHatch.inMinutes % 60;
    final seconds = timeUntilHatch.inSeconds % 60;

    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: Colors.white.withOpacity(0.2),
          width: 1,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.white.withOpacity(0.1),
            blurRadius: 20,
            spreadRadius: 5,
          ),
        ],
      ),
      child: Column(
        children: [
          Text(
            'Hatch Day Begins In',
            style: TextStyle(
              fontSize: 16,
              color: Colors.white.withOpacity(0.7),
              letterSpacing: 2,
            ),
          ),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              _buildCountdownUnit(days.toString(), 'DAYS'),
              _buildCountdownDivider(),
              _buildCountdownUnit(hours.toString().padLeft(2, '0'), 'HRS'),
              _buildCountdownDivider(),
              _buildCountdownUnit(minutes.toString().padLeft(2, '0'), 'MIN'),
              _buildCountdownDivider(),
              _buildCountdownUnit(seconds.toString().padLeft(2, '0'), 'SEC'),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildCountdownUnit(String value, String label) {
    return Column(
      children: [
        Text(
          value,
          style: const TextStyle(
            fontSize: 32,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        Text(
          label,
          style: TextStyle(
            fontSize: 10,
            color: Colors.white.withOpacity(0.5),
            letterSpacing: 1,
          ),
        ),
      ],
    );
  }

  Widget _buildCountdownDivider() {
    return Text(
      ':',
      style: TextStyle(
        fontSize: 32,
        fontWeight: FontWeight.bold,
        color: Colors.white.withOpacity(0.5),
      ),
    );
  }

  Widget _buildRewardsTracker() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(16),
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            Colors.purple.withOpacity(0.3),
            Colors.blue.withOpacity(0.2),
          ],
        ),
        border: Border.all(
          color: Colors.white.withOpacity(0.3),
          width: 1,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.purple.withOpacity(0.2),
            blurRadius: 20,
            spreadRadius: 5,
          ),
        ],
      ),
      child: Column(
        children: [
          Text(
            'Your Rewards',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: Colors.white,
              letterSpacing: 2,
            ),
          ),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              _buildRewardItem(
                icon: '🥚',
                label: 'Eggs',
                value: eggsGranted.toString(),
                color: Colors.blue,
              ),
              Container(
                width: 1,
                height: 50,
                color: Colors.white.withOpacity(0.3),
              ),
              _buildRewardItem(
                icon: '🌾',
                label: 'Feed',
                value: feedGranted.toString(),
                color: Colors.amber,
              ),
            ],
          ),
          if (waitlistStatus != null && waitlistStatus!.referralCode.isNotEmpty) ...[
            const SizedBox(height: 16),
            Divider(color: Colors.white.withOpacity(0.2)),
            const SizedBox(height: 12),
            Column(
              children: [
                Text(
                  'Your Referral Code',
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.white.withOpacity(0.7),
                  ),
                ),
                const SizedBox(height: 6),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 8,
                  ),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(
                      color: Colors.white.withOpacity(0.3),
                      width: 1,
                    ),
                  ),
                  child: Text(
                    waitlistStatus!.referralCode,
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                      letterSpacing: 2,
                    ),
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  '${waitlistStatus!.referralCount} referrals',
                  style: TextStyle(
                    fontSize: 11,
                    color: Colors.white.withOpacity(0.6),
                  ),
                ),
              ],
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildRewardItem({
    required String icon,
    required String label,
    required String value,
    required Color color,
  }) {
    return Column(
      children: [
        Text(
          icon,
          style: const TextStyle(fontSize: 32),
        ),
        const SizedBox(height: 8),
        Text(
          value,
          style: TextStyle(
            fontSize: 28,
            fontWeight: FontWeight.bold,
            color: color,
          ),
        ),
        Text(
          label,
          style: TextStyle(
            fontSize: 14,
            color: Colors.white.withOpacity(0.7),
          ),
        ),
      ],
    );
  }

  Widget _buildMysteryMessage() {
    return Column(
      children: [
        Text(
          hasJoinedWaitlist
              ? 'Your egg is waiting...'
              : 'Something magical is coming...',
          style: TextStyle(
            fontSize: 20,
            color: Colors.white.withOpacity(0.9),
            fontWeight: FontWeight.w500,
          ),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 12),
        Text(
          hasJoinedWaitlist
              ? 'Complete these goals to prepare for Hatch Day'
              : 'Join the waitlist to reserve your free egg',
          style: TextStyle(
            fontSize: 14,
            color: Colors.white.withOpacity(0.6),
          ),
          textAlign: TextAlign.center,
        ),
      ],
    );
  }

  Widget _buildActionButtons() {
    // Before joining: Show single "Join Waitlist" CTA
    if (!hasJoinedWaitlist) {
      return Column(
        children: [
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: isAuthenticating ? null : _joinWaitlist,
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.purple,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 20),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                ),
                elevation: 8,
                shadowColor: Colors.purple.withOpacity(0.5),
              ),
              child: isAuthenticating
                  ? const SizedBox(
                      height: 24,
                      width: 24,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        color: Colors.white,
                      ),
                    )
                  : Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.star, size: 24),
                        const SizedBox(width: 12),
                        const Text(
                          'Join the Waitlist',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
            ),
          ),
          const SizedBox(height: 16),
          Text(
            'Sign up with Google, Apple, or Aptos wallet',
            style: TextStyle(
              fontSize: 13,
              color: Colors.white.withOpacity(0.6),
            ),
            textAlign: TextAlign.center,
          ),
        ],
      );
    }

    // After joining: Show goals to complete
    return Column(
      children: [
        // Connect Strava Button
        _buildActionCard(
          title: 'Connect Strava',
          subtitle: hasConnectedStrava
              ? 'Connected! ✓'
              : 'Sync your activities',
          reward: 'Bonus Feed',
          icon: Icons.directions_run,
          completed: hasConnectedStrava,
          enabled: true,
          onTap: hasConnectedStrava ? null : _connectStrava,
        ),

        const SizedBox(height: 16),

        // Shop 4D Prism Button
        _buildActionCard(
          title: 'Shop 4D Prism',
          subtitle: hasPrism
              ? 'Prism unlocked! ✓'
              : 'Unlock AR magic',
          reward: 'Premium Feed',
          icon: Icons.shopping_bag_outlined,
          completed: hasPrism,
          enabled: true,
          onTap: hasPrism ? null : _shopPrism,
        ),
      ],
    );
  }

  Widget _buildActionCard({
    required String title,
    required String subtitle,
    required String reward,
    required IconData icon,
    required bool completed,
    bool enabled = true,
    VoidCallback? onTap,
  }) {
    return Opacity(
      opacity: enabled ? 1.0 : 0.5,
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(16),
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: completed
                ? [
                    Colors.green.withOpacity(0.3),
                    Colors.green.withOpacity(0.1),
                  ]
                : [
                    Colors.white.withOpacity(0.1),
                    Colors.white.withOpacity(0.05),
                  ],
          ),
          border: Border.all(
            color: completed
                ? Colors.green.withOpacity(0.5)
                : Colors.white.withOpacity(0.2),
            width: 1,
          ),
        ),
        child: Material(
          color: Colors.transparent,
          child: InkWell(
            borderRadius: BorderRadius.circular(16),
            onTap: enabled ? onTap : null,
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Row(
                children: [
                  // Icon
                  Container(
                    width: 50,
                    height: 50,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: completed
                          ? Colors.green.withOpacity(0.3)
                          : Colors.white.withOpacity(0.1),
                    ),
                    child: Icon(
                      icon,
                      color: Colors.white,
                      size: 26,
                    ),
                  ),

                  const SizedBox(width: 16),

                  // Text
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          title,
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          subtitle,
                          style: TextStyle(
                            fontSize: 13,
                            color: Colors.white.withOpacity(0.6),
                          ),
                        ),
                      ],
                    ),
                  ),

                  // Reward badge
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 6,
                    ),
                    decoration: BoxDecoration(
                      color: completed
                          ? Colors.green.withOpacity(0.3)
                          : Colors.amber.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                        color: completed
                            ? Colors.green.withOpacity(0.5)
                            : Colors.amber.withOpacity(0.5),
                        width: 1,
                      ),
                    ),
                    child: Text(
                      reward,
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        color: completed ? Colors.green : Colors.amber,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Future<void> _joinWaitlist() async {
    setState(() {
      isAuthenticating = true;
    });

    try {
      // Show auth options (Google, Apple, or Aptos)
      final authMethod = await _showAuthMethodDialog();

      if (authMethod == null) {
        setState(() {
          isAuthenticating = false;
        });
        return;
      }

      Map<String, dynamic>? result;

      switch (authMethod) {
        case 'google':
          result = await Web3AuthService.signInWithGoogle();
          break;
        case 'apple':
          result = await Web3AuthService.signInWithApple();
          break;
        case 'aptos':
          // Navigate to wallet selection screen
          if (mounted) {
            Navigator.of(context).push(
              MaterialPageRoute(
                builder: (context) => WalletSelectionScreen(),
              ),
            ).then((_) {
              _checkWaitlistStatus();
            });
          }
          setState(() {
            isAuthenticating = false;
          });
          return;
      }

      if (result == null) {
        throw Exception('Sign in canceled or failed');
      }

      // Register with backend
      final response = await http.post(
        Uri.parse('${AppConstants.baseUrl}/api/auth/connect-wallet'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(result),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        userId = data['user']['id'];
        await Web3AuthService.setUserId(userId!);

        setState(() {
          hasJoinedWaitlist = true;
          eggsGranted = 1;
        });

        // Fetch full waitlist status
        await _checkWaitlistStatus();

        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('🎉 Welcome! You\'ve earned 1 free egg!'),
              backgroundColor: Colors.green,
              duration: Duration(seconds: 3),
            ),
          );
        }
      } else {
        throw Exception('Backend registration failed');
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to join waitlist: $e'),
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

  Future<String?> _showAuthMethodDialog() async {
    return showDialog<String>(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: const Color(0xFF1a1a1a),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
        ),
        title: const Text(
          'Choose Sign In Method',
          style: TextStyle(
            color: Colors.white,
            fontSize: 22,
            fontWeight: FontWeight.bold,
          ),
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            _buildAuthOption(
              icon: Icons.mail_outline,
              label: 'Continue with Google',
              onTap: () => Navigator.of(context).pop('google'),
            ),
            const SizedBox(height: 12),
            if (Web3AuthService.isAppleSignInAvailable())
              _buildAuthOption(
                icon: Icons.apple,
                label: 'Continue with Apple',
                onTap: () => Navigator.of(context).pop('apple'),
              ),
            const SizedBox(height: 12),
            _buildAuthOption(
              icon: Icons.account_balance_wallet,
              label: 'Connect Aptos Wallet',
              onTap: () => Navigator.of(context).pop('aptos'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAuthOption({
    required IconData icon,
    required String label,
    required VoidCallback onTap,
  }) {
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: Colors.white.withOpacity(0.2),
          width: 1,
        ),
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(12),
          onTap: onTap,
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Icon(icon, color: Colors.white, size: 24),
                const SizedBox(width: 16),
                Text(
                  label,
                  style: const TextStyle(
                    fontSize: 16,
                    color: Colors.white,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Future<void> _connectStrava() async {
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (context) => const ConnectStravaScreen(),
      ),
    ).then((_) async {
      // Grant reward for connecting Strava
      if (userId != null && !hasConnectedStrava) {
        final response = await WaitlistService.connectStrava(userId!);

        if (response != null && mounted) {
          setState(() {
            hasConnectedStrava = true;
            feedGranted = response.feedGranted;
          });

          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('🎉 ${response.message}'),
              backgroundColor: Colors.green,
              duration: const Duration(seconds: 3),
            ),
          );
        }

        // Refresh status
        await _checkWaitlistStatus();
      }
    });
  }

  void _shopPrism() {
    ShopifyService.showShopDialog(context);
  }

  Future<void> _handleLogout() async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Logout'),
        content: const Text('Are you sure you want to logout? You can always log back in with the same account.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context, true),
            child: const Text('Logout', style: TextStyle(color: Colors.red)),
          ),
        ],
      ),
    );

    if (confirmed == true) {
      await Web3AuthService.logout();
      setState(() {
        hasJoinedWaitlist = false;
        hasConnectedStrava = false;
        hasPrism = false;
        eggsGranted = 0;
        feedGranted = 0;
        waitlistStatus = null;
        userId = null;
      });
    }
  }

  Widget _buildReferralCard() {
    final referralCode = waitlistStatus?.referralCode ?? 'LOADING...';
    final referralCount = waitlistStatus?.referralCount ?? 0;

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(16),
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            Colors.amber.withOpacity(0.3),
            Colors.orange.withOpacity(0.2),
          ],
        ),
        border: Border.all(
          color: Colors.amber.withOpacity(0.5),
          width: 1,
        ),
      ),
      child: Column(
        children: [
          Row(
            children: [
              Icon(Icons.card_giftcard, color: Colors.amber[300], size: 24),
              const SizedBox(width: 8),
              const Text(
                'Invite Friends',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            'Share your code and earn rewards when friends join!',
            style: TextStyle(
              fontSize: 13,
              color: Colors.white.withOpacity(0.7),
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 16),
          // Referral code display
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              color: Colors.black.withOpacity(0.3),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                color: Colors.amber.withOpacity(0.3),
                width: 1,
              ),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  referralCode,
                  style: const TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                    letterSpacing: 2,
                  ),
                ),
                IconButton(
                  onPressed: () async {
                    await Clipboard.setData(ClipboardData(text: referralCode));
                    if (mounted) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: const Text('Referral code copied!'),
                          backgroundColor: Colors.green,
                          duration: const Duration(seconds: 2),
                        ),
                      );
                    }
                  },
                  icon: const Icon(Icons.copy, color: Colors.white, size: 20),
                  padding: EdgeInsets.zero,
                  constraints: const BoxConstraints(),
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),
          // Referral count
          Text(
            '$referralCount friends joined',
            style: TextStyle(
              fontSize: 13,
              color: Colors.amber[300],
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }
}

// Custom painter for animated star field with sparkles
class StarFieldPainter extends CustomPainter {
  final double starAnimation;
  final double sparkleAnimation;
  final math.Random random = math.Random(42); // Fixed seed for consistent stars

  StarFieldPainter(this.starAnimation, this.sparkleAnimation);

  @override
  void paint(Canvas canvas, Size size) {
    // Draw stars
    for (int i = 0; i < 100; i++) {
      final x = (random.nextDouble() * size.width);
      final y = (random.nextDouble() * size.height);
      final starSize = random.nextDouble() * 2 + 0.5;

      // Twinkling effect
      final twinkle = math.sin((starAnimation * math.pi * 2) + (i * 0.1));
      final opacity = 0.3 + (twinkle.abs() * 0.7);

      final paint = Paint()
        ..color = Colors.white.withOpacity(opacity)
        ..style = PaintingStyle.fill;

      canvas.drawCircle(Offset(x, y), starSize, paint);
    }

    // Draw sparkles
    for (int i = 0; i < 15; i++) {
      final x = (random.nextDouble() * size.width);
      final y = (random.nextDouble() * size.height);

      // Sparkle timing
      final sparklePhase = (sparkleAnimation + (i * 0.1)) % 1.0;
      final sparkleOpacity = sparklePhase < 0.5
          ? sparklePhase * 2
          : (1.0 - sparklePhase) * 2;

      if (sparkleOpacity > 0.1) {
        _drawSparkle(canvas, Offset(x, y), sparkleOpacity);
      }
    }
  }

  void _drawSparkle(Canvas canvas, Offset position, double opacity) {
    final paint = Paint()
      ..color = Colors.white.withOpacity(opacity * 0.8)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.5;

    // Draw cross sparkle
    canvas.drawLine(
      Offset(position.dx - 4, position.dy),
      Offset(position.dx + 4, position.dy),
      paint,
    );
    canvas.drawLine(
      Offset(position.dx, position.dy - 4),
      Offset(position.dx, position.dy + 4),
      paint,
    );
  }

  @override
  bool shouldRepaint(StarFieldPainter oldDelegate) {
    return oldDelegate.starAnimation != starAnimation ||
        oldDelegate.sparkleAnimation != sparkleAnimation;
  }
}
