import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../../data/services/api_service.dart';
import '../../data/repositories/breeding_repository.dart';
import '../../data/models/vanimal_model.dart';
import 'activity_rewards_screen.dart';

class StravaActivitiesScreen extends StatefulWidget {
  const StravaActivitiesScreen({super.key});

  @override
  State<StravaActivitiesScreen> createState() => _StravaActivitiesScreenState();
}

class _StravaActivitiesScreenState extends State<StravaActivitiesScreen> {
  List<Map<String, dynamic>> activities = [];
  List<VanimalModel> userVanimals = [];
  bool isLoading = true;
  String? errorMessage;

  @override
  void initState() {
    super.initState();
    _loadActivitiesAndVanimals();
  }

  Future<void> _loadActivitiesAndVanimals() async {
    setState(() => isLoading = true);
    
    try {
      // Load both activities and user's Vanimals
      final activitiesData = await _getStravaActivities();
      final vanimals = await BreedingRepository.getUserVanimals();
      
      setState(() {
        activities = activitiesData;
        userVanimals = vanimals;
        isLoading = false;
      });
    } catch (e) {
      setState(() {
        errorMessage = e.toString();
        isLoading = false;
      });
    }
  }

  Future<List<Map<String, dynamic>>> _getStravaActivities() async {
    try {
      // TODO: Replace with actual user ID when user system is implemented
      final activitiesData = await ApiService.getStravaActivities('test_user_id');
      return List<Map<String, dynamic>>.from(activitiesData);
    } catch (e) {
      // Return mock data for demonstration
      return [
        {
          'id': '1',
          'name': 'Morning Run',
          'type': 'Run',
          'distance': 5200.0, // meters
          'moving_time': 1680, // seconds
          'total_elevation_gain': 45.0,
          'start_date': DateTime.now().subtract(const Duration(hours: 2)).toIso8601String(),
          'has_rewards_claimed': false,
        },
        {
          'id': '2',
          'name': 'Evening Bike Ride',
          'type': 'Ride',
          'distance': 15300.0,
          'moving_time': 2400,
          'total_elevation_gain': 120.0,
          'start_date': DateTime.now().subtract(const Duration(days: 1)).toIso8601String(),
          'has_rewards_claimed': true,
        },
        {
          'id': '3',
          'name': 'Weekend Hike',
          'type': 'Hike',
          'distance': 8600.0,
          'moving_time': 4200,
          'total_elevation_gain': 340.0,
          'start_date': DateTime.now().subtract(const Duration(days: 2)).toIso8601String(),
          'has_rewards_claimed': false,
        },
        {
          'id': '4',
          'name': 'Quick Walk',
          'type': 'Walk',
          'distance': 2100.0,
          'moving_time': 900,
          'total_elevation_gain': 12.0,
          'start_date': DateTime.now().subtract(const Duration(days: 3)).toIso8601String(),
          'has_rewards_claimed': true,
        },
      ];
    }
  }

  void _claimRewards(Map<String, dynamic> activity) {
    if (userVanimals.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('You need at least one Sprout to claim rewards!'),
          backgroundColor: Colors.orange,
        ),
      );
      return;
    }

    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (context) => ActivityRewardsScreen(
          activity: activity,
          userVanimals: userVanimals,
          onRewardsClaimed: () {
            setState(() {
              activity['has_rewards_claimed'] = true;
            });
          },
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Strava Activities'),
        backgroundColor: const Color(0xFFFC4C02), // Strava orange
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
          child: isLoading
              ? const Center(child: CircularProgressIndicator(color: Color(0xFFFC4C02)))
              : errorMessage != null
                  ? _buildErrorState()
                  : _buildActivitiesList(),
        ),
      ),
    );
  }

  Widget _buildErrorState() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.error_outline, color: Colors.red, size: 64),
            const SizedBox(height: 16),
            const Text(
              'Unable to load activities',
              style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Text(
              errorMessage!,
              style: const TextStyle(color: Colors.white70, fontSize: 14),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: _loadActivitiesAndVanimals,
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFFFC4C02),
                foregroundColor: Colors.white,
              ),
              child: const Text('Retry'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildActivitiesList() {
    if (activities.isEmpty) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                width: 120,
                height: 120,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: const Color(0xFFFC4C02).withOpacity(0.2),
                ),
                child: const Icon(Icons.directions_run, color: Color(0xFFFC4C02), size: 60),
              ),
              const SizedBox(height: 20),
              const Text(
                'No Activities Found',
                style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              const Text(
                'Complete some activities on Strava to see them here and earn rewards!',
                style: TextStyle(color: Colors.white70, fontSize: 14),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      );
    }

    return Column(
      children: [
        // Summary Card
        Container(
          margin: const EdgeInsets.all(16),
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
          child: Row(
            children: [
              Expanded(
                child: Column(
                  children: [
                    const Text(
                      'Recent Activities',
                      style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      '${activities.length}',
                      style: const TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
              ),
              Container(width: 1, height: 40, color: Colors.white30),
              Expanded(
                child: Column(
                  children: [
                    const Text(
                      'Pending Rewards',
                      style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      '${activities.where((a) => !a['has_rewards_claimed']).length}',
                      style: const TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),

        // Activities List
        Expanded(
          child: ListView.builder(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            itemCount: activities.length,
            itemBuilder: (context, index) {
              final activity = activities[index];
              return _buildActivityCard(activity);
            },
          ),
        ),
      ],
    );
  }

  Widget _buildActivityCard(Map<String, dynamic> activity) {
    final distance = (activity['distance'] / 1000).toStringAsFixed(1); // Convert to km
    final duration = _formatDuration(activity['moving_time']);
    final hasRewards = !activity['has_rewards_claimed'];
    final activityDate = DateTime.parse(activity['start_date']);
    
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.black.withOpacity(0.8),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: hasRewards ? AppTheme.vanimalPink : Colors.white.withOpacity(0.2),
          width: hasRewards ? 2 : 1,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: _getActivityColor(activity['type']),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Icon(
                  _getActivityIcon(activity['type']),
                  color: Colors.white,
                  size: 20,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      activity['name'],
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    Text(
                      _formatActivityDate(activityDate),
                      style: const TextStyle(color: Colors.white70, fontSize: 12),
                    ),
                  ],
                ),
              ),
              if (hasRewards)
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: AppTheme.vanimalPink,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Text(
                    'Rewards!',
                    style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold),
                  ),
                ),
            ],
          ),
          
          const SizedBox(height: 12),
          
          // Activity Stats
          Row(
            children: [
              _buildStatChip(Icons.straighten, '${distance}km', Colors.blue),
              const SizedBox(width: 8),
              _buildStatChip(Icons.timer, duration, Colors.green),
              const SizedBox(width: 8),
              _buildStatChip(Icons.terrain, '${activity['total_elevation_gain'].round()}m', Colors.orange),
            ],
          ),
          
          const SizedBox(height: 12),
          
          // Action Button
          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              onPressed: hasRewards ? () => _claimRewards(activity) : null,
              icon: Icon(
                hasRewards ? Icons.card_giftcard : Icons.check_circle,
                size: 20,
              ),
              label: Text(hasRewards ? 'Claim Rewards' : 'Rewards Claimed'),
              style: ElevatedButton.styleFrom(
                backgroundColor: hasRewards ? AppTheme.vanimalPink : Colors.grey,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 10),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatChip(IconData icon, String value, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: color.withOpacity(0.2),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, color: color, size: 14),
          const SizedBox(width: 4),
          Text(
            value,
            style: TextStyle(color: color, fontSize: 12, fontWeight: FontWeight.bold),
          ),
        ],
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

  Color _getActivityColor(String type) {
    switch (type.toLowerCase()) {
      case 'run':
        return Colors.red;
      case 'ride':
        return Colors.blue;
      case 'hike':
        return Colors.green;
      case 'walk':
        return Colors.purple;
      default:
        return Colors.grey;
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

  String _formatActivityDate(DateTime date) {
    final now = DateTime.now();
    final difference = now.difference(date);
    
    if (difference.inDays == 0) {
      return 'Today';
    } else if (difference.inDays == 1) {
      return 'Yesterday';
    } else if (difference.inDays < 7) {
      return '${difference.inDays} days ago';
    } else {
      return '${date.day}/${date.month}/${date.year}';
    }
  }
}