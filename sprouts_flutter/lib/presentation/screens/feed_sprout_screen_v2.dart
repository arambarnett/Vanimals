import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../../core/constants/app_constants.dart';
import '../../data/services/web3auth_service.dart';

/// Enhanced feed screen with tap-to-allocate interaction
/// Shows Rest, Water, and Food stats with Mood indicator
class FeedSproutScreenV2 extends StatefulWidget {
  final String sproutId;
  final String sproutName;
  final int currentRest;
  final int currentWater;
  final int currentFood;
  final String currentMood;

  const FeedSproutScreenV2({
    Key? key,
    required this.sproutId,
    required this.sproutName,
    required this.currentRest,
    required this.currentWater,
    required this.currentFood,
    required this.currentMood,
  }) : super(key: key);

  @override
  State<FeedSproutScreenV2> createState() => _FeedSproutScreenV2State();
}

class _FeedSproutScreenV2State extends State<FeedSproutScreenV2> {
  int _foodBalance = 0;
  bool _isLoading = true;
  bool _isFeeding = false;

  // Allocated amounts for each stat
  int _restFood = 0;
  int _waterFood = 0;
  int _foodFood = 0;

  String? _selectedStat; // Track which stat user is currently allocating to

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

  int get _totalAllocated => _restFood + _waterFood + _foodFood;
  int get _remainingFood => _foodBalance - _totalAllocated;

  // Tap to increment stat allocation
  void _onStatTap(String statType) {
    if (_remainingFood <= 0) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('No food remaining!'),
          backgroundColor: Colors.red,
          duration: Duration(seconds: 1),
        ),
      );
      return;
    }

    // Check if stat is already at max
    int currentValue = 0;
    int allocated = 0;

    switch (statType) {
      case 'rest':
        currentValue = widget.currentRest;
        allocated = _restFood;
        break;
      case 'water':
        currentValue = widget.currentWater;
        allocated = _waterFood;
        break;
      case 'food':
        currentValue = widget.currentFood;
        allocated = _foodFood;
        break;
    }

    if (currentValue + allocated >= 100) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('${statType.toUpperCase()} is already at maximum!'),
          backgroundColor: Colors.orange,
          duration: const Duration(seconds: 1),
        ),
      );
      return;
    }

    setState(() {
      _selectedStat = statType;
      switch (statType) {
        case 'rest':
          _restFood++;
          break;
        case 'water':
          _waterFood++;
          break;
        case 'food':
          _foodFood++;
          break;
      }
    });
  }

  // Long press to decrement
  void _onStatLongPress(String statType) {
    setState(() {
      switch (statType) {
        case 'rest':
          if (_restFood > 0) _restFood--;
          break;
        case 'water':
          if (_waterFood > 0) _waterFood--;
          break;
        case 'food':
          if (_foodFood > 0) _foodFood--;
          break;
      }
    });
  }

  Future<void> _feedSprout(String statType, int amount) async {
    if (amount <= 0) return;

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

      if (response.statusCode != 200) {
        throw Exception('Failed to feed sprout');
      }
    } catch (e) {
      print('Error feeding: $e');
      rethrow;
    }
  }

  Future<void> _confirmAndFeed() async {
    if (_totalAllocated == 0) return;

    setState(() {
      _isFeeding = true;
    });

    try {
      // Feed each stat sequentially
      if (_restFood > 0) await _feedSprout('rest', _restFood);
      if (_waterFood > 0) await _feedSprout('water', _waterFood);
      if (_foodFood > 0) await _feedSprout('food', _foodFood);

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Sprout fed successfully! 🌱'),
            backgroundColor: Color(0xFF4CAF50),
          ),
        );
        Navigator.of(context).pop(true);
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
      if (mounted) {
        setState(() {
          _isFeeding = false;
        });
      }
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
                        child: Column(
                          children: [
                            Row(
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
                            const SizedBox(height: 12),
                            Text(
                              'Balance: $_foodBalance total',
                              style: TextStyle(
                                color: Colors.white.withOpacity(0.6),
                                fontSize: 12,
                              ),
                            ),
                          ],
                        ),
                      ),

                      const SizedBox(height: 32),

                      // Mood indicator
                      _buildMoodIndicator(),

                      const SizedBox(height: 24),

                      // Instructions
                      const Text(
                        'Tap to allocate food',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Tap each stat to add food • Hold to remove',
                        style: TextStyle(
                          color: Colors.white.withOpacity(0.7),
                          fontSize: 14,
                        ),
                      ),

                      const SizedBox(height: 24),

                      // Rest stat
                      _buildTapStat(
                        icon: '😴',
                        label: 'Rest',
                        statType: 'rest',
                        currentValue: widget.currentRest,
                        allocated: _restFood,
                        color: const Color(0xFF9C27B0),
                      ),

                      const SizedBox(height: 16),

                      // Water stat
                      _buildTapStat(
                        icon: '💧',
                        label: 'Water',
                        statType: 'water',
                        currentValue: widget.currentWater,
                        allocated: _waterFood,
                        color: const Color(0xFF2196F3),
                      ),

                      const SizedBox(height: 16),

                      // Food stat
                      _buildTapStat(
                        icon: '🍎',
                        label: 'Food',
                        statType: 'food',
                        currentValue: widget.currentFood,
                        allocated: _foodFood,
                        color: const Color(0xFFF44336),
                      ),

                      const SizedBox(height: 40),

                      // Feed button
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton(
                          onPressed: _isFeeding || _totalAllocated == 0
                              ? null
                              : _confirmAndFeed,
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

  Widget _buildMoodIndicator() {
    // Mood emoji and color
    String moodEmoji;
    Color moodColor;
    String moodText;

    switch (widget.currentMood) {
      case 'happy':
        moodEmoji = '😄';
        moodColor = const Color(0xFF4CAF50);
        moodText = 'Happy';
        break;
      case 'content':
        moodEmoji = '😊';
        moodColor = const Color(0xFF8BC34A);
        moodText = 'Content';
        break;
      case 'neutral':
        moodEmoji = '😐';
        moodColor = const Color(0xFFFFEB3B);
        moodText = 'Neutral';
        break;
      case 'sad':
        moodEmoji = '😢';
        moodColor = const Color(0xFFFF9800);
        moodText = 'Sad';
        break;
      case 'distressed':
        moodEmoji = '😰';
        moodColor = const Color(0xFFF44336);
        moodText = 'Distressed';
        break;
      default:
        moodEmoji = '😊';
        moodColor = const Color(0xFF4CAF50);
        moodText = 'Happy';
    }

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: moodColor.withOpacity(0.2),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: moodColor.withOpacity(0.5),
        ),
      ),
      child: Row(
        children: [
          Text(
            moodEmoji,
            style: const TextStyle(fontSize: 48),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Current Mood',
                  style: TextStyle(
                    color: Colors.white70,
                    fontSize: 12,
                  ),
                ),
                Text(
                  moodText,
                  style: TextStyle(
                    color: moodColor,
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTapStat({
    required String icon,
    required String label,
    required String statType,
    required int currentValue,
    required int allocated,
    required Color color,
  }) {
    final newValue = (currentValue + allocated).clamp(0, 100);
    final isSelected = _selectedStat == statType;

    return GestureDetector(
      onTap: () => _onStatTap(statType),
      onLongPress: () => _onStatLongPress(statType),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: isSelected
              ? color.withOpacity(0.2)
              : Colors.white.withOpacity(0.05),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: isSelected ? color : color.withOpacity(0.3),
            width: isSelected ? 2 : 1,
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
                if (allocated > 0)
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
                      '+$allocated 🍎',
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

            // Progress bar
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
          ],
        ),
      ),
    );
  }
}
