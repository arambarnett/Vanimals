import 'package:http/http.dart' as http;
import 'dart:convert';
import '../../core/constants/app_constants.dart';

class WaitlistService {
  /// Get user's waitlist status
  static Future<WaitlistStatus?> getStatus(String userId) async {
    try {
      final response = await http.get(
        Uri.parse('${AppConstants.baseUrl}/api/waitlist/status/$userId'),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['success'] == true) {
          return WaitlistStatus.fromJson(data['data']);
        }
      }
      return null;
    } catch (e) {
      print('Error fetching waitlist status: $e');
      return null;
    }
  }

  /// Mark Strava as connected and grant feed reward
  static Future<WaitlistRewardResponse?> connectStrava(String userId) async {
    try {
      final response = await http.post(
        Uri.parse('${AppConstants.baseUrl}/api/waitlist/connect-strava/$userId'),
        headers: {'Content-Type': 'application/json'},
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['success'] == true) {
          return WaitlistRewardResponse.fromJson(data);
        }
      }
      return null;
    } catch (e) {
      print('Error connecting Strava: $e');
      return null;
    }
  }

  /// Mark prism as purchased and grant feed reward
  static Future<WaitlistRewardResponse?> purchasePrism(
      String userId, String transactionId) async {
    try {
      final response = await http.post(
        Uri.parse('${AppConstants.baseUrl}/api/waitlist/purchase-prism/$userId'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'transactionId': transactionId}),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['success'] == true) {
          return WaitlistRewardResponse.fromJson(data);
        }
      }
      return null;
    } catch (e) {
      print('Error purchasing prism: $e');
      return null;
    }
  }

  /// Mark premium as purchased and grant feed reward
  static Future<WaitlistRewardResponse?> purchasePremium(
      String userId, String transactionId) async {
    try {
      final response = await http.post(
        Uri.parse('${AppConstants.baseUrl}/api/waitlist/purchase-premium/$userId'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'transactionId': transactionId}),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['success'] == true) {
          return WaitlistRewardResponse.fromJson(data);
        }
      }
      return null;
    } catch (e) {
      print('Error purchasing premium: $e');
      return null;
    }
  }

  /// Get waitlist leaderboard
  static Future<List<WaitlistLeaderboardEntry>> getLeaderboard({int limit = 100}) async {
    try {
      final response = await http.get(
        Uri.parse('${AppConstants.baseUrl}/api/waitlist/leaderboard?limit=$limit'),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['success'] == true) {
          return (data['data'] as List)
              .map((entry) => WaitlistLeaderboardEntry.fromJson(entry))
              .toList();
        }
      }
      return [];
    } catch (e) {
      print('Error fetching leaderboard: $e');
      return [];
    }
  }

  /// Validate referral code
  static Future<bool> validateReferralCode(String code) async {
    try {
      final response = await http.get(
        Uri.parse('${AppConstants.baseUrl}/api/waitlist/referral/$code'),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return data['success'] == true && data['valid'] == true;
      }
      return false;
    } catch (e) {
      print('Error validating referral code: $e');
      return false;
    }
  }
}

class WaitlistStatus {
  final DateTime joinedAt;
  final bool stravaConnected;
  final bool hasPrism;
  final bool hasPremium;
  final int eggsGranted;
  final int feedGranted;
  final String referralCode;
  final int referralCount;

  WaitlistStatus({
    required this.joinedAt,
    required this.stravaConnected,
    required this.hasPrism,
    required this.hasPremium,
    required this.eggsGranted,
    required this.feedGranted,
    required this.referralCode,
    required this.referralCount,
  });

  factory WaitlistStatus.fromJson(Map<String, dynamic> json) {
    return WaitlistStatus(
      joinedAt: DateTime.parse(json['joinedAt']),
      stravaConnected: json['stravaConnected'] ?? false,
      hasPrism: json['hasPrism'] ?? false,
      hasPremium: json['hasPremium'] ?? false,
      eggsGranted: json['eggsGranted'] ?? 1,
      feedGranted: json['feedGranted'] ?? 0,
      referralCode: json['referralCode'] ?? '',
      referralCount: json['referralCount'] ?? 0,
    );
  }
}

class WaitlistRewardResponse {
  final bool success;
  final String message;
  final int feedGranted;
  final int reward;

  WaitlistRewardResponse({
    required this.success,
    required this.message,
    required this.feedGranted,
    required this.reward,
  });

  factory WaitlistRewardResponse.fromJson(Map<String, dynamic> json) {
    return WaitlistRewardResponse(
      success: json['success'] ?? false,
      message: json['message'] ?? '',
      feedGranted: json['data']['feedGranted'] ?? 0,
      reward: json['data']['reward'] ?? 0,
    );
  }
}

class WaitlistLeaderboardEntry {
  final String referralCode;
  final int referralCount;
  final DateTime joinedAt;

  WaitlistLeaderboardEntry({
    required this.referralCode,
    required this.referralCount,
    required this.joinedAt,
  });

  factory WaitlistLeaderboardEntry.fromJson(Map<String, dynamic> json) {
    return WaitlistLeaderboardEntry(
      referralCode: json['referralCode'],
      referralCount: json['referralCount'],
      joinedAt: DateTime.parse(json['joinedAt']),
    );
  }
}
