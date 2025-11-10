import 'package:flutter/material.dart';
import 'dart:math' as math;
import '../theme/app_theme.dart';
import 'hatching_screen.dart';
import 'egg_shop_screen.dart';

class HatchNowScreen extends StatefulWidget {
  final int eggsAvailable;
  final int feedAvailable;

  const HatchNowScreen({
    super.key,
    this.eggsAvailable = 1,
    this.feedAvailable = 0,
  });

  @override
  State<HatchNowScreen> createState() => _HatchNowScreenState();
}

class _HatchNowScreenState extends State<HatchNowScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _glowController;

  @override
  void initState() {
    super.initState();
    _glowController = AnimationController(
      duration: const Duration(seconds: 2),
      vsync: this,
    )..repeat(reverse: true);
  }

  @override
  void dispose() {
    _glowController.dispose();
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
        child: SafeArea(
          child: SingleChildScrollView(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Column(
                children: [
                  const SizedBox(height: 60),
                  _buildHeader(),
                  const SizedBox(height: 40),
                  _buildEggDisplay(),
                  const SizedBox(height: 40),
                  _buildRewardsSummary(),
                  const SizedBox(height: 40),
                  _buildActionButtons(),
                  const SizedBox(height: 40),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Column(
      children: [
        Text(
          '🎉',
          style: TextStyle(
            fontSize: 60,
            shadows: [
              Shadow(
                color: Colors.amber.withOpacity(0.5),
                blurRadius: 20,
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),
        Text(
          'Hatch Day is Here!',
          style: TextStyle(
            fontSize: 32,
            fontWeight: FontWeight.bold,
            color: Colors.white,
            letterSpacing: 2,
            shadows: [
              Shadow(
                color: Colors.white.withOpacity(0.5),
                blurRadius: 10,
              ),
            ],
          ),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 12),
        Text(
          'Your Sprouts are ready to hatch',
          style: TextStyle(
            fontSize: 16,
            color: Colors.white.withOpacity(0.7),
          ),
          textAlign: TextAlign.center,
        ),
      ],
    );
  }

  Widget _buildEggDisplay() {
    return AnimatedBuilder(
      animation: _glowController,
      builder: (context, child) {
        return Container(
          padding: const EdgeInsets.all(40),
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            boxShadow: [
              BoxShadow(
                color: Colors.white.withOpacity(0.2 + (_glowController.value * 0.3)),
                blurRadius: 40 + (_glowController.value * 20),
                spreadRadius: 10 + (_glowController.value * 10),
              ),
              BoxShadow(
                color: Colors.purple.withOpacity(0.2),
                blurRadius: 60,
                spreadRadius: 20,
              ),
            ],
          ),
          child: Text(
            '🥚',
            style: TextStyle(
              fontSize: 120,
              shadows: [
                Shadow(
                  color: Colors.white.withOpacity(0.5),
                  blurRadius: 20,
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildRewardsSummary() {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: Colors.white.withOpacity(0.2),
          width: 1,
        ),
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            Colors.white.withOpacity(0.1),
            Colors.white.withOpacity(0.05),
          ],
        ),
      ),
      child: Column(
        children: [
          Text(
            'Your Rewards',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: Colors.white,
              letterSpacing: 1,
            ),
          ),
          const SizedBox(height: 20),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              _buildRewardItem(
                icon: '🥚',
                label: 'Eggs',
                value: widget.eggsAvailable.toString(),
                color: Colors.blue,
              ),
              Container(
                width: 1,
                height: 40,
                color: Colors.white.withOpacity(0.2),
              ),
              _buildRewardItem(
                icon: '🌾',
                label: 'Feed',
                value: widget.feedAvailable.toString(),
                color: Colors.amber,
              ),
            ],
          ),
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
            fontSize: 24,
            fontWeight: FontWeight.bold,
            color: color,
          ),
        ),
        Text(
          label,
          style: TextStyle(
            fontSize: 14,
            color: Colors.white.withOpacity(0.6),
          ),
        ),
      ],
    );
  }

  Widget _buildActionButtons() {
    return Column(
      children: [
        // Hatch Now Button
        SizedBox(
          width: double.infinity,
          child: ElevatedButton(
            onPressed: _hatchNow,
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
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(Icons.egg_outlined, size: 24),
                const SizedBox(width: 12),
                const Text(
                  'Hatch Your Egg Now',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          ),
        ),

        const SizedBox(height: 16),

        // Get More Eggs Button
        SizedBox(
          width: double.infinity,
          child: OutlinedButton(
            onPressed: _getMoreEggs,
            style: OutlinedButton.styleFrom(
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(vertical: 20),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
              ),
              side: BorderSide(
                color: Colors.white.withOpacity(0.3),
                width: 1,
              ),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(Icons.shopping_bag_outlined, size: 24),
                const SizedBox(width: 12),
                const Text(
                  'Get More Eggs',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  void _hatchNow() {
    // Create a basic egg type for hatching
    final eggType = EggType(
      name: 'Starter Egg',
      description: 'Your first Sprout egg',
      price: 0,
      rarity: 'Common',
      color: Colors.blue,
      imagePath: 'assets/images/icons/spawn-icon-color.png',
      hatchChances: {
        'Pigeon': 60,
        'Urban Bird': 30,
        'City Cat': 10,
      },
    );

    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (context) => HatchingScreen(eggType: eggType),
      ),
    );
  }

  void _getMoreEggs() {
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (context) => const EggShopScreen(),
      ),
    );
  }
}
