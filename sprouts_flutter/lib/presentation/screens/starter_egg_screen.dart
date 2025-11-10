import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'dart:math';
import '../../core/constants/app_constants.dart';
import '../../data/services/web3auth_service.dart';
import 'collection_screen.dart';

/// Screen for hatching the starter Sprout egg during onboarding
/// User taps the egg multiple times to hatch it - MAGICAL VERSION!
class StarterEggScreen extends StatefulWidget {
  const StarterEggScreen({Key? key}) : super(key: key);

  @override
  State<StarterEggScreen> createState() => _StarterEggScreenState();
}

class _StarterEggScreenState extends State<StarterEggScreen>
    with TickerProviderStateMixin {
  bool _isHatching = false;
  bool _hasHatched = false;
  int _tapCount = 0;
  final int _tapsRequired = 5;

  late AnimationController _shakeController;
  late AnimationController _crackController;
  late AnimationController _revealController;
  late AnimationController _glowController;
  late AnimationController _particleController;
  late AnimationController _floatController;

  late Animation<double> _shakeAnimation;
  late Animation<double> _scaleAnimation;
  late Animation<double> _glowAnimation;
  late Animation<double> _particleAnimation;
  late Animation<double> _floatAnimation;

  Map<String, dynamic>? _hatchedSprout;
  final List<Particle> _particles = [];

  @override
  void initState() {
    super.initState();

    // Shake animation when tapping - more dynamic
    _shakeController = AnimationController(
      duration: const Duration(milliseconds: 400),
      vsync: this,
    );
    _shakeAnimation = Tween<double>(begin: 0, end: 1).animate(
      CurvedAnimation(parent: _shakeController, curve: Curves.elasticOut),
    );

    // Crack animation
    _crackController = AnimationController(
      duration: const Duration(milliseconds: 1200),
      vsync: this,
    );

    // Reveal animation with bounce
    _revealController = AnimationController(
      duration: const Duration(milliseconds: 2000),
      vsync: this,
    );
    _scaleAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _revealController,
        curve: Curves.elasticOut,
      ),
    );

    // Glow pulse animation (continuous)
    _glowController = AnimationController(
      duration: const Duration(milliseconds: 2000),
      vsync: this,
    )..repeat(reverse: true);
    _glowAnimation = Tween<double>(begin: 0.3, end: 1.0).animate(
      CurvedAnimation(parent: _glowController, curve: Curves.easeInOut),
    );

    // Particle burst animation
    _particleController = AnimationController(
      duration: const Duration(milliseconds: 1500),
      vsync: this,
    );
    _particleAnimation = Tween<double>(begin: 0, end: 1).animate(
      CurvedAnimation(parent: _particleController, curve: Curves.easeOut),
    );

    // Floating animation for egg
    _floatController = AnimationController(
      duration: const Duration(milliseconds: 3000),
      vsync: this,
    )..repeat(reverse: true);
    _floatAnimation = Tween<double>(begin: -10, end: 10).animate(
      CurvedAnimation(parent: _floatController, curve: Curves.easeInOut),
    );

    // Generate initial particles
    _generateParticles();
  }

  void _generateParticles() {
    final random = Random();
    _particles.clear();
    for (int i = 0; i < 30; i++) {
      _particles.add(Particle(
        angle: random.nextDouble() * 2 * pi,
        speed: 50 + random.nextDouble() * 100,
        size: 2 + random.nextDouble() * 4,
        color: [
          const Color(0xFF4CAF50),
          const Color(0xFF8BC34A),
          const Color(0xFFFFEB3B),
          Colors.white,
        ][random.nextInt(4)],
      ));
    }
  }

  @override
  void dispose() {
    _shakeController.dispose();
    _crackController.dispose();
    _revealController.dispose();
    _glowController.dispose();
    _particleController.dispose();
    _floatController.dispose();
    super.dispose();
  }

  Future<void> _onEggTap() async {
    if (_isHatching || _hasHatched) return;

    setState(() {
      _tapCount++;
    });

    // Shake the egg with increasing intensity
    _shakeController.forward(from: 0);

    // Burst particles on tap
    _generateParticles();
    _particleController.forward(from: 0);

    // Haptic feedback would go here if available
    // HapticFeedback.mediumImpact();

    // If enough taps, hatch the egg
    if (_tapCount >= _tapsRequired) {
      await _hatchEgg();
    }
  }

  Future<void> _hatchEgg() async {
    setState(() {
      _isHatching = true;
    });

    try {
      // Get user ID
      final userId = await Web3AuthService.getUserId();
      print('🔍 Retrieved userId for hatching: $userId');

      if (userId == null) {
        throw Exception('User not authenticated');
      }

      // Call hatch API
      print('🥚 Calling hatch endpoint: ${AppConstants.baseUrl}/api/auth/hatch-egg/$userId');
      final response = await http.post(
        Uri.parse('${AppConstants.baseUrl}/api/auth/hatch-egg/$userId'),
        headers: {'Content-Type': 'application/json'},
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);

        // Play crack animation
        await _crackController.forward();

        setState(() {
          _hasHatched = true;
          _hatchedSprout = data['sprout'];
        });

        // Play reveal animation
        await _revealController.forward();

        // Wait to let user see the Sprout
        await Future.delayed(const Duration(seconds: 3));

        // Navigate to collection
        if (mounted) {
          Navigator.of(context).pushReplacement(
            MaterialPageRoute(
              builder: (context) => const CollectionScreen(),
            ),
          );
        }
      } else {
        throw Exception('Failed to hatch egg: ${response.body}');
      }
    } catch (e) {
      print('Error hatching egg: $e');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error hatching egg: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
      setState(() {
        _isHatching = false;
      });
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
              Color(0xFF1a1a2e),
              Color(0xFF16213e),
              Color(0xFF0f3460),
            ],
          ),
        ),
        child: SafeArea(
          child: Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(24),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  if (!_hasHatched) ...[
                    // Title
                    const Text(
                      'Your First Sprout!',
                      style: TextStyle(
                        fontSize: 32,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'Tap the egg to hatch it',
                      style: TextStyle(
                        fontSize: 18,
                        color: Colors.white70,
                      ),
                    ),
                    const SizedBox(height: 60),

                    // Egg with magical animations
                    SizedBox(
                      width: 300,
                      height: 300,
                      child: Stack(
                        alignment: Alignment.center,
                        children: [
                          // Particle burst effect
                          AnimatedBuilder(
                            animation: _particleAnimation,
                            builder: (context, child) {
                              return CustomPaint(
                                size: const Size(300, 300),
                                painter: ParticlePainter(
                                  particles: _particles,
                                  progress: _particleAnimation.value,
                                ),
                              );
                            },
                          ),

                          // Floating glow effect
                          AnimatedBuilder(
                            animation: Listenable.merge([_glowAnimation, _floatAnimation]),
                            builder: (context, child) {
                              return Transform.translate(
                                offset: Offset(0, _floatAnimation.value),
                                child: Container(
                                  width: 220,
                                  height: 280,
                                  decoration: BoxDecoration(
                                    shape: BoxShape.circle,
                                    boxShadow: [
                                      BoxShadow(
                                        color: const Color(0xFF4CAF50).withOpacity(_glowAnimation.value * 0.6),
                                        blurRadius: 40 + (_glowAnimation.value * 20),
                                        spreadRadius: 10 + (_glowAnimation.value * 10),
                                      ),
                                    ],
                                  ),
                                ),
                              );
                            },
                          ),

                          // Egg with tap interaction
                          GestureDetector(
                            onTap: _onEggTap,
                            child: AnimatedBuilder(
                              animation: Listenable.merge([_shakeAnimation, _floatAnimation]),
                              builder: (context, child) {
                                final shake = _shakeAnimation.value;
                                return Transform.translate(
                                  offset: Offset(0, _floatAnimation.value),
                                  child: Transform.rotate(
                                    angle: (shake * 0.3) * ((_tapCount % 2 == 0) ? 1 : -1),
                                    child: Transform.scale(
                                      scale: 1.0 + (shake * 0.1),
                                      child: AnimatedBuilder(
                                        animation: _crackController,
                                        builder: (context, child) {
                                          return Stack(
                                            alignment: Alignment.center,
                                            children: [
                                              // Egg
                                              Container(
                                                width: 200,
                                                height: 260,
                                                decoration: BoxDecoration(
                                                  gradient: LinearGradient(
                                                    begin: Alignment.topLeft,
                                                    end: Alignment.bottomRight,
                                                    colors: [
                                                      Color(0xFFE8F5E9),
                                                      Color(0xFFC8E6C9),
                                                      Color(0xFFA5D6A7).withOpacity(1.0 - (_crackController.value * 0.5)),
                                                    ],
                                                  ),
                                                  borderRadius: BorderRadius.circular(100),
                                                  boxShadow: [
                                                    BoxShadow(
                                                      color: Colors.black.withOpacity(0.3),
                                                      blurRadius: 20,
                                                      offset: const Offset(0, 10),
                                                    ),
                                                  ],
                                                ),
                                                child: Center(
                                                  child: Text(
                                                    '🥚',
                                                    style: TextStyle(
                                                      fontSize: 120,
                                                      shadows: [
                                                        Shadow(
                                                          color: Colors.white.withOpacity(0.5),
                                                          blurRadius: 10,
                                                        ),
                                                      ],
                                                    ),
                                                  ),
                                                ),
                                              ),

                                              // Crack effect
                                              if (_crackController.value > 0)
                                                Opacity(
                                                  opacity: _crackController.value,
                                                  child: CustomPaint(
                                                    size: const Size(200, 260),
                                                    painter: CrackPainter(
                                                      progress: _crackController.value,
                                                    ),
                                                  ),
                                                ),

                                              // Light burst from cracks
                                              if (_crackController.value > 0.5)
                                                Opacity(
                                                  opacity: (_crackController.value - 0.5) * 2,
                                                  child: Container(
                                                    width: 200,
                                                    height: 260,
                                                    decoration: BoxDecoration(
                                                      shape: BoxShape.circle,
                                                      gradient: RadialGradient(
                                                        colors: [
                                                          const Color(0xFFFFEB3B).withOpacity(0.8),
                                                          Colors.transparent,
                                                        ],
                                                      ),
                                                    ),
                                                  ),
                                                ),
                                            ],
                                          );
                                        },
                                      ),
                                    ),
                                  ),
                                );
                              },
                            ),
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 40),

                    // Progress indicator
                    Column(
                      children: [
                        Text(
                          '$_tapCount / $_tapsRequired taps',
                          style: const TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFF4CAF50),
                          ),
                        ),
                        const SizedBox(height: 16),
                        Container(
                          width: 200,
                          height: 8,
                          decoration: BoxDecoration(
                            color: Colors.white.withOpacity(0.2),
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: FractionallySizedBox(
                            alignment: Alignment.centerLeft,
                            widthFactor: _tapCount / _tapsRequired,
                            child: Container(
                              decoration: BoxDecoration(
                                gradient: const LinearGradient(
                                  colors: [Color(0xFF4CAF50), Color(0xFF8BC34A)],
                                ),
                                borderRadius: BorderRadius.circular(4),
                                boxShadow: [
                                  BoxShadow(
                                    color: const Color(0xFF4CAF50).withOpacity(0.5),
                                    blurRadius: 8,
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ] else ...[
                    // Hatched Sprout reveal
                    ScaleTransition(
                      scale: _scaleAnimation,
                      child: Column(
                        children: [
                          const Text(
                            '🎉 Congratulations! 🎉',
                            style: TextStyle(
                              fontSize: 32,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                          ),
                          const SizedBox(height: 20),
                          Container(
                            width: 200,
                            height: 200,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              gradient: RadialGradient(
                                colors: [
                                  const Color(0xFF4CAF50).withOpacity(0.3),
                                  Colors.transparent,
                                ],
                              ),
                            ),
                            child: const Center(
                              child: Text(
                                '🌱',
                                style: TextStyle(fontSize: 120),
                              ),
                            ),
                          ),
                          const SizedBox(height: 20),
                          Text(
                            _hatchedSprout?['name'] ?? 'Your Sprout',
                            style: const TextStyle(
                              fontSize: 28,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            _hatchedSprout?['species'] ?? 'Baby Sprout',
                            style: const TextStyle(
                              fontSize: 18,
                              color: Colors.white70,
                            ),
                          ),
                          const SizedBox(height: 40),
                          Container(
                            padding: const EdgeInsets.all(20),
                            decoration: BoxDecoration(
                              color: Colors.white.withOpacity(0.1),
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(
                                color: const Color(0xFF4CAF50).withOpacity(0.3),
                              ),
                            ),
                            child: Column(
                              children: [
                                const Text(
                                  'Complete goals to earn food 🍎',
                                  textAlign: TextAlign.center,
                                  style: TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.white,
                                  ),
                                ),
                                const SizedBox(height: 8),
                                const Text(
                                  'Feed your Sprout to keep it healthy!',
                                  textAlign: TextAlign.center,
                                  style: TextStyle(
                                    fontSize: 14,
                                    color: Colors.white70,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],

                  if (_isHatching && !_hasHatched)
                    const Padding(
                      padding: EdgeInsets.only(top: 40),
                      child: CircularProgressIndicator(
                        color: Color(0xFF4CAF50),
                      ),
                    ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

// Custom painter for crack effect
class CrackPainter extends CustomPainter {
  final double progress;

  CrackPainter({required this.progress});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.black.withOpacity(0.6)
      ..strokeWidth = 3
      ..style = PaintingStyle.stroke;

    final center = Offset(size.width / 2, size.height / 2);

    // Draw cracks radiating from center
    for (int i = 0; i < 8; i++) {
      final angle = (i / 8) * 2 * pi;
      final length = (size.width / 2) * progress;
      final endX = center.dx + length * cos(angle);
      final endY = center.dy + length * sin(angle);

      canvas.drawLine(
        center,
        Offset(endX, endY),
        paint,
      );
    }
  }

  @override
  bool shouldRepaint(CrackPainter oldDelegate) {
    return oldDelegate.progress != progress;
  }
}

// Particle class for burst effects
class Particle {
  final double angle;
  final double speed;
  final double size;
  final Color color;

  Particle({
    required this.angle,
    required this.speed,
    required this.size,
    required this.color,
  });
}

// Custom painter for particle burst
class ParticlePainter extends CustomPainter {
  final List<Particle> particles;
  final double progress;

  ParticlePainter({required this.particles, required this.progress});

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);

    for (final particle in particles) {
      final distance = particle.speed * progress;
      final x = center.dx + distance * cos(particle.angle);
      final y = center.dy + distance * sin(particle.angle);

      final opacity = 1.0 - progress;
      final paint = Paint()
        ..color = particle.color.withOpacity(opacity)
        ..style = PaintingStyle.fill;

      canvas.drawCircle(
        Offset(x, y),
        particle.size * (1.0 + progress),
        paint,
      );

      // Add glow effect
      final glowPaint = Paint()
        ..color = particle.color.withOpacity(opacity * 0.3)
        ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 3);

      canvas.drawCircle(
        Offset(x, y),
        particle.size * (1.0 + progress) * 2,
        glowPaint,
      );
    }
  }

  @override
  bool shouldRepaint(ParticlePainter oldDelegate) {
    return oldDelegate.progress != progress;
  }
}
