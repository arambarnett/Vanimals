import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../theme/app_theme.dart';
import '../../data/services/api_service.dart';
import '../../data/services/web3auth_service.dart';
import '../../core/constants/app_constants.dart';

class SproutDetailScreen extends StatefulWidget {
  final String sproutId;
  final String name;
  final Color categoryColor;

  const SproutDetailScreen({
    super.key,
    required this.sproutId,
    required this.name,
    required this.categoryColor,
  });

  @override
  State<SproutDetailScreen> createState() => _SproutDetailScreenState();
}

class _SproutDetailScreenState extends State<SproutDetailScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _pulseController;
  bool isLoading = true;
  Map<String, dynamic>? sproutData;

  @override
  void initState() {
    super.initState();
    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 2),
    )..repeat(reverse: true);
    _loadSproutData();
  }

  @override
  void dispose() {
    _pulseController.dispose();
    super.dispose();
  }

  Future<void> _loadSproutData() async {
    try {
      final data = await ApiService.getSproutById(widget.sproutId);
      setState(() {
        sproutData = data;
        isLoading = false;
      });
    } catch (e) {
      setState(() {
        isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              widget.categoryColor.withOpacity(0.3),
              const Color(0xFF1a1a2e),
            ],
          ),
        ),
        child: SafeArea(
          child: isLoading
              ? const Center(
                  child: CircularProgressIndicator(color: Colors.white),
                )
              : _buildContent(),
        ),
      ),
    );
  }

  Widget _buildContent() {
    final health = sproutData?['healthPoints'] ?? 100;
    final rest = sproutData?['restScore'] ?? 100;
    final water = sproutData?['waterScore'] ?? 100;
    final food = sproutData?['foodScore'] ?? 100;
    final mood = sproutData?['mood'] ?? 'happy';
    final level = sproutData?['level'] ?? 1;
    final experience = sproutData?['experience'] ?? 0;
    final category = sproutData?['category'] ?? 'fitness';

    return Column(
      children: [
        // Header
        _buildHeader(level),

        Expanded(
          child: SingleChildScrollView(
            child: Column(
              children: [
                const SizedBox(height: 20),

                // Cute Sprout Avatar
                _buildSproutAvatar(health, category),

                const SizedBox(height: 30),

                // Name with sparkles
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Text('✨', style: TextStyle(fontSize: 24)),
                    const SizedBox(width: 8),
                    Text(
                      widget.name,
                      style: AppTheme.headlineMedium.copyWith(fontSize: 28),
                    ),
                    const SizedBox(width: 8),
                    const Text('✨', style: TextStyle(fontSize: 24)),
                  ],
                ),
                const SizedBox(height: 8),
                Text(
                  'Level $level ${_getCategoryEmoji(category)} ${_getCategoryName(category)}',
                  style: AppTheme.bodyLarge.copyWith(
                    color: widget.categoryColor,
                    fontWeight: FontWeight.w600,
                  ),
                ),

                const SizedBox(height: 30),

                // Mood indicator
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  child: _buildMoodCard(mood),
                ),

                const SizedBox(height: 20),

                // Fun status cards
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  child: Column(
                    children: [
                      _buildCuteStatusCard(
                        icon: '😴',
                        label: 'Rest',
                        value: rest,
                        maxValue: 100,
                        color: const Color(0xFF9C27B0),
                        message: _getRestMessage(rest),
                      ),
                      const SizedBox(height: 16),
                      _buildCuteStatusCard(
                        icon: '💧',
                        label: 'Water',
                        value: water,
                        maxValue: 100,
                        color: const Color(0xFF03A9F4),
                        message: _getWaterMessage(water),
                      ),
                      const SizedBox(height: 16),
                      _buildCuteStatusCard(
                        icon: '🍎',
                        label: 'Food',
                        value: food,
                        maxValue: 100,
                        color: const Color(0xFF4CAF50),
                        message: _getFoodMessage(food),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 30),

                // Experience bar
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  child: _buildExperienceBar(level, experience),
                ),

                const SizedBox(height: 30),

                // Fun facts section
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  child: _buildFunFacts(),
                ),

                const SizedBox(height: 20),
              ],
            ),
          ),
        ),

        // Action buttons
        _buildActionButtons(),
      ],
    );
  }

  Widget _buildHeader(int level) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          IconButton(
            icon: const Icon(Icons.arrow_back, color: Colors.white),
            onPressed: () => Navigator.of(context).pop(),
          ),
          const Spacer(),
          IconButton(
            icon: const Icon(Icons.edit, color: Colors.white),
            onPressed: _renameSprout,
            tooltip: 'Rename Sprout',
          ),
          const SizedBox(width: 8),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  widget.categoryColor,
                  widget.categoryColor.withOpacity(0.7),
                ],
              ),
              borderRadius: BorderRadius.circular(20),
              boxShadow: [
                BoxShadow(
                  color: widget.categoryColor.withOpacity(0.3),
                  blurRadius: 10,
                  spreadRadius: 2,
                ),
              ],
            ),
            child: Row(
              children: [
                const Icon(Icons.star, color: Colors.white, size: 20),
                const SizedBox(width: 6),
                Text(
                  'Level $level',
                  style: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSproutAvatar(int health, String category) {
    final species = sproutData?['species'] ?? 'bear';

    return AnimatedBuilder(
      animation: _pulseController,
      builder: (context, child) {
        return Container(
          width: 200,
          height: 200,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            gradient: RadialGradient(
              colors: [
                widget.categoryColor.withOpacity(0.4 + _pulseController.value * 0.2),
                widget.categoryColor.withOpacity(0.1),
                Colors.transparent,
              ],
            ),
          ),
          child: Center(
            child: Container(
              width: 160,
              height: 160,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: widget.categoryColor.withOpacity(0.2),
                border: Border.all(
                  color: widget.categoryColor,
                  width: 3,
                ),
                boxShadow: [
                  BoxShadow(
                    color: widget.categoryColor.withOpacity(0.5),
                    blurRadius: 20,
                    spreadRadius: 5,
                  ),
                ],
              ),
              child: Center(
                child: _buildSproutImage(species, health),
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildSproutImage(String species, int health) {
    final String imagePath = 'assets/sprouts/${species.toLowerCase()}.png';

    return ClipOval(
      child: Image.asset(
        imagePath,
        width: 140,
        height: 140,
        fit: BoxFit.cover,
        errorBuilder: (context, error, stackTrace) {
          // Fallback to emoji if image not found
          return Text(
            _getSproutEmoji(sproutData?['category'] ?? 'fitness', health),
            style: const TextStyle(fontSize: 80),
          );
        },
      ),
    );
  }

  Widget _buildCuteStatusCard({
    required String icon,
    required String label,
    required int value,
    required int maxValue,
    required Color color,
    required String message,
  }) {
    final percentage = (value / maxValue).clamp(0.0, 1.0);

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            color.withOpacity(0.2),
            color.withOpacity(0.05),
          ],
        ),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: color.withOpacity(0.3),
          width: 2,
        ),
        boxShadow: [
          BoxShadow(
            color: color.withOpacity(0.2),
            blurRadius: 10,
            spreadRadius: 2,
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Text(icon, style: const TextStyle(fontSize: 32)),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      label,
                      style: AppTheme.labelLarge.copyWith(
                        fontSize: 18,
                        color: color,
                      ),
                    ),
                    Text(
                      message,
                      style: AppTheme.bodySmall.copyWith(
                        color: Colors.white.withOpacity(0.7),
                        fontSize: 12,
                      ),
                    ),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: color.withOpacity(0.3),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  '$value/$maxValue',
                  style: TextStyle(
                    color: color,
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          ClipRRect(
            borderRadius: BorderRadius.circular(10),
            child: Stack(
              children: [
                Container(
                  height: 20,
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
                FractionallySizedBox(
                  widthFactor: percentage,
                  child: Container(
                    height: 20,
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [color, color.withOpacity(0.7)],
                      ),
                      borderRadius: BorderRadius.circular(10),
                      boxShadow: [
                        BoxShadow(
                          color: color.withOpacity(0.5),
                          blurRadius: 8,
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildExperienceBar(int level, int experience) {
    final expRequired = level * 100;
    final percentage = (experience / expRequired).clamp(0.0, 1.0);

    return Container(
      padding: const EdgeInsets.all(20),
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
          width: 2,
        ),
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  const Text('⭐', style: TextStyle(fontSize: 24)),
                  const SizedBox(width: 8),
                  const Text(
                    'Experience',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
              Text(
                '$experience / $expRequired XP',
                style: const TextStyle(
                  color: Colors.white70,
                  fontSize: 14,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          ClipRRect(
            borderRadius: BorderRadius.circular(10),
            child: Stack(
              children: [
                Container(
                  height: 16,
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
                FractionallySizedBox(
                  widthFactor: percentage,
                  child: Container(
                    height: 16,
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [
                          AppTheme.vanimalPurple,
                          AppTheme.vanimalPink,
                        ],
                      ),
                      borderRadius: BorderRadius.circular(10),
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 8),
          Text(
            '${(percentage * 100).toStringAsFixed(0)}% to Level ${level + 1}',
            style: TextStyle(
              color: Colors.white.withOpacity(0.7),
              fontSize: 12,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFunFacts() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.05),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: Colors.white.withOpacity(0.1),
          width: 1,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Text('💡', style: TextStyle(fontSize: 24)),
              const SizedBox(width: 8),
              Text(
                'Fun Facts',
                style: AppTheme.labelLarge.copyWith(fontSize: 18),
              ),
            ],
          ),
          const SizedBox(height: 12),
          _buildFactRow('🎂', 'Born', _formatDate(sproutData?['createdAt'])),
          _buildFactRow('🏆', 'Growth Stage', sproutData?['growthStage'] ?? 'Sprout'),
          _buildFactRow('💪', 'Strength', '${sproutData?['strength'] ?? 1}'),
          _buildFactRow('🧠', 'Intelligence', '${sproutData?['intelligence'] ?? 1}'),
          _buildFactRow('⚡', 'Speed', '${sproutData?['speed'] ?? 1}'),
        ],
      ),
    );
  }

  Widget _buildFactRow(String emoji, String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        children: [
          Text(emoji, style: const TextStyle(fontSize: 20)),
          const SizedBox(width: 12),
          Text(
            '$label:',
            style: TextStyle(
              color: Colors.white.withOpacity(0.7),
              fontSize: 14,
            ),
          ),
          const Spacer(),
          Text(
            value,
            style: const TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.w600,
              fontSize: 14,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActionButtons() {
    return Container(
      padding: const EdgeInsets.all(20),
      child: Column(
        children: [
          Row(
            children: [
              Expanded(
                child: ElevatedButton(
                  onPressed: _feedSprout,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.orange,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(15),
                    ),
                  ),
                  child: const Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text('🍎', style: TextStyle(fontSize: 20)),
                      SizedBox(width: 8),
                      Text(
                        'Feed',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: ElevatedButton(
                  onPressed: _playSprout,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.vanimalPink,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(15),
                    ),
                  ),
                  child: const Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text('🎮', style: TextStyle(fontSize: 20)),
                      SizedBox(width: 8),
                      Text(
                        'Play',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: _shareProgress,
              style: ElevatedButton.styleFrom(
                backgroundColor: widget.categoryColor,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(15),
                ),
              ),
              child: const Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.share, size: 20),
                  SizedBox(width: 8),
                  Text(
                    'Share Progress',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  String _getSproutEmoji(String category, int health) {
    if (health < 30) return '😢'; // Sad/withering
    if (health < 60) return '😐'; // Okay

    switch (category.toLowerCase()) {
      case 'fitness':
        return '💪';
      case 'finance':
        return '💰';
      case 'education':
        return '📚';
      case 'faith':
        return '🙏';
      case 'screentime':
        return '📱';
      case 'work':
        return '💼';
      default:
        return '🌱';
    }
  }

  String _getCategoryEmoji(String category) {
    switch (category.toLowerCase()) {
      case 'fitness':
        return '🏃';
      case 'finance':
        return '💰';
      case 'education':
        return '📚';
      case 'faith':
        return '❤️';
      case 'screentime':
        return '📵';
      case 'work':
        return '💼';
      default:
        return '🌱';
    }
  }

  String _getCategoryName(String category) {
    return '${category[0].toUpperCase()}${category.substring(1)} Sprout';
  }

  Widget _buildMoodCard(String mood) {
    String moodEmoji;
    Color moodColor;
    String moodText;
    String moodDescription;

    switch (mood.toLowerCase()) {
      case 'happy':
        moodEmoji = '😄';
        moodColor = const Color(0xFF4CAF50);
        moodText = 'Happy';
        moodDescription = 'Your Sprout is thriving!';
        break;
      case 'content':
        moodEmoji = '😊';
        moodColor = const Color(0xFF8BC34A);
        moodText = 'Content';
        moodDescription = 'Feeling pretty good!';
        break;
      case 'neutral':
        moodEmoji = '😐';
        moodColor = const Color(0xFFFFEB3B);
        moodText = 'Neutral';
        moodDescription = 'Could use some care';
        break;
      case 'sad':
        moodEmoji = '😢';
        moodColor = const Color(0xFFFF9800);
        moodText = 'Sad';
        moodDescription = 'Needs attention soon';
        break;
      case 'distressed':
        moodEmoji = '😰';
        moodColor = const Color(0xFFF44336);
        moodText = 'Distressed';
        moodDescription = 'Critical! Feed now!';
        break;
      default:
        moodEmoji = '😊';
        moodColor = const Color(0xFF4CAF50);
        moodText = 'Happy';
        moodDescription = 'Your Sprout is thriving!';
    }

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            moodColor.withOpacity(0.3),
            moodColor.withOpacity(0.1),
          ],
        ),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: moodColor.withOpacity(0.5),
          width: 2,
        ),
      ),
      child: Row(
        children: [
          Text(moodEmoji, style: const TextStyle(fontSize: 48)),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Mood: $moodText',
                  style: AppTheme.labelLarge.copyWith(
                    fontSize: 20,
                    color: moodColor,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  moodDescription,
                  style: AppTheme.bodySmall.copyWith(
                    color: Colors.white.withOpacity(0.8),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  String _getRestMessage(int rest) {
    if (rest >= 80) return 'Well rested! 😴';
    if (rest >= 60) return 'Feeling good';
    if (rest >= 40) return 'Getting tired';
    if (rest >= 20) return 'Very sleepy';
    return 'Exhausted! 💤';
  }

  String _getWaterMessage(int water) {
    if (water >= 80) return 'Hydrated! 💧';
    if (water >= 60) return 'Quenched';
    if (water >= 40) return 'Getting thirsty';
    if (water >= 20) return 'Very thirsty!';
    return 'Parched! 🚰';
  }

  String _getFoodMessage(int food) {
    if (food >= 80) return 'Full & satisfied! 😋';
    if (food >= 60) return 'Well fed';
    if (food >= 40) return 'Getting hungry';
    if (food >= 20) return 'Very hungry!';
    return 'Starving! 🍽️';
  }

  String _formatDate(dynamic date) {
    if (date == null) return 'Unknown';
    try {
      final dateTime = DateTime.parse(date.toString());
      return '${dateTime.month}/${dateTime.day}/${dateTime.year}';
    } catch (e) {
      return 'Unknown';
    }
  }

  Future<void> _feedSprout() async {
    // Check if feed_sprout_screen_v2.dart exists, otherwise show message
    // For now, navigate to placeholder since we haven't created the v2 screen yet
    try {
      // Get current food balance
      final userId = await Web3AuthService.getUserId();
      if (userId == null) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Please log in to feed your Sprout'),
              backgroundColor: Colors.red,
            ),
          );
        }
        return;
      }

      final foodResponse = await http.get(
        Uri.parse('${AppConstants.baseUrl}/api/food/$userId'),
      );
      final foodData = jsonDecode(foodResponse.body);
      final foodBalance = foodData['foodBalance'] ?? 0;

      if (foodBalance <= 0) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('No food available! Complete goals or visit the store.'),
              backgroundColor: Colors.red,
              duration: Duration(seconds: 3),
            ),
          );
        }
        return;
      }

      // TODO: Navigate to feed allocation screen when it's refactored for new stats
      // For now, show informative message
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Feed allocation coming soon! Balance: $foodBalance 🍎'),
            backgroundColor: Colors.orange,
            duration: const Duration(seconds: 2),
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  void _playSprout() {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: const Text('🎮 Your Sprout loves to play! Keep it happy!'),
        backgroundColor: AppTheme.vanimalPink,
      ),
    );
  }

  void _shareProgress() {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('📱 Sharing ${widget.name}\'s progress!'),
        backgroundColor: widget.categoryColor,
      ),
    );
  }

  Future<void> _renameSprout() async {
    final TextEditingController nameController = TextEditingController(text: widget.name);

    final newName = await showDialog<String>(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: const Color(0xFF1a1a2e),
        title: const Text(
          'Rename Sprout',
          style: TextStyle(color: Colors.white),
        ),
        content: TextField(
          controller: nameController,
          autofocus: true,
          maxLength: 50,
          style: const TextStyle(color: Colors.white),
          decoration: InputDecoration(
            hintText: 'Enter new name',
            hintStyle: TextStyle(color: Colors.white.withOpacity(0.5)),
            enabledBorder: UnderlineInputBorder(
              borderSide: BorderSide(color: widget.categoryColor),
            ),
            focusedBorder: UnderlineInputBorder(
              borderSide: BorderSide(color: widget.categoryColor, width: 2),
            ),
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text(
              'Cancel',
              style: TextStyle(color: Colors.white70),
            ),
          ),
          ElevatedButton(
            onPressed: () {
              final name = nameController.text.trim();
              if (name.isNotEmpty) {
                Navigator.of(context).pop(name);
              }
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: widget.categoryColor,
            ),
            child: const Text('Rename'),
          ),
        ],
      ),
    );

    if (newName != null && newName.isNotEmpty && newName != widget.name) {
      try {
        final response = await http.put(
          Uri.parse('${AppConstants.baseUrl}/api/sprouts/${widget.sproutId}/rename'),
          headers: {'Content-Type': 'application/json'},
          body: jsonEncode({'name': newName}),
        );

        if (response.statusCode == 200) {
          if (mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text('✅ Renamed to "$newName"!'),
                backgroundColor: const Color(0xFF4CAF50),
              ),
            );

            // Reload sprout data to show new name
            await _loadSproutData();
          }
        } else {
          throw Exception('Failed to rename sprout');
        }
      } catch (e) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Error: $e'),
              backgroundColor: Colors.red,
            ),
          );
        }
      }
    }
  }
}
