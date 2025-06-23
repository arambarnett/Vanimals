import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/user_model.dart';

class ApiService {
  static const String baseUrl = 'http://192.168.12.244:3000'; // Backend URL
  
  static const Map<String, String> headers = {
    'Content-Type': 'application/json',
  };

  // Health check
  static Future<Map<String, dynamic>> healthCheck() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/health'),
        headers: headers,
      );
      
      if (response.statusCode == 200) {
        return json.decode(response.body);
      } else {
        throw Exception('Health check failed: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Network error: $e');
    }
  }

  // Auth endpoints
  static Future<User> createUser({
    required String privyId,
    required String name,
    String? email,
    required String animalId,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/auth/users'),
        headers: headers,
        body: json.encode({
          'privyId': privyId,
          'name': name,
          'email': email,
          'animalId': animalId,
        }),
      );
      
      if (response.statusCode == 201) {
        return User.fromJson(json.decode(response.body));
      } else {
        throw Exception('Failed to create user: ${response.body}');
      }
    } catch (e) {
      throw Exception('Network error: $e');
    }
  }

  static Future<User> getUserById(String userId) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/auth/users/$userId'),
        headers: headers,
      );
      
      if (response.statusCode == 200) {
        return User.fromJson(json.decode(response.body));
      } else {
        throw Exception('User not found: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Network error: $e');
    }
  }

  static Future<User> updateUser({
    required String userId,
    String? name,
    String? email,
    int? experience,
    int? level,
  }) async {
    try {
      final Map<String, dynamic> updateData = {};
      if (name != null) updateData['name'] = name;
      if (email != null) updateData['email'] = email;
      if (experience != null) updateData['experience'] = experience;
      if (level != null) updateData['level'] = level;

      final response = await http.put(
        Uri.parse('$baseUrl/auth/users/$userId'),
        headers: headers,
        body: json.encode(updateData),
      );
      
      if (response.statusCode == 200) {
        return User.fromJson(json.decode(response.body));
      } else {
        throw Exception('Failed to update user: ${response.body}');
      }
    } catch (e) {
      throw Exception('Network error: $e');
    }
  }

  // Animal endpoints
  static Future<List<Animal>> getAnimals() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/auth/animals'),
        headers: headers,
      );
      
      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        return data.map((animal) => Animal.fromJson(animal)).toList();
      } else {
        throw Exception('Failed to get animals: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Network error: $e');
    }
  }

  // Habits endpoints
  static Future<Habit> createHabit({
    required String userId,
    required String title,
    required String frequency,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/auth/habits'),
        headers: headers,
        body: json.encode({
          'userId': userId,
          'title': title,
          'frequency': frequency,
        }),
      );
      
      if (response.statusCode == 201) {
        return Habit.fromJson(json.decode(response.body));
      } else {
        throw Exception('Failed to create habit: ${response.body}');
      }
    } catch (e) {
      throw Exception('Network error: $e');
    }
  }

  static Future<List<Habit>> getUserHabits(String userId) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/auth/users/$userId/habits'),
        headers: headers,
      );
      
      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        return data.map((habit) => Habit.fromJson(habit)).toList();
      } else {
        throw Exception('Failed to get habits: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Network error: $e');
    }
  }

  // Milestones endpoints
  static Future<Milestone> createMilestone({
    required String userId,
    required String title,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/auth/milestones'),
        headers: headers,
        body: json.encode({
          'userId': userId,
          'title': title,
        }),
      );
      
      if (response.statusCode == 201) {
        return Milestone.fromJson(json.decode(response.body));
      } else {
        throw Exception('Failed to create milestone: ${response.body}');
      }
    } catch (e) {
      throw Exception('Network error: $e');
    }
  }

  static Future<Milestone> updateMilestone({
    required String milestoneId,
    required bool achieved,
  }) async {
    try {
      final response = await http.put(
        Uri.parse('$baseUrl/auth/milestones/$milestoneId'),
        headers: headers,
        body: json.encode({
          'achieved': achieved,
        }),
      );
      
      if (response.statusCode == 200) {
        return Milestone.fromJson(json.decode(response.body));
      } else {
        throw Exception('Failed to update milestone: ${response.body}');
      }
    } catch (e) {
      throw Exception('Network error: $e');
    }
  }

  // Strava integration endpoints
  static Future<String> getStravaOAuthUrl(String userId) async {
    const clientId = '165294'; // From the backend
    const redirectUri = '$baseUrl/api/exchange_token';
    const scope = 'activity:read_all';
    
    return 'https://www.strava.com/oauth/authorize'
           '?client_id=$clientId'
           '&response_type=code'
           '&redirect_uri=$redirectUri?userId=$userId'
           '&scope=$scope'
           '&approval_prompt=force';
  }

  static Future<List<dynamic>> getStravaActivities(String userId) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/api/activities?userId=$userId'),
        headers: headers,
      );
      
      if (response.statusCode == 200) {
        return json.decode(response.body);
      } else {
        throw Exception('Failed to get Strava activities: ${response.body}');
      }
    } catch (e) {
      throw Exception('Network error: $e');
    }
  }

  static Future<Integration> getStravaIntegration(String userId) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/auth/users/$userId/integrations/strava'),
        headers: headers,
      );
      
      if (response.statusCode == 200) {
        return Integration.fromJson(json.decode(response.body));
      } else {
        throw Exception('Strava integration not found: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Network error: $e');
    }
  }
}