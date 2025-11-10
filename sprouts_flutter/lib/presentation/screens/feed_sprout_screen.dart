import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../../core/constants/app_constants.dart';
import '../../data/services/web3auth_service.dart';

/// Screen for allocating food to Sprout stats (Sleep, Health, Happiness)
class FeedSproutScreen extends StatefulWidget {
  final String sproutId;
  final String sproutName;
  final int currentSleep;
  final int currentHealth;
  final int currentHappiness;

  const FeedSproutScreen({
    Key? key,
    required this.sproutId,
    required this.sproutName,
    required this.currentSleep,
    required this.currentHealth,
    required this.currentHappiness,
  }) : super(key: key);

  @override
  State<FeedSproutScreen> createState() => _FeedSproutScreenState();
}

class _FeedSproutScreenState extends State<FeedSproutScreen> {
  int _foodBalance = 0;
  bool _isLoading = true;
  bool _isFeeding = false;

  // Food allocation amounts
  int _sleepFood = 0;
  int _healthFood = 0;
  int _happinessFood = 0;

  @override
  void initState() {
    super.initState();
    _loadFoodBalance();
  }

  Future<void> _loadFoodBalance() async {
    try {
      final userId = await Web3AuthService.getUserId();
      if (userId == null) return;

      final response = await http.get(
        Uri.parse('${AppConstants.baseUrl}/api/food/$userId'),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        setState(() {
          _foodBalance = data['foodBalance'] ?? 0;
          _isLoading = false;
        });
      }
    } catch (e) {
      print('Error loading food balance: $e');
      setState(() {
        _isLoading = false;
      });
    }
  }

  int get _totalAllocated => _sleepFood + _healthFood + _happinessFood;
  int get _remainingFood => _foodBalance - _totalAllocated;

  Future<void> _feedSprout(String statType, int amount) async {
    if (amount <= 0) return;

    setState(() {
      _isFeeding = true;
    });

    try {
      final userId = await Web3AuthService.getUserId();
      if (userId == null) throw Exception('User not authenticated');

      final response = await http.post(
        Uri.parse('${AppConstants.baseUrl}/api/food/feed'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'userId': userId,
          'sproutId': widget.sproutId,
          'statType': statType,
          'amount': amount,
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);

        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(data['message'] ?? 'Fed successfully!'),
              backgroundColor: const Color(0xFF4CAF50),
            ),
          );
        }

        // Reload balance
        await _loadFoodBalance();

        // Reset allocations
        setState(() {
          _sleepFood = 0;
          _healthFood = 0;
          _happinessFood = 0;
        });
      } else {
        throw Exception('Failed to feed sprout');
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } finally {
      setState(() {
        _isFeeding = false;
      });
    }
  }

  Future<void> _feedAll() async {
    if (_totalAllocated == 0) return;

    setState(() {
      _isFeeding = true;
    });

    try {
      // Feed each stat sequentially
      if (_sleepFood > 0) {
        await _feedSprout('sleep', _sleepFood);
      }
      if (_healthFood > 0) {
        await _feedSprout('health', _healthFood);
      }
      if (_happinessFood > 0) {
        await _feedSprout('happiness', _happinessFood);
      }

      if (mounted) {
        Navigator.of(context).pop(true); // Return true to indicate sprout was fed
      }
    } finally {
      setState(() {
        _isFeeding = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Feed ${widget.sproutName}'),
        backgroundColor: const Color(0xFF1a1a2e),
        elevation: 0,
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : Container(
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    Color(0xFF1a1a2e),
                    Color(0xFF16213e),
                    Color(0xFF0f3460),
                  ],
                ),
              ),
              child: SafeArea(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.all(24),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Food balance card
                      Container(
                        padding: const EdgeInsets.all(20),
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            colors: [
                              const Color(0xFF4CAF50).withOpacity(0.3),
                              const Color(0xFF8BC34A).withOpacity(0.3),
                            ],
                          ),
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(
                            color: const Color(0xFF4CAF50).withOpacity(0.5),
                          ),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  'Food Available',
                                  style: TextStyle(
                                    color: Colors.white70,
                                    fontSize: 14,
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  '$_remainingFood 🍎',
                                  style: const TextStyle(
                                    color: Colors.white,
                                    fontSize: 32,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ],
                            ),
                            if (_totalAllocated > 0)
                              Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 12,
                                  vertical: 6,
                                ),
                                decoration: BoxDecoration(
                                  color: Colors.white.withOpacity(0.2),
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: Text(
                                  '-$_totalAllocated',
                                  style: const TextStyle(
                                    color: Colors.white,
                                    fontSize: 18,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                          ],
                        ),
                      ),

                      const SizedBox(height: 32),

                      // Instructions
                      const Text(
                        'Allocate food to your Sprout\'s stats',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 8),
                      const Text(
                        'Slide to choose how much food to give each stat',
                        style: TextStyle(
                          color: Colors.white70,
                          fontSize: 14,
                        ),
                      ),

                      const SizedBox(height: 24),

                      // Sleep stat
                      _buildStatSlider(
                        icon: '😴',
                        label: 'Sleep',
                        currentValue: widget.currentSleep,
                        foodAmount: _sleepFood,
                        color: const Color(0xFF9C27B0),
                        onChanged: (value) {
                          setState(() {
                            _sleepFood = value.round();
                          });
                        },
                      ),

                      const SizedBox(height: 24),

                      // Health stat
                      _buildStatSlider(
                        icon: '❤️',
                        label: 'Health',
                        currentValue: widget.currentHealth,
                        foodAmount: _healthFood,
                        color: const Color(0xFFF44336),
                        onChanged: (value) {
                          setState(() {
                            _healthFood = value.round();
                          });
                        },
                      ),

                      const SizedBox(height: 24),

                      // Happiness stat
                      _buildStatSlider(
                        icon: '😊',
                        label: 'Happiness',
                        currentValue: widget.currentHappiness,
                        foodAmount: _happinessFood,
                        color: const Color(0xFFFFEB3B),
                        onChanged: (value) {
                          setState(() {
                            _happinessFood = value.round();
                          });
                        },
                      ),

                      const SizedBox(height: 40),

                      // Feed button
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton(
                          onPressed: _isFeeding || _totalAllocated == 0
                              ? null
                              : _feedAll,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF4CAF50),
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(vertical: 16),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                            disabledBackgroundColor: Colors.grey,
                          ),
                          child: _isFeeding
                              ? const SizedBox(
                                  width: 20,
                                  height: 20,
                                  child: CircularProgressIndicator(
                                    strokeWidth: 2,
                                    color: Colors.white,
                                  ),
                                )
                              : Text(
                                  'Feed Sprout ($_totalAllocated food)',
                                  style: const TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                        ),
                      ),

                      const SizedBox(height: 16),

                      // Info text
                      Center(
                        child: Text(
                          'Complete goals to earn more food!',
                          style: TextStyle(
                            color: Colors.white.withOpacity(0.6),
                            fontSize: 14,
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

  Widget _buildStatSlider({
    required String icon,
    required String label,
    required int currentValue,
    required int foodAmount,
    required Color color,
    required ValueChanged<double> onChanged,
  }) {
    final newValue = (currentValue + foodAmount).clamp(0, 100);
    final canIncrease = newValue < 100 && _remainingFood > 0;

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.05),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: color.withOpacity(0.3),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header
          Row(
            children: [
              Text(
                icon,
                style: const TextStyle(fontSize: 32),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      label,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      '$currentValue → $newValue / 100',
                      style: TextStyle(
                        color: color,
                        fontSize: 14,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ),
              if (foodAmount > 0)
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 12,
                    vertical: 6,
                  ),
                  decoration: BoxDecoration(
                    color: color.withOpacity(0.3),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    '+$foodAmount 🍎',
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
            ],
          ),

          const SizedBox(height: 16),

          // Progress bar showing current value
          Stack(
            children: [
              Container(
                height: 8,
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(4),
                ),
              ),
              FractionallySizedBox(
                widthFactor: currentValue / 100,
                child: Container(
                  height: 8,
                  decoration: BoxDecoration(
                    color: color.withOpacity(0.5),
                    borderRadius: BorderRadius.circular(4),
                  ),
                ),
              ),
              FractionallySizedBox(
                widthFactor: newValue / 100,
                child: Container(
                  height: 8,
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [color.withOpacity(0.8), color],
                    ),
                    borderRadius: BorderRadius.circular(4),
                  ),
                ),
              ),
            ],
          ),

          const SizedBox(height: 16),

          // Slider
          SliderTheme(
            data: SliderThemeData(
              activeTrackColor: color,
              inactiveTrackColor: Colors.white.withOpacity(0.1),
              thumbColor: color,
              overlayColor: color.withOpacity(0.3),
              trackHeight: 6,
            ),
            child: Slider(
              value: foodAmount.toDouble(),
              min: 0,
              max: canIncrease ? _remainingFood.toDouble() + foodAmount : foodAmount.toDouble(),
              divisions: canIncrease ? (_remainingFood + foodAmount) : (foodAmount > 0 ? foodAmount : 1),
              label: '$foodAmount food',
              onChanged: canIncrease || foodAmount > 0 ? onChanged : null,
            ),
          ),
        ],
      ),
    );
  }
}
