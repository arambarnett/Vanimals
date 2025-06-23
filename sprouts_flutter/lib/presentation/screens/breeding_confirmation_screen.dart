import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../../data/models/vanimal_model.dart';
import '../../data/models/breeding_model.dart';
import '../../data/repositories/breeding_repository.dart';
import 'breeding_progress_screen.dart';

class BreedingConfirmationScreen extends StatefulWidget {
  final VanimalModel parent1;
  final VanimalModel parent2;
  final BreedingCompatibilityResult compatibilityResult;

  const BreedingConfirmationScreen({
    super.key,
    required this.parent1,
    required this.parent2,
    required this.compatibilityResult,
  });

  @override
  State<BreedingConfirmationScreen> createState() => _BreedingConfirmationScreenState();
}

class _BreedingConfirmationScreenState extends State<BreedingConfirmationScreen> {
  BreedingCost? breedingCost;
  int userBalance = 0;
  bool isLoading = true;
  bool isBreeding = false;

  @override
  void initState() {
    super.initState();
    _loadBreedingInfo();
  }

  Future<void> _loadBreedingInfo() async {
    setState(() => isLoading = true);

    try {
      final cost = BreedingRepository.calculateBreedingCost(widget.parent1, widget.parent2);
      final balance = await BreedingRepository.getUserBalance();
      
      setState(() {
        breedingCost = cost;
        userBalance = balance;
        isLoading = false;
      });
    } catch (e) {
      setState(() => isLoading = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error loading breeding info: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  Future<void> _startBreeding() async {
    if (breedingCost == null) return;

    setState(() => isBreeding = true);

    try {
      // Check if user has enough balance
      final canAfford = await BreedingRepository.spendCoins(breedingCost!.totalCost);
      if (!canAfford) {
        throw Exception('Insufficient funds');
      }

      // Start breeding session
      final session = await BreedingRepository.startBreeding(
        parent1: widget.parent1,
        parent2: widget.parent2,
        cost: breedingCost!.totalCost,
      );

      if (mounted) {
        // Navigate to progress screen
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(
            builder: (context) => BreedingProgressScreen(session: session),
          ),
        );
      }
    } catch (e) {
      setState(() => isBreeding = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Breeding failed: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Confirm Breeding'),
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
              : SingleChildScrollView(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Parents Display
                      _buildParentsDisplay(),
                      
                      const SizedBox(height: 20),
                      
                      // Compatibility Info
                      _buildCompatibilityCard(),
                      
                      const SizedBox(height: 20),
                      
                      // Cost Breakdown
                      if (breedingCost != null) _buildCostBreakdown(),
                      
                      const SizedBox(height: 20),
                      
                      // Breeding Info
                      _buildBreedingInfoCard(),
                      
                      const SizedBox(height: 20),
                      
                      // Balance Check
                      _buildBalanceCard(),
                      
                      const SizedBox(height: 30),
                      
                      // Action Buttons
                      _buildActionButtons(),
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
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(child: _buildParentCard(widget.parent1, 'Parent 1')),
              const Padding(
                padding: EdgeInsets.symmetric(horizontal: 16),
                child: Icon(Icons.favorite, color: Colors.white, size: 32),
              ),
              Expanded(child: _buildParentCard(widget.parent2, 'Parent 2')),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildParentCard(VanimalModel parent, String label) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        children: [
          Text(
            label,
            style: const TextStyle(
              color: Colors.white70,
              fontSize: 12,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          Container(
            width: 60,
            height: 60,
            decoration: BoxDecoration(
              color: AppTheme.vanimalPink,
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.pets, color: Colors.white, size: 30),
          ),
          const SizedBox(height: 8),
          Text(
            parent.name,
            style: const TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.bold,
              fontSize: 14,
            ),
            textAlign: TextAlign.center,
          ),
          Text(
            parent.species.toUpperCase(),
            style: const TextStyle(
              color: Colors.white70,
              fontSize: 10,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            'Level ${parent.state.level}',
            style: const TextStyle(
              color: AppTheme.vanimalPink,
              fontSize: 12,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          _buildStatBar('Health', (parent.state.feedLevel + parent.state.sleepLevel) / 2),
        ],
      ),
    );
  }

  Widget _buildStatBar(String label, double value) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(color: Colors.white70, fontSize: 10),
        ),
        const SizedBox(height: 2),
        Container(
          height: 4,
          decoration: BoxDecoration(
            color: Colors.white.withOpacity(0.3),
            borderRadius: BorderRadius.circular(2),
          ),
          child: FractionallySizedBox(
            alignment: Alignment.centerLeft,
            widthFactor: value,
            child: Container(
              decoration: BoxDecoration(
                color: AppTheme.vanimalPink,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildCompatibilityCard() {
    Color compatibilityColor;
    IconData compatibilityIcon;

    switch (widget.compatibilityResult.compatibility) {
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
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.black.withOpacity(0.8),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: compatibilityColor),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(compatibilityIcon, color: compatibilityColor, size: 24),
              const SizedBox(width: 12),
              Expanded(
                child: Text(
                  'Breeding Compatibility',
                  style: TextStyle(
                    color: compatibilityColor,
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                decoration: BoxDecoration(
                  color: compatibilityColor.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  '${(widget.compatibilityResult.successRate * 100).round()}%',
                  style: TextStyle(
                    color: compatibilityColor,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            widget.compatibilityResult.message,
            style: const TextStyle(color: Colors.white, fontSize: 14),
          ),
          if (widget.compatibilityResult.factors.isNotEmpty) ...[
            const SizedBox(height: 12),
            ...widget.compatibilityResult.factors.map((factor) => 
              Padding(
                padding: const EdgeInsets.only(bottom: 4),
                child: Row(
                  children: [
                    const Icon(Icons.circle, color: Colors.white70, size: 6),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        factor,
                        style: const TextStyle(color: Colors.white70, fontSize: 12),
                      ),
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

  Widget _buildCostBreakdown() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.black.withOpacity(0.8),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            children: [
              Icon(Icons.monetization_on, color: Colors.amber, size: 24),
              SizedBox(width: 12),
              Text(
                'Breeding Cost Breakdown',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          _buildCostRow('Base Cost', breedingCost!.baseCost),
          _buildCostRow('Level Bonus', breedingCost!.levelMultiplier),
          _buildCostRow('Rarity Bonus', breedingCost!.rarityBonus),
          if (breedingCost!.crossBreedPenalty > 0)
            _buildCostRow('Cross-breed Penalty', breedingCost!.crossBreedPenalty),
          const Divider(color: Colors.white30),
          _buildCostRow('Total Cost', breedingCost!.totalCost, isTotal: true),
        ],
      ),
    );
  }

  Widget _buildCostRow(String label, int amount, {bool isTotal = false}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: TextStyle(
              color: isTotal ? Colors.white : Colors.white70,
              fontSize: isTotal ? 14 : 12,
              fontWeight: isTotal ? FontWeight.bold : FontWeight.normal,
            ),
          ),
          Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(
                Icons.monetization_on,
                color: Colors.amber,
                size: isTotal ? 16 : 14,
              ),
              const SizedBox(width: 4),
              Text(
                amount.toString(),
                style: TextStyle(
                  color: isTotal ? Colors.amber : Colors.white,
                  fontSize: isTotal ? 14 : 12,
                  fontWeight: isTotal ? FontWeight.bold : FontWeight.normal,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildBreedingInfoCard() {
    // Calculate estimated breeding time
    final avgReproSpeed = (widget.parent1.stats.reproductiveSpeed + widget.parent2.stats.reproductiveSpeed) / 2;
    final estimatedHours = (4 * (100 / avgReproSpeed)).round().clamp(1, 12);

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.vanimalPink.withOpacity(0.2),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppTheme.vanimalPink.withOpacity(0.5)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            children: [
              Icon(Icons.info_outline, color: AppTheme.vanimalPink, size: 24),
              SizedBox(width: 12),
              Text(
                'Breeding Information',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          _buildInfoRow('Estimated Time', '$estimatedHours hours'),
          _buildInfoRow('Species', widget.parent1.species.toUpperCase()),
          _buildInfoRow('Success Rate', '${(widget.compatibilityResult.successRate * 100).round()}%'),
          const SizedBox(height: 8),
          const Text(
            'Your new offspring will inherit traits from both parents with some genetic variation. Higher compatibility increases the chances of superior offspring.',
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

  Widget _buildBalanceCard() {
    final canAfford = breedingCost != null && userBalance >= breedingCost!.totalCost;
    
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: canAfford ? Colors.green.withOpacity(0.2) : Colors.red.withOpacity(0.2),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: canAfford ? Colors.green : Colors.red,
        ),
      ),
      child: Row(
        children: [
          Icon(
            canAfford ? Icons.account_balance_wallet : Icons.warning,
            color: canAfford ? Colors.green : Colors.red,
            size: 24,
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  canAfford ? 'Sufficient Funds' : 'Insufficient Funds',
                  style: TextStyle(
                    color: canAfford ? Colors.green : Colors.red,
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Row(
                  children: [
                    const Text(
                      'Your Balance: ',
                      style: TextStyle(color: Colors.white70, fontSize: 12),
                    ),
                    Icon(Icons.monetization_on, color: Colors.amber, size: 14),
                    Text(
                      userBalance.toString(),
                      style: const TextStyle(
                        color: Colors.amber,
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActionButtons() {
    final canAfford = breedingCost != null && userBalance >= breedingCost!.totalCost;
    
    return Column(
      children: [
        SizedBox(
          width: double.infinity,
          child: ElevatedButton(
            onPressed: canAfford && !isBreeding ? _startBreeding : null,
            style: ElevatedButton.styleFrom(
              backgroundColor: canAfford ? AppTheme.vanimalPink : Colors.grey,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(vertical: 16),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
            child: isBreeding
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
                      Text('Starting Breeding...'),
                    ],
                  )
                : const Text(
                    'Start Breeding',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
          ),
        ),
        const SizedBox(height: 12),
        SizedBox(
          width: double.infinity,
          child: TextButton(
            onPressed: isBreeding ? null : () => Navigator.of(context).pop(),
            child: const Text(
              'Cancel',
              style: TextStyle(color: Colors.white70),
            ),
          ),
        ),
      ],
    );
  }
}