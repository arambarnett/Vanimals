import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import 'ar_viewer_screen.dart';

class VanimalDetailScreen extends StatefulWidget {
  final String name;
  final String species;
  final int level;
  final String rarity;
  final Color color;
  final String? imagePath;

  const VanimalDetailScreen({
    super.key,
    required this.name,
    required this.species,
    required this.level,
    required this.rarity,
    required this.color,
    this.imagePath,
  });

  @override
  State<VanimalDetailScreen> createState() => _VanimalDetailScreenState();
}

class _VanimalDetailScreenState extends State<VanimalDetailScreen>
    with TickerProviderStateMixin {
  late TabController _tabController;
  
  // Mock stats - in real app these would come from backend
  late Map<String, int> stats;
  late List<String> abilities;
  late Map<String, dynamic> vanimalInfo;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    _initializeVanimalData();
  }

  void _initializeVanimalData() {
    // Initialize based on species
    switch (widget.species.toLowerCase()) {
      case 'elephant':
        stats = {'Strength': 95, 'Intelligence': 88, 'Happiness': 76, 'Health': 92};
        abilities = ['Memory Master', 'Gentle Giant', 'Trunk Spray'];
        vanimalInfo = {
          'habitat': 'African Savanna',
          'discovered': 'Downtown Park',
          'birthday': 'March 15, 2024',
          'favorite_food': 'Cosmic Peanuts',
          'personality': 'Wise and caring, loves to help other Sprouts',
        };
        break;
      case 'pigeon':
        stats = {'Speed': 87, 'Intelligence': 72, 'Happiness': 89, 'Health': 81};
        abilities = ['Sky Navigation', 'Message Delivery', 'Urban Adaptation'];
        vanimalInfo = {
          'habitat': 'Urban Rooftops',
          'discovered': 'City Square',
          'birthday': 'January 8, 2024',
          'favorite_food': 'Stardust Crumbs',
          'personality': 'Curious and social, loves exploring new places',
        };
        break;
      case 'tiger':
        stats = {'Strength': 98, 'Speed': 93, 'Happiness': 84, 'Health': 89};
        abilities = ['Stealth Strike', 'Roar of Power', 'Night Vision'];
        vanimalInfo = {
          'habitat': 'Cosmic Jungle',
          'discovered': 'Forest Edge',
          'birthday': 'June 22, 2024',
          'favorite_food': 'Stellar Meat',
          'personality': 'Independent and brave, a natural leader',
        };
        break;
      case 'penguin':
        stats = {'Swimming': 94, 'Intelligence': 79, 'Happiness': 91, 'Health': 86};
        abilities = ['Ice Slide', 'Fish Hunt', 'Colony Call'];
        vanimalInfo = {
          'habitat': 'Antarctic Ice',
          'discovered': 'Frozen Lake',
          'birthday': 'December 3, 2024',
          'favorite_food': 'Cosmic Fish',
          'personality': 'Playful and loyal, loves group activities',
        };
        break;
      default:
        stats = {'Strength': 75, 'Intelligence': 75, 'Happiness': 75, 'Health': 75};
        abilities = ['Basic Skills'];
        vanimalInfo = {
          'habitat': 'Unknown',
          'discovered': 'Mystery Location',
          'birthday': 'Unknown',
          'favorite_food': 'Energy Crystals',
          'personality': 'Mysterious and unique',
        };
    }
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
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
              AppTheme.spaceBackground,
              Color(0xFF1a1a2e),
            ],
          ),
        ),
        child: SafeArea(
          child: Column(
            children: [
              _buildHeader(),
              _buildVanimalImage(),
              _buildTabBar(),
              Expanded(
                child: TabBarView(
                  controller: _tabController,
                  children: [
                    _buildStatsTab(),
                    _buildInfoTab(),
                    _buildAbilitiesTab(),
                  ],
                ),
              ),
              _buildActionButtons(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          IconButton(
            icon: const Icon(Icons.arrow_back, color: Colors.white),
            onPressed: () => Navigator.of(context).pop(),
          ),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Text(
                  widget.name,
                  style: AppTheme.headlineMedium,
                ),
                Text(
                  '${widget.species} • Level ${widget.level}',
                  style: AppTheme.bodyLarge.copyWith(
                    color: widget.color,
                  ),
                ),
              ],
            ),
          ),
          IconButton(
            icon: const Icon(Icons.edit, color: Colors.white70, size: 20),
            onPressed: _showRenameDialog,
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              color: _getRarityColor(widget.rarity),
              borderRadius: BorderRadius.circular(15),
            ),
            child: Text(
              widget.rarity,
              style: AppTheme.bodySmall.copyWith(
                color: Colors.white,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildVanimalImage() {
    return Container(
      height: 200,
      margin: const EdgeInsets.symmetric(horizontal: 20),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(25),
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            widget.color.withOpacity(0.3),
            Colors.black.withOpacity(0.8),
          ],
        ),
        border: Border.all(
          color: widget.color.withOpacity(0.5),
          width: 2,
        ),
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(25),
        child: widget.imagePath != null
            ? Image.asset(
                widget.imagePath!,
                fit: BoxFit.cover,
              )
            : Icon(
                Icons.pets,
                size: 80,
                color: widget.color,
              ),
      ),
    );
  }

  Widget _buildTabBar() {
    return Container(
      margin: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.1),
        borderRadius: BorderRadius.circular(25),
      ),
      child: TabBar(
        controller: _tabController,
        indicator: BoxDecoration(
          color: AppTheme.vanimalPurple,
          borderRadius: BorderRadius.circular(25),
        ),
        labelColor: Colors.white,
        unselectedLabelColor: Colors.white.withOpacity(0.6),
        tabs: const [
          Tab(text: 'Stats'),
          Tab(text: 'Info'),
          Tab(text: 'Abilities'),
        ],
      ),
    );
  }

  Widget _buildStatsTab() {
    return Padding(
      padding: const EdgeInsets.all(20),
      child: Column(
        children: stats.entries.map((entry) {
          return _buildStatBar(entry.key, entry.value);
        }).toList(),
      ),
    );
  }

  Widget _buildStatBar(String statName, int value) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                statName,
                style: AppTheme.labelLarge,
              ),
              Text(
                '$value/100',
                style: AppTheme.bodyMedium.copyWith(
                  color: widget.color,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Container(
            height: 8,
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.2),
              borderRadius: BorderRadius.circular(4),
            ),
            child: FractionallySizedBox(
              alignment: Alignment.centerLeft,
              widthFactor: value / 100,
              child: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [widget.color, widget.color.withOpacity(0.7)],
                  ),
                  borderRadius: BorderRadius.circular(4),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInfoTab() {
    return Padding(
      padding: const EdgeInsets.all(20),
      child: Column(
        children: vanimalInfo.entries.map((entry) {
          return _buildInfoRow(entry.key, entry.value.toString());
        }).toList(),
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.1),
        borderRadius: BorderRadius.circular(15),
        border: Border.all(
          color: widget.color.withOpacity(0.3),
          width: 1,
        ),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            '${label.replaceAll('_', ' ').toUpperCase()}:',
            style: AppTheme.labelLarge.copyWith(
              color: widget.color,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              value,
              style: AppTheme.bodyMedium,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAbilitiesTab() {
    return Padding(
      padding: const EdgeInsets.all(20),
      child: Column(
        children: abilities.map((ability) {
          return Container(
            margin: const EdgeInsets.only(bottom: 12),
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  widget.color.withOpacity(0.3),
                  widget.color.withOpacity(0.1),
                ],
              ),
              borderRadius: BorderRadius.circular(15),
              border: Border.all(
                color: widget.color.withOpacity(0.5),
                width: 1,
              ),
            ),
            child: Row(
              children: [
                Icon(
                  Icons.star,
                  color: widget.color,
                  size: 24,
                ),
                const SizedBox(width: 12),
                Text(
                  ability,
                  style: AppTheme.labelLarge,
                ),
              ],
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget _buildActionButtons() {
    return Container(
      padding: const EdgeInsets.all(20),
      child: Row(
        children: [
          Expanded(
            child: ElevatedButton.icon(
              onPressed: _openARViewer,
              icon: const Icon(Icons.view_in_ar),
              label: const Text('View in AR'),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppTheme.vanimalPurple,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(15),
                ),
              ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: ElevatedButton.icon(
              onPressed: _shareVanimal,
              icon: const Icon(Icons.share),
              label: const Text('Share'),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppTheme.vanimalPink,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(15),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _openARViewer() {
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (context) => ARViewerScreen(
          vanimalName: widget.name,
          vanimalSpecies: widget.species,
        ),
      ),
    );
  }

  void _shareVanimal() {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Sharing ${widget.name} on social media! 📱'),
        backgroundColor: AppTheme.vanimalPink,
      ),
    );
  }

  void _showRenameDialog() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        String newName = widget.name;
        return AlertDialog(
          backgroundColor: Colors.black87,
          title: const Text(
            'Rename Your Sprout',
            style: TextStyle(color: Colors.white),
          ),
          content: TextField(
            controller: TextEditingController(text: newName),
            onChanged: (value) => newName = value,
            style: const TextStyle(color: Colors.white),
            decoration: InputDecoration(
              hintText: 'Enter new name',
              hintStyle: TextStyle(color: Colors.white.withOpacity(0.5)),
              enabledBorder: UnderlineInputBorder(
                borderSide: BorderSide(color: widget.color),
              ),
              focusedBorder: UnderlineInputBorder(
                borderSide: BorderSide(color: AppTheme.vanimalPink),
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
                if (newName.trim().isNotEmpty) {
                  Navigator.of(context).pop();
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text('Renamed to "$newName"!'),
                      backgroundColor: widget.color,
                    ),
                  );
                  // In a real app, this would update the database
                }
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: widget.color,
              ),
              child: const Text('Save'),
            ),
          ],
        );
      },
    );
  }

  Color _getRarityColor(String rarity) {
    switch (rarity.toLowerCase()) {
      case 'common':
        return Colors.grey;
      case 'rare':
        return Colors.blue;
      case 'epic':
        return Colors.purple;
      case 'legendary':
        return Colors.orange;
      default:
        return Colors.white;
    }
  }
}