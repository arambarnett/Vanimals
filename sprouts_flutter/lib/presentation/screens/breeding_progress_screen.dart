import 'dart:async';
import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../../data/models/breeding_model.dart';
import '../../data/models/vanimal_model.dart';
import '../../data/repositories/breeding_repository.dart';
import 'breeding_result_screen.dart';
import 'collection_screen.dart';

class BreedingProgressScreen extends StatefulWidget {
  final BreedingSession session;

  const BreedingProgressScreen({
    super.key,
    required this.session,
  });

  @override
  State<BreedingProgressScreen> createState() => _BreedingProgressScreenState();
}

class _BreedingProgressScreenState extends State<BreedingProgressScreen>
    with TickerProviderStateMixin {
  Timer? _timer;
  BreedingSession? currentSession;
  late AnimationController _heartbeatController;
  late AnimationController _glowController;
  late Animation<double> _heartbeatAnimation;
  late Animation<double> _glowAnimation;

  @override
  void initState() {
    super.initState();
    currentSession = widget.session;
    
    // Setup animations
    _heartbeatController = AnimationController(
      duration: const Duration(milliseconds: 1000),
      vsync: this,
    );
    
    _glowController = AnimationController(
      duration: const Duration(milliseconds: 2000),
      vsync: this,
    );
    
    _heartbeatAnimation = Tween<double>(
      begin: 0.8,
      end: 1.2,
    ).animate(CurvedAnimation(
      parent: _heartbeatController,
      curve: Curves.easeInOut,
    ));
    
    _glowAnimation = Tween<double>(
      begin: 0.3,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _glowController,
      curve: Curves.easeInOut,
    ));

    // Start animations
    _heartbeatController.repeat(reverse: true);
    _glowController.repeat(reverse: true);
    
    // Start timer to check breeding progress
    _startProgressTimer();
  }

  @override
  void dispose() {
    _timer?.cancel();
    _heartbeatController.dispose();
    _glowController.dispose();
    super.dispose();
  }

  void _startProgressTimer() {
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) async {
      if (currentSession == null) return;
      
      try {
        final updatedSession = await BreedingRepository.checkBreedingProgress(
          currentSession!.id,
        );
        
        if (updatedSession != null) {
          setState(() {
            currentSession = updatedSession;
          });
          
          // If breeding is complete, navigate to result screen
          if (updatedSession.isComplete && updatedSession.offspring != null) {
            _timer?.cancel();
            _heartbeatController.stop();
            _glowController.stop();
            
            // Wait a moment for user to see completion, then navigate
            Future.delayed(const Duration(seconds: 2), () {
              if (mounted) {
                Navigator.of(context).pushReplacement(
                  MaterialPageRoute(
                    builder: (context) => BreedingResultScreen(
                      session: updatedSession,
                    ),
                  ),
                );
              }
            });
          }
        }
      } catch (e) {
        // Handle error silently for now
        print('Error checking breeding progress: $e');
      }
    });
  }

  String _formatTimeRemaining(Duration duration) {
    if (duration.inMilliseconds <= 0) return 'Complete!';
    
    final hours = duration.inHours;
    final minutes = duration.inMinutes.remainder(60);
    final seconds = duration.inSeconds.remainder(60);
    
    if (hours > 0) {
      return '${hours}h ${minutes}m ${seconds}s';
    } else if (minutes > 0) {
      return '${minutes}m ${seconds}s';
    } else {
      return '${seconds}s';
    }
  }

  @override
  Widget build(BuildContext context) {
    final session = currentSession!;
    final progress = session.progressPercent;
    final timeRemaining = session.timeRemaining;
    final isComplete = session.isComplete;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Breeding in Progress'),
        backgroundColor: AppTheme.vanimalPurple,
        foregroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.home),
          onPressed: () {
            Navigator.of(context).pushAndRemoveUntil(
              MaterialPageRoute(builder: (context) => const CollectionScreen()),
              (route) => false,
            );
          },
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
        child: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                const SizedBox(height: 20),
                
                // Parents Display
                _buildParentsDisplay(),
                
                const SizedBox(height: 30),
                
                // Breeding Animation
                _buildBreedingAnimation(isComplete),
                
                const SizedBox(height: 30),
                
                // Progress Information
                _buildProgressCard(progress, timeRemaining, isComplete),
                
                const SizedBox(height: 20),
                
                // Breeding Stats
                _buildBreedingStatsCard(),
                
                const SizedBox(height: 30),
                
                // Action Button
                if (isComplete)
                  _buildCompleteButton()
                else
                  _buildWaitingMessage(),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildParentsDisplay() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppTheme.vanimalPurple.withOpacity(0.9),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        children: [
          const Text(
            'Breeding Pair',
            style: TextStyle(
              color: Colors.white,
              fontSize: 16,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(child: _buildParentCard(currentSession!.parent1)),
              const Padding(
                padding: EdgeInsets.symmetric(horizontal: 16),
                child: Icon(Icons.favorite, color: Colors.white, size: 24),
              ),
              Expanded(child: _buildParentCard(currentSession!.parent2)),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildParentCard(VanimalModel parent) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        children: [
          Container(
            width: 50,
            height: 50,
            decoration: BoxDecoration(
              color: AppTheme.vanimalPink,
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.pets, color: Colors.white, size: 25),
          ),
          const SizedBox(height: 8),
          Text(
            parent.name,
            style: const TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.bold,
              fontSize: 12,
            ),
            textAlign: TextAlign.center,
          ),
          Text(
            'Lv.${parent.state.level}',
            style: const TextStyle(
              color: Colors.white70,
              fontSize: 10,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBreedingAnimation(bool isComplete) {
    return AnimatedBuilder(
      animation: Listenable.merge([_heartbeatAnimation, _glowAnimation]),
      builder: (context, child) {
        return Container(
          width: 200,
          height: 200,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            gradient: RadialGradient(
              colors: [
                AppTheme.vanimalPink.withOpacity(_glowAnimation.value * 0.5),
                AppTheme.vanimalPurple.withOpacity(_glowAnimation.value * 0.3),
                Colors.transparent,
              ],
            ),
          ),
          child: Center(
            child: Transform.scale(
              scale: isComplete ? 1.0 : _heartbeatAnimation.value,
              child: Container(
                width: 120,
                height: 120,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: isComplete ? Colors.green : AppTheme.vanimalPink,
                  boxShadow: [
                    BoxShadow(
                      color: (isComplete ? Colors.green : AppTheme.vanimalPink)
                          .withOpacity(_glowAnimation.value * 0.5),
                      blurRadius: 20,
                      spreadRadius: 5,
                    ),
                  ],
                ),
                child: Icon(
                  isComplete ? Icons.check : Icons.favorite,
                  color: Colors.white,
                  size: 60,
                ),
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildProgressCard(double progress, Duration timeRemaining, bool isComplete) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.black.withOpacity(0.8),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Breeding Progress',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
              Text(
                '${(progress * 100).round()}%',
                style: TextStyle(
                  color: isComplete ? Colors.green : AppTheme.vanimalPink,
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: LinearProgressIndicator(
              value: progress,
              backgroundColor: Colors.white.withOpacity(0.2),
              valueColor: AlwaysStoppedAnimation<Color>(
                isComplete ? Colors.green : AppTheme.vanimalPink,
              ),
              minHeight: 8,
            ),
          ),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Time Remaining',
                    style: TextStyle(color: Colors.white70, fontSize: 12),
                  ),
                  Text(
                    _formatTimeRemaining(timeRemaining),
                    style: TextStyle(
                      color: isComplete ? Colors.green : Colors.white,
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  const Text(
                    'Status',
                    style: TextStyle(color: Colors.white70, fontSize: 12),
                  ),
                  Text(
                    isComplete ? 'Complete!' : 'In Progress',
                    style: TextStyle(
                      color: isComplete ? Colors.green : AppTheme.vanimalPink,
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildBreedingStatsCard() {
    final session = currentSession!;
    
    return Container(
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
            'Breeding Details',
            style: TextStyle(
              color: Colors.white,
              fontSize: 16,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 12),
          _buildDetailRow('Species', session.parent1.species.toUpperCase()),
          _buildDetailRow('Started', _formatDateTime(session.startedAt)),
          _buildDetailRow('Duration', '${session.durationHours} hours'),
          _buildDetailRow('Cost Paid', '${session.totalCost} coins'),
          const SizedBox(height: 8),
          const Text(
            'Your Vanimals are working together to create new life. The offspring will inherit traits from both parents with unique genetic variations.',
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

  Widget _buildDetailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 2),
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

  Widget _buildCompleteButton() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.green.withOpacity(0.2),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.green),
      ),
      child: Column(
        children: [
          const Icon(Icons.celebration, color: Colors.green, size: 48),
          const SizedBox(height: 12),
          const Text(
            'Breeding Complete!',
            style: TextStyle(
              color: Colors.green,
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            'Your new offspring is ready to meet you!',
            style: TextStyle(color: Colors.white, fontSize: 14),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 16),
          const Text(
            'Redirecting to results...',
            style: TextStyle(color: Colors.white70, fontSize: 12),
          ),
        ],
      ),
    );
  }

  Widget _buildWaitingMessage() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.vanimalPink.withOpacity(0.2),
        borderRadius: BorderRadius.circular(12),
      ),
      child: const Column(
        children: [
          Icon(Icons.hourglass_empty, color: AppTheme.vanimalPink, size: 32),
          SizedBox(height: 8),
          Text(
            'Breeding in Progress',
            style: TextStyle(
              color: Colors.white,
              fontSize: 16,
              fontWeight: FontWeight.bold,
            ),
          ),
          SizedBox(height: 4),
          Text(
            'Please wait while your Vanimals create their offspring. You can close this screen and check back later.',
            style: TextStyle(color: Colors.white70, fontSize: 12),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  String _formatDateTime(DateTime dateTime) {
    final now = DateTime.now();
    final difference = now.difference(dateTime);
    
    if (difference.inMinutes < 1) {
      return 'Just now';
    } else if (difference.inHours < 1) {
      return '${difference.inMinutes}m ago';
    } else if (difference.inDays < 1) {
      return '${difference.inHours}h ago';
    } else {
      return '${dateTime.day}/${dateTime.month} ${dateTime.hour}:${dateTime.minute.toString().padLeft(2, '0')}';
    }
  }
}