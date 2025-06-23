import '../models/user_collection_model.dart';
import '../repositories/user_repository.dart';
import '../services/privy_auth_service.dart';

class UserCollectionRepository {
  static const String _testUserId = 'test-user-id';
  
  // Get user's Sprouts collection
  static Future<List<UserCollectionItem>> getUserCollection([String? userId]) async {
    try {
      // Try to get authenticated user ID first, fallback to test user
      String? actualUserId = userId;
      if (actualUserId == null) {
        final authUserId = await PrivyAuthService.getUserId();
        actualUserId = authUserId ?? _testUserId;
      }
      
      // For now, we're using habits to store the user's collection
      // This is a temporary solution until we implement a proper UserAnimal model
      final habits = await UserRepository.getUserHabits(actualUserId);
      
      return habits.map((habit) => UserCollectionItem.fromHabit(habit.toJson())).toList();
    } catch (e) {
      throw Exception('Failed to fetch user collection: $e');
    }
  }
  
  // Get user profile with basic info
  static Future<Map<String, dynamic>> getUserProfile([String? userId]) async {
    try {
      // Try to get authenticated user ID first, fallback to test user
      String? actualUserId = userId;
      if (actualUserId == null) {
        final authUserId = await PrivyAuthService.getUserId();
        actualUserId = authUserId ?? _testUserId;
      }
      final user = await UserRepository.getUserById(actualUserId);
      
      return {
        'id': user.id,
        'name': user.name,
        'email': user.email,
        'experience': user.experience,
        'level': user.level,
        'animal': user.animal?.toJson(),
      };
    } catch (e) {
      throw Exception('Failed to fetch user profile: $e');
    }
  }
  
  // Check if user has any Sprouts in collection
  static Future<bool> hasAnyCollectionItems([String? userId]) async {
    try {
      final collection = await getUserCollection(userId);
      return collection.isNotEmpty;
    } catch (e) {
      return false;
    }
  }
  
  // Get collection count
  static Future<int> getCollectionCount([String? userId]) async {
    try {
      final collection = await getUserCollection(userId);
      return collection.length;
    } catch (e) {
      return 0;
    }
  }
}