import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import 'hatching_screen.dart';

class EggShopScreen extends StatefulWidget {
  const EggShopScreen({super.key});

  @override
  State<EggShopScreen> createState() => _EggShopScreenState();
}

class _EggShopScreenState extends State<EggShopScreen> {
  int mannaBalance = 2500; // Mock currency balance
  
  final List<EggType> availableEggs = [
    EggType(
      name: 'Common Egg',
      description: 'Contains common Sprouts\nPigeon, Basic creatures',
      price: 100,
      rarity: 'Common',
      color: Colors.grey,
      imagePath: 'assets/images/icons/spawn-icon-color.png',
      hatchChances: {
        'Pigeon': 60,
        'Urban Bird': 30,
        'City Cat': 10,
      },
    ),
    EggType(
      name: 'Rare Egg',
      description: 'Contains rare Sprouts\nElephant, Exotic animals',
      price: 350,
      rarity: 'Rare',
      color: Colors.blue,
      imagePath: 'assets/images/icons/spawn-icon-color.png',
      hatchChances: {
        'Elephant': 40,
        'Rare Bird': 35,
        'Forest Creature': 25,
      },
    ),
    EggType(
      name: 'Epic Egg',
      description: 'Contains epic Sprouts\nTiger, Powerful predators',
      price: 750,
      rarity: 'Epic',
      color: Colors.purple,
      imagePath: 'assets/images/icons/spawn-icon-color.png',
      hatchChances: {
        'Tiger': 30,
        'Epic Beast': 40,
        'Legendary Chance': 30,
      },
    ),
    EggType(
      name: 'Legendary Egg',
      description: 'Contains legendary Sprouts\nDragon, Mythical creatures',
      price: 1500,
      rarity: 'Legendary',
      color: Colors.orange,
      imagePath: 'assets/images/icons/spawn-icon-color.png',
      hatchChances: {
        'Dragon': 20,
        'Phoenix': 25,
        'Cosmic Entity': 35,
        'Ultra Rare': 20,
      },
    ),
  ];

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
              _buildHeader(),
              _buildMannaBalance(),
              Expanded(
                child: _buildEggGrid(),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Padding(
      padding: const EdgeInsets.all(20),
      child: Row(
        children: [
          IconButton(
            icon: const Icon(Icons.arrow_back, color: Colors.white),
            onPressed: () => Navigator.of(context).pop(),
          ),
          const Spacer(),
          Text(
            'Sprout Eggs',
            style: AppTheme.headlineMedium,
          ),
          const Spacer(),
          IconButton(
            icon: const Icon(Icons.info_outline, color: Colors.white),
            onPressed: _showEggInfo,
          ),
        ],
      ),
    );
  }

  Widget _buildMannaBalance() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            AppTheme.vanimalPurple.withOpacity(0.3),
            AppTheme.vanimalPink.withOpacity(0.3),
          ],
        ),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: AppTheme.vanimalPurple.withOpacity(0.5),
          width: 1,
        ),
      ),
      child: Row(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: Colors.amber,
              shape: BoxShape.circle,
            ),
            child: const Icon(
              Icons.monetization_on,
              color: Colors.white,
              size: 24,
            ),
          ),
          const SizedBox(width: 12),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Manna Balance',
                style: AppTheme.bodySmall,
              ),
              Text(
                '$mannaBalance Manna',
                style: AppTheme.headlineSmall.copyWith(
                  color: Colors.amber,
                ),
              ),
            ],
          ),
          const Spacer(),
          TextButton(
            onPressed: _showEarnManna,
            child: Text(
              'Earn More',
              style: AppTheme.labelLarge.copyWith(
                color: AppTheme.vanimalPurple,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildEggGrid() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: GridView.builder(
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          crossAxisSpacing: 16,
          mainAxisSpacing: 16,
          childAspectRatio: 0.8,
        ),
        itemCount: availableEggs.length,
        itemBuilder: (context, index) {
          return _buildEggCard(availableEggs[index]);
        },
      ),
    );
  }

  Widget _buildEggCard(EggType egg) {
    bool canAfford = mannaBalance >= egg.price;
    
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
          width: 1,
        ),
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(20),
          onTap: canAfford ? () => _showEggDetails(egg) : null,
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                // Egg Image
                Expanded(
                  flex: 3,
                  child: Container(
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: Colors.white.withOpacity(0.1),
                      border: Border.all(
                        color: egg.color,
                        width: 2,
                      ),
                    ),
                    child: ClipOval(
                      child: Image.asset(
                        egg.imagePath,
                        fit: BoxFit.cover,
                        color: canAfford ? null : Colors.grey,
                        colorBlendMode: canAfford ? null : BlendMode.saturation,
                      ),
                    ),
                  ),
                ),
                
                const SizedBox(height: 12),
                
                // Egg Name
                Text(
                  egg.name,
                  style: AppTheme.labelLarge.copyWith(
                    fontSize: 16,
                    color: canAfford ? Colors.white : Colors.grey,
                  ),
                  textAlign: TextAlign.center,
                ),
                
                const SizedBox(height: 4),
                
                // Rarity
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 4,
                  ),
                  decoration: BoxDecoration(
                    color: egg.color.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    egg.rarity,
                    style: AppTheme.bodySmall.copyWith(
                      color: canAfford ? egg.color : Colors.grey,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                
                const SizedBox(height: 8),
                
                // Price
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      Icons.monetization_on,
                      size: 16,
                      color: canAfford ? Colors.amber : Colors.grey,
                    ),
                    const SizedBox(width: 4),
                    Text(
                      '${egg.price}',
                      style: AppTheme.bodyMedium.copyWith(
                        color: canAfford ? Colors.amber : Colors.grey,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
                
                const SizedBox(height: 8),
                
                // Buy Button
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: canAfford ? () => _purchaseEgg(egg) : null,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: canAfford ? egg.color : Colors.grey,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 8),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    child: Text(
                      canAfford ? 'Buy' : 'Not enough Manna',
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

  void _showEggDetails(EggType egg) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: AppTheme.spaceBackground,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
        ),
        title: Text(
          egg.name,
          style: AppTheme.headlineSmall,
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              egg.description,
              style: AppTheme.bodyMedium,
            ),
            const SizedBox(height: 16),
            Text(
              'Hatch Chances:',
              style: AppTheme.labelLarge,
            ),
            const SizedBox(height: 8),
            ...egg.hatchChances.entries.map((entry) {
              return Padding(
                padding: const EdgeInsets.symmetric(vertical: 2),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(entry.key, style: AppTheme.bodySmall),
                    Text('${entry.value}%', style: AppTheme.bodySmall),
                  ],
                ),
              );
            }).toList(),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: Text('Close', style: AppTheme.labelLarge),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.of(context).pop();
              _purchaseEgg(egg);
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: egg.color,
              foregroundColor: Colors.white,
            ),
            child: Text('Buy for ${egg.price} Manna'),
          ),
        ],
      ),
    );
  }

  void _purchaseEgg(EggType egg) {
    if (mannaBalance >= egg.price) {
      setState(() {
        mannaBalance -= egg.price;
      });
      
      Navigator.of(context).push(
        MaterialPageRoute(
          builder: (context) => HatchingScreen(eggType: egg),
        ),
      ).then((_) {
        // Refresh the shop when returning
        setState(() {});
      });
    }
  }

  void _showEggInfo() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: AppTheme.spaceBackground,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
        ),
        title: Text('About Sprout Eggs', style: AppTheme.headlineSmall),
        content: Text(
          'Sprout Eggs contain unborn digital creatures waiting to hatch! '
          'Different egg types have different chances of containing rare Sprouts. '
          'Purchase eggs with Manna and watch them hatch into amazing AR companions!',
          style: AppTheme.bodyMedium,
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: Text('Got it!', style: AppTheme.labelLarge),
          ),
        ],
      ),
    );
  }

  void _showEarnManna() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('💰 Earn Manna by caring for your Sprouts! (Feature coming soon)'),
        backgroundColor: AppTheme.vanimalPurple,
      ),
    );
  }
}

class EggType {
  final String name;
  final String description;
  final int price;
  final String rarity;
  final Color color;
  final String imagePath;
  final Map<String, int> hatchChances;

  EggType({
    required this.name,
    required this.description,
    required this.price,
    required this.rarity,
    required this.color,
    required this.imagePath,
    required this.hatchChances,
  });
}