import 'package:flutter/material.dart';
import 'package:flutter_staggered_grid_view/flutter_staggered_grid_view.dart';
import '../theme/app_theme.dart';
import '../../data/services/user_preferences.dart';
import '../../data/repositories/user_collection_repository.dart';
import '../../data/models/user_collection_model.dart';
import 'vanimal_detail_screen.dart';
import 'egg_shop_screen.dart';
import 'breeding_selection_screen.dart';
import 'eggs_nursery_screen.dart';
import 'settings_screen.dart';

class CollectionScreen extends StatefulWidget {
  const CollectionScreen({super.key});

  @override
  State<CollectionScreen> createState() => _CollectionScreenState();
}

class _CollectionScreenState extends State<CollectionScreen> {
  List<UserCollectionItem>? userCollection;
  bool isLoading = true;
  String? errorMessage;

  @override
  void initState() {
    super.initState();
    _loadUserCollection();
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
      setState(() {
        errorMessage = e.toString();
        isLoading = false;
      });
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
                              builder: (context) => const BreedingSelectionScreen(),
                            ),
                          );
                        },
                        icon: const Icon(Icons.favorite, size: 20),
                        label: const Text('Breeding'),
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
                          );
                        },
                        icon: const Icon(Icons.egg, size: 20),
                        label: const Text('Eggs'),
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
                    const SizedBox(width: 8),
                    Expanded(
                      child: ElevatedButton.icon(
                        onPressed: () {
                          Navigator.of(context).push(
                            MaterialPageRoute(
                              builder: (context) => const EggShopScreen(),
                            ),
                          );
                        },
                        icon: const Icon(Icons.store, size: 20),
                        label: const Text('Shop'),
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
      return _buildLoadingState();
    }
    
    if (errorMessage != null) {
      return _buildErrorState(context);
    }
    
    if (userCollection == null || userCollection!.isEmpty) {
      return _buildEmptyState(context);
    }

    return _buildCollectionGrid(context);
  }

  Widget _buildLoadingState() {
    return const Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          CircularProgressIndicator(color: AppTheme.vanimalPurple),
          SizedBox(height: 16),
          Text(
            'Loading your Sprouts...',
            style: TextStyle(color: Colors.white70, fontSize: 16),
          ),
        ],
      ),
    );
  }

  Widget _buildErrorState(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(
            Icons.error_outline,
            color: Colors.red,
            size: 64,
          ),
          const SizedBox(height: 16),
          Text(
            'Failed to load collection',
            style: AppTheme.headlineSmall,
          ),
          const SizedBox(height: 8),
          Text(
            errorMessage ?? 'Unknown error occurred',
            textAlign: TextAlign.center,
            style: const TextStyle(color: Colors.white70),
          ),
          const SizedBox(height: 20),
          ElevatedButton.icon(
            onPressed: _loadUserCollection,
            icon: const Icon(Icons.refresh),
            label: const Text('Retry'),
            style: ElevatedButton.styleFrom(
              backgroundColor: AppTheme.vanimalPurple,
              foregroundColor: Colors.white,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCollectionGrid(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: GridView.builder(
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          childAspectRatio: 0.65,
          crossAxisSpacing: 16,
          mainAxisSpacing: 16,
        ),
        itemCount: userCollection!.length,
        itemBuilder: (buildContext, index) {
          return _buildVanimalCard(context, userCollection![index]);
        },
      ),
    );
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
                builder: (context) => VanimalDetailScreen(
                  name: vanimal.name,
                  species: vanimal.species,
                  level: vanimal.level,
                  rarity: vanimal.rarity,
                  color: color,
                  imagePath: vanimal.imagePath,
                ),
              ),
            );
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
                    child: vanimal.imagePath != null
                        ? Image.asset(
                            vanimal.imagePath!,
                            fit: BoxFit.cover,
                            errorBuilder: (context, error, stackTrace) {
                              return Icon(
                                _getSpeciesIcon(vanimal.species),
                                size: 50,
                                color: color,
                              );
                            },
                          )
                        : Icon(
                            _getSpeciesIcon(vanimal.species),
                            size: 50,
                            color: color,
                          ),
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
                
                // AR Button
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton.icon(
                    onPressed: () {
                      Navigator.of(context).push(
                        MaterialPageRoute(
                          builder: (context) => VanimalDetailScreen(
                            name: vanimal.name,
                            species: vanimal.species,
                            level: vanimal.level,
                            rarity: vanimal.rarity,
                            color: color,
                            imagePath: vanimal.imagePath,
                          ),
                        ),
                      );
                    },
                    icon: const Icon(Icons.view_in_ar, size: 16),
                    label: const Text('View in AR'),
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
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: 150,
            height: 150,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: Colors.white.withOpacity(0.1),
              border: Border.all(
                color: AppTheme.vanimalPurple,
                width: 2,
              ),
            ),
            child: const Icon(
              Icons.pets,
              size: 80,
              color: AppTheme.vanimalPurple,
            ),
          ),
          const SizedBox(height: 30),
          Text(
            'No Sprouts Yet',
            style: AppTheme.headlineMedium,
          ),
          const SizedBox(height: 15),
          Text(
            'Your digital AR pet collection\nwill appear here.',
            textAlign: TextAlign.center,
            style: AppTheme.bodyLarge.copyWith(
              color: Colors.white.withOpacity(0.7),
            ),
          ),
          const SizedBox(height: 20),
          ElevatedButton.icon(
            onPressed: () {
              Navigator.of(context).push(
                MaterialPageRoute(
                  builder: (context) => const EggsNurseryScreen(),
                ),
              );
            },
            icon: const Icon(Icons.egg, size: 20),
            label: const Text('Check Your Eggs'),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.amber,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
          ),
        ],
      ),
    );
  }

  IconData _getSpeciesIcon(String species) {
    switch (species.toLowerCase()) {
      case 'pigeon':
        return Icons.flutter_dash;
      case 'elephant':
        return Icons.terrain;
      case 'tiger':
        return Icons.pets;
      case 'penguin':
        return Icons.ac_unit;
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
      case 'pigeon':
        return AppTheme.vanimalPurple;
      case 'elephant':
        return AppTheme.vanimalPink;
      case 'tiger':
        return Colors.orange;
      case 'penguin':
        return Colors.cyan;
      default:
        return AppTheme.vanimalPurple;
    }
  }
}

