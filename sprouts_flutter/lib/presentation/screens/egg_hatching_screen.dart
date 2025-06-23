import 'dart:math';
import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../../data/models/vanimal_model.dart';
import '../../data/repositories/breeding_repository.dart';
import 'ar_viewer_screen.dart';

class EggHatchingScreen extends StatefulWidget {
  final String eggName;
  final String eggType;
  final Color eggColor;
  final String description;

  const EggHatchingScreen({
    super.key,
    required this.eggName,
    required this.eggType,
    required this.eggColor,
    required this.description,
  });

  @override
  State<EggHatchingScreen> createState() => _EggHatchingScreenState();
}

class _EggHatchingScreenState extends State<EggHatchingScreen>
    with TickerProviderStateMixin {
  late AnimationController _eggController;
  late AnimationController _sparkleController;
  late AnimationController _hatchController;
  late Animation<double> _eggAnimation;
  late Animation<double> _sparkleAnimation;
  late Animation<double> _hatchAnimation;
  
  bool isHatching = false;
  bool hasHatched = false;
  VanimalModel? hatchedVanimal;

  @override
  void initState() {
    super.initState();
    
    _eggController = AnimationController(
      duration: const Duration(milliseconds: 1500),
      vsync: this,
    );
    
    _sparkleController = AnimationController(
      duration: const Duration(milliseconds: 2000),
      vsync: this,
    );
    
    _hatchController = AnimationController(
      duration: const Duration(milliseconds: 3000),
      vsync: this,
    );
    
    _eggAnimation = Tween<double>(
      begin: 1.0,
      end: 1.1,
    ).animate(CurvedAnimation(
      parent: _eggController,
      curve: Curves.easeInOut,
    ));
    
    _sparkleAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _sparkleController,
      curve: Curves.easeInOut,
    ));
    
    _hatchAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _hatchController,
      curve: Curves.elasticOut,
    ));

    _eggController.repeat(reverse: true);
    _sparkleController.repeat();
  }

  @override
  void dispose() {
    _eggController.dispose();
    _sparkleController.dispose();
    _hatchController.dispose();
    super.dispose();
  }

  Future<void> _hatchEgg() async {
    setState(() => isHatching = true);
    
    // Stop the idle animations
    _eggController.stop();
    _sparkleController.stop();
    
    // Generate a new Vanimal
    final newVanimal = _generateVanimalFromEgg();
    
    // Start hatching animation
    _hatchController.forward();
    
    // Wait for animation
    await Future.delayed(const Duration(milliseconds: 3000));
    
    setState(() {
      hasHatched = true;
      hatchedVanimal = newVanimal;
      isHatching = false;
    });
    
    // Show success message
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('🎉 ${newVanimal.name} has hatched!'),
          backgroundColor: Colors.green,
          duration: const Duration(seconds: 3),
        ),
      );
    }
  }

  VanimalModel _generateVanimalFromEgg() {
    final random = Random();
    final species = _getSpeciesFromEggType();
    final name = _generateName(species);
    
    return VanimalModel(
      id: 'hatched_${DateTime.now().millisecondsSinceEpoch}',
      name: name,
      species: species,
      location: 'North America',
      habitat: 'Urban',
      stats: VanimalStats(
        speed: 30 + random.nextInt(40),
        strength: 30 + random.nextInt(40),
        intelligence: 30 + random.nextInt(40),
        size: 30 + random.nextInt(40),
        versatility: 30 + random.nextInt(40),
        reproductiveSpeed: 30 + random.nextInt(40),
      ),
      visuals: VanimalVisuals(
        logo: 'assets/images/animals/$species.png',
        logoDetailed: 'assets/images/animals/$species.png',
        bgImage: 'assets/images/backgrounds/space_bg.jpg',
        modelPath: 'assets/models/$species.glb',
        modelScale: 1.0,
        childNodeName: species,
        runningEnabled: true,
      ),
      state: VanimalState(
        feedLevel: 1.0,
        sleepLevel: 1.0,
        lastFed: DateTime.now(),
        lastSlept: DateTime.now(),
        experience: 0,
        level: 1,
      ),
      createdAt: DateTime.now(),
      updatedAt: DateTime.now(),
    );
  }

  String _getSpeciesFromEggType() {
    switch (widget.eggType.toLowerCase()) {
      case 'common':
        final species = ['pigeon', 'penguin'];
        return species[Random().nextInt(species.length)];
      case 'rare':
        final species = ['elephant', 'tiger'];
        return species[Random().nextInt(species.length)];
      case 'epic':
        return 'axolotl';
      default:
        return 'pigeon';
    }
  }

  String _generateName(String species) {
    final names = {
      'pigeon': ['Pip', 'Sky', 'Feather', 'Coo', 'Wing'],
      'penguin': ['Waddle', 'Ice', 'Flipper', 'Snow', 'Polar'],
      'elephant': ['Trunk', 'Jumbo', 'Peanut', 'Stampy', 'Ella'],
      'tiger': ['Stripe', 'Prowl', 'Whiskers', 'Roar', 'Amber'],
      'axolotl': ['Gilly', 'Aqua', 'Bubble', 'Flow', 'Splash'],
    };
    
    final speciesNames = names[species] ?? ['Buddy'];
    return speciesNames[Random().nextInt(speciesNames.length)];
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(hasHatched ? 'Congratulations!' : widget.eggName),
        backgroundColor: widget.eggColor,
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
              if (!hasHatched) _buildSparkleEffect(),
              
              // Main content
              SingleChildScrollView(
                padding: const EdgeInsets.all(16),
                child: Column(
                  children: [
                    if (!hasHatched) ...[
                      // Egg display and info
                      _buildEggDisplay(),
                      const SizedBox(height: 20),
                      _buildEggInfo(),
                      const SizedBox(height: 30),
                      _buildHatchButton(),
                    ] else ...[
                      // Hatched Vanimal display
                      _buildHatchedVanimalDisplay(),
                      const SizedBox(height: 20),
                      _buildVanimalStats(),
                      const SizedBox(height: 20),
                      _buildActionButtons(),
                    ],
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
          children: List.generate(20, (index) {
            final random = (index * 137.5) % 360;
            final radius = 100 + (index * 15) % 200;
            final angle = random + (_sparkleAnimation.value * 360);
            
            final x = MediaQuery.of(context).size.width / 2 + 
                     radius * 0.3 * cos(angle * pi / 180);
            final y = MediaQuery.of(context).size.height / 2 + 
                     radius * 0.3 * sin(angle * pi / 180);
            
            return Positioned(
              left: x,
              top: y,
              child: Opacity(
                opacity: ((0.2 + (index % 3) * 0.2) * _sparkleAnimation.value).clamp(0.0, 1.0),
                child: Icon(
                  Icons.star,
                  color: [
                    widget.eggColor,
                    Colors.white,
                    Colors.yellow,
                  ][index % 3],
                  size: 8 + (index % 3) * 4,
                ),
              ),
            );
          }),
        );
      },
    );
  }

  Widget _buildEggDisplay() {
    return AnimatedBuilder(
      animation: Listenable.merge([_eggAnimation, _hatchAnimation]),
      builder: (context, child) {
        return Transform.scale(
          scale: isHatching ? (1.0 + _hatchAnimation.value * 0.5) : _eggAnimation.value,
          child: Container(
            width: 200,
            height: 250,
            decoration: BoxDecoration(
              gradient: RadialGradient(
                colors: [
                  widget.eggColor.withOpacity(0.8),
                  widget.eggColor,
                  widget.eggColor.withOpacity(0.6),
                ],
              ),
              shape: BoxShape.circle,
              boxShadow: [
                BoxShadow(
                  color: widget.eggColor.withOpacity(0.4),
                  blurRadius: 30,
                  spreadRadius: 10,
                ),
              ],
            ),
            child: Stack(
              alignment: Alignment.center,
              children: [
                Icon(
                  Icons.egg,
                  size: 120,
                  color: Colors.white,
                ),
                if (isHatching)
                  Opacity(
                    opacity: _hatchAnimation.value.clamp(0.0, 1.0),
                    child: Container(
                      width: 150,
                      height: 150,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: Colors.white.withOpacity(0.9.clamp(0.0, 1.0)),
                      ),
                      child: const Icon(
                        Icons.pets,
                        size: 80,
                        color: AppTheme.vanimalPurple,
                      ),
                    ),
                  ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildEggInfo() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.black.withOpacity(0.8),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: widget.eggColor.withOpacity(0.5)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(Icons.info_outline, color: widget.eggColor, size: 24),
              const SizedBox(width: 12),
              Text(
                'Egg Information',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          _buildInfoRow('Type', widget.eggType),
          _buildInfoRow('Rarity', widget.eggType),
          _buildInfoRow('Status', 'Ready to Hatch'),
          _buildInfoRow('Description', widget.description),
          const SizedBox(height: 12),
          const Text(
            'This egg contains a baby Sprout waiting to meet you! Tap hatch to discover what\'s inside.',
            style: TextStyle(
              color: Colors.white70,
              fontSize: 12,
              fontStyle: FontStyle.italic,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 80,
            child: Text(
              '$label:',
              style: const TextStyle(color: Colors.white70, fontSize: 14),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: TextStyle(
                color: widget.eggColor,
                fontSize: 14,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHatchButton() {
    return SizedBox(
      width: double.infinity,
      child: ElevatedButton.icon(
        onPressed: isHatching ? null : _hatchEgg,
        icon: isHatching
            ? const SizedBox(
                width: 20,
                height: 20,
                child: CircularProgressIndicator(
                  strokeWidth: 2,
                  color: Colors.white,
                ),
              )
            : const Icon(Icons.touch_app, size: 24),
        label: Text(
          isHatching ? 'Hatching...' : 'Hatch Egg',
          style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
        ),
        style: ElevatedButton.styleFrom(
          backgroundColor: widget.eggColor,
          foregroundColor: Colors.white,
          padding: const EdgeInsets.symmetric(vertical: 16),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
        ),
      ),
    );
  }

  Widget _buildHatchedVanimalDisplay() {
    if (hatchedVanimal == null) return const SizedBox.shrink();
    
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            AppTheme.vanimalPurple.withOpacity(0.8),
            AppTheme.vanimalPink.withOpacity(0.8),
          ],
        ),
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: AppTheme.vanimalPurple.withOpacity(0.3),
            blurRadius: 20,
            spreadRadius: 5,
          ),
        ],
      ),
      child: Column(
        children: [
          const Text(
            'Meet Your New Sprout!',
            style: TextStyle(
              color: Colors.white,
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 20),
          
          Container(
            width: 120,
            height: 120,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: Colors.white.withOpacity(0.2),
              border: Border.all(color: Colors.white, width: 3),
            ),
            child: const Icon(
              Icons.pets,
              color: Colors.white,
              size: 60,
            ),
          ),
          
          const SizedBox(height: 16),
          
          Text(
            hatchedVanimal!.name,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 22,
              fontWeight: FontWeight.bold,
            ),
          ),
          
          const SizedBox(height: 4),
          
          Text(
            '${hatchedVanimal!.species.toUpperCase()} • Level ${hatchedVanimal!.state.level}',
            style: const TextStyle(
              color: Colors.white70,
              fontSize: 14,
            ),
          ),
          
          const SizedBox(height: 8),
          
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.2),
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Text(
              '🍼 Newborn',
              style: TextStyle(
                color: Colors.white,
                fontSize: 12,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildVanimalStats() {
    if (hatchedVanimal == null) return const SizedBox.shrink();
    
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
            'Stats',
            style: TextStyle(
              color: Colors.white,
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),
          
          GridView.count(
            crossAxisCount: 2,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            crossAxisSpacing: 12,
            mainAxisSpacing: 12,
            childAspectRatio: 3,
            children: [
              _buildStatCard('Speed', hatchedVanimal!.stats.speed),
              _buildStatCard('Strength', hatchedVanimal!.stats.strength),
              _buildStatCard('Intelligence', hatchedVanimal!.stats.intelligence),
              _buildStatCard('Size', hatchedVanimal!.stats.size),
              _buildStatCard('Versatility', hatchedVanimal!.stats.versatility),
              _buildStatCard('Repro Speed', hatchedVanimal!.stats.reproductiveSpeed),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildStatCard(String label, int value) {
    return Container(
      padding: const EdgeInsets.all(8),
      decoration: BoxDecoration(
        color: AppTheme.vanimalPurple.withOpacity(0.3),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(
            label,
            style: const TextStyle(
              color: Colors.white70,
              fontSize: 10,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            value.toString(),
            style: const TextStyle(
              color: Colors.white,
              fontSize: 16,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActionButtons() {
    if (hatchedVanimal == null) return const SizedBox.shrink();
    
    return Column(
      children: [
        Row(
          children: [
            Expanded(
              child: ElevatedButton.icon(
                onPressed: () {
                  Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (context) => ARViewerScreen(
                        vanimalName: hatchedVanimal!.name,
                        vanimalSpecies: hatchedVanimal!.species,
                        modelPath: hatchedVanimal!.visuals.modelPath,
                      ),
                    ),
                  );
                },
                icon: const Icon(Icons.view_in_ar, size: 20),
                label: const Text('View in AR'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.vanimalPurple,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 12),
                ),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: ElevatedButton.icon(
                onPressed: () {
                  Navigator.of(context).pop();
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text('${hatchedVanimal!.name} added to your collection!'),
                      backgroundColor: Colors.green,
                    ),
                  );
                },
                icon: const Icon(Icons.check, size: 20),
                label: const Text('Add to Collection'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.green,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 12),
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        SizedBox(
          width: double.infinity,
          child: TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text(
              'Back to Collection',
              style: TextStyle(color: Colors.white70),
            ),
          ),
        ),
      ],
    );
  }
}