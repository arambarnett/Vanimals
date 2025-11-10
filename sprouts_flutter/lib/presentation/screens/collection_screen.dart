import 'package:flutter/material.dart';
import 'package:flutter_staggered_grid_view/flutter_staggered_grid_view.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../theme/app_theme.dart';
import '../../data/services/user_preferences.dart';
import '../../data/repositories/user_collection_repository.dart';
import '../../data/models/user_collection_model.dart';
import '../../data/services/web3auth_service.dart';
import '../../core/constants/app_constants.dart';
import 'sprout_detail_screen.dart';
import 'egg_shop_screen.dart';
import 'breeding_selection_screen.dart';
import 'eggs_nursery_screen.dart';
import 'settings_screen.dart';
import 'goal_selection_screen.dart';
import 'goals_screen.dart';

class CollectionScreen extends StatefulWidget {
  const CollectionScreen({super.key});

  @override
  State<CollectionScreen> createState() => _CollectionScreenState();
}

class _CollectionScreenState extends State<CollectionScreen> {
  List<UserCollectionItem> userCollection = [];
  bool isLoading = true;
  String? errorMessage;
  int foodBalance = 0;

  @override
  void initState() {
    super.initState();
    _loadUserCollection();
    _loadFoodBalance();
  }

  Future<void> _loadUserCollection() async {
    try {
      setState(() {
        isLoading = true;
        errorMessage = null;
      });

      final collection = await UserCollectionRepository.getUserCollection();

      setState(() {
        userCollection = collection;
        isLoading = false;
      });
    } catch (e) {
      print('Error loading collection: $e');
      setState(() {
        errorMessage = e.toString();
        isLoading = false;
      });
    }
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
          foodBalance = data['foodBalance'] ?? 0;
        });
      }
    } catch (e) {
      print('Error loading food balance: $e');
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
            children: [
              // Header
              Padding(
                padding: const EdgeInsets.all(20),
                child: Row(
                  children: [
                    const Spacer(),
                    Text(
                      'My Sprouts',
                      style: AppTheme.headlineMedium,
                    ),
                    const Spacer(),
                    IconButton(
                      icon: const Icon(Icons.settings, color: Colors.white),
                      onPressed: () {
                        Navigator.of(context).push(
                          MaterialPageRoute(
                            builder: (context) => const SettingsScreen(),
                          ),
                        );
                      },
                    ),
                  ],
                ),
              ),

              // Food Balance Card
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                child: Container(
                  padding: const EdgeInsets.all(16),
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
                      Row(
                        children: [
                          const Text('🍎', style: TextStyle(fontSize: 32)),
                          const SizedBox(width: 12),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text(
                                'Food Balance',
                                style: TextStyle(
                                  color: Colors.white70,
                                  fontSize: 14,
                                ),
                              ),
                              Text(
                                '$foodBalance',
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 24,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                      ElevatedButton.icon(
                        onPressed: () {
                          Navigator.of(context).push(
                            MaterialPageRoute(
                              builder: (context) => const EggsNurseryScreen(),
                            ),
                          ).then((_) => _loadFoodBalance());
                        },
                        icon: const Icon(Icons.add, size: 18),
                        label: const Text('Buy More'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF4CAF50),
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(
                            horizontal: 16,
                            vertical: 12,
                          ),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              // Action Buttons Row
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                child: Row(
                  children: [
                    Expanded(
                      child: ElevatedButton.icon(
                        onPressed: () {
                          Navigator.of(context).push(
                            MaterialPageRoute(
                              builder: (context) => const GoalsScreen(),
                            ),
                          ).then((_) => _loadUserCollection());
                        },
                        icon: const Icon(Icons.track_changes, size: 20),
                        label: const Text('Goals'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppTheme.vanimalPurple,
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: ElevatedButton.icon(
                        onPressed: () {
                          Navigator.of(context).push(
                            MaterialPageRoute(
                              builder: (context) => const BreedingSelectionScreen(),
                            ),
                          );
                        },
                        icon: const Icon(Icons.favorite, size: 20),
                        label: const Text('Breed'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppTheme.vanimalPink,
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: ElevatedButton.icon(
                        onPressed: () {
                          Navigator.of(context).push(
                            MaterialPageRoute(
                              builder: (context) => const EggsNurseryScreen(),
                            ),
                          ).then((_) => _loadFoodBalance());
                        },
                        icon: const Icon(Icons.store, size: 20),
                        label: const Text('Store'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.amber,
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              
              // Collection Grid
              Expanded(
                child: _buildCollectionContent(context),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildCollectionContent(BuildContext context) {
    if (isLoading) {
      return const Center(
        child: CircularProgressIndicator(color: AppTheme.vanimalPurple),
      );
    }

    if (errorMessage != null) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.error_outline, size: 64, color: Colors.red),
            const SizedBox(height: 16),
            Text(
              'Error loading collection',
              style: AppTheme.headlineSmall,
            ),
            const SizedBox(height: 8),
            Text(
              errorMessage!,
              style: AppTheme.bodyMedium.copyWith(color: Colors.red),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: _loadUserCollection,
              child: const Text('Retry'),
            ),
          ],
        ),
      );
    }

    if (userCollection.isEmpty) {
      return _buildEmptyState(context);
    }

    return _buildCollectionGrid(context);
  }

  Widget _buildCollectionGrid(BuildContext context) {
    return PageView.builder(
      scrollDirection: Axis.vertical,
      itemCount: userCollection.length,
      itemBuilder: (context, index) {
        return _buildSproutPage(context, userCollection[index]);
      },
    );
  }

  Widget _buildSproutPage(BuildContext context, UserCollectionItem sprout) {
    final color = _getSpeciesColor(sprout.species);
    final rest = sprout.restScore ?? 100;
    final water = sprout.waterScore ?? 100;
    final food = sprout.foodScore ?? 100;
    final mood = sprout.mood ?? 'happy';

    return GestureDetector(
      onTap: () {
        Navigator.of(context).push(
          MaterialPageRoute(
            builder: (context) => SproutDetailScreen(
              sproutId: sprout.id,
              name: sprout.name,
              categoryColor: color,
            ),
          ),
        ).then((_) => _loadUserCollection());
      },
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
        child: SingleChildScrollView(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const SizedBox(height: 20),

              // Large Sprout Image (35% of screen to save space)
              Container(
                width: double.infinity,
                height: MediaQuery.of(context).size.height * 0.35,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(30),
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [
                      color.withOpacity(0.3),
                      Colors.black.withOpacity(0.5),
                    ],
                  ),
                  border: Border.all(
                    color: color.withOpacity(0.5),
                    width: 2,
                  ),
                ),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(30),
                  child: _buildSproutImage(sprout.species, color),
                ),
              ),

              const SizedBox(height: 20),

              // Name
              Text(
                sprout.name,
                style: AppTheme.headlineMedium.copyWith(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                ),
                textAlign: TextAlign.center,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),

              const SizedBox(height: 12),

              // Mood Indicator
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                decoration: BoxDecoration(
                  color: _getMoodColor(mood).withOpacity(0.2),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color: _getMoodColor(mood).withOpacity(0.5),
                  ),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      _getMoodEmoji(mood),
                      style: const TextStyle(fontSize: 20),
                    ),
                    const SizedBox(width: 8),
                    Text(
                      'Feeling ${mood.capitalize()}',
                      style: AppTheme.bodyMedium.copyWith(
                        color: Colors.white,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 20),

              // Stat Preview Bars
              _buildStatPreview('Rest', rest, const Color(0xFF9C27B0), '😴'),
              const SizedBox(height: 10),
              _buildStatPreview('Water', water, const Color(0xFF03A9F4), '💧'),
              const SizedBox(height: 10),
              _buildStatPreview('Food', food, const Color(0xFF4CAF50), '🍎'),

              const SizedBox(height: 20),

              // Swipe indicator
              Text(
                '⬆️ Swipe to see more ⬇️',
                style: AppTheme.bodySmall.copyWith(
                  color: Colors.white.withOpacity(0.5),
                ),
              ),

              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStatPreview(String label, int value, Color color, String emoji) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.05),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: color.withOpacity(0.3),
        ),
      ),
      child: Row(
        children: [
          Text(emoji, style: const TextStyle(fontSize: 20)),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      label,
                      style: AppTheme.bodySmall.copyWith(
                        color: Colors.white,
                        fontWeight: FontWeight.w600,
                        fontSize: 13,
                      ),
                    ),
                    Text(
                      '$value/100',
                      style: AppTheme.bodySmall.copyWith(
                        color: Colors.white70,
                        fontWeight: FontWeight.bold,
                        fontSize: 12,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                ClipRRect(
                  borderRadius: BorderRadius.circular(6),
                  child: LinearProgressIndicator(
                    value: value / 100,
                    minHeight: 6,
                    backgroundColor: Colors.white.withOpacity(0.1),
                    valueColor: AlwaysStoppedAnimation<Color>(color),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  String _getMoodEmoji(String mood) {
    switch (mood.toLowerCase()) {
      case 'happy':
        return '😄';
      case 'content':
        return '😊';
      case 'neutral':
        return '😐';
      case 'sad':
        return '😢';
      case 'distressed':
        return '😰';
      default:
        return '😊';
    }
  }

  Color _getMoodColor(String mood) {
    switch (mood.toLowerCase()) {
      case 'happy':
        return Colors.green;
      case 'content':
        return Colors.lightGreen;
      case 'neutral':
        return Colors.amber;
      case 'sad':
        return Colors.orange;
      case 'distressed':
        return Colors.red;
      default:
        return Colors.green;
    }
  }

  Widget _buildVanimalCard(BuildContext context, UserCollectionItem vanimal) {
    final color = _getSpeciesColor(vanimal.species);
    
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20),
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            color.withOpacity(0.3),
            Colors.black.withOpacity(0.8),
          ],
        ),
        border: Border.all(
          color: color.withOpacity(0.5),
          width: 1,
        ),
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(20),
          onTap: () {
            Navigator.of(context).push(
              MaterialPageRoute(
                builder: (context) => SproutDetailScreen(
                  sproutId: vanimal.id,
                  name: vanimal.name,
                  categoryColor: color,
                ),
              ),
            ).then((_) => _loadUserCollection());
          },
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Vanimal Image/Avatar
                Container(
                  width: double.infinity,
                  height: 120,
                  margin: const EdgeInsets.only(bottom: 8),
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(15),
                    color: Colors.white.withOpacity(0.1),
                    border: Border.all(
                      color: color.withOpacity(0.3),
                      width: 1,
                    ),
                  ),
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(15),
                    child: _buildSproutImage(vanimal.species, color),
                  ),
                ),
                const SizedBox(height: 12),
                
                // Name
                Text(
                  vanimal.name,
                  style: AppTheme.labelLarge.copyWith(
                    fontSize: 16,
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 4),
                
                // Level and Rarity
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 8,
                        vertical: 4,
                      ),
                      decoration: BoxDecoration(
                        color: color.withOpacity(0.2),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        'Lv. ${vanimal.level}',
                        style: AppTheme.bodySmall.copyWith(
                          color: color,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    Text(
                      vanimal.rarity,
                      style: AppTheme.bodySmall.copyWith(
                        color: _getRarityColor(vanimal.rarity),
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                
                // View Details Button
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton.icon(
                    onPressed: () {
                      Navigator.of(context).push(
                        MaterialPageRoute(
                          builder: (context) => SproutDetailScreen(
                            sproutId: vanimal.id,
                            name: vanimal.name,
                            categoryColor: color,
                          ),
                        ),
                      ).then((_) => _loadUserCollection());
                    },
                    icon: const Icon(Icons.favorite, size: 16),
                    label: const Text('View Details'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: color,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 8),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
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

  Widget _buildEmptyState(BuildContext context) {
    return Center(
      child: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(32.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            mainAxisSize: MainAxisSize.min,
            children: [
            Container(
              width: 150,
              height: 150,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: LinearGradient(
                  colors: [
                    AppTheme.vanimalPurple.withOpacity(0.3),
                    AppTheme.vanimalPink.withOpacity(0.3),
                  ],
                ),
                border: Border.all(
                  color: AppTheme.vanimalPurple,
                  width: 3,
                ),
              ),
              child: const Icon(
                Icons.auto_awesome,
                size: 80,
                color: AppTheme.vanimalPurple,
              ),
            ),
            const SizedBox(height: 30),
            Text(
              'Get Your First Sprout FREE!',
              style: AppTheme.headlineMedium.copyWith(
                fontSize: 28,
                fontWeight: FontWeight.bold,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 15),
            Text(
              'Create a goal to mint your first Sprout NFT.\nChoose from fitness, finance, or lifestyle goals!',
              textAlign: TextAlign.center,
              style: AppTheme.bodyLarge.copyWith(
                color: Colors.white.withOpacity(0.8),
                height: 1.5,
              ),
            ),
            const SizedBox(height: 30),
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.1),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: AppTheme.vanimalPurple.withOpacity(0.3),
                ),
              ),
              child: Column(
                children: [
                  Row(
                    children: [
                      Icon(Icons.check_circle, color: Colors.green, size: 20),
                      SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          'Set a goal in any category',
                          style: AppTheme.bodyMedium,
                        ),
                      ),
                    ],
                  ),
                  SizedBox(height: 12),
                  Row(
                    children: [
                      Icon(Icons.check_circle, color: Colors.green, size: 20),
                      SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          'Your Sprout NFT mints automatically',
                          style: AppTheme.bodyMedium,
                        ),
                      ),
                    ],
                  ),
                  SizedBox(height: 12),
                  Row(
                    children: [
                      Icon(Icons.check_circle, color: Colors.green, size: 20),
                      SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          'Track progress & watch it grow!',
                          style: AppTheme.bodyMedium,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 30),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: () {
                  Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (context) => const GoalSelectionScreen(),
                    ),
                  );
                },
                icon: const Icon(Icons.add_task, size: 24),
                label: const Text(
                  'Create My First Goal',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.vanimalPurple,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                  elevation: 8,
                ),
              ),
            ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSproutImage(String species, Color fallbackColor) {
    final String imagePath = 'assets/sprouts/${species.toLowerCase()}.png';

    return Image.asset(
      imagePath,
      fit: BoxFit.contain,
      errorBuilder: (context, error, stackTrace) {
        // Fallback to icon if image not found
        return Icon(
          _getSpeciesIcon(species),
          size: 50,
          color: fallbackColor,
        );
      },
    );
  }

  IconData _getSpeciesIcon(String species) {
    switch (species.toLowerCase()) {
      case 'bear':
        return Icons.pets;
      case 'deer':
        return Icons.nature;
      case 'fox':
        return Icons.pets;
      case 'owl':
        return Icons.flight;
      case 'penguin':
        return Icons.ac_unit;
      case 'rabbit':
        return Icons.cruelty_free;
      default:
        return Icons.pets;
    }
  }

  Color _getRarityColor(String rarity) {
    switch (rarity.toLowerCase()) {
      case 'common':
        return Colors.grey;
      case 'rare':
        return Colors.blue;
      case 'epic':
        return Colors.purple;
      case 'legendary':
        return Colors.orange;
      default:
        return Colors.white;
    }
  }

  Color _getSpeciesColor(String species) {
    switch (species.toLowerCase()) {
      case 'bear':
        return const Color(0xFF8B4513); // Brown
      case 'deer':
        return const Color(0xFFD2691E); // Tan/Ochre
      case 'fox':
        return const Color(0xFFFF6347); // Orange-red
      case 'owl':
        return const Color(0xFF9370DB); // Purple
      case 'penguin':
        return Colors.cyan;
      case 'rabbit':
        return AppTheme.vanimalPink;
      default:
        return AppTheme.vanimalPurple;
    }
  }
}

extension StringExtension on String {
  String capitalize() {
    if (isEmpty) return this;
    return '${this[0].toUpperCase()}${substring(1).toLowerCase()}';
  }
}

