import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../theme/app_theme.dart';
import '../../data/services/user_preferences.dart';
import '../../data/services/web3auth_service.dart';
import '../../core/constants/app_constants.dart';
import 'egg_hatching_screen.dart';
import 'vanimal_detail_screen.dart';

class EggsNurseryScreen extends StatefulWidget {
  const EggsNurseryScreen({super.key});

  @override
  State<EggsNurseryScreen> createState() => _EggsNurseryScreenState();
}

class _EggsNurseryScreenState extends State<EggsNurseryScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  int foodBalance = 0;
  bool isLoadingFood = false;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    _loadFoodBalance();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
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
        if (mounted) {
          setState(() {
            foodBalance = data['foodBalance'] ?? 0;
          });
        }
      }
    } catch (e) {
      print('Error loading food balance: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Store'),
        backgroundColor: AppTheme.vanimalPurple,
        foregroundColor: Colors.white,
        elevation: 0,
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: Colors.white,
          labelColor: Colors.white,
          unselectedLabelColor: Colors.white70,
          tabs: const [
            Tab(
              icon: Icon(Icons.restaurant),
              text: 'Food',
            ),
            Tab(
              icon: Icon(Icons.egg),
              text: 'Eggs',
            ),
            Tab(
              icon: Icon(Icons.child_care),
              text: 'Nursery',
            ),
          ],
        ),
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
        child: TabBarView(
          controller: _tabController,
          children: [
            _buildFoodTab(),
            _buildEggsTab(),
            _buildNurseryTab(),
          ],
        ),
      ),
    );
  }

  Widget _buildFoodTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Current Balance Card
          Container(
            width: double.infinity,
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
              children: [
                const Text('🍎', style: TextStyle(fontSize: 40)),
                const SizedBox(width: 16),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Current Balance',
                      style: TextStyle(
                        color: Colors.white70,
                        fontSize: 14,
                      ),
                    ),
                    Text(
                      '$foodBalance Food',
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 28,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),

          const SizedBox(height: 24),

          const Text(
            'Buy Food Packages',
            style: TextStyle(
              color: Colors.white,
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            'Feed your Sprouts to keep them happy and healthy!',
            style: TextStyle(
              color: Colors.white70,
              fontSize: 14,
            ),
          ),

          const SizedBox(height: 20),

          // Small Package
          _buildFoodPackageCard(
            name: 'Small Package',
            foodAmount: 50,
            pointsCost: 100,
            color: const Color(0xFF4CAF50),
            icon: '🥗',
            description: 'Perfect for a quick snack',
          ),

          const SizedBox(height: 16),

          // Medium Package
          _buildFoodPackageCard(
            name: 'Medium Package',
            foodAmount: 150,
            pointsCost: 250,
            color: const Color(0xFF8BC34A),
            icon: '🍱',
            description: 'Great value for regular feeding',
            isPopular: true,
          ),

          const SizedBox(height: 16),

          // Large Package
          _buildFoodPackageCard(
            name: 'Large Package',
            foodAmount: 500,
            pointsCost: 750,
            color: const Color(0xFF66BB6A),
            icon: '🍜',
            description: 'Best deal for serious trainers',
          ),
        ],
      ),
    );
  }

  Widget _buildFoodPackageCard({
    required String name,
    required int foodAmount,
    required int pointsCost,
    required Color color,
    required String icon,
    required String description,
    bool isPopular = false,
  }) {
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
          color: isPopular ? Colors.amber : color.withOpacity(0.5),
          width: isPopular ? 3 : 2,
        ),
      ),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Text(icon, style: const TextStyle(fontSize: 32)),
                    const SizedBox(width: 12),
                    Text(
                      name,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
                if (isPopular)
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 6,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.amber,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Text(
                      'POPULAR',
                      style: TextStyle(
                        color: Colors.black,
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
              ],
            ),
            const SizedBox(height: 12),
            Text(
              description,
              style: const TextStyle(
                color: Colors.white70,
                fontSize: 14,
              ),
            ),
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      '+$foodAmount Food',
                      style: TextStyle(
                        color: color,
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    Text(
                      '$pointsCost Points',
                      style: const TextStyle(
                        color: Colors.white70,
                        fontSize: 14,
                      ),
                    ),
                  ],
                ),
                ElevatedButton.icon(
                  onPressed: isLoadingFood
                      ? null
                      : () => _purchaseFood(foodAmount, pointsCost, name),
                  icon: const Icon(Icons.shopping_cart, size: 18),
                  label: const Text('Buy'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: color,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(
                      horizontal: 24,
                      vertical: 12,
                    ),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
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

  Future<void> _purchaseFood(int foodAmount, int pointsCost, String packageName) async {
    // Show confirmation dialog
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: const Color(0xFF1a1a2e),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
        ),
        title: const Text(
          'Confirm Purchase',
          style: TextStyle(color: Colors.white),
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Purchase $packageName?',
              style: const TextStyle(
                color: Colors.white,
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 12),
            Text(
              'You will receive:',
              style: TextStyle(
                color: Colors.white.withOpacity(0.7),
                fontSize: 14,
              ),
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                const Text('🍎', style: TextStyle(fontSize: 24)),
                const SizedBox(width: 8),
                Text(
                  '+$foodAmount Food',
                  style: const TextStyle(
                    color: Color(0xFF4CAF50),
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Text(
              'Cost:',
              style: TextStyle(
                color: Colors.white.withOpacity(0.7),
                fontSize: 14,
              ),
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                const Text('⭐', style: TextStyle(fontSize: 24)),
                const SizedBox(width: 8),
                Text(
                  '$pointsCost Points',
                  style: const TextStyle(
                    color: Colors.amber,
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(false),
            child: const Text(
              'Cancel',
              style: TextStyle(color: Colors.white70),
            ),
          ),
          ElevatedButton(
            onPressed: () => Navigator.of(context).pop(true),
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF4CAF50),
              foregroundColor: Colors.white,
            ),
            child: const Text('Confirm'),
          ),
        ],
      ),
    );

    if (confirmed != true) return;

    setState(() {
      isLoadingFood = true;
    });

    try {
      final userId = await Web3AuthService.getUserId();
      if (userId == null) {
        throw Exception('Not logged in');
      }

      final response = await http.post(
        Uri.parse('${AppConstants.baseUrl}/api/food/purchase'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'userId': userId,
          'foodAmount': foodAmount,
          'pointsCost': pointsCost,
        }),
      );

      if (response.statusCode == 200) {
        await _loadFoodBalance();

        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('✅ Purchased $foodAmount food for $pointsCost points!'),
              backgroundColor: const Color(0xFF4CAF50),
              duration: const Duration(seconds: 2),
            ),
          );
        }
      } else {
        final errorData = jsonDecode(response.body);
        throw Exception(errorData['error'] ?? 'Failed to purchase food');
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error: $e'),
            backgroundColor: Colors.red,
            duration: const Duration(seconds: 3),
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          isLoadingFood = false;
        });
      }
    }
  }

  Widget _buildEggsTab() {
    final List<EggItem> eggs = _getAvailableEggs();

    if (eggs.isEmpty) {
      return _buildEmptyEggsState();
    }

    return Padding(
      padding: const EdgeInsets.all(16),
      child: GridView.builder(
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          childAspectRatio: 0.75,
          crossAxisSpacing: 16,
          mainAxisSpacing: 16,
        ),
        itemCount: eggs.length,
        itemBuilder: (context, index) {
          final egg = eggs[index];
          return _buildEggCard(egg);
        },
      ),
    );
  }

  Widget _buildNurseryTab() {
    final List<BabyVanimal> babies = _getBabyVanimals();

    if (babies.isEmpty) {
      return _buildEmptyNurseryState();
    }

    return Padding(
      padding: const EdgeInsets.all(16),
      child: GridView.builder(
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          childAspectRatio: 0.75,
          crossAxisSpacing: 16,
          mainAxisSpacing: 16,
        ),
        itemCount: babies.length,
        itemBuilder: (context, index) {
          final baby = babies[index];
          return _buildBabyVanimalCard(baby);
        },
      ),
    );
  }

  List<EggItem> _getAvailableEggs() {
    final List<EggItem> eggs = [];

    // Add starter egg if user received one from Strava connection
    if (UserPreferences.hasReceivedStarterEgg) {
      eggs.add(EggItem(
        id: 'starter_egg',
        name: 'Starter Egg',
        type: 'Common',
        description: 'FREE from Strava connection!',
        color: Colors.amber,
        isFromStrava: true,
      ));
    }

    // Add some mock eggs for demonstration
    eggs.addAll([
      EggItem(
        id: 'breeding_egg_1',
        name: 'Breeding Egg',
        type: 'Rare',
        description: 'From successful breeding',
        color: AppTheme.vanimalPink,
        isFromBreeding: true,
      ),
      EggItem(
        id: 'purchased_egg_1',
        name: 'Premium Egg',
        type: 'Epic',
        description: 'Purchased from shop',
        color: Colors.purple,
        isFromShop: true,
      ),
    ]);

    return eggs;
  }

  List<BabyVanimal> _getBabyVanimals() {
    // Mock baby Vanimals for demonstration
    return [
      BabyVanimal(
        id: 'baby_1',
        name: 'Baby Pip',
        species: 'Pigeon',
        age: 2,
        level: 1,
        color: AppTheme.vanimalPurple,
        isReadyToGraduate: false,
      ),
      BabyVanimal(
        id: 'baby_2',
        name: 'Little Waddle',
        species: 'Penguin',
        age: 7,
        level: 3,
        color: Colors.cyan,
        isReadyToGraduate: true,
      ),
    ];
  }

  Widget _buildEggCard(EggItem egg) {
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20),
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            egg.color.withOpacity(0.3),
            Colors.black.withOpacity(0.8),
          ],
        ),
        border: Border.all(
          color: egg.color.withOpacity(0.5),
          width: 2,
        ),
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(20),
          onTap: () {
            Navigator.of(context).push(
              MaterialPageRoute(
                builder: (context) => EggHatchingScreen(
                  eggName: egg.name,
                  eggType: egg.type,
                  eggColor: egg.color,
                  description: egg.description,
                ),
              ),
            );
          },
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                // Special badge for source
                if (egg.isFromStrava || egg.isFromBreeding || egg.isFromShop)
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: egg.color.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      egg.isFromStrava
                          ? 'STRAVA BONUS'
                          : egg.isFromBreeding
                              ? 'BREEDING'
                              : 'SHOP',
                      style: TextStyle(
                        color: egg.color,
                        fontSize: 8,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                
                const SizedBox(height: 8),
                
                // Egg Icon
                Expanded(
                  child: Container(
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: Colors.white.withOpacity(0.1),
                      border: Border.all(
                        color: egg.color.withOpacity(0.3),
                        width: 1,
                      ),
                    ),
                    child: Center(
                      child: Icon(
                        Icons.egg,
                        size: 60,
                        color: egg.color,
                      ),
                    ),
                  ),
                ),
                
                const SizedBox(height: 12),
                
                // Name
                Text(
                  egg.name,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                  ),
                  textAlign: TextAlign.center,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                
                const SizedBox(height: 4),
                
                // Type
                Text(
                  egg.type,
                  style: TextStyle(
                    color: egg.color,
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                
                const SizedBox(height: 8),
                
                // Description
                Text(
                  egg.description,
                  style: const TextStyle(
                    color: Colors.white70,
                    fontSize: 10,
                  ),
                  textAlign: TextAlign.center,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                
                const SizedBox(height: 12),
                
                // Hatch Button
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () {
                      Navigator.of(context).push(
                        MaterialPageRoute(
                          builder: (context) => EggHatchingScreen(
                            eggName: egg.name,
                            eggType: egg.type,
                            eggColor: egg.color,
                            description: egg.description,
                          ),
                        ),
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: egg.color,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 8),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                    child: const Text(
                      'Hatch',
                      style: TextStyle(fontSize: 12),
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

  Widget _buildBabyVanimalCard(BabyVanimal baby) {
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20),
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            baby.color.withOpacity(0.3),
            Colors.black.withOpacity(0.8),
          ],
        ),
        border: Border.all(
          color: baby.isReadyToGraduate 
              ? Colors.green 
              : baby.color.withOpacity(0.5),
          width: 2,
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
                  name: baby.name,
                  species: baby.species,
                  level: baby.level,
                  rarity: 'Baby',
                  color: baby.color,
                  imagePath: 'assets/images/animals/${baby.species.toLowerCase()}.png',
                ),
              ),
            );
          },
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                // Graduation badge
                if (baby.isReadyToGraduate)
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: Colors.green.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: const Text(
                      'READY TO GRADUATE',
                      style: TextStyle(
                        color: Colors.green,
                        fontSize: 8,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                
                const SizedBox(height: 8),
                
                // Baby Vanimal Icon
                Expanded(
                  child: Container(
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: Colors.white.withOpacity(0.1),
                      border: Border.all(
                        color: baby.color.withOpacity(0.3),
                        width: 1,
                      ),
                    ),
                    child: Center(
                      child: Icon(
                        Icons.child_care,
                        size: 50,
                        color: baby.color,
                      ),
                    ),
                  ),
                ),
                
                const SizedBox(height: 12),
                
                // Name
                Text(
                  baby.name,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                  ),
                  textAlign: TextAlign.center,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                
                const SizedBox(height: 4),
                
                // Species and Level
                Text(
                  '${baby.species} • Lv.${baby.level}',
                  style: TextStyle(
                    color: baby.color,
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                
                const SizedBox(height: 4),
                
                // Age
                Text(
                  '${baby.age} days old',
                  style: const TextStyle(
                    color: Colors.white70,
                    fontSize: 10,
                  ),
                ),
                
                const SizedBox(height: 12),
                
                // Action Button
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () {
                      if (baby.isReadyToGraduate) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text('${baby.name} graduated to adult collection!'),
                            backgroundColor: Colors.green,
                          ),
                        );
                      } else {
                        Navigator.of(context).push(
                          MaterialPageRoute(
                            builder: (context) => VanimalDetailScreen(
                              name: baby.name,
                              species: baby.species,
                              level: baby.level,
                              rarity: 'Baby',
                              color: baby.color,
                              imagePath: 'assets/images/animals/${baby.species.toLowerCase()}.png',
                            ),
                          ),
                        );
                      }
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: baby.isReadyToGraduate 
                          ? Colors.green 
                          : baby.color,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 8),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                    child: Text(
                      baby.isReadyToGraduate ? 'Graduate' : 'Care',
                      style: const TextStyle(fontSize: 12),
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

  Widget _buildEmptyEggsState() {
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
                color: Colors.white.withOpacity(0.1),
                border: Border.all(
                  color: AppTheme.vanimalPurple,
                  width: 2,
                ),
              ),
              child: const Icon(
                Icons.egg,
                size: 60,
                color: AppTheme.vanimalPurple,
              ),
            ),
            const SizedBox(height: 20),
            const Text(
              'No Eggs Yet',
              style: TextStyle(
                color: Colors.white,
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              'Get eggs by connecting Strava, breeding your Sprouts, or visiting the shop!',
              style: TextStyle(color: Colors.white70, fontSize: 14),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildEmptyNurseryState() {
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
                color: Colors.white.withOpacity(0.1),
                border: Border.all(
                  color: AppTheme.vanimalPink,
                  width: 2,
                ),
              ),
              child: const Icon(
                Icons.child_care,
                size: 60,
                color: AppTheme.vanimalPink,
              ),
            ),
            const SizedBox(height: 20),
            const Text(
              'Nursery Empty',
              style: TextStyle(
                color: Colors.white,
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              'Hatch some eggs to see baby Sprouts growing up here!',
              style: TextStyle(color: Colors.white70, fontSize: 14),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}

class EggItem {
  final String id;
  final String name;
  final String type;
  final String description;
  final Color color;
  final bool isFromStrava;
  final bool isFromBreeding;
  final bool isFromShop;

  EggItem({
    required this.id,
    required this.name,
    required this.type,
    required this.description,
    required this.color,
    this.isFromStrava = false,
    this.isFromBreeding = false,
    this.isFromShop = false,
  });
}

class BabyVanimal {
  final String id;
  final String name;
  final String species;
  final int age;
  final int level;
  final Color color;
  final bool isReadyToGraduate;

  BabyVanimal({
    required this.id,
    required this.name,
    required this.species,
    required this.age,
    required this.level,
    required this.color,
    required this.isReadyToGraduate,
  });
}