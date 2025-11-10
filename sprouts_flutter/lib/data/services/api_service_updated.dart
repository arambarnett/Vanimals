import 'dart:convert';
import 'package:http/http.dart' as http;
import 'aptos_wallet_service.dart';

class ApiService {
  static const String baseUrl = 'http://localhost:3000/api'; // Update for production

  /// Get authentication headers with wallet signature
  static Future<Map<String, String>> _getAuthHeaders() async {
    final walletAddress = await AptosWalletService.getWalletAddress();
    if (walletAddress == null) {
      throw Exception('Wallet not connected');
    }

    final message = 'Sprouts Authentication: ${DateTime.now().millisecondsSinceEpoch}';
    final signature = await AptosWalletService.signMessage(message);

    return {
      'Content-Type': 'application/json',
      'x-wallet-address': walletAddress,
      'Authorization': 'Bearer $signature',
    };
  }

  // ========== Authentication ==========

  /// Connect wallet and register/login user
  static Future<Map<String, dynamic>?> connectWallet({
    required String walletAddress,
    required String socialProvider,
    required String socialProviderId,
    required String name,
    String? email,
  }) async {
    try {
      final message = 'Sprouts Wallet Connection: ${DateTime.now().millisecondsSinceEpoch}';
      final signature = await AptosWalletService.signMessage(message);

      final response = await http.post(
        Uri.parse('$baseUrl/auth/connect-wallet'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'walletAddress': walletAddress,
          'socialProvider': socialProvider,
          'socialProviderId': socialProviderId,
          'name': name,
          'email': email,
          'signature': signature,
        }),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        // Store user ID
        if (data['user'] != null && data['user']['id'] != null) {
          await AptosWalletService.setUserId(data['user']['id']);
        }
        return data;
      }

      throw Exception('Failed to connect wallet: ${response.body}');
    } catch (e) {
      print('Connect wallet API error: $e');
      return null;
    }
  }

  /// Get user by wallet address
  static Future<Map<String, dynamic>?> getUserByWallet(String walletAddress) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/auth/user/$walletAddress'),
        headers: await _getAuthHeaders(),
      );

      if (response.statusCode == 200) {
        return json.decode(response.body);
      }

      return null;
    } catch (e) {
      print('Get user error: $e');
      return null;
    }
  }

  /// Get user summary
  static Future<Map<String, dynamic>?> getUserSummary(String userId) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/auth/user/$userId/summary'),
        headers: await _getAuthHeaders(),
      );

      if (response.statusCode == 200) {
        return json.decode(response.body);
      }

      return null;
    } catch (e) {
      print('Get user summary error: $e');
      return null;
    }
  }

  // ========== Goals ==========

  /// Create a new goal
  static Future<Map<String, dynamic>?> createGoal({
    required String userId,
    required String title,
    String? description,
    required String type,
    required String category,
    required double targetValue,
    required String unit,
    required String frequency,
    DateTime? endDate,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/goals'),
        headers: await _getAuthHeaders(),
        body: json.encode({
          'userId': userId,
          'title': title,
          'description': description,
          'type': type,
          'category': category,
          'targetValue': targetValue,
          'unit': unit,
          'frequency': frequency,
          'endDate': endDate?.toIso8601String(),
        }),
      );

      if (response.statusCode == 201) {
        return json.decode(response.body);
      }

      throw Exception('Failed to create goal');
    } catch (e) {
      print('Create goal error: $e');
      return null;
    }
  }

  /// Get user's goals
  static Future<List<dynamic>> getUserGoals(String userId, {String? type}) async {
    try {
      final uri = Uri.parse('$baseUrl/goals/user/$userId');
      final params = type != null ? {'type': type} : null;

      final response = await http.get(
        params != null ? uri.replace(queryParameters: params) : uri,
        headers: await _getAuthHeaders(),
      );

      if (response.statusCode == 200) {
        return json.decode(response.body);
      }

      return [];
    } catch (e) {
      print('Get goals error: $e');
      return [];
    }
  }

  /// Get goal details with progress
  static Future<Map<String, dynamic>?> getGoalDetails(String goalId) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/goals/$goalId'),
        headers: await _getAuthHeaders(),
      );

      if (response.statusCode == 200) {
        return json.decode(response.body);
      }

      return null;
    } catch (e) {
      print('Get goal details error: $e');
      return null;
    }
  }

  /// Log manual progress toward a goal
  static Future<bool> logGoalProgress(String goalId, double value, {String? notes}) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/goals/$goalId/progress'),
        headers: await _getAuthHeaders(),
        body: json.encode({
          'value': value,
          'notes': notes,
        }),
      );

      return response.statusCode == 200;
    } catch (e) {
      print('Log progress error: $e');
      return false;
    }
  }

  // ========== Sprouts ==========

  /// Get user's Sprouts
  static Future<List<dynamic>> getUserSprouts(String userId) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/sprouts/user/$userId'),
        headers: await _getAuthHeaders(),
      );

      if (response.statusCode == 200) {
        return json.decode(response.body);
      }

      return [];
    } catch (e) {
      print('Get Sprouts error: $e');
      return [];
    }
  }

  /// Get Sprout details
  static Future<Map<String, dynamic>?> getSproutDetails(String sproutId) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/sprouts/$sproutId'),
        headers: await _getAuthHeaders(),
      );

      if (response.statusCode == 200) {
        return json.decode(response.body);
      }

      return null;
    } catch (e) {
      print('Get Sprout details error: $e');
      return null;
    }
  }

  /// Get Sprout health status
  static Future<Map<String, dynamic>?> getSproutHealth(String sproutId) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/sprouts/$sproutId/health'),
        headers: await _getAuthHeaders(),
      );

      if (response.statusCode == 200) {
        return json.decode(response.body);
      }

      return null;
    } catch (e) {
      print('Get Sprout health error: $e');
      return null;
    }
  }

  // ========== Plaid ==========

  /// Create Plaid Link token
  static Future<String?> createPlaidLinkToken(String userId) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/plaid/create-link-token'),
        headers: await _getAuthHeaders(),
        body: json.encode({'userId': userId}),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return data['linkToken'];
      }

      return null;
    } catch (e) {
      print('Create Plaid link token error: $e');
      return null;
    }
  }

  /// Exchange Plaid public token
  static Future<bool> exchangePlaidToken(String publicToken, String userId) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/plaid/exchange-token'),
        headers: await _getAuthHeaders(),
        body: json.encode({
          'publicToken': publicToken,
          'userId': userId,
        }),
      );

      return response.statusCode == 200;
    } catch (e) {
      print('Exchange Plaid token error: $e');
      return false;
    }
  }

  /// Sync Plaid transactions
  static Future<Map<String, dynamic>?> syncPlaidTransactions(String userId) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/plaid/sync-transactions'),
        headers: await _getAuthHeaders(),
        body: json.encode({'userId': userId}),
      );

      if (response.statusCode == 200) {
        return json.decode(response.body);
      }

      return null;
    } catch (e) {
      print('Sync Plaid transactions error: $e');
      return null;
    }
  }

  // ========== Strava ==========

  /// Sync Strava activities
  static Future<Map<String, dynamic>?> syncStravaActivities(String userId) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/strava/sync-activities'),
        headers: await _getAuthHeaders(),
        body: json.encode({'userId': userId}),
      );

      if (response.statusCode == 200) {
        return json.decode(response.body);
      }

      return null;
    } catch (e) {
      print('Sync Strava activities error: $e');
      return null;
    }
  }

  /// Get Strava activities
  static Future<List<dynamic>> getStravaActivities(String userId) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/strava/activities?userId=$userId'),
        headers: await _getAuthHeaders(),
      );

      if (response.statusCode == 200) {
        return json.decode(response.body);
      }

      return [];
    } catch (e) {
      print('Get Strava activities error: $e');
      return [];
    }
  }

  // ========== Health Check ==========

  static Future<Map<String, dynamic>?> healthCheck() async {
    try {
      final response = await http.get(Uri.parse('http://localhost:3000/health'));

      if (response.statusCode == 200) {
        return json.decode(response.body);
      }

      return null;
    } catch (e) {
      print('Health check error: $e');
      return null;
    }
  }
}
