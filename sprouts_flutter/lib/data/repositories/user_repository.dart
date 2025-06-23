import '../models/user_model.dart';
import '../services/api_service.dart';

class UserRepository {
  // User management
  static Future<User> createUser({
    required String privyId,
    required String name,
    String? email,
    required String animalId,
  }) async {
    return await ApiService.createUser(
      privyId: privyId,
      name: name,
      email: email,
      animalId: animalId,
    );
  }

  static Future<User> getUserById(String userId) async {
    return await ApiService.getUserById(userId);
  }

  static Future<User> updateUser({
    required String userId,
    String? name,
    String? email,
    int? experience,
    int? level,
  }) async {
    return await ApiService.updateUser(
      userId: userId,
      name: name,
      email: email,
      experience: experience,
      level: level,
    );
  }

  // Level up user (add experience)
  static Future<User> addExperience(String userId, int experiencePoints) async {
    try {
      final user = await getUserById(userId);
      final newExperience = user.experience + experiencePoints;
      final newLevel = _calculateLevel(newExperience);
      
      return await updateUser(
        userId: userId,
        experience: newExperience,
        level: newLevel,
      );
    } catch (e) {
      throw Exception('Failed to add experience: $e');
    }
  }

  // Calculate level based on experience (Pokemon GO style)
  static int _calculateLevel(int experience) {
    if (experience < 100) return 1;
    if (experience < 300) return 2;
    if (experience < 600) return 3;
    if (experience < 1000) return 4;
    if (experience < 1500) return 5;
    if (experience < 2100) return 6;
    if (experience < 2800) return 7;
    if (experience < 3600) return 8;
    if (experience < 4500) return 9;
    if (experience < 5500) return 10;
    
    // Beyond level 10, each level requires 1000 more XP
    return 10 + ((experience - 5500) ~/ 1000);
  }

  static int getExperienceForNextLevel(int currentLevel) {
    switch (currentLevel) {
      case 1: return 100;
      case 2: return 300;
      case 3: return 600;
      case 4: return 1000;
      case 5: return 1500;
      case 6: return 2100;
      case 7: return 2800;
      case 8: return 3600;
      case 9: return 4500;
      case 10: return 5500;
      default: return 5500 + ((currentLevel - 10) * 1000);
    }
  }

  // Animal management
  static Future<List<Animal>> getAvailableAnimals() async {
    return await ApiService.getAnimals();
  }

  // Habits management
  static Future<Habit> createHabit({
    required String userId,
    required String title,
    required String frequency,
  }) async {
    return await ApiService.createHabit(
      userId: userId,
      title: title,
      frequency: frequency,
    );
  }

  static Future<List<Habit>> getUserHabits(String userId) async {
    return await ApiService.getUserHabits(userId);
  }

  // Milestones management
  static Future<Milestone> createMilestone({
    required String userId,
    required String title,
  }) async {
    return await ApiService.createMilestone(
      userId: userId,
      title: title,
    );
  }

  static Future<Milestone> achieveMilestone(String milestoneId) async {
    return await ApiService.updateMilestone(
      milestoneId: milestoneId,
      achieved: true,
    );
  }

  // Strava integration
  static Future<String> getStravaConnectUrl(String userId) async {
    return await ApiService.getStravaOAuthUrl(userId);
  }

  static Future<List<dynamic>> getStravaActivities(String userId) async {
    return await ApiService.getStravaActivities(userId);
  }

  static Future<Integration?> getStravaIntegration(String userId) async {
    try {
      return await ApiService.getStravaIntegration(userId);
    } catch (e) {
      // Integration not found
      return null;
    }
  }

  static Future<bool> isStravaConnected(String userId) async {
    final integration = await getStravaIntegration(userId);
    return integration?.isActive == true;
  }

  // Backend health check
  static Future<bool> isBackendHealthy() async {
    try {
      final health = await ApiService.healthCheck();
      return health['status'] == 'OK';
    } catch (e) {
      return false;
    }
  }
}