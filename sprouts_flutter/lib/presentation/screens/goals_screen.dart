import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../../data/services/api_service.dart';
import '../../data/services/web3auth_service.dart';
import 'goal_selection_screen.dart';

class GoalsScreen extends StatefulWidget {
  const GoalsScreen({super.key});

  @override
  State<GoalsScreen> createState() => _GoalsScreenState();
}

class _GoalsScreenState extends State<GoalsScreen> {
  List<dynamic> activeGoals = [];
  List<dynamic> completedGoals = [];
  bool isLoading = true;
  String? errorMessage;
  String selectedTab = 'active'; // 'active' or 'completed'

  @override
  void initState() {
    super.initState();
    _loadGoals();
  }

  Future<void> _loadGoals() async {
    try {
      setState(() {
        isLoading = true;
        errorMessage = null;
      });

      final userId = await Web3AuthService.getUserId();
      if (userId == null) {
        throw Exception('No authenticated user found');
      }

      final active = await ApiService.getUserGoals(userId, isActive: true, isCompleted: false);
      final completed = await ApiService.getUserGoals(userId, isCompleted: true);

      setState(() {
        activeGoals = active;
        completedGoals = completed;
        isLoading = false;
      });
    } catch (e) {
      setState(() {
        errorMessage = e.toString();
        isLoading = false;
      });
    }
  }

  Future<void> _logProgress(String goalId, BuildContext context) async {
    final progressController = TextEditingController();
    final notesController = TextEditingController();

    final result = await showDialog<Map<String, dynamic>>(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: const Color(0xFF1a1a2e),
        title: const Text('Log Progress', style: TextStyle(color: Colors.white)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: progressController,
              keyboardType: TextInputType.number,
              style: const TextStyle(color: Colors.white),
              decoration: InputDecoration(
                labelText: 'Progress Value',
                labelStyle: TextStyle(color: Colors.white.withOpacity(0.7)),
                hintText: 'e.g., 5',
                hintStyle: TextStyle(color: Colors.white.withOpacity(0.5)),
                enabledBorder: UnderlineInputBorder(
                  borderSide: BorderSide(color: Colors.white.withOpacity(0.3)),
                ),
                focusedBorder: const UnderlineInputBorder(
                  borderSide: BorderSide(color: AppTheme.vanimalPurple),
                ),
              ),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: notesController,
              style: const TextStyle(color: Colors.white),
              decoration: InputDecoration(
                labelText: 'Notes (optional)',
                labelStyle: TextStyle(color: Colors.white.withOpacity(0.7)),
                hintText: 'Add notes about your progress',
                hintStyle: TextStyle(color: Colors.white.withOpacity(0.5)),
                enabledBorder: UnderlineInputBorder(
                  borderSide: BorderSide(color: Colors.white.withOpacity(0.3)),
                ),
                focusedBorder: const UnderlineInputBorder(
                  borderSide: BorderSide(color: AppTheme.vanimalPurple),
                ),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              final value = double.tryParse(progressController.text);
              if (value != null && value > 0) {
                Navigator.of(context).pop({
                  'value': value,
                  'notes': notesController.text,
                });
              }
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: AppTheme.vanimalPurple,
            ),
            child: const Text('Log Progress'),
          ),
        ],
      ),
    );

    if (result != null && mounted) {
      try {
        await ApiService.logGoalProgress(
          goalId: goalId,
          value: result['value'],
          notes: result['notes'].isNotEmpty ? result['notes'] : null,
        );

        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Progress logged successfully!'),
              backgroundColor: Colors.green,
            ),
          );
          _loadGoals(); // Reload goals to show updated progress
        }
      } catch (e) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Failed to log progress: $e'),
              backgroundColor: Colors.red,
            ),
          );
        }
      }
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
                    IconButton(
                      icon: const Icon(Icons.arrow_back, color: Colors.white),
                      onPressed: () => Navigator.of(context).pop(),
                    ),
                    const Expanded(
                      child: Text(
                        'My Goals',
                        style: AppTheme.headlineMedium,
                        textAlign: TextAlign.center,
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.add, color: Colors.white),
                      onPressed: () {
                        Navigator.of(context).push(
                          MaterialPageRoute(
                            builder: (context) => const GoalSelectionScreen(),
                          ),
                        ).then((_) => _loadGoals());
                      },
                    ),
                  ],
                ),
              ),

              // Tabs
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: Row(
                  children: [
                    Expanded(
                      child: ElevatedButton(
                        onPressed: () {
                          setState(() {
                            selectedTab = 'active';
                          });
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: selectedTab == 'active'
                              ? AppTheme.vanimalPurple
                              : Colors.white.withOpacity(0.1),
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        child: Text('Active (${activeGoals.length})'),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: ElevatedButton(
                        onPressed: () {
                          setState(() {
                            selectedTab = 'completed';
                          });
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: selectedTab == 'completed'
                              ? AppTheme.vanimalPurple
                              : Colors.white.withOpacity(0.1),
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        child: Text('Completed (${completedGoals.length})'),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),

              // Goals List
              Expanded(
                child: _buildGoalsList(),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildGoalsList() {
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
            Text('Error loading goals', style: AppTheme.headlineSmall),
            const SizedBox(height: 8),
            Text(
              errorMessage!,
              style: AppTheme.bodyMedium.copyWith(color: Colors.red),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: _loadGoals,
              child: const Text('Retry'),
            ),
          ],
        ),
      );
    }

    final goals = selectedTab == 'active' ? activeGoals : completedGoals;

    if (goals.isEmpty) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(32.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                selectedTab == 'active' ? Icons.add_task : Icons.check_circle_outline,
                size: 80,
                color: Colors.white.withOpacity(0.3),
              ),
              const SizedBox(height: 20),
              Text(
                selectedTab == 'active'
                    ? 'No Active Goals'
                    : 'No Completed Goals Yet',
                style: AppTheme.headlineMedium,
              ),
              const SizedBox(height: 12),
              Text(
                selectedTab == 'active'
                    ? 'Create your first goal to start growing your Sprout!'
                    : 'Keep working on your goals to complete them!',
                style: AppTheme.bodyLarge.copyWith(
                  color: Colors.white.withOpacity(0.7),
                ),
                textAlign: TextAlign.center,
              ),
              if (selectedTab == 'active') ...[
                const SizedBox(height: 24),
                ElevatedButton.icon(
                  onPressed: () {
                    Navigator.of(context).push(
                      MaterialPageRoute(
                        builder: (context) => const GoalSelectionScreen(),
                      ),
                    ).then((_) => _loadGoals());
                  },
                  icon: const Icon(Icons.add),
                  label: const Text('Create Goal'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.vanimalPurple,
                    padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                  ),
                ),
              ],
            ],
          ),
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      itemCount: goals.length,
      itemBuilder: (context, index) {
        return _buildGoalCard(goals[index]);
      },
    );
  }

  Widget _buildGoalCard(dynamic goal) {
    final double currentValue = (goal['currentValue'] ?? 0).toDouble();
    final double targetValue = (goal['targetValue'] ?? 1).toDouble();
    final double progress = (currentValue / targetValue).clamp(0.0, 1.0);
    final bool isCompleted = goal['isCompleted'] ?? false;

    final Color categoryColor = _getCategoryColor(goal['category'] ?? goal['type']);

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(16),
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            categoryColor.withOpacity(0.2),
            Colors.black.withOpacity(0.6),
          ],
        ),
        border: Border.all(
          color: categoryColor.withOpacity(0.4),
          width: 1,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header row
          Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: categoryColor.withOpacity(0.3),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  (goal['category'] ?? goal['type']).toString().toUpperCase(),
                  style: AppTheme.bodySmall.copyWith(
                    color: categoryColor,
                    fontWeight: FontWeight.bold,
                    fontSize: 10,
                  ),
                ),
              ),
              const Spacer(),
              if (isCompleted)
                const Icon(Icons.check_circle, color: Colors.green, size: 20),
            ],
          ),
          const SizedBox(height: 12),

          // Goal title
          Text(
            goal['title'] ?? 'Untitled Goal',
            style: AppTheme.labelLarge.copyWith(fontSize: 16),
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
          ),
          if (goal['description'] != null && goal['description'].toString().isNotEmpty) ...[
            const SizedBox(height: 4),
            Text(
              goal['description'],
              style: AppTheme.bodySmall.copyWith(
                color: Colors.white.withOpacity(0.7),
              ),
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
          ],
          const SizedBox(height: 12),

          // Progress bar
          ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: LinearProgressIndicator(
              value: progress,
              backgroundColor: Colors.white.withOpacity(0.1),
              valueColor: AlwaysStoppedAnimation<Color>(categoryColor),
              minHeight: 8,
            ),
          ),
          const SizedBox(height: 8),

          // Progress text
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                '${currentValue.toStringAsFixed(1)} / ${targetValue.toStringAsFixed(0)} ${goal['unit']}',
                style: AppTheme.bodySmall.copyWith(
                  color: Colors.white.withOpacity(0.8),
                ),
              ),
              Text(
                '${(progress * 100).toStringAsFixed(0)}%',
                style: AppTheme.bodySmall.copyWith(
                  color: categoryColor,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),

          // Action button
          if (!isCompleted) ...[
            const SizedBox(height: 12),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: () => _logProgress(goal['id'], context),
                icon: const Icon(Icons.add, size: 16),
                label: const Text('Log Progress'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: categoryColor,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 8),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }

  Color _getCategoryColor(String category) {
    switch (category.toLowerCase()) {
      case 'fitness':
        return Colors.red;
      case 'finance':
        return Colors.green;
      case 'education':
        return Colors.blue;
      case 'faith':
        return AppTheme.vanimalPink;
      case 'screentime':
        return Colors.orange;
      case 'work':
        return AppTheme.vanimalPurple;
      default:
        return AppTheme.vanimalPurple;
    }
  }
}
