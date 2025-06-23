import 'package:equatable/equatable.dart';
import 'vanimal_model.dart';

class BreedingRequest extends Equatable {
  final String id;
  final String requesterId;
  final String requesterVanimalId;
  final String? targetUserId;
  final String? targetVanimalId;
  final BreedingRequestStatus status;
  final int cost;
  final DateTime createdAt;
  final DateTime? acceptedAt;
  final DateTime? completedAt;

  const BreedingRequest({
    required this.id,
    required this.requesterId,
    required this.requesterVanimalId,
    this.targetUserId,
    this.targetVanimalId,
    required this.status,
    required this.cost,
    required this.createdAt,
    this.acceptedAt,
    this.completedAt,
  });

  factory BreedingRequest.fromJson(Map<String, dynamic> json) {
    return BreedingRequest(
      id: json['id'] as String,
      requesterId: json['requester_id'] as String,
      requesterVanimalId: json['requester_vanimal_id'] as String,
      targetUserId: json['target_user_id'] as String?,
      targetVanimalId: json['target_vanimal_id'] as String?,
      status: BreedingRequestStatus.values.firstWhere(
        (e) => e.toString().split('.').last == json['status'],
      ),
      cost: json['cost'] as int,
      createdAt: DateTime.parse(json['created_at'] as String),
      acceptedAt: json['accepted_at'] != null 
          ? DateTime.parse(json['accepted_at'] as String)
          : null,
      completedAt: json['completed_at'] != null
          ? DateTime.parse(json['completed_at'] as String)
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'requester_id': requesterId,
      'requester_vanimal_id': requesterVanimalId,
      'target_user_id': targetUserId,
      'target_vanimal_id': targetVanimalId,
      'status': status.toString().split('.').last,
      'cost': cost,
      'created_at': createdAt.toIso8601String(),
      'accepted_at': acceptedAt?.toIso8601String(),
      'completed_at': completedAt?.toIso8601String(),
    };
  }

  @override
  List<Object?> get props => [
        id,
        requesterId,
        requesterVanimalId,
        targetUserId,
        targetVanimalId,
        status,
        cost,
        createdAt,
        acceptedAt,
        completedAt,
      ];
}

class BreedingSession extends Equatable {
  final String id;
  final String parent1Id;
  final String parent2Id;
  final VanimalModel parent1;
  final VanimalModel parent2;
  final BreedingSessionStatus status;
  final int totalCost;
  final DateTime startedAt;
  final DateTime? completedAt;
  final VanimalModel? offspring;
  final int durationHours;

  const BreedingSession({
    required this.id,
    required this.parent1Id,
    required this.parent2Id,
    required this.parent1,
    required this.parent2,
    required this.status,
    required this.totalCost,
    required this.startedAt,
    this.completedAt,
    this.offspring,
    required this.durationHours,
  });

  factory BreedingSession.fromJson(Map<String, dynamic> json) {
    return BreedingSession(
      id: json['id'] as String,
      parent1Id: json['parent1_id'] as String,
      parent2Id: json['parent2_id'] as String,
      parent1: VanimalModel.fromJson(json['parent1'] as Map<String, dynamic>),
      parent2: VanimalModel.fromJson(json['parent2'] as Map<String, dynamic>),
      status: BreedingSessionStatus.values.firstWhere(
        (e) => e.toString().split('.').last == json['status'],
      ),
      totalCost: json['total_cost'] as int,
      startedAt: DateTime.parse(json['started_at'] as String),
      completedAt: json['completed_at'] != null
          ? DateTime.parse(json['completed_at'] as String)
          : null,
      offspring: json['offspring'] != null
          ? VanimalModel.fromJson(json['offspring'] as Map<String, dynamic>)
          : null,
      durationHours: json['duration_hours'] as int,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'parent1_id': parent1Id,
      'parent2_id': parent2Id,
      'parent1': parent1.toJson(),
      'parent2': parent2.toJson(),
      'status': status.toString().split('.').last,
      'total_cost': totalCost,
      'started_at': startedAt.toIso8601String(),
      'completed_at': completedAt?.toIso8601String(),
      'offspring': offspring?.toJson(),
      'duration_hours': durationHours,
    };
  }

  bool get isComplete => status == BreedingSessionStatus.completed;
  bool get isInProgress => status == BreedingSessionStatus.inProgress;
  
  Duration get timeRemaining {
    if (isComplete) return Duration.zero;
    final endTime = startedAt.add(Duration(hours: durationHours));
    final remaining = endTime.difference(DateTime.now());
    return remaining.isNegative ? Duration.zero : remaining;
  }

  double get progressPercent {
    if (isComplete) return 1.0;
    final elapsed = DateTime.now().difference(startedAt);
    final total = Duration(hours: durationHours);
    return (elapsed.inMilliseconds / total.inMilliseconds).clamp(0.0, 1.0);
  }

  @override
  List<Object?> get props => [
        id,
        parent1Id,
        parent2Id,
        parent1,
        parent2,
        status,
        totalCost,
        startedAt,
        completedAt,
        offspring,
        durationHours,
      ];
}

class BreedingCost extends Equatable {
  final int baseCost;
  final int levelMultiplier;
  final int rarityBonus;
  final int crossBreedPenalty;
  final int totalCost;

  const BreedingCost({
    required this.baseCost,
    required this.levelMultiplier,
    required this.rarityBonus,
    required this.crossBreedPenalty,
    required this.totalCost,
  });

  factory BreedingCost.calculate({
    required VanimalModel parent1,
    required VanimalModel parent2,
    bool isCrossBreed = false,
  }) {
    const int baseBreedingCost = 100;
    final int levelMultiplier = (parent1.state.level + parent2.state.level) * 5;
    final int rarityBonus = _calculateRarityBonus(parent1, parent2);
    final int crossBreedPenalty = isCrossBreed ? 50 : 0;
    
    final int total = baseBreedingCost + levelMultiplier + rarityBonus + crossBreedPenalty;
    
    return BreedingCost(
      baseCost: baseBreedingCost,
      levelMultiplier: levelMultiplier,
      rarityBonus: rarityBonus,
      crossBreedPenalty: crossBreedPenalty,
      totalCost: total,
    );
  }

  static int _calculateRarityBonus(VanimalModel parent1, VanimalModel parent2) {
    // Calculate rarity based on stats - higher stats = rarer
    final p1Total = parent1.stats.speed + parent1.stats.strength + 
                   parent1.stats.intelligence + parent1.stats.size + 
                   parent1.stats.versatility + parent1.stats.reproductiveSpeed;
    
    final p2Total = parent2.stats.speed + parent2.stats.strength + 
                   parent2.stats.intelligence + parent2.stats.size + 
                   parent2.stats.versatility + parent2.stats.reproductiveSpeed;
    
    final avgStats = (p1Total + p2Total) / 2;
    
    if (avgStats > 500) return 100; // Legendary
    if (avgStats > 400) return 75;  // Epic
    if (avgStats > 300) return 50;  // Rare
    if (avgStats > 200) return 25;  // Uncommon
    return 0; // Common
  }

  @override
  List<Object> get props => [
        baseCost,
        levelMultiplier,
        rarityBonus,
        crossBreedPenalty,
        totalCost,
      ];
}

enum BreedingRequestStatus {
  pending,
  accepted,
  rejected,
  completed,
  cancelled,
}

enum BreedingSessionStatus {
  inProgress,
  completed,
  failed,
}

enum BreedingCompatibility {
  perfect,     // Same species, high compatibility
  compatible,  // Same species, medium compatibility
  difficult,   // Same species, low compatibility
  impossible,  // Different species
}

class BreedingCompatibilityResult extends Equatable {
  final BreedingCompatibility compatibility;
  final double successRate;
  final String message;
  final List<String> factors;

  const BreedingCompatibilityResult({
    required this.compatibility,
    required this.successRate,
    required this.message,
    required this.factors,
  });

  static BreedingCompatibilityResult calculate(
    VanimalModel parent1,
    VanimalModel parent2,
  ) {
    // Check species compatibility first
    if (parent1.species != parent2.species) {
      return const BreedingCompatibilityResult(
        compatibility: BreedingCompatibility.impossible,
        successRate: 0.0,
        message: 'Different species cannot breed together',
        factors: ['Species mismatch'],
      );
    }

    // Calculate compatibility based on various factors
    final List<String> factors = [];
    double baseRate = 0.8; // 80% base success rate

    // Level difference factor
    final levelDiff = (parent1.state.level - parent2.state.level).abs();
    if (levelDiff > 10) {
      baseRate -= 0.2;
      factors.add('Large level difference (-20%)');
    } else if (levelDiff > 5) {
      baseRate -= 0.1;
      factors.add('Moderate level difference (-10%)');
    } else {
      factors.add('Similar levels (+5%)');
      baseRate += 0.05;
    }

    // Health factor (based on feed and sleep levels)
    final parent1Health = (parent1.state.feedLevel + parent1.state.sleepLevel) / 2;
    final parent2Health = (parent2.state.feedLevel + parent2.state.sleepLevel) / 2;
    final avgHealth = (parent1Health + parent2Health) / 2;
    
    if (avgHealth > 0.8) {
      baseRate += 0.1;
      factors.add('Excellent health (+10%)');
    } else if (avgHealth > 0.6) {
      factors.add('Good health');
    } else {
      baseRate -= 0.15;
      factors.add('Poor health (-15%)');
    }

    // Reproductive speed factor
    final avgReproSpeed = (parent1.stats.reproductiveSpeed + parent2.stats.reproductiveSpeed) / 2;
    if (avgReproSpeed > 80) {
      baseRate += 0.1;
      factors.add('High reproductive compatibility (+10%)');
    } else if (avgReproSpeed < 40) {
      baseRate -= 0.1;
      factors.add('Low reproductive compatibility (-10%)');
    }

    // Clamp success rate between 0.1 and 0.95
    final successRate = baseRate.clamp(0.1, 0.95);

    // Determine compatibility level
    BreedingCompatibility compatibility;
    String message;

    if (successRate >= 0.8) {
      compatibility = BreedingCompatibility.perfect;
      message = 'Perfect breeding match!';
    } else if (successRate >= 0.6) {
      compatibility = BreedingCompatibility.compatible;
      message = 'Good breeding compatibility';
    } else if (successRate >= 0.3) {
      compatibility = BreedingCompatibility.difficult;
      message = 'Challenging breeding attempt';
    } else {
      compatibility = BreedingCompatibility.difficult;
      message = 'Very difficult breeding attempt';
    }

    return BreedingCompatibilityResult(
      compatibility: compatibility,
      successRate: successRate,
      message: message,
      factors: factors,
    );
  }

  @override
  List<Object> get props => [compatibility, successRate, message, factors];
}