import 'dart:math';
import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../../data/models/breeding_model.dart';
import '../../data/models/vanimal_model.dart';
import '../../data/repositories/breeding_repository.dart';
import 'collection_screen.dart';

class BreedingResultScreen extends StatefulWidget {
  final BreedingSession session;

  const BreedingResultScreen({
    super.key,
    required this.session,
  });

  @override
  State<BreedingResultScreen> createState() => _BreedingResultScreenState();
}

class _BreedingResultScreenState extends State<BreedingResultScreen>
    with TickerProviderStateMixin {
  late AnimationController _sparkleController;
  late AnimationController _slideController;
  late AnimationController _scaleController;
  late Animation<double> _sparkleAnimation;
  late Animation<Offset> _slideAnimation;
  late Animation<double> _scaleAnimation;
  bool _showDetails = false;
  bool _isClaming = false;

  @override
  void initState() {
    super.initState();
    
    // Setup animations
    _sparkleController = AnimationController(
      duration: const Duration(milliseconds: 2000),
      vsync: this,
    );
    
    _slideController = AnimationController(
      duration: const Duration(milliseconds: 800),
      vsync: this,
    );
    
    _scaleController = AnimationController(
      duration: const Duration(milliseconds: 600),
      vsync: this,
    );
    
    _sparkleAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _sparkleController,
      curve: Curves.easeInOut,
    ));
    
    _slideAnimation = Tween<Offset>(
      begin: const Offset(0, 1),
      end: Offset.zero,
    ).animate(CurvedAnimation(
      parent: _slideController,
      curve: Curves.elasticOut,
    ));
    
    _scaleAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _scaleController,
      curve: Curves.bounceOut,
    ));

    // Start animations
    _sparkleController.repeat();
    
    // Delayed animations for dramatic effect
    Future.delayed(const Duration(milliseconds: 500), () {
      _scaleController.forward();
    });
    
    Future.delayed(const Duration(milliseconds: 1000), () {
      _slideController.forward();
      setState(() => _showDetails = true);
    });
  }

  @override
  void dispose() {
    _sparkleController.dispose();
    _slideController.dispose();
    _scaleController.dispose();
    super.dispose();
  }

  Future<void> _claimOffspring() async {
    setState(() => _isClaming = true);
    
    try {
      final offspring = await BreedingRepository.claimOffspring(widget.session.id);
      
      if (mounted) {
        // Show success message and navigate to collection
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('${offspring.name} has been added to your collection!'),
            backgroundColor: Colors.green,
            duration: const Duration(seconds: 3),
          ),
        );
        
        // Navigate to collection screen
        Navigator.of(context).pushAndRemoveUntil(
          MaterialPageRoute(builder: (context) => const CollectionScreen()),
          (route) => false,
        );
      }
    } catch (e) {
      setState(() => _isClaming = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to claim offspring: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final offspring = widget.session.offspring;
    if (offspring == null) {
      return const Scaffold(
        body: Center(
          child: Text('No offspring data available'),
        ),
      );
    }

    return Scaffold(
      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: const BoxDecoration(
          image: DecorationImage(
            image: AssetImage('assets/images/backgrounds/space_bg.jpg'),
            fit: BoxFit.cover,
          ),
        ),
        child: SafeArea(
          child: Stack(
            children: [
              // Sparkle effect background
              _buildSparkleEffect(),
              
              // Main content
              SingleChildScrollView(
                padding: const EdgeInsets.all(16),
                child: Column(
                  children: [
                    const SizedBox(height: 40),
                    
                    // Success header
                    _buildSuccessHeader(),
                    
                    const SizedBox(height: 30),
                    
                    // Offspring reveal
                    _buildOffspringReveal(offspring),
                    
                    const SizedBox(height: 30),
                    
                    // Offspring details (animated)
                    if (_showDetails) _buildOffspringDetails(offspring),
                    
                    const SizedBox(height: 20),
                    
                    // Parents comparison
                    if (_showDetails) _buildParentsComparison(),
                    
                    const SizedBox(height: 30),
                    
                    // Action buttons
                    if (_showDetails) _buildActionButtons(),
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
            final random = (index * 137.5) % 360; // Golden angle for distribution
            final radius = 100 + (index * 10) % 200;
            final angle = random + (_sparkleAnimation.value * 360);
            
            final x = MediaQuery.of(context).size.width / 2 + 
                     radius * 0.5 * cos(angle * pi / 180);
            final y = MediaQuery.of(context).size.height / 2 + 
                     radius * 0.5 * sin(angle * pi / 180);
            
            return Positioned(
              left: x,
              top: y,
              child: Opacity(
                opacity: (0.3 + (index % 3) * 0.3) * _sparkleAnimation.value,
                child: Icon(
                  Icons.star,
                  color: [
                    Colors.white,
                    AppTheme.vanimalPink,
                    AppTheme.vanimalPurple,
                    Colors.yellow,
                  ][index % 4],
                  size: 8 + (index % 3) * 4,
                ),
              ),
            );
          }),
        );
      },
    );
  }

  Widget _buildSuccessHeader() {
    return Column(
      children: [
        ScaleTransition(
          scale: _scaleAnimation,
          child: Container(
            width: 80,
            height: 80,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: Colors.green,
              boxShadow: [
                BoxShadow(
                  color: Colors.green.withOpacity(0.5),
                  blurRadius: 20,
                  spreadRadius: 5,
                ),
              ],
            ),
            child: const Icon(
              Icons.celebration,
              color: Colors.white,
              size: 40,
            ),
          ),
        ),
        const SizedBox(height: 16),
        const Text(
          'Breeding Successful!',
          style: TextStyle(
            color: Colors.white,
            fontSize: 24,
            fontWeight: FontWeight.bold,
          ),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 8),
        const Text(
          'Congratulations! Your Vanimals have successfully created new life.',
          style: TextStyle(
            color: Colors.white70,
            fontSize: 14,
          ),
          textAlign: TextAlign.center,
        ),
      ],
    );
  }

  Widget _buildOffspringReveal(VanimalModel offspring) {
    return ScaleTransition(
      scale: _scaleAnimation,
      child: Container(
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [
              AppTheme.vanimalPurple.withOpacity(0.8),
              AppTheme.vanimalPink.withOpacity(0.8),
            ],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          borderRadius: BorderRadius.circular(20),
          boxShadow: [
            BoxShadow(
              color: AppTheme.vanimalPink.withOpacity(0.3),
              blurRadius: 20,
              spreadRadius: 5,
            ),
          ],
        ),
        child: Column(
          children: [
            const Text(
              'Meet Your New Offspring',
              style: TextStyle(
                color: Colors.white,
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 20),
            
            // Offspring avatar
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
            
            // Offspring name
            Text(
              offspring.name,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            
            const SizedBox(height: 4),
            
            // Species and level
            Text(
              '${offspring.species.toUpperCase()} • Level ${offspring.state.level}',
              style: const TextStyle(
                color: Colors.white70,
                fontSize: 14,
              ),
            ),
            
            const SizedBox(height: 8),
            
            // Baby indicator
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.2),
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Text(
                '👶 Newborn',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildOffspringDetails(VanimalModel offspring) {
    return SlideTransition(
      position: _slideAnimation,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.black.withOpacity(0.8),
          borderRadius: BorderRadius.circular(16),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Offspring Stats',
              style: TextStyle(
                color: Colors.white,
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            
            // Stats grid
            GridView.count(
              crossAxisCount: 2,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisSpacing: 12,
              mainAxisSpacing: 12,
              childAspectRatio: 3,
              children: [
                _buildStatCard('Speed', offspring.stats.speed),
                _buildStatCard('Strength', offspring.stats.strength),
                _buildStatCard('Intelligence', offspring.stats.intelligence),
                _buildStatCard('Size', offspring.stats.size),
                _buildStatCard('Versatility', offspring.stats.versatility),
                _buildStatCard('Repro Speed', offspring.stats.reproductiveSpeed),
              ],
            ),
            
            const SizedBox(height: 16),
            
            // Additional info
            _buildInfoSection('Born', _formatDateTime(offspring.createdAt)),
            _buildInfoSection('Health', '100% (Perfect)'),
            _buildInfoSection('Experience', '0 XP (Ready to grow!)'),
          ],
        ),
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
              fontSize: 14,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInfoSection(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: const TextStyle(color: Colors.white70, fontSize: 12),
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

  Widget _buildParentsComparison() {
    return SlideTransition(
      position: _slideAnimation,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppTheme.vanimalPurple.withOpacity(0.2),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: AppTheme.vanimalPurple.withOpacity(0.5)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Inherited from Parents',
              style: TextStyle(
                color: Colors.white,
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(child: _buildParentSummary('Parent 1', widget.session.parent1)),
                const Padding(
                  padding: EdgeInsets.symmetric(horizontal: 8),
                  child: Icon(Icons.add, color: Colors.white70, size: 20),
                ),
                Expanded(child: _buildParentSummary('Parent 2', widget.session.parent2)),
              ],
            ),
            const SizedBox(height: 12),
            const Center(
              child: Text(
                '= Unique Genetic Combination',
                style: TextStyle(
                  color: AppTheme.vanimalPink,
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildParentSummary(String label, VanimalModel parent) {
    final totalStats = parent.stats.speed + parent.stats.strength + 
                      parent.stats.intelligence + parent.stats.size + 
                      parent.stats.versatility + parent.stats.reproductiveSpeed;
    
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.1),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Column(
        children: [
          Text(
            label,
            style: const TextStyle(color: Colors.white70, fontSize: 10),
          ),
          const SizedBox(height: 4),
          Text(
            parent.name,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 12,
              fontWeight: FontWeight.bold,
            ),
          ),
          Text(
            'Total Stats: $totalStats',
            style: const TextStyle(color: Colors.white70, fontSize: 10),
          ),
        ],
      ),
    );
  }

  Widget _buildActionButtons() {
    return SlideTransition(
      position: _slideAnimation,
      child: Column(
        children: [
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: _isClaming ? null : _claimOffspring,
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.green,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              child: _isClaming
                  ? const Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        SizedBox(
                          width: 20,
                          height: 20,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            color: Colors.white,
                          ),
                        ),
                        SizedBox(width: 12),
                        Text('Adding to Collection...'),
                      ],
                    )
                  : const Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.pets, size: 20),
                        SizedBox(width: 8),
                        Text(
                          'Claim Your Offspring',
                          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
            ),
          ),
          const SizedBox(height: 12),
          SizedBox(
            width: double.infinity,
            child: TextButton(
              onPressed: _isClaming ? null : () {
                Navigator.of(context).pushAndRemoveUntil(
                  MaterialPageRoute(builder: (context) => const CollectionScreen()),
                  (route) => false,
                );
              },
              child: const Text(
                'View Collection',
                style: TextStyle(color: Colors.white70),
              ),
            ),
          ),
        ],
      ),
    );
  }

  String _formatDateTime(DateTime dateTime) {
    return '${dateTime.day}/${dateTime.month}/${dateTime.year} at ${dateTime.hour}:${dateTime.minute.toString().padLeft(2, '0')}';
  }
}