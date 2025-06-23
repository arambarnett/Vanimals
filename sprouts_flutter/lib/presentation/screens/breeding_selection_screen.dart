import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../../data/models/vanimal_model.dart';
import '../../data/models/breeding_model.dart';
import '../../data/repositories/breeding_repository.dart';
import 'breeding_confirmation_screen.dart';

class BreedingSelectionScreen extends StatefulWidget {
  const BreedingSelectionScreen({super.key});

  @override
  State<BreedingSelectionScreen> createState() => _BreedingSelectionScreenState();
}

class _BreedingSelectionScreenState extends State<BreedingSelectionScreen> {
  List<VanimalModel> userVanimals = [];
  List<String> availableSpecies = [];
  VanimalModel? selectedParent1;
  VanimalModel? selectedParent2;
  String? selectedSpeciesFilter;
  bool isLoading = true;
  BreedingCompatibilityResult? compatibilityResult;

  @override
  void initState() {
    super.initState();
    _loadUserVanimals();
  }

  Future<void> _loadUserVanimals() async {
    setState(() => isLoading = true);
    
    try {
      final vanimals = await BreedingRepository.getUserVanimals();
      final species = await BreedingRepository.getAvailableSpecies();
      
      setState(() {
        userVanimals = vanimals;
        availableSpecies = species;
        isLoading = false;
      });
    } catch (e) {
      setState(() => isLoading = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error loading Vanimals: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  List<VanimalModel> get filteredVanimals {
    if (selectedSpeciesFilter == null) return userVanimals;
    return userVanimals.where((v) => v.species == selectedSpeciesFilter).toList();
  }

  void _selectParent1(VanimalModel vanimal) {
    setState(() {
      selectedParent1 = vanimal;
      selectedSpeciesFilter = vanimal.species;
      
      // Clear parent2 if it's not compatible
      if (selectedParent2 != null && selectedParent2!.species != vanimal.species) {
        selectedParent2 = null;
      }
      
      _updateCompatibility();
    });
  }

  void _selectParent2(VanimalModel vanimal) {
    setState(() {
      selectedParent2 = vanimal;
      _updateCompatibility();
    });
  }

  void _updateCompatibility() {
    if (selectedParent1 != null && selectedParent2 != null) {
      if (selectedParent1!.id == selectedParent2!.id) {
        setState(() {
          compatibilityResult = const BreedingCompatibilityResult(
            compatibility: BreedingCompatibility.impossible,
            successRate: 0.0,
            message: 'Cannot breed a Vanimal with itself',
            factors: ['Same Vanimal selected'],
          );
        });
        return;
      }
      
      setState(() {
        compatibilityResult = BreedingRepository.checkCompatibility(
          selectedParent1!,
          selectedParent2!,
        );
      });
    } else {
      setState(() => compatibilityResult = null);
    }
  }

  void _proceedToConfirmation() {
    if (selectedParent1 != null && 
        selectedParent2 != null && 
        compatibilityResult != null &&
        compatibilityResult!.compatibility != BreedingCompatibility.impossible) {
      
      Navigator.of(context).push(
        MaterialPageRoute(
          builder: (context) => BreedingConfirmationScreen(
            parent1: selectedParent1!,
            parent2: selectedParent2!,
            compatibilityResult: compatibilityResult!,
          ),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Select Breeding Pair'),
        backgroundColor: AppTheme.vanimalPurple,
        foregroundColor: Colors.white,
        elevation: 0,
      ),
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
          child: isLoading 
              ? const Center(child: CircularProgressIndicator(color: AppTheme.vanimalPurple))
              : Column(
                  children: [
                    // Species Filter
                    Container(
                      margin: const EdgeInsets.all(16),
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                      decoration: BoxDecoration(
                        color: Colors.black.withOpacity(0.8),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.filter_list, color: Colors.white, size: 20),
                          const SizedBox(width: 8),
                          const Text('Species:', style: TextStyle(color: Colors.white)),
                          const SizedBox(width: 12),
                          Expanded(
                            child: DropdownButton<String>(
                              value: selectedSpeciesFilter,
                              hint: const Text('All Species', style: TextStyle(color: Colors.white70)),
                              dropdownColor: Colors.black87,
                              style: const TextStyle(color: Colors.white),
                              underline: Container(),
                              isExpanded: true,
                              items: [
                                const DropdownMenuItem<String>(
                                  value: null,
                                  child: Text('All Species'),
                                ),
                                ...availableSpecies.map((species) => 
                                  DropdownMenuItem<String>(
                                    value: species,
                                    child: Text(species.toUpperCase()),
                                  ),
                                ),
                              ],
                              onChanged: (value) {
                                setState(() {
                                  selectedSpeciesFilter = value;
                                  selectedParent1 = null;
                                  selectedParent2 = null;
                                  compatibilityResult = null;
                                });
                              },
                            ),
                          ),
                        ],
                      ),
                    ),

                    // Selection Status
                    Container(
                      margin: const EdgeInsets.symmetric(horizontal: 16),
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: AppTheme.vanimalPurple.withOpacity(0.9),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Column(
                        children: [
                          Row(
                            children: [
                              Expanded(
                                child: _buildParentSelection(
                                  'Parent 1',
                                  selectedParent1,
                                  1,
                                ),
                              ),
                              const Padding(
                                padding: EdgeInsets.symmetric(horizontal: 16),
                                child: Icon(Icons.favorite, color: Colors.white, size: 24),
                              ),
                              Expanded(
                                child: _buildParentSelection(
                                  'Parent 2',
                                  selectedParent2,
                                  2,
                                ),
                              ),
                            ],
                          ),
                          
                          if (compatibilityResult != null) ...[
                            const SizedBox(height: 16),
                            _buildCompatibilityDisplay(),
                          ],
                        ],
                      ),
                    ),

                    const SizedBox(height: 16),

                    // Vanimals Grid
                    Expanded(
                      child: Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        child: GridView.builder(
                          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                            crossAxisCount: 2,
                            childAspectRatio: 0.8,
                            crossAxisSpacing: 12,
                            mainAxisSpacing: 12,
                          ),
                          itemCount: filteredVanimals.length,
                          itemBuilder: (context, index) {
                            final vanimal = filteredVanimals[index];
                            final isSelected1 = selectedParent1?.id == vanimal.id;
                            final isSelected2 = selectedParent2?.id == vanimal.id;
                            final isSelected = isSelected1 || isSelected2;
                            
                            return _buildVanimalCard(vanimal, isSelected, isSelected1, isSelected2);
                          },
                        ),
                      ),
                    ),

                    // Proceed Button
                    if (selectedParent1 != null && selectedParent2 != null)
                      Padding(
                        padding: const EdgeInsets.all(16),
                        child: SizedBox(
                          width: double.infinity,
                          child: ElevatedButton(
                            onPressed: compatibilityResult?.compatibility != BreedingCompatibility.impossible
                                ? _proceedToConfirmation 
                                : null,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: compatibilityResult?.compatibility != BreedingCompatibility.impossible
                                  ? AppTheme.vanimalPink
                                  : Colors.grey,
                              foregroundColor: Colors.white,
                              padding: const EdgeInsets.symmetric(vertical: 16),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12),
                              ),
                            ),
                            child: const Text(
                              'Proceed to Breeding',
                              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                            ),
                          ),
                        ),
                      ),
                  ],
                ),
        ),
      ),
    );
  }

  Widget _buildParentSelection(String label, VanimalModel? parent, int parentNumber) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.1),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(
          color: parent != null ? Colors.white : Colors.white.withOpacity(0.3),
          width: 2,
        ),
      ),
      child: Column(
        children: [
          Text(
            label,
            style: const TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.bold,
              fontSize: 14,
            ),
          ),
          const SizedBox(height: 8),
          if (parent != null) ...[
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: AppTheme.vanimalPink,
              ),
              child: const Icon(Icons.pets, color: Colors.white, size: 20),
            ),
            const SizedBox(height: 4),
            Text(
              parent.name,
              style: const TextStyle(color: Colors.white, fontSize: 12),
              textAlign: TextAlign.center,
            ),
            Text(
              'Lv.${parent.state.level}',
              style: const TextStyle(color: Colors.white70, fontSize: 10),
            ),
          ] else ...[
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: Colors.white.withOpacity(0.2),
                border: Border.all(color: Colors.white.withOpacity(0.3)),
              ),
              child: const Icon(Icons.add, color: Colors.white70, size: 20),
            ),
            const SizedBox(height: 4),
            const Text(
              'Select',
              style: TextStyle(color: Colors.white70, fontSize: 12),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildCompatibilityDisplay() {
    if (compatibilityResult == null) return const SizedBox.shrink();

    Color compatibilityColor;
    IconData compatibilityIcon;

    switch (compatibilityResult!.compatibility) {
      case BreedingCompatibility.perfect:
        compatibilityColor = Colors.green;
        compatibilityIcon = Icons.favorite;
        break;
      case BreedingCompatibility.compatible:
        compatibilityColor = Colors.orange;
        compatibilityIcon = Icons.favorite_border;
        break;
      case BreedingCompatibility.difficult:
        compatibilityColor = Colors.red;
        compatibilityIcon = Icons.warning;
        break;
      case BreedingCompatibility.impossible:
        compatibilityColor = Colors.red;
        compatibilityIcon = Icons.block;
        break;
    }

    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: compatibilityColor.withOpacity(0.2),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: compatibilityColor),
      ),
      child: Column(
        children: [
          Row(
            children: [
              Icon(compatibilityIcon, color: compatibilityColor, size: 20),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  compatibilityResult!.message,
                  style: TextStyle(
                    color: compatibilityColor,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              Text(
                '${(compatibilityResult!.successRate * 100).round()}%',
                style: TextStyle(
                  color: compatibilityColor,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          if (compatibilityResult!.factors.isNotEmpty) ...[
            const SizedBox(height: 8),
            ...compatibilityResult!.factors.map((factor) => 
              Padding(
                padding: const EdgeInsets.only(bottom: 2),
                child: Row(
                  children: [
                    const SizedBox(width: 28),
                    Text(
                      '• $factor',
                      style: const TextStyle(color: Colors.white70, fontSize: 12),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildVanimalCard(VanimalModel vanimal, bool isSelected, bool isParent1, bool isParent2) {
    return GestureDetector(
      onTap: () {
        if (isSelected) {
          // Deselect
          setState(() {
            if (isParent1) selectedParent1 = null;
            if (isParent2) selectedParent2 = null;
            _updateCompatibility();
          });
        } else {
          // Select as parent 1 or 2
          if (selectedParent1 == null) {
            _selectParent1(vanimal);
          } else if (selectedParent2 == null && vanimal.species == selectedParent1!.species) {
            _selectParent2(vanimal);
          } else if (selectedParent1 != null && vanimal.species == selectedParent1!.species) {
            // Replace parent 2
            _selectParent2(vanimal);
          }
        }
      },
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: isSelected 
                ? (isParent1 ? AppTheme.vanimalPurple : AppTheme.vanimalPink)
                : Colors.white.withOpacity(0.3),
            width: isSelected ? 3 : 1,
          ),
          color: Colors.black.withOpacity(0.6),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            // Selection indicator
            if (isSelected)
              Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(vertical: 4),
                decoration: BoxDecoration(
                  color: isParent1 ? AppTheme.vanimalPurple : AppTheme.vanimalPink,
                  borderRadius: const BorderRadius.only(
                    topLeft: Radius.circular(12),
                    topRight: Radius.circular(12),
                  ),
                ),
                child: Text(
                  isParent1 ? 'PARENT 1' : 'PARENT 2',
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                  ),
                  textAlign: TextAlign.center,
                ),
              ),
            
            const SizedBox(height: 8),
            
            // Vanimal image placeholder
            Container(
              width: 60,
              height: 60,
              decoration: BoxDecoration(
                color: AppTheme.vanimalPurple.withOpacity(0.3),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.pets, color: Colors.white, size: 30),
            ),
            
            const SizedBox(height: 8),
            
            // Name and info
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 8),
              child: Column(
                children: [
                  Text(
                    vanimal.name,
                    style: const TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 14,
                    ),
                    textAlign: TextAlign.center,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  Text(
                    vanimal.species.toUpperCase(),
                    style: const TextStyle(
                      color: Colors.white70,
                      fontSize: 10,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Level ${vanimal.state.level}',
                    style: const TextStyle(
                      color: AppTheme.vanimalPink,
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ),
            
            const Spacer(),
            
            // Health indicators
            Padding(
              padding: const EdgeInsets.all(8),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  _buildHealthIndicator(
                    Icons.restaurant,
                    vanimal.state.feedLevel,
                    Colors.orange,
                  ),
                  _buildHealthIndicator(
                    Icons.bedtime,
                    vanimal.state.sleepLevel,
                    Colors.blue,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHealthIndicator(IconData icon, double level, Color color) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(icon, color: color, size: 12),
        const SizedBox(width: 2),
        Text(
          '${(level * 100).round()}%',
          style: TextStyle(color: color, fontSize: 10),
        ),
      ],
    );
  }
}