import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../../data/services/user_preferences.dart';
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

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Eggs & Nursery'),
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
            _buildEggsTab(),
            _buildNurseryTab(),
          ],
        ),
      ),
    );
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