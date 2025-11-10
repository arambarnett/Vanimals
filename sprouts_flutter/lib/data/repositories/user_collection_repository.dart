import '../models/user_collection_model.dart';
import '../services/web3auth_service.dart';
import '../services/api_service.dart';

class UserCollectionRepository {
  // Get user's Sprouts collection from backend
  static Future<List<UserCollectionItem>> getUserCollection([String? userId]) async {
    try {
      // Get authenticated user ID
      String? actualUserId = userId ?? await Web3AuthService.getUserId();

      if (actualUserId == null) {
        throw Exception('No authenticated user found');
      }

      // Fetch sprouts from backend
      final sprouts = await ApiService.getUserSprouts(actualUserId);

      // Convert to UserCollectionItem
      return sprouts.map<UserCollectionItem>((sprout) {
        return UserCollectionItem(
          id: sprout['id'] as String,
          name: sprout['name'] as String,
          species: sprout['species'] as String,
          level: sprout['level'] as int,
          rarity: sprout['rarity'] as String,
          imagePath: sprout['imagePath'] as String?,
          category: sprout['category'] as String?,
          healthPoints: sprout['healthPoints'] as int?,
          restScore: sprout['restScore'] as int?,
          waterScore: sprout['waterScore'] as int?,
          foodScore: sprout['foodScore'] as int?,
          mood: sprout['mood'] as String?,
        );
      }).toList();
    } catch (e) {
      print('Error fetching collection: $e');
      throw Exception('Failed to fetch user collection: $e');
    }
  }
  
  // Get user profile with basic info
  static Future<Map<String, dynamic>> getUserProfile([String? userId]) async {
    try {
      // Get authenticated user ID
      String? actualUserId = userId ?? await Web3AuthService.getUserId();

      if (actualUserId == null) {
        throw Exception('No authenticated user found');
      }

      // For now, return minimal profile data
      // TODO: Implement full user profile endpoint
      return {
        'id': actualUserId,
        'name': 'User',
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