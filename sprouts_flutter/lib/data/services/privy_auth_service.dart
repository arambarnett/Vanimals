import 'dart:convert';
import 'dart:math';
import 'package:crypto/crypto.dart';
import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:url_launcher/url_launcher.dart';

class PrivyAuthService {
  static const String _privyAppId = 'clm2kik9900pfmu0fpnmn0v2h'; // Replace with your Privy App ID
  static const String _redirectUri = 'sprouts://auth/callback';
  static const String _baseUrl = 'https://auth.privy.io';
  
  // Storage keys
  static const String _tokenKey = 'privy_token';
  static const String _userIdKey = 'privy_user_id';
  static const String _userDataKey = 'privy_user_data';

  // Generate code verifier and challenge for PKCE
  static String _generateCodeVerifier() {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    final random = Random.secure();
    return List.generate(128, (_) => charset[random.nextInt(charset.length)]).join();
  }

  static String _generateCodeChallenge(String verifier) {
    final bytes = utf8.encode(verifier);
    final digest = sha256.convert(bytes);
    return base64Url.encode(digest.bytes).replaceAll('=', '');
  }

  // Check if user is authenticated
  static Future<bool> isAuthenticated() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString(_tokenKey);
    return token != null && token.isNotEmpty;
  }

  // Get stored user data
  static Future<Map<String, dynamic>?> getUserData() async {
    final prefs = await SharedPreferences.getInstance();
    final userData = prefs.getString(_userDataKey);
    if (userData != null) {
      return json.decode(userData);
    }
    return null;
  }

  // Get stored token
  static Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_tokenKey);
  }

  // Get stored user ID
  static Future<String?> getUserId() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_userIdKey);
  }

  // Store authentication data
  static Future<void> _storeAuthData({
    required String token,
    required String userId,
    required Map<String, dynamic> userData,
  }) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_tokenKey, token);
    await prefs.setString(_userIdKey, userId);
    await prefs.setString(_userDataKey, json.encode(userData));
  }

  // Clear authentication data
  static Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_tokenKey);
    await prefs.remove(_userIdKey);
    await prefs.remove(_userDataKey);
  }

  // Start authentication flow
  static Future<void> authenticate(BuildContext context) async {
    final codeVerifier = _generateCodeVerifier();
    final codeChallenge = _generateCodeChallenge(codeVerifier);
    
    // Store code verifier for later use
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('code_verifier', codeVerifier);

    final authUrl = Uri.parse('$_baseUrl/oauth/authorize').replace(queryParameters: {
      'client_id': _privyAppId,
      'redirect_uri': _redirectUri,
      'response_type': 'code',
      'scope': 'openid profile email',
      'code_challenge': codeChallenge,
      'code_challenge_method': 'S256',
      'state': _generateState(),
    });

    // Show WebView for authentication
    if (context.mounted) {
      await _showAuthWebView(context, authUrl.toString());
    }
  }

  static String _generateState() {
    final random = Random.secure();
    return List.generate(16, (_) => random.nextInt(256).toRadixString(16).padLeft(2, '0')).join();
  }

  // Show authentication WebView
  static Future<void> _showAuthWebView(BuildContext context, String authUrl) async {
    return showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => Dialog.fullscreen(
        child: Scaffold(
          appBar: AppBar(
            title: const Text('Sign In'),
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
                      _handleCallback(context, request.url);
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

  // Handle authentication callback
  static Future<void> _handleCallback(BuildContext context, String callbackUrl) async {
    try {
      final uri = Uri.parse(callbackUrl);
      final code = uri.queryParameters['code'];
      final error = uri.queryParameters['error'];

      if (error != null) {
        throw Exception('Authentication error: $error');
      }

      if (code == null) {
        throw Exception('No authorization code received');
      }

      // Exchange code for token
      await _exchangeCodeForToken(code);
      
      if (context.mounted) {
        Navigator.of(context).pop(); // Close WebView
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Successfully signed in!'),
            backgroundColor: Colors.green,
          ),
        );
      }
    } catch (e) {
      if (context.mounted) {
        Navigator.of(context).pop(); // Close WebView
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Authentication failed: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  // Exchange authorization code for access token
  static Future<void> _exchangeCodeForToken(String code) async {
    final prefs = await SharedPreferences.getInstance();
    final codeVerifier = prefs.getString('code_verifier');
    
    if (codeVerifier == null) {
      throw Exception('Code verifier not found');
    }

    // For now, simulate a successful token exchange
    // In a real implementation, you would make an HTTP request to Privy's token endpoint
    
    // Mock user data - in real implementation this would come from Privy
    final mockUserData = {
      'id': 'privy_user_${DateTime.now().millisecondsSinceEpoch}',
      'email': 'user@sprouts.com',
      'name': 'Sprout Trainer',
      'verified': true,
    };

    final mockToken = 'mock_privy_token_${DateTime.now().millisecondsSinceEpoch}';

    await _storeAuthData(
      token: mockToken,
      userId: mockUserData['id'] as String,
      userData: mockUserData,
    );

    // Clean up
    await prefs.remove('code_verifier');
  }
}