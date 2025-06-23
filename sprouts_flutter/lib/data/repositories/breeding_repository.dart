import 'dart:math';
import '../models/breeding_model.dart';
import '../models/vanimal_model.dart';

class BreedingRepository {
  // Simulated storage for breeding sessions and requests
  static final List<BreedingSession> _activeSessions = [];
  static final List<BreedingRequest> _breedingRequests = [];
  static final List<VanimalModel> _userVanimals = [];

  // Initialize with some sample Vanimals for testing
  static void initializeSampleData() {
    if (_userVanimals.isEmpty) {
      _userVanimals.addAll([
        _createSampleVanimal('pigeon', 'Pip', 5),
        _createSampleVanimal('pigeon', 'Piper', 7),
        _createSampleVanimal('elephant', 'Ellie', 3),
        _createSampleVanimal('tiger', 'Stripe', 8),
        _createSampleVanimal('penguin', 'Penny', 4),
        _createSampleVanimal('penguin', 'Pete', 6),
      ]);
    }
  }

  static VanimalModel _createSampleVanimal(String species, String name, int level) {
    final random = Random();
    return VanimalModel(
      id: 'vanimal_${DateTime.now().millisecondsSinceEpoch}_${random.nextInt(1000)}',
      name: name,
      species: species,
      location: 'North America',
      habitat: 'Urban',
      stats: VanimalStats(
        speed: 40 + random.nextInt(60),
        strength: 40 + random.nextInt(60),
        intelligence: 40 + random.nextInt(60),
        size: 40 + random.nextInt(60),
        versatility: 40 + random.nextInt(60),
        reproductiveSpeed: 40 + random.nextInt(60),
      ),
      visuals: VanimalVisuals(
        logo: 'assets/images/animals/$species.png',
        logoDetailed: 'assets/images/animals/$species.png',
        bgImage: 'assets/images/backgrounds/space_bg.jpg',
        modelPath: 'assets/models/$species.glb',
        modelScale: 1.0,
        childNodeName: species,
        runningEnabled: true,
      ),
      state: VanimalState(
        feedLevel: 0.7 + random.nextDouble() * 0.3,
        sleepLevel: 0.7 + random.nextDouble() * 0.3,
        lastFed: DateTime.now().subtract(Duration(hours: random.nextInt(12))),
        lastSlept: DateTime.now().subtract(Duration(hours: random.nextInt(12))),
        experience: level * 100 + random.nextInt(100),
        level: level,
      ),
      createdAt: DateTime.now().subtract(Duration(days: random.nextInt(30))),
      updatedAt: DateTime.now(),
    );
  }

  // Get user's Vanimals for breeding
  static Future<List<VanimalModel>> getUserVanimals() async {
    initializeSampleData();
    await Future.delayed(const Duration(milliseconds: 500)); // Simulate API call
    return List.from(_userVanimals);
  }

  // Get Vanimals of the same species for breeding
  static Future<List<VanimalModel>> getCompatibleVanimals(String species) async {
    initializeSampleData();
    await Future.delayed(const Duration(milliseconds: 300));
    return _userVanimals.where((v) => v.species == species).toList();
  }

  // Calculate breeding compatibility
  static BreedingCompatibilityResult checkCompatibility(
    VanimalModel parent1,
    VanimalModel parent2,
  ) {
    return BreedingCompatibilityResult.calculate(parent1, parent2);
  }

  // Calculate breeding cost
  static BreedingCost calculateBreedingCost(
    VanimalModel parent1,
    VanimalModel parent2,
  ) {
    final isCrossBreed = parent1.species != parent2.species;
    return BreedingCost.calculate(
      parent1: parent1,
      parent2: parent2,
      isCrossBreed: isCrossBreed,
    );
  }

  // Start breeding session
  static Future<BreedingSession> startBreeding({
    required VanimalModel parent1,
    required VanimalModel parent2,
    required int cost,
  }) async {
    // Simulate API call
    await Future.delayed(const Duration(milliseconds: 800));

    // Calculate breeding duration based on reproductive speed
    final avgReproSpeed = (parent1.stats.reproductiveSpeed + parent2.stats.reproductiveSpeed) / 2;
    final baseDuration = 4; // 4 hours base
    final durationHours = (baseDuration * (100 / avgReproSpeed)).round().clamp(1, 12);

    final session = BreedingSession(
      id: 'breeding_${DateTime.now().millisecondsSinceEpoch}',
      parent1Id: parent1.id,
      parent2Id: parent2.id,
      parent1: parent1,
      parent2: parent2,
      status: BreedingSessionStatus.inProgress,
      totalCost: cost,
      startedAt: DateTime.now(),
      durationHours: durationHours,
    );

    _activeSessions.add(session);
    return session;
  }

  // Get active breeding sessions
  static Future<List<BreedingSession>> getActiveBreedingSessions() async {
    await Future.delayed(const Duration(milliseconds: 200));
    return List.from(_activeSessions);
  }

  // Check if breeding is complete and generate offspring
  static Future<BreedingSession?> checkBreedingProgress(String sessionId) async {
    await Future.delayed(const Duration(milliseconds: 300));
    
    final sessionIndex = _activeSessions.indexWhere((s) => s.id == sessionId);
    if (sessionIndex == -1) return null;

    final session = _activeSessions[sessionIndex];
    if (session.timeRemaining.inMilliseconds <= 0 && !session.isComplete) {
      // Generate offspring
      final offspring = _generateOffspring(session.parent1, session.parent2);
      
      final completedSession = BreedingSession(
        id: session.id,
        parent1Id: session.parent1Id,
        parent2Id: session.parent2Id,
        parent1: session.parent1,
        parent2: session.parent2,
        status: BreedingSessionStatus.completed,
        totalCost: session.totalCost,
        startedAt: session.startedAt,
        completedAt: DateTime.now(),
        offspring: offspring,
        durationHours: session.durationHours,
      );

      _activeSessions[sessionIndex] = completedSession;
      
      // Add offspring to user's collection
      _userVanimals.add(offspring);
      
      return completedSession;
    }

    return session;
  }

  // Generate offspring from two parents
  static VanimalModel _generateOffspring(VanimalModel parent1, VanimalModel parent2) {
    final random = Random();
    
    // Generate offspring stats by inheriting from parents with some variation
    final offspring = VanimalModel(
      id: 'offspring_${DateTime.now().millisecondsSinceEpoch}',
      name: _generateOffspringName(parent1, parent2),
      species: parent1.species, // Same species as parents
      location: random.nextBool() ? parent1.location : parent2.location,
      habitat: random.nextBool() ? parent1.habitat : parent2.habitat,
      stats: _inheritStats(parent1.stats, parent2.stats),
      visuals: VanimalVisuals(
        logo: parent1.visuals.logo,
        logoDetailed: parent1.visuals.logoDetailed,
        bgImage: parent1.visuals.bgImage,
        modelPath: parent1.visuals.modelPath,
        modelScale: parent1.visuals.modelScale,
        childNodeName: parent1.visuals.childNodeName,
        runningEnabled: parent1.visuals.runningEnabled,
      ),
      state: VanimalState(
        feedLevel: 1.0, // Baby is well-fed
        sleepLevel: 1.0, // Baby is well-rested
        lastFed: DateTime.now(),
        lastSlept: DateTime.now(),
        experience: 0, // New baby starts at 0 XP
        level: 1, // New baby starts at level 1
      ),
      createdAt: DateTime.now(),
      updatedAt: DateTime.now(),
    );

    return offspring;
  }

  // Generate name for offspring
  static String _generateOffspringName(VanimalModel parent1, VanimalModel parent2) {
    final babyNames = {
      'pigeon': ['Squab', 'Pip Jr.', 'Chirpy', 'Feather', 'Wing'],
      'elephant': ['Calf', 'Peanut', 'Trunk', 'Jumbo Jr.', 'Ellie Jr.'],
      'tiger': ['Cub', 'Stripe Jr.', 'Whiskers', 'Tiger Jr.', 'Prowl'],
      'penguin': ['Chick', 'Waddle', 'Flipper', 'Ice', 'Penny Jr.'],
      'axolotl': ['Gilly', 'Aqua', 'Gill Jr.', 'Swim', 'Bubble'],
      'chimpanzee': ['Baby', 'Chimp Jr.', 'Monkey', 'Banana', 'Swing'],
    };

    final species = parent1.species.toLowerCase();
    final names = babyNames[species] ?? ['Baby', 'Junior', 'Little One'];
    final random = Random();
    
    return names[random.nextInt(names.length)];
  }

  // Inherit stats from parents with genetic variation
  static VanimalStats _inheritStats(VanimalStats parent1Stats, VanimalStats parent2Stats) {
    final random = Random();
    
    int inheritStat(int stat1, int stat2) {
      // Average parents' stats with ±20% variation
      final average = (stat1 + stat2) / 2;
      final variation = (average * 0.4 * random.nextDouble()) - (average * 0.2);
      return (average + variation).round().clamp(1, 100);
    }

    return VanimalStats(
      speed: inheritStat(parent1Stats.speed, parent2Stats.speed),
      strength: inheritStat(parent1Stats.strength, parent2Stats.strength),
      intelligence: inheritStat(parent1Stats.intelligence, parent2Stats.intelligence),
      size: inheritStat(parent1Stats.size, parent2Stats.size),
      versatility: inheritStat(parent1Stats.versatility, parent2Stats.versatility),
      reproductiveSpeed: inheritStat(parent1Stats.reproductiveSpeed, parent2Stats.reproductiveSpeed),
    );
  }

  // Complete breeding session and claim offspring
  static Future<VanimalModel> claimOffspring(String sessionId) async {
    await Future.delayed(const Duration(milliseconds: 400));
    
    final session = _activeSessions.firstWhere((s) => s.id == sessionId);
    if (session.offspring == null) {
      throw Exception('No offspring available to claim');
    }

    // Remove the completed session
    _activeSessions.removeWhere((s) => s.id == sessionId);
    
    return session.offspring!;
  }

  // Create breeding request to another user
  static Future<BreedingRequest> createBreedingRequest({
    required String requesterId,
    required String requesterVanimalId,
    required String targetUserId,
    required String targetVanimalId,
    required int cost,
  }) async {
    await Future.delayed(const Duration(milliseconds: 600));

    final request = BreedingRequest(
      id: 'request_${DateTime.now().millisecondsSinceEpoch}',
      requesterId: requesterId,
      requesterVanimalId: requesterVanimalId,
      targetUserId: targetUserId,
      targetVanimalId: targetVanimalId,
      status: BreedingRequestStatus.pending,
      cost: cost,
      createdAt: DateTime.now(),
    );

    _breedingRequests.add(request);
    return request;
  }

  // Get pending breeding requests
  static Future<List<BreedingRequest>> getPendingRequests() async {
    await Future.delayed(const Duration(milliseconds: 200));
    return _breedingRequests
        .where((r) => r.status == BreedingRequestStatus.pending)
        .toList();
  }

  // Accept breeding request
  static Future<BreedingSession> acceptBreedingRequest(String requestId) async {
    await Future.delayed(const Duration(milliseconds: 500));
    
    final requestIndex = _breedingRequests.indexWhere((r) => r.id == requestId);
    if (requestIndex == -1) {
      throw Exception('Breeding request not found');
    }

    final request = _breedingRequests[requestIndex];
    
    // Update request status
    final updatedRequest = BreedingRequest(
      id: request.id,
      requesterId: request.requesterId,
      requesterVanimalId: request.requesterVanimalId,
      targetUserId: request.targetUserId,
      targetVanimalId: request.targetVanimalId,
      status: BreedingRequestStatus.accepted,
      cost: request.cost,
      createdAt: request.createdAt,
      acceptedAt: DateTime.now(),
    );
    
    _breedingRequests[requestIndex] = updatedRequest;

    // Find the Vanimals involved
    final parent1 = _userVanimals.firstWhere((v) => v.id == request.requesterVanimalId);
    final parent2 = _userVanimals.firstWhere((v) => v.id == request.targetVanimalId);

    // Start breeding session
    return startBreeding(
      parent1: parent1,
      parent2: parent2,
      cost: request.cost,
    );
  }

  // Reject breeding request
  static Future<void> rejectBreedingRequest(String requestId) async {
    await Future.delayed(const Duration(milliseconds: 300));
    
    final requestIndex = _breedingRequests.indexWhere((r) => r.id == requestId);
    if (requestIndex != -1) {
      final request = _breedingRequests[requestIndex];
      
      final updatedRequest = BreedingRequest(
        id: request.id,
        requesterId: request.requesterId,
        requesterVanimalId: request.requesterVanimalId,
        targetUserId: request.targetUserId,
        targetVanimalId: request.targetVanimalId,
        status: BreedingRequestStatus.rejected,
        cost: request.cost,
        createdAt: request.createdAt,
      );
      
      _breedingRequests[requestIndex] = updatedRequest;
    }
  }

  // Get species list for filtering
  static Future<List<String>> getAvailableSpecies() async {
    initializeSampleData();
    await Future.delayed(const Duration(milliseconds: 100));
    
    final species = _userVanimals.map((v) => v.species).toSet().toList();
    species.sort();
    return species;
  }

  // Simulate checking user's currency/balance
  static Future<int> getUserBalance() async {
    await Future.delayed(const Duration(milliseconds: 200));
    return 1000; // Simulated balance of 1000 coins
  }

  // Simulate spending coins for breeding
  static Future<bool> spendCoins(int amount) async {
    await Future.delayed(const Duration(milliseconds: 300));
    final balance = await getUserBalance();
    return balance >= amount; // Return true if user has enough coins
  }
}