import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../theme/app_theme.dart';
import '../../data/services/web3auth_service.dart';
import '../../core/constants/app_constants.dart';

class ConnectStravaScreen extends StatelessWidget {
  const ConnectStravaScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Color(0xFFFC4C02), // Strava orange
              Color(0xFF1a1a2e),
            ],
          ),
        ),
        child: SafeArea(
          child: Column(
            children: [
              // Header
              Padding(
                padding: const EdgeInsets.all(16),
                child: Row(
                  children: [
                    IconButton(
                      icon: const Icon(Icons.arrow_back, color: Colors.white),
                      onPressed: () => Navigator.of(context).pop(),
                    ),
                    const Expanded(
                      child: Text(
                        'Connect Strava',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                        textAlign: TextAlign.center,
                      ),
                    ),
                    const SizedBox(width: 48),
                  ],
                ),
              ),

              Expanded(
                child: Padding(
                  padding: const EdgeInsets.all(32),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      // Strava Logo
                      Container(
                        width: 120,
                        height: 120,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: Colors.white,
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.3),
                              blurRadius: 20,
                              spreadRadius: 5,
                            ),
                          ],
                        ),
                        child: const Icon(
                          Icons.directions_run,
                          size: 60,
                          color: Color(0xFFFC4C02),
                        ),
                      ),
                      const SizedBox(height: 40),

                      const Text(
                        'Auto-Track Your Workouts',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 28,
                          fontWeight: FontWeight.bold,
                        ),
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 16),

                      Text(
                        'Connect Strava to automatically track runs, rides, and workouts towards your fitness goals.',
                        style: TextStyle(
                          color: Colors.white.withOpacity(0.9),
                          fontSize: 16,
                          height: 1.5,
                        ),
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 40),

                      // Benefits
                      _buildBenefitRow('🏃', 'Auto-track runs & rides'),
                      const SizedBox(height: 16),
                      _buildBenefitRow('📊', 'See progress in real-time'),
                      const SizedBox(height: 16),
                      _buildBenefitRow('🌱', 'Feed your Sprout automatically'),
                      const SizedBox(height: 40),

                      // Connect Button
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton(
                          onPressed: () => _connectStrava(context),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.white,
                            foregroundColor: const Color(0xFFFC4C02),
                            padding: const EdgeInsets.symmetric(vertical: 16),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                            elevation: 8,
                          ),
                          child: const Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(Icons.link, size: 24),
                              SizedBox(width: 12),
                              Text(
                                'Connect with Strava',
                                style: TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(height: 16),

                      // Skip button
                      TextButton(
                        onPressed: () => Navigator.of(context).pop(),
                        child: Text(
                          'Skip for now',
                          style: TextStyle(
                            color: Colors.white.withOpacity(0.7),
                            fontSize: 16,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildBenefitRow(String emoji, String text) {
    return Row(
      children: [
        Text(emoji, style: const TextStyle(fontSize: 28)),
        const SizedBox(width: 16),
        Expanded(
          child: Text(
            text,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 16,
              fontWeight: FontWeight.w500,
            ),
          ),
        ),
      ],
    );
  }

  Future<void> _connectStrava(BuildContext context) async {
    try {
      // Get user ID
      final userId = await Web3AuthService.getUserId();
      if (userId == null) {
        throw Exception('User not logged in');
      }

      // Strava OAuth URL
      const stravaClientId = '181846';
      final redirectUri = '${AppConstants.baseUrl}/api/strava/exchange_token?userId=$userId';
      final stravaAuthUrl = 'https://www.strava.com/oauth/authorize'
          '?client_id=$stravaClientId'
          '&response_type=code'
          '&redirect_uri=${Uri.encodeComponent(redirectUri)}'
          '&approval_prompt=force'
          '&scope=activity:read_all';

      // Open Strava OAuth in browser
      final uri = Uri.parse(stravaAuthUrl);
      if (await canLaunchUrl(uri)) {
        await launchUrl(uri, mode: LaunchMode.externalApplication);

        // Show success message
        if (context.mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('🏃 Authorize Sprouts in Strava, then return here!'),
              backgroundColor: Color(0xFFFC4C02),
              duration: Duration(seconds: 5),
            ),
          );
        }
      } else {
        throw Exception('Could not launch Strava authorization');
      }
    } catch (e) {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to connect Strava: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }
}
