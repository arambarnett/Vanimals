import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import 'goal_create_screen.dart';
import 'strava_goal_creation_screen.dart';

class GoalSelectionScreen extends StatelessWidget {
  const GoalSelectionScreen({super.key});

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
                        'Choose Goal Category',
                        style: AppTheme.headlineMedium,
                        textAlign: TextAlign.center,
                      ),
                    ),
                    const SizedBox(width: 48), // Balance the back button
                  ],
                ),
              ),

              // Subtitle
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 32),
                child: Text(
                  'Your first goal will mint a FREE Sprout NFT!',
                  textAlign: TextAlign.center,
                  style: AppTheme.bodyLarge.copyWith(
                    color: AppTheme.vanimalPurple,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
              const SizedBox(height: 30),

              // Categories Grid
              Expanded(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  child: GridView.count(
                    crossAxisCount: 2,
                    childAspectRatio: 1.0,
                    crossAxisSpacing: 16,
                    mainAxisSpacing: 16,
                    children: [
                      _buildCategoryCard(
                        context: context,
                        title: 'Fitness',
                        icon: Icons.directions_run,
                        color: Colors.red,
                        description: 'Track workouts, runs, & activities',
                        category: 'fitness',
                      ),
                      _buildCategoryCard(
                        context: context,
                        title: 'Finance',
                        icon: Icons.account_balance_wallet,
                        color: Colors.green,
                        description: 'Save money & manage spending',
                        category: 'finance',
                      ),
                      _buildCategoryCard(
                        context: context,
                        title: 'Education',
                        icon: Icons.school,
                        color: Colors.blue,
                        description: 'Learn new skills & read books',
                        category: 'education',
                      ),
                      _buildCategoryCard(
                        context: context,
                        title: 'Faith',
                        icon: Icons.favorite,
                        color: AppTheme.vanimalPink,
                        description: 'Meditation & spiritual practices',
                        category: 'faith',
                      ),
                      _buildCategoryCard(
                        context: context,
                        title: 'Screentime',
                        icon: Icons.phone_android,
                        color: Colors.orange,
                        description: 'Reduce phone & social media use',
                        category: 'screentime',
                      ),
                      _buildCategoryCard(
                        context: context,
                        title: 'Work',
                        icon: Icons.work,
                        color: AppTheme.vanimalPurple,
                        description: 'Productivity & career goals',
                        category: 'work',
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildCategoryCard({
    required BuildContext context,
    required String title,
    required IconData icon,
    required Color color,
    required String description,
    required String category,
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
          color: color.withOpacity(0.5),
          width: 1,
        ),
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(20),
          onTap: () {
            // Fitness goals use the new Strava-based flow
            if (category == 'fitness') {
              Navigator.of(context).push(
                MaterialPageRoute(
                  builder: (context) => const StravaGoalCreationScreen(),
                ),
              );
            } else {
              // Other categories use the traditional goal creation flow
              Navigator.of(context).push(
                MaterialPageRoute(
                  builder: (context) => GoalCreateScreen(
                    category: category,
                    categoryColor: color,
                  ),
                ),
              );
            }
          },
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Icon
                Container(
                  width: 60,
                  height: 60,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: color.withOpacity(0.2),
                  ),
                  child: Icon(
                    icon,
                    size: 32,
                    color: color,
                  ),
                ),
                const SizedBox(height: 12),

                // Title
                Text(
                  title,
                  style: AppTheme.labelLarge.copyWith(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 6),

                // Description
                Text(
                  description,
                  style: AppTheme.bodySmall.copyWith(
                    color: Colors.white.withOpacity(0.7),
                    fontSize: 11,
                  ),
                  textAlign: TextAlign.center,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
