import 'package:flutter/material.dart';
import 'dart:math';
import '../theme/app_theme.dart';
import 'egg_shop_screen.dart';
import 'vanimal_detail_screen.dart';

class HatchingScreen extends StatefulWidget {
  final EggType eggType;

  const HatchingScreen({
    super.key,
    required this.eggType,
  });

  @override
  State<HatchingScreen> createState() => _HatchingScreenState();
}

class _HatchingScreenState extends State<HatchingScreen>
    with TickerProviderStateMixin {
  late AnimationController _shakeController;
  late AnimationController _crackController;
  late AnimationController _hatchController;
  late AnimationController _celebrationController;
  
  late Animation<double> _shakeAnimation;
  late Animation<double> _crackAnimation;
  late Animation<double> _hatchAnimation;
  late Animation<double> _celebrationAnimation;
  
  bool isShaking = false;
  bool isCracking = false;
  bool isHatched = false;
  bool showVanimal = false;
  
  HatchedVanimal? hatchedVanimal;
  int tapCount = 0;
  final int requiredTaps = 15;

  @override
  void initState() {
    super.initState();
    _setupAnimations();
    _generateHatchedVanimal();
  }

  void _setupAnimations() {
    _shakeController = AnimationController(
      duration: const Duration(milliseconds: 200),
      vsync: this,
    );
    
    _crackController = AnimationController(
      duration: const Duration(milliseconds: 500),
      vsync: this,
    );
    
    _hatchController = AnimationController(
      duration: const Duration(milliseconds: 800),
      vsync: this,
    );
    
    _celebrationController = AnimationController(
      duration: const Duration(milliseconds: 1500),
      vsync: this,
    );

    _shakeAnimation = Tween<double>(
      begin: 0,
      end: 10,
    ).animate(CurvedAnimation(
      parent: _shakeController,
      curve: Curves.elasticInOut,
    ));

    _crackAnimation = Tween<double>(
      begin: 0,
      end: 1,
    ).animate(CurvedAnimation(
      parent: _crackController,
      curve: Curves.easeInOut,
    ));

    _hatchAnimation = Tween<double>(
      begin: 0,
      end: 1,
    ).animate(CurvedAnimation(
      parent: _hatchController,
      curve: Curves.bounceOut,
    ));

    _celebrationAnimation = Tween<double>(
      begin: 0,
      end: 1,
    ).animate(CurvedAnimation(
      parent: _celebrationController,
      curve: Curves.elasticOut,
    ));

    _hatchController.addStatusListener((status) {
      if (status == AnimationStatus.completed) {
        setState(() {
          showVanimal = true;
        });
        _celebrationController.forward();
      }
    });
  }

  void _generateHatchedVanimal() {
    final random = Random();
    final hatchChances = widget.eggType.hatchChances;
    
    // Determine which Vanimal hatches based on probabilities
    int totalChance = hatchChances.values.reduce((a, b) => a + b);
    int randomValue = random.nextInt(totalChance);
    
    String selectedSpecies = '';
    int currentChance = 0;
    
    for (var entry in hatchChances.entries) {
      currentChance += entry.value;
      if (randomValue < currentChance) {
        selectedSpecies = entry.key;
        break;
      }
    }
    
    // Create the hatched Vanimal
    hatchedVanimal = HatchedVanimal(
      name: _generateVanimalName(selectedSpecies),
      species: selectedSpecies,
      level: 1,
      rarity: _determineRarity(selectedSpecies),
      color: _getSpeciesColor(selectedSpecies),
      imagePath: _getSpeciesImagePath(selectedSpecies),
    );
  }

  String _generateVanimalName(String species) {
    final prefixes = ['Cosmic', 'Stellar', 'Astro', 'Nova', 'Galactic', 'Nebula', 'Solar'];
    final suffixes = ['Star', 'Moon', 'Comet', 'Ray', 'Glow', 'Spark', 'Shine'];
    
    final random = Random();
    final prefix = prefixes[random.nextInt(prefixes.length)];
    final suffix = suffixes[random.nextInt(suffixes.length)];
    
    return '$prefix $species $suffix';
  }

  String _determineRarity(String species) {
    switch (species.toLowerCase()) {
      case 'pigeon':
      case 'urban bird':
      case 'city cat':
        return 'Common';
      case 'elephant':
      case 'rare bird':
      case 'forest creature':
        return 'Rare';
      case 'tiger':
      case 'epic beast':
        return 'Epic';
      case 'dragon':
      case 'phoenix':
      case 'cosmic entity':
        return 'Legendary';
      default:
        return widget.eggType.rarity;
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
      case 'dragon':
        return Colors.red;
      case 'phoenix':
        return Colors.deepOrange;
      default:
        return widget.eggType.color;
    }
  }

  String? _getSpeciesImagePath(String species) {
    switch (species.toLowerCase()) {
      case 'pigeon':
        return 'assets/images/animals/pigeon.png';
      case 'elephant':
        return 'assets/images/animals/elephant.png';
      case 'tiger':
        return 'assets/images/animals/tiger.png';
      case 'penguin':
        return 'assets/images/animals/penguin.png';
      default:
        return null;
    }
  }

  @override
  void dispose() {
    _shakeController.dispose();
    _crackController.dispose();
    _hatchController.dispose();
    _celebrationController.dispose();
    super.dispose();
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
          child: showVanimal ? _buildHatchedView() : _buildEggView(),
        ),
      ),
    );
  }

  Widget _buildEggView() {
    return Column(
      children: [
        _buildHeader(),
        const Spacer(),
        _buildEggAnimation(),
        const Spacer(),
        _buildInstructions(),
        _buildProgress(),
        const SizedBox(height: 40),
      ],
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
            'Hatching ${widget.eggType.name}',
            style: AppTheme.headlineMedium,
          ),
          const Spacer(),
          const SizedBox(width: 48), // Balance the back button
        ],
      ),
    );
  }

  Widget _buildEggAnimation() {
    return GestureDetector(
      onTap: _onEggTap,
      child: AnimatedBuilder(
        animation: Listenable.merge([
          _shakeAnimation,
          _crackAnimation,
          _hatchAnimation,
        ]),
        builder: (context, child) {
          return Transform.translate(
            offset: Offset(
              sin(_shakeAnimation.value) * 5,
              cos(_shakeAnimation.value) * 5,
            ),
            child: Container(
              width: 200,
              height: 250,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    widget.eggType.color.withOpacity(0.8),
                    widget.eggType.color.withOpacity(0.4),
                  ],
                ),
                boxShadow: [
                  BoxShadow(
                    color: widget.eggType.color.withOpacity(0.3),
                    blurRadius: 20,
                    spreadRadius: 5,
                  ),
                ],
              ),
              child: Stack(
                children: [
                  // Base egg
                  Center(
                    child: Image.asset(
                      widget.eggType.imagePath,
                      width: 120,
                      height: 150,
                      fit: BoxFit.contain,
                    ),
                  ),
                  
                  // Crack overlay
                  if (isCracking)
                    Center(
                      child: Opacity(
                        opacity: _crackAnimation.value,
                        child: CustomPaint(
                          size: const Size(120, 150),
                          painter: CrackPainter(_crackAnimation.value),
                        ),
                      ),
                    ),
                  
                  // Hatch effect
                  if (isHatched)
                    Center(
                      child: Transform.scale(
                        scale: _hatchAnimation.value,
                        child: Container(
                          width: 100,
                          height: 100,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color: Colors.white.withOpacity(0.8),
                          ),
                        ),
                      ),
                    ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildInstructions() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 40),
      child: Column(
        children: [
          Text(
            isHatched 
                ? 'Your Sprout is hatching!'
                : isCracking 
                    ? 'Keep tapping! It\'s starting to crack!'
                    : 'Tap the egg to help it hatch!',
            style: AppTheme.headlineSmall,
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 12),
          Text(
            isHatched
                ? 'Get ready to meet your new companion!'
                : 'Your gentle taps will encourage the Sprout inside to emerge.',
            style: AppTheme.bodyLarge.copyWith(
              color: Colors.white.withOpacity(0.8),
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildProgress() {
    double progress = tapCount / requiredTaps;
    
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 40, vertical: 20),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Hatching Progress',
                style: AppTheme.labelLarge,
              ),
              Text(
                '$tapCount/$requiredTaps',
                style: AppTheme.bodyMedium.copyWith(
                  color: widget.eggType.color,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          LinearProgressIndicator(
            value: progress,
            backgroundColor: Colors.white.withOpacity(0.2),
            valueColor: AlwaysStoppedAnimation<Color>(widget.eggType.color),
            minHeight: 8,
          ),
        ],
      ),
    );
  }

  Widget _buildHatchedView() {
    return AnimatedBuilder(
      animation: _celebrationAnimation,
      builder: (context, child) {
        return Column(
          children: [
            _buildHeader(),
            const Spacer(),
            
            // Celebration effects
            Transform.scale(
              scale: 0.8 + (_celebrationAnimation.value * 0.2),
              child: Column(
                children: [
                  // "Congratulations!" text
                  Text(
                    '🎉 Congratulations! 🎉',
                    style: AppTheme.headlineLarge.copyWith(
                      color: Colors.amber,
                    ),
                  ),
                  const SizedBox(height: 20),
                  
                  // Hatched Vanimal
                  Container(
                    width: 200,
                    height: 200,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(25),
                      gradient: LinearGradient(
                        colors: [
                          hatchedVanimal!.color.withOpacity(0.3),
                          Colors.black.withOpacity(0.8),
                        ],
                      ),
                      border: Border.all(
                        color: hatchedVanimal!.color,
                        width: 3,
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: hatchedVanimal!.color.withOpacity(0.5),
                          blurRadius: 20,
                          spreadRadius: 5,
                        ),
                      ],
                    ),
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(25),
                      child: hatchedVanimal!.imagePath != null
                          ? Image.asset(
                              hatchedVanimal!.imagePath!,
                              fit: BoxFit.cover,
                            )
                          : Icon(
                              Icons.pets,
                              size: 80,
                              color: hatchedVanimal!.color,
                            ),
                    ),
                  ),
                  
                  const SizedBox(height: 20),
                  
                  // Vanimal info
                  Text(
                    hatchedVanimal!.name,
                    style: AppTheme.headlineMedium,
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    '${hatchedVanimal!.species} • ${hatchedVanimal!.rarity}',
                    style: AppTheme.bodyLarge.copyWith(
                      color: hatchedVanimal!.color,
                    ),
                  ),
                ],
              ),
            ),
            
            const Spacer(),
            
            // Action buttons
            Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                children: [
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton.icon(
                      onPressed: _showNameDialog,
                      icon: const Icon(Icons.edit, size: 20),
                      label: const Text('Give it a Name!'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: hatchedVanimal!.color,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(15),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: ElevatedButton(
                          onPressed: _viewVanimalDetails,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.white.withOpacity(0.1),
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(vertical: 16),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(15),
                            ),
                          ),
                          child: const Text('View Details'),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: ElevatedButton(
                          onPressed: _returnToCollection,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppTheme.vanimalPurple,
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(vertical: 16),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(15),
                            ),
                          ),
                          child: const Text('Add to Collection'),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        );
      },
    );
  }

  void _onEggTap() {
    if (isHatched || showVanimal) return;
    
    setState(() {
      tapCount++;
    });
    
    // Shake animation
    _shakeController.forward().then((_) {
      _shakeController.reverse();
    });
    
    if (tapCount >= requiredTaps ~/ 2 && !isCracking) {
      setState(() {
        isCracking = true;
      });
      _crackController.forward();
    }
    
    if (tapCount >= requiredTaps && !isHatched) {
      setState(() {
        isHatched = true;
      });
      _hatchController.forward();
    }
  }

  void _viewVanimalDetails() {
    Navigator.of(context).pushReplacement(
      MaterialPageRoute(
        builder: (context) => VanimalDetailScreen(
          name: hatchedVanimal!.name,
          species: hatchedVanimal!.species,
          level: hatchedVanimal!.level,
          rarity: hatchedVanimal!.rarity,
          color: hatchedVanimal!.color,
          imagePath: hatchedVanimal!.imagePath,
        ),
      ),
    );
  }

  Future<void> _showNameDialog() async {
    final TextEditingController nameController = TextEditingController();

    final newName = await showDialog<String>(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: const Color(0xFF1a1a2e),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
        ),
        title: Column(
          children: [
            Text(
              hatchedVanimal!.species,
              style: TextStyle(
                color: hatchedVanimal!.color,
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              'Give your Sprout a name!',
              style: TextStyle(
                color: Colors.white,
                fontSize: 18,
              ),
            ),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: nameController,
              autofocus: true,
              maxLength: 20,
              style: const TextStyle(color: Colors.white, fontSize: 18),
              decoration: InputDecoration(
                hintText: 'Enter a name...',
                hintStyle: TextStyle(color: Colors.white.withOpacity(0.5)),
                enabledBorder: UnderlineInputBorder(
                  borderSide: BorderSide(color: hatchedVanimal!.color),
                ),
                focusedBorder: UnderlineInputBorder(
                  borderSide: BorderSide(color: hatchedVanimal!.color, width: 2),
                ),
                counterStyle: const TextStyle(color: Colors.white70),
              ),
            ),
            const SizedBox(height: 16),
            Text(
              'You can always change this later!',
              style: TextStyle(
                color: Colors.white.withOpacity(0.6),
                fontSize: 12,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text(
              'Skip',
              style: TextStyle(color: Colors.white70),
            ),
          ),
          ElevatedButton(
            onPressed: () {
              final name = nameController.text.trim();
              if (name.isNotEmpty) {
                Navigator.of(context).pop(name);
              } else {
                // Show error if empty
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Please enter a name'),
                    backgroundColor: Colors.red,
                    duration: Duration(seconds: 1),
                  ),
                );
              }
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: hatchedVanimal!.color,
              foregroundColor: Colors.white,
            ),
            child: const Text('Confirm'),
          ),
        ],
      ),
    );

    if (newName != null && newName.isNotEmpty) {
      setState(() {
        hatchedVanimal = HatchedVanimal(
          name: newName,
          species: hatchedVanimal!.species,
          level: hatchedVanimal!.level,
          rarity: hatchedVanimal!.rarity,
          color: hatchedVanimal!.color,
          imagePath: hatchedVanimal!.imagePath,
        );
      });

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('✨ Your Sprout is now named "$newName"!'),
            backgroundColor: Colors.green,
            duration: const Duration(seconds: 2),
          ),
        );
      }
    }
  }

  void _returnToCollection() {
    // Pop back to the collection screen (2 levels: this screen + shop screen)
    Navigator.of(context).pop(); // Pop hatching screen
    Navigator.of(context).pop(); // Pop shop screen

    // Show success message
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('🎉 ${hatchedVanimal!.name} added to your collection!'),
          backgroundColor: Colors.green,
          duration: const Duration(seconds: 3),
        ),
      );
    }
  }
}

class CrackPainter extends CustomPainter {
  final double progress;
  
  CrackPainter(this.progress);
  
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.black.withOpacity(0.8)
      ..strokeWidth = 2
      ..style = PaintingStyle.stroke;
    
    final center = Offset(size.width / 2, size.height / 2);
    
    // Draw cracks radiating from center
    for (int i = 0; i < 5; i++) {
      final angle = (i * 72) * (pi / 180); // 5 cracks, 72 degrees apart
      final length = (size.width / 3) * progress;
      
      final end = Offset(
        center.dx + cos(angle) * length,
        center.dy + sin(angle) * length,
      );
      
      canvas.drawLine(center, end, paint);
    }
  }
  
  @override
  bool shouldRepaint(CrackPainter oldDelegate) {
    return oldDelegate.progress != progress;
  }
}

class HatchedVanimal {
  final String name;
  final String species;
  final int level;
  final String rarity;
  final Color color;
  final String? imagePath;

  HatchedVanimal({
    required this.name,
    required this.species,
    required this.level,
    required this.rarity,
    required this.color,
    this.imagePath,
  });
}