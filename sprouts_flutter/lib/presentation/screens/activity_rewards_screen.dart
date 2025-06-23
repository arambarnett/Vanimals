import 'dart:math';
import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../../data/models/vanimal_model.dart';

class ActivityRewardsScreen extends StatefulWidget {
  final Map<String, dynamic> activity;
  final List<VanimalModel> userVanimals;
  final VoidCallback onRewardsClaimed;

  const ActivityRewardsScreen({
    super.key,
    required this.activity,
    required this.userVanimals,
    required this.onRewardsClaimed,
  });

  @override
  State<ActivityRewardsScreen> createState() => _ActivityRewardsScreenState();
}

class _ActivityRewardsScreenState extends State<ActivityRewardsScreen>
    with TickerProviderStateMixin {
  late AnimationController _sparkleController;
  late Animation<double> _sparkleAnimation;
  
  String selectedRewardType = 'currency'; // 'currency' or 'xp'
  VanimalModel? selectedVanimal;
  int calculatedCoins = 0;
  int calculatedXP = 0;
  bool isClaimingRewards = false;

  @override
  void initState() {
    super.initState();
    
    _sparkleController = AnimationController(
      duration: const Duration(milliseconds: 2000),
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
    _calculateRewards();
  }

  @override
  void dispose() {
    _sparkleController.dispose();
    super.dispose();
  }

  void _calculateRewards() {
    final distance = widget.activity['distance'] / 1000; // Convert to km
    final duration = widget.activity['moving_time'] / 60; // Convert to minutes
    final elevation = widget.activity['total_elevation_gain'];
    final type = widget.activity['type'];

    // Base rewards calculation
    int baseCoins = (distance * 10).round(); // 10 coins per km
    int baseXP = (distance * 15).round(); // 15 XP per km

    // Type multipliers
    double typeMultiplier = 1.0;
    switch (type.toLowerCase()) {
      case 'run':
        typeMultiplier = 1.2;
        break;
      case 'ride':
        typeMultiplier = 1.0;
        break;
      case 'hike':
        typeMultiplier = 1.5;
        break;
      case 'walk':
        typeMultiplier = 0.8;
        break;
    }

    // Elevation bonus
    double elevationBonus = 1.0 + (elevation / 1000); // +1% per 10m elevation

    // Duration bonus (for longer activities)
    double durationBonus = 1.0;
    if (duration > 60) {
      durationBonus = 1.1; // 10% bonus for activities over 1 hour
    }
    if (duration > 120) {
      durationBonus = 1.2; // 20% bonus for activities over 2 hours
    }

    calculatedCoins = (baseCoins * typeMultiplier * elevationBonus * durationBonus).round();
    calculatedXP = (baseXP * typeMultiplier * elevationBonus * durationBonus).round();

    // Minimum rewards
    calculatedCoins = calculatedCoins.clamp(5, 1000);
    calculatedXP = calculatedXP.clamp(10, 1500);
  }

  Future<void> _claimRewards() async {
    if (selectedRewardType == 'xp' && selectedVanimal == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please select a Sprout to level up'),
          backgroundColor: Colors.orange,
        ),
      );
      return;
    }

    setState(() => isClaimingRewards = true);

    // Simulate claiming rewards
    await Future.delayed(const Duration(seconds: 2));

    if (mounted) {
      String message;
      if (selectedRewardType == 'currency') {
        message = 'Earned $calculatedCoins coins!';
      } else {
        message = '${selectedVanimal!.name} gained $calculatedXP XP!';
      }

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(message),
          backgroundColor: Colors.green,
          duration: const Duration(seconds: 3),
        ),
      );

      widget.onRewardsClaimed();
      Navigator.of(context).pop();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Claim Rewards'),
        backgroundColor: AppTheme.vanimalPurple,
        foregroundColor: Colors.white,
        elevation: 0,
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
          child: Stack(
            children: [
              // Sparkle effect
              _buildSparkleEffect(),
              
              // Main content
              SingleChildScrollView(
                padding: const EdgeInsets.all(16),
                child: Column(
                  children: [
                    // Activity Summary
                    _buildActivitySummary(),
                    
                    const SizedBox(height: 20),
                    
                    // Rewards Calculation
                    _buildRewardsCalculation(),
                    
                    const SizedBox(height: 20),
                    
                    // Reward Type Selection
                    _buildRewardTypeSelection(),
                    
                    const SizedBox(height: 20),
                    
                    // Vanimal Selection (if XP chosen)
                    if (selectedRewardType == 'xp') _buildVanimalSelection(),
                    
                    const SizedBox(height: 30),
                    
                    // Claim Button
                    _buildClaimButton(),
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
          children: List.generate(15, (index) {
            final random = (index * 137.5) % 360;
            final radius = 50 + (index * 15) % 150;
            final angle = random + (_sparkleAnimation.value * 360);
            
            final x = MediaQuery.of(context).size.width / 2 + 
                     radius * 0.3 * cos(angle * pi / 180);
            final y = MediaQuery.of(context).size.height / 2 + 
                     radius * 0.3 * sin(angle * pi / 180);
            
            return Positioned(
              left: x,
              top: y,
              child: Opacity(
                opacity: (0.2 + (index % 3) * 0.2) * _sparkleAnimation.value,
                child: Icon(
                  Icons.star,
                  color: [Colors.amber, AppTheme.vanimalPink, Colors.yellow][index % 3],
                  size: 8 + (index % 3) * 3,
                ),
              ),
            );
          }),
        );
      },
    );
  }

  Widget _buildActivitySummary() {
    final distance = (widget.activity['distance'] / 1000).toStringAsFixed(1);
    final duration = _formatDuration(widget.activity['moving_time']);
    
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            const Color(0xFFFC4C02).withOpacity(0.8),
            AppTheme.vanimalPurple.withOpacity(0.8),
          ],
        ),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(
                  _getActivityIcon(widget.activity['type']),
                  color: Colors.white,
                  size: 24,
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      widget.activity['name'],
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    Text(
                      widget.activity['type'].toUpperCase(),
                      style: const TextStyle(color: Colors.white70, fontSize: 12),
                    ),
                  ],
                ),
              ),
            ],
          ),
          
          const SizedBox(height: 16),
          
          Row(
            children: [
              Expanded(
                child: _buildStatCard('Distance', '${distance}km', Icons.straighten),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildStatCard('Duration', duration, Icons.timer),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildStatCard(
                  'Elevation',
                  '${widget.activity['total_elevation_gain'].round()}m',
                  Icons.terrain,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildStatCard(String label, String value, IconData icon) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.1),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Column(
        children: [
          Icon(icon, color: Colors.white, size: 20),
          const SizedBox(height: 4),
          Text(
            value,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 14,
              fontWeight: FontWeight.bold,
            ),
          ),
          Text(
            label,
            style: const TextStyle(color: Colors.white70, fontSize: 10),
          ),
        ],
      ),
    );
  }

  Widget _buildRewardsCalculation() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.black.withOpacity(0.8),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            children: [
              Icon(Icons.calculate, color: Colors.amber, size: 24),
              SizedBox(width: 12),
              Text(
                'Rewards Calculated',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          
          Row(
            children: [
              Expanded(
                child: Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.amber.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: Colors.amber.withOpacity(0.5)),
                  ),
                  child: Column(
                    children: [
                      const Icon(Icons.monetization_on, color: Colors.amber, size: 32),
                      const SizedBox(height: 8),
                      Text(
                        calculatedCoins.toString(),
                        style: const TextStyle(
                          color: Colors.amber,
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const Text(
                        'Coins',
                        style: TextStyle(color: Colors.white70, fontSize: 12),
                      ),
                    ],
                  ),
                ),
              ),
              
              const SizedBox(width: 16),
              
              const Text(
                'OR',
                style: TextStyle(
                  color: Colors.white70,
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
              
              const SizedBox(width: 16),
              
              Expanded(
                child: Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: AppTheme.vanimalPink.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: AppTheme.vanimalPink.withOpacity(0.5)),
                  ),
                  child: Column(
                    children: [
                      const Icon(Icons.star, color: AppTheme.vanimalPink, size: 32),
                      const SizedBox(height: 8),
                      Text(
                        calculatedXP.toString(),
                        style: const TextStyle(
                          color: AppTheme.vanimalPink,
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const Text(
                        'XP',
                        style: TextStyle(color: Colors.white70, fontSize: 12),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
          
          const SizedBox(height: 16),
          
          const Text(
            'Choose your reward type below. Coins can be used for breeding and purchases, while XP will level up your selected Sprout.',
            style: TextStyle(color: Colors.white70, fontSize: 12),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildRewardTypeSelection() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.black.withOpacity(0.8),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Choose Your Reward',
            style: TextStyle(
              color: Colors.white,
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),
          
          Row(
            children: [
              Expanded(
                child: GestureDetector(
                  onTap: () {
                    setState(() {
                      selectedRewardType = 'currency';
                      selectedVanimal = null;
                    });
                  },
                  child: Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: selectedRewardType == 'currency'
                          ? Colors.amber.withOpacity(0.3)
                          : Colors.white.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                        color: selectedRewardType == 'currency'
                            ? Colors.amber
                            : Colors.white.withOpacity(0.3),
                        width: 2,
                      ),
                    ),
                    child: Column(
                      children: [
                        Icon(
                          Icons.monetization_on,
                          color: selectedRewardType == 'currency' ? Colors.amber : Colors.white70,
                          size: 32,
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Get Coins',
                          style: TextStyle(
                            color: selectedRewardType == 'currency' ? Colors.amber : Colors.white70,
                            fontSize: 14,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          '$calculatedCoins coins',
                          style: TextStyle(
                            color: selectedRewardType == 'currency' ? Colors.amber : Colors.white70,
                            fontSize: 12,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              
              const SizedBox(width: 16),
              
              Expanded(
                child: GestureDetector(
                  onTap: () {
                    setState(() {
                      selectedRewardType = 'xp';
                    });
                  },
                  child: Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: selectedRewardType == 'xp'
                          ? AppTheme.vanimalPink.withOpacity(0.3)
                          : Colors.white.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                        color: selectedRewardType == 'xp'
                            ? AppTheme.vanimalPink
                            : Colors.white.withOpacity(0.3),
                        width: 2,
                      ),
                    ),
                    child: Column(
                      children: [
                        Icon(
                          Icons.star,
                          color: selectedRewardType == 'xp' ? AppTheme.vanimalPink : Colors.white70,
                          size: 32,
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Level Up Sprout',
                          style: TextStyle(
                            color: selectedRewardType == 'xp' ? AppTheme.vanimalPink : Colors.white70,
                            fontSize: 14,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          '$calculatedXP XP',
                          style: TextStyle(
                            color: selectedRewardType == 'xp' ? AppTheme.vanimalPink : Colors.white70,
                            fontSize: 12,
                          ),
                        ),
                      ],
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

  Widget _buildVanimalSelection() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppTheme.vanimalPink.withOpacity(0.2),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppTheme.vanimalPink.withOpacity(0.5)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Select Sprout to Level Up',
            style: TextStyle(
              color: Colors.white,
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),
          
          SizedBox(
            height: 120,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              itemCount: widget.userVanimals.length,
              itemBuilder: (context, index) {
                final vanimal = widget.userVanimals[index];
                final isSelected = selectedVanimal?.id == vanimal.id;
                
                return GestureDetector(
                  onTap: () {
                    setState(() {
                      selectedVanimal = vanimal;
                    });
                  },
                  child: Container(
                    width: 100,
                    margin: const EdgeInsets.only(right: 12),
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: isSelected
                          ? AppTheme.vanimalPink.withOpacity(0.3)
                          : Colors.white.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                        color: isSelected ? AppTheme.vanimalPink : Colors.white.withOpacity(0.3),
                        width: 2,
                      ),
                    ),
                    child: Column(
                      children: [
                        Container(
                          width: 40,
                          height: 40,
                          decoration: BoxDecoration(
                            color: AppTheme.vanimalPurple,
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(Icons.pets, color: Colors.white, size: 20),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          vanimal.name,
                          style: TextStyle(
                            color: isSelected ? AppTheme.vanimalPink : Colors.white,
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                          ),
                          textAlign: TextAlign.center,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                        Text(
                          'Lv.${vanimal.state.level}',
                          style: TextStyle(
                            color: isSelected ? AppTheme.vanimalPink : Colors.white70,
                            fontSize: 10,
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildClaimButton() {
    final canClaim = selectedRewardType == 'currency' || 
                    (selectedRewardType == 'xp' && selectedVanimal != null);
    
    return SizedBox(
      width: double.infinity,
      child: ElevatedButton(
        onPressed: canClaim && !isClaimingRewards ? _claimRewards : null,
        style: ElevatedButton.styleFrom(
          backgroundColor: canClaim ? AppTheme.vanimalPink : Colors.grey,
          foregroundColor: Colors.white,
          padding: const EdgeInsets.symmetric(vertical: 16),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
        ),
        child: isClaimingRewards
            ? const Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  SizedBox(
                    width: 20,
                    height: 20,
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      color: Colors.white,
                    ),
                  ),
                  SizedBox(width: 12),
                  Text('Claiming Rewards...'),
                ],
              )
            : Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.card_giftcard, size: 20),
                  const SizedBox(width: 8),
                  Text(
                    selectedRewardType == 'currency'
                        ? 'Claim $calculatedCoins Coins'
                        : selectedVanimal != null
                            ? 'Give ${selectedVanimal!.name} $calculatedXP XP'
                            : 'Select a Sprout',
                    style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                ],
              ),
      ),
    );
  }

  IconData _getActivityIcon(String type) {
    switch (type.toLowerCase()) {
      case 'run':
        return Icons.directions_run;
      case 'ride':
        return Icons.directions_bike;
      case 'hike':
        return Icons.hiking;
      case 'walk':
        return Icons.directions_walk;
      default:
        return Icons.fitness_center;
    }
  }

  String _formatDuration(int seconds) {
    final hours = seconds ~/ 3600;
    final minutes = (seconds % 3600) ~/ 60;
    
    if (hours > 0) {
      return '${hours}h ${minutes}m';
    } else {
      return '${minutes}m';
    }
  }
}