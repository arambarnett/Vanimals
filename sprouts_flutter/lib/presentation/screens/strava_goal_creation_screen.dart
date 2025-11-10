import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../../core/constants/app_constants.dart';
import '../../data/services/web3auth_service.dart';
import '../theme/app_theme.dart';
import 'collection_screen.dart';
import 'connect_strava_screen.dart';

/// Screen for creating fitness goals based on actual Strava data
/// Flow: Check Strava → Fetch stats → Show personalized suggestions → Create goal
class StravaGoalCreationScreen extends StatefulWidget {
  const StravaGoalCreationScreen({super.key});

  @override
  State<StravaGoalCreationScreen> createState() => _StravaGoalCreationScreenState();
}

class _StravaGoalCreationScreenState extends State<StravaGoalCreationScreen> {
  bool _isLoading = true;
  bool _isStravaConnected = false;
  bool _isCreatingGoal = false;

  Map<String, dynamic>? _athleteStats;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _checkStravaAndLoadStats();
  }

  Future<void> _checkStravaAndLoadStats() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final userId = await Web3AuthService.getUserId();
      if (userId == null) {
        throw Exception('No authenticated user found');
      }

      // Fetch athlete stats and goal suggestions
      final response = await http.get(
        Uri.parse('${AppConstants.baseUrl}/api/strava/athlete-stats/$userId'),
      );

      if (response.statusCode == 200) {
        setState(() {
          _athleteStats = jsonDecode(response.body);
          _isStravaConnected = true;
          _isLoading = false;
        });
      } else if (response.statusCode == 404) {
        // Strava not connected
        setState(() {
          _isStravaConnected = false;
          _isLoading = false;
        });
      } else {
        throw Exception('Failed to load athlete stats');
      }
    } catch (e) {
      setState(() {
        _errorMessage = e.toString();
        _isStravaConnected = false;
        _isLoading = false;
      });
    }
  }

  Future<void> _createGoal({
    required String title,
    required String description,
    required String category,
    required String subcategory,
    required double targetValue,
    required String unit,
    required String frequency,
    required int foodReward,
  }) async {
    setState(() {
      _isCreatingGoal = true;
    });

    try {
      final userId = await Web3AuthService.getUserId();
      if (userId == null) {
        throw Exception('No authenticated user found');
      }

      final response = await http.post(
        Uri.parse('${AppConstants.baseUrl}/api/goals'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'userId': userId,
          'title': title,
          'description': description,
          'type': 'fitness',
          'category': category,
          'subcategory': subcategory,
          'targetValue': targetValue,
          'unit': unit,
          'frequency': frequency,
          'foodReward': foodReward,
        }),
      );

      if (response.statusCode == 201) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Goal created! Your Sprout is ready to grow!'),
              backgroundColor: Color(0xFF4CAF50),
            ),
          );

          // Navigate to collection
          Navigator.of(context).pushAndRemoveUntil(
            MaterialPageRoute(builder: (context) => const CollectionScreen()),
            (route) => false,
          );
        }
      } else {
        throw Exception('Failed to create goal');
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
          _isCreatingGoal = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
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
            children: [
              // Header
              Padding(
                padding: const EdgeInsets.all(20),
                child: Row(
                  children: [
                    IconButton(
                      icon: const Icon(Icons.arrow_back, color: Colors.white),
                      onPressed: () => Navigator.of(context).pop(),
                    ),
                    Expanded(
                      child: Text(
                        'Create Fitness Goal',
                        style: AppTheme.headlineMedium,
                        textAlign: TextAlign.center,
                      ),
                    ),
                    const SizedBox(width: 48),
                  ],
                ),
              ),

              // Content
              Expanded(
                child: _isLoading
                    ? const Center(
                        child: CircularProgressIndicator(color: Color(0xFFFC4C02)),
                      )
                    : !_isStravaConnected
                        ? _buildConnectStravaView()
                        : _buildGoalSuggestionsView(),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildConnectStravaView() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 120,
              height: 120,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: LinearGradient(
                  colors: [
                    const Color(0xFFFC4C02).withOpacity(0.3),
                    const Color(0xFFFC4C02).withOpacity(0.1),
                  ],
                ),
                border: Border.all(
                  color: const Color(0xFFFC4C02),
                  width: 2,
                ),
              ),
              child: const Icon(
                Icons.directions_run,
                size: 60,
                color: Color(0xFFFC4C02),
              ),
            ),
            const SizedBox(height: 32),
            const Text(
              'Connect Strava First',
              style: TextStyle(
                color: Colors.white,
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 16),
            Text(
              'To create personalized fitness goals based on your activity history, connect your Strava account.',
              style: TextStyle(
                color: Colors.white.withOpacity(0.7),
                fontSize: 16,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 32),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: () async {
                  await Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (context) => const ConnectStravaScreen(),
                    ),
                  );
                  // Recheck after returning
                  _checkStravaAndLoadStats();
                },
                icon: const Icon(Icons.link, size: 20),
                label: const Text(
                  'Connect Strava',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
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
            if (_errorMessage != null) ...[
              const SizedBox(height: 24),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.red.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: Colors.red.withOpacity(0.5)),
                ),
                child: Text(
                  _errorMessage!,
                  style: const TextStyle(color: Colors.red, fontSize: 12),
                  textAlign: TextAlign.center,
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildGoalSuggestionsView() {
    if (_athleteStats == null) {
      return const Center(
        child: Text(
          'No data available',
          style: TextStyle(color: Colors.white),
        ),
      );
    }

    final athlete = _athleteStats!['athlete'];
    final goalSuggestions = _athleteStats!['goalSuggestions'] as List<dynamic>;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Athlete info
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  const Color(0xFFFC4C02).withOpacity(0.3),
                  const Color(0xFFFC4C02).withOpacity(0.1),
                ],
              ),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: const Color(0xFFFC4C02).withOpacity(0.5),
              ),
            ),
            child: Row(
              children: [
                const Icon(
                  Icons.check_circle,
                  color: Color(0xFFFC4C02),
                  size: 32,
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Strava Connected',
                        style: TextStyle(
                          color: Color(0xFFFC4C02),
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        athlete['name'],
                        style: TextStyle(
                          color: Colors.white.withOpacity(0.9),
                          fontSize: 14,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          // Instructions
          const Text(
            'Choose a goal based on your activity',
            style: TextStyle(
              color: Colors.white,
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'These goals are personalized based on your recent Strava activities',
            style: TextStyle(
              color: Colors.white.withOpacity(0.7),
              fontSize: 14,
            ),
          ),
          const SizedBox(height: 24),

          // Goal suggestions by category
          ...goalSuggestions.map((suggestionGroup) {
            return _buildSuggestionGroup(suggestionGroup);
          }),
        ],
      ),
    );
  }

  Widget _buildSuggestionGroup(Map<String, dynamic> suggestionGroup) {
    final category = suggestionGroup['category'] as String;
    final title = suggestionGroup['title'] as String;
    final icon = suggestionGroup['icon'] as String;
    final suggestions = suggestionGroup['suggestions'] as List<dynamic>;
    final recentStats = suggestionGroup['recentStats'];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Category header with stats
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white.withOpacity(0.05),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Text(
                    icon,
                    style: const TextStyle(fontSize: 32),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      title,
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
              // Recent stats
              Wrap(
                spacing: 16,
                runSpacing: 8,
                children: [
                  _buildStatChip(
                    'Last 30 Days',
                    '${recentStats['last30Days']['count']} activities',
                  ),
                  if (recentStats['last30Days']['distance'] != '0')
                    _buildStatChip(
                      'Distance',
                      '${recentStats['last30Days']['distance']} mi',
                    ),
                  if (recentStats['last30Days']['time'] != '0')
                    _buildStatChip(
                      'Time',
                      '${recentStats['last30Days']['time']} min',
                    ),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 12),

        // Goal suggestions
        ...suggestions.map((suggestion) {
          return _buildGoalSuggestionCard(
            category: category,
            suggestion: suggestion,
          );
        }),
        const SizedBox(height: 24),
      ],
    );
  }

  Widget _buildStatChip(String label, String value) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.1),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            '$label: ',
            style: TextStyle(
              color: Colors.white.withOpacity(0.6),
              fontSize: 12,
            ),
          ),
          Text(
            value,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 12,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildGoalSuggestionCard({
    required String category,
    required Map<String, dynamic> suggestion,
  }) {
    final title = suggestion['title'] as String;
    final description = suggestion['description'] as String;
    final targetValue = (suggestion['targetValue'] as num).toDouble();
    final unit = suggestion['unit'] as String;
    final frequency = suggestion['frequency'] as String;
    final difficulty = suggestion['difficulty'] as String;

    // Difficulty colors
    final difficultyColor = difficulty == 'easy'
        ? const Color(0xFF4CAF50)
        : difficulty == 'medium'
            ? const Color(0xFFFF9800)
            : const Color(0xFFF44336);

    // Food reward based on frequency
    final foodReward = frequency == 'daily' ? 5 : frequency == 'weekly' ? 15 : 30;

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.05),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: Colors.white.withOpacity(0.1),
        ),
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(12),
          onTap: _isCreatingGoal
              ? null
              : () {
                  _createGoal(
                    title: title,
                    description: description,
                    category: 'fitness',
                    subcategory: category,
                    targetValue: targetValue,
                    unit: unit,
                    frequency: frequency,
                    foodReward: foodReward,
                  );
                },
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        title,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 8,
                        vertical: 4,
                      ),
                      decoration: BoxDecoration(
                        color: difficultyColor.withOpacity(0.3),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        difficulty.toUpperCase(),
                        style: TextStyle(
                          color: difficultyColor,
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Text(
                  description,
                  style: TextStyle(
                    color: Colors.white.withOpacity(0.7),
                    fontSize: 14,
                  ),
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Icon(
                      Icons.restaurant,
                      size: 16,
                      color: const Color(0xFF4CAF50),
                    ),
                    const SizedBox(width: 4),
                    Text(
                      'Earn $foodReward food on completion',
                      style: TextStyle(
                        color: const Color(0xFF4CAF50),
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
