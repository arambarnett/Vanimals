import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'api_service.dart';
import 'privy_auth_service.dart';

class StravaAuthService {
  static const String _stravaClientId = '165294';
  static const String _redirectUri = 'sprouts://strava/callback';
  static const String _baseUrl = 'https://www.strava.com';
  
  // Storage keys
  static const String _stravaTokenKey = 'strava_access_token';
  static const String _stravaUserKey = 'strava_user_data';
  static const String _stravaConnectedKey = 'strava_connected';

  // Check if Strava is connected
  static Future<bool> isStravaConnected() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool(_stravaConnectedKey) ?? false;
  }

  // Get stored Strava user data
  static Future<Map<String, dynamic>?> getStravaUserData() async {
    final prefs = await SharedPreferences.getInstance();
    final userData = prefs.getString(_stravaUserKey);
    if (userData != null) {
      return json.decode(userData);
    }
    return null;
  }

  // Get stored Strava token
  static Future<String?> getStravaToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_stravaTokenKey);
  }

  // Store Strava data
  static Future<void> _storeStravaData({
    required String token,
    required Map<String, dynamic> userData,
  }) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_stravaTokenKey, token);
    await prefs.setString(_stravaUserKey, json.encode(userData));
    await prefs.setBool(_stravaConnectedKey, true);
  }

  // Clear Strava data
  static Future<void> disconnectStrava() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_stravaTokenKey);
    await prefs.remove(_stravaUserKey);
    await prefs.setBool(_stravaConnectedKey, false);
  }

  // Connect to Strava
  static Future<void> connectStrava(BuildContext context) async {
    final userId = await PrivyAuthService.getUserId();
    if (userId == null) {
      throw Exception('User must be authenticated first');
    }

    final authUrl = Uri.parse('$_baseUrl/oauth/authorize').replace(queryParameters: {
      'client_id': _stravaClientId,
      'redirect_uri': _redirectUri,
      'response_type': 'code',
      'scope': 'read,activity:read_all',
      'approval_prompt': 'force',
      'state': userId, // Pass user ID as state
    });

    // Show WebView for Strava authentication
    if (context.mounted) {
      await _showStravaAuthWebView(context, authUrl.toString());
    }
  }

  // Show Strava authentication WebView
  static Future<void> _showStravaAuthWebView(BuildContext context, String authUrl) async {
    return showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => Dialog.fullscreen(
        child: Scaffold(
          appBar: AppBar(
            title: const Text('Connect Strava'),
            backgroundColor: const Color(0xFFFC4C02), // Strava orange
            foregroundColor: Colors.white,
            leading: IconButton(
              icon: const Icon(Icons.close),
              onPressed: () => Navigator.of(context).pop(),
            ),
          ),
          body: WebViewWidget(
            controller: WebViewController()
              ..setJavaScriptMode(JavaScriptMode.unrestricted)
              ..setNavigationDelegate(
                NavigationDelegate(
                  onNavigationRequest: (request) {
                    if (request.url.startsWith(_redirectUri)) {
                      _handleStravaCallback(context, request.url);
                      return NavigationDecision.prevent;
                    }
                    return NavigationDecision.navigate;
                  },
                ),
              )
              ..loadRequest(Uri.parse(authUrl)),
          ),
        ),
      ),
    );
  }

  // Handle Strava authentication callback
  static Future<void> _handleStravaCallback(BuildContext context, String callbackUrl) async {
    try {
      final uri = Uri.parse(callbackUrl);
      final code = uri.queryParameters['code'];
      final state = uri.queryParameters['state']; // This is the user ID
      final error = uri.queryParameters['error'];

      if (error != null) {
        throw Exception('Strava authentication error: $error');
      }

      if (code == null || state == null) {
        throw Exception('Missing authorization code or user ID');
      }

      // Exchange code for token via our backend
      await _exchangeStravaCodeForToken(code, state);
      
      if (context.mounted) {
        Navigator.of(context).pop(); // Close WebView
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Successfully connected to Strava!'),
            backgroundColor: Color(0xFFFC4C02),
          ),
        );
      }
    } catch (e) {
      if (context.mounted) {
        Navigator.of(context).pop(); // Close WebView
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Strava connection failed: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  // Exchange authorization code for access token via backend
  static Future<void> _exchangeStravaCodeForToken(String code, String userId) async {
    try {
      // Call our backend endpoint to exchange the code
      final response = await ApiService.healthCheck(); // Using existing method temporarily
      
      // For now, simulate a successful Strava connection
      // In real implementation, this would call the backend Strava exchange endpoint
      
      // Mock Strava user data
      final mockStravaData = {
        'id': 12345678,
        'username': 'sprout_runner',
        'firstname': 'Sprout',
        'lastname': 'Runner',
        'profile_medium': 'https://example.com/avatar.jpg',
        'city': 'San Francisco',
        'state': 'CA',
        'country': 'USA',
      };

      final mockToken = 'mock_strava_token_${DateTime.now().millisecondsSinceEpoch}';

      await _storeStravaData(
        token: mockToken,
        userData: mockStravaData,
      );

      print('Strava connected successfully for user: $userId');
    } catch (e) {
      throw Exception('Failed to exchange Strava token: $e');
    }
  }

  // Get Strava activities
  static Future<List<dynamic>> getStravaActivities() async {
    try {
      final userId = await PrivyAuthService.getUserId();
      if (userId == null) {
        throw Exception('User not authenticated');
      }

      final isConnected = await isStravaConnected();
      if (!isConnected) {
        throw Exception('Strava not connected');
      }

      // Call backend to get activities
      final activities = await ApiService.getStravaActivities(userId);
      return activities;
    } catch (e) {
      throw Exception('Failed to fetch Strava activities: $e');
    }
  }

  // Get Strava integration status
  static Future<Map<String, dynamic>?> getStravaIntegration() async {
    try {
      final userId = await PrivyAuthService.getUserId();
      if (userId == null) {
        return null;
      }

      final integration = await ApiService.getStravaIntegration(userId);
      return integration.toJson();
    } catch (e) {
      return null;
    }
  }
}