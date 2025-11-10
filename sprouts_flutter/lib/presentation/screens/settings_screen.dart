import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../theme/app_theme.dart';
import '../../data/repositories/breeding_repository.dart';
import '../../data/services/api_service.dart';
import '../../data/services/user_preferences.dart';
import '../../data/services/web3auth_service.dart';
import '../../data/services/strava_auth_service.dart';
import '../../data/repositories/user_repository.dart';
import 'strava_activities_screen.dart';
import '../../main.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  bool isConnectingStrava = false;
  bool isStravaConnected = false;
  String? stravaError;
  int userBalance = 0;
  Map<String, dynamic>? userProfile;
  bool isTestingBackend = false;
  String? backendTestResult;
  String? walletAddress;

  @override
  void initState() {
    super.initState();
    _loadUserData();
  }

  Future<void> _loadUserData() async {
    try {
      final balance = await BreedingRepository.getUserBalance();
      final address = await Web3AuthService.getWalletAddress();
      setState(() {
        userBalance = balance;
        walletAddress = address;
      });

      // Check if Strava is already connected
      await _checkStravaConnection();
    } catch (e) {
      print('Error loading user data: $e');
    }
  }

  Future<void> _checkStravaConnection() async {
    try {
      final isConnected = await StravaAuthService.isStravaConnected();
      setState(() {
        isStravaConnected = isConnected;
      });
    } catch (e) {
      setState(() {
        isStravaConnected = false;
      });
    }
  }

  Future<void> _connectStrava() async {
    setState(() {
      isConnectingStrava = true;
      stravaError = null;
    });

    try {
      await StravaAuthService.connectStrava(context);
      
      // Check connection status after auth
      await _checkStravaConnection();
    } catch (e) {
      setState(() {
        stravaError = e.toString();
      });
    } finally {
      setState(() {
        isConnectingStrava = false;
      });
    }
  }

  Future<void> _disconnectStrava() async {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: Colors.black87,
        title: const Text('Disconnect Strava?', style: TextStyle(color: Colors.white)),
        content: const Text(
          'Are you sure you want to disconnect your Strava account? You will no longer earn rewards from activities.',
          style: TextStyle(color: Colors.white70),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Cancel', style: TextStyle(color: Colors.white70)),
          ),
          TextButton(
            onPressed: () async {
              Navigator.of(context).pop();
              await StravaAuthService.disconnectStrava();
              setState(() {
                isStravaConnected = false;
              });
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Strava disconnected successfully'),
                  backgroundColor: Colors.orange,
                ),
              );
            },
            child: const Text('Disconnect', style: TextStyle(color: Colors.red)),
          ),
        ],
      ),
    );
  }

  Future<void> _logout() async {
    final navigator = Navigator.of(context);

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: Colors.black87,
        title: const Text('Logout', style: TextStyle(color: Colors.white)),
        content: const Text(
          'Are you sure you want to logout? Your Sprouts collection will be saved and you can return anytime.',
          style: TextStyle(color: Colors.white70),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Cancel', style: TextStyle(color: Colors.white70)),
          ),
          TextButton(
            onPressed: () async {
              // Close confirmation dialog first
              Navigator.of(context).pop();

              // Show loading indicator
              showDialog(
                context: context,
                barrierDismissible: false,
                builder: (context) => WillPopScope(
                  onWillPop: () async => false,
                  child: const Center(
                    child: CircularProgressIndicator(
                      valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                    ),
                  ),
                ),
              );

              try {
                // Clear authentication data
                await Web3AuthService.signOut();
                await StravaAuthService.disconnectStrava();
                UserPreferences.reset();
              } catch (e) {
                print('Error during logout: $e');
                // Continue with navigation even if logout fails
              }

              // Use the navigator reference captured at the beginning
              // Close loading dialog and navigate to home screen
              navigator.pushAndRemoveUntil(
                MaterialPageRoute(builder: (context) => const VanimalHomeScreen()),
                (route) => false,
              );
            },
            child: const Text('Logout', style: TextStyle(color: Colors.red)),
          ),
        ],
      ),
    );
  }

  Future<void> _testBackendConnection() async {
    setState(() {
      isTestingBackend = true;
      backendTestResult = null;
    });

    try {
      final isHealthy = await UserRepository.isBackendHealthy();
      setState(() {
        backendTestResult = isHealthy 
            ? '✅ Backend connection successful!'
            : '❌ Backend health check failed';
      });
      
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(backendTestResult!),
            backgroundColor: isHealthy ? Colors.green : Colors.red,
            duration: const Duration(seconds: 3),
          ),
        );
      }
    } catch (e) {
      setState(() {
        backendTestResult = '❌ Connection failed: ${e.toString()}';
      });
      
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Backend connection failed: $e'),
            backgroundColor: Colors.red,
            duration: const Duration(seconds: 4),
          ),
        );
      }
    } finally {
      setState(() {
        isTestingBackend = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Settings'),
        backgroundColor: AppTheme.vanimalPurple,
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              AppTheme.spaceBackground,
              Color(0xFF1a1a2e),
            ],
          ),
        ),
        child: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // User Profile Section
                _buildUserProfileCard(),
                
                const SizedBox(height: 20),
                
                // Strava Integration Section
                _buildStravaSection(),
                
                const SizedBox(height: 20),
                
                // Currency Section
                _buildCurrencySection(),
                
                const SizedBox(height: 20),
                
                // App Settings Section
                _buildAppSettingsSection(),
                
                const SizedBox(height: 20),
                
                // About Section
                _buildAboutSection(),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildUserProfileCard() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            AppTheme.vanimalPurple.withOpacity(0.8),
            AppTheme.vanimalPink.withOpacity(0.8),
          ],
        ),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        children: [
          const CircleAvatar(
            radius: 40,
            backgroundColor: Colors.white,
            child: Icon(Icons.person, size: 40, color: AppTheme.vanimalPurple),
          ),
          const SizedBox(height: 12),
          const Text(
            'Sprout Trainer',
            style: TextStyle(
              color: Colors.white,
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            'Member since ${DateTime.now().year}',
            style: const TextStyle(
              color: Colors.white70,
              fontSize: 14,
            ),
          ),
          if (walletAddress != null) ...[
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.1),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: Colors.white.withOpacity(0.3),
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Icon(Icons.account_balance_wallet, color: Colors.white70, size: 16),
                      const SizedBox(width: 8),
                      const Text(
                        'Wallet Address',
                        style: TextStyle(
                          color: Colors.white70,
                          fontSize: 12,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      const Spacer(),
                      IconButton(
                        icon: const Icon(Icons.copy, size: 16, color: Colors.white70),
                        padding: EdgeInsets.zero,
                        constraints: const BoxConstraints(),
                        onPressed: () async {
                          // Copy to clipboard
                          await Clipboard.setData(ClipboardData(text: walletAddress!));
                          if (mounted) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text('Wallet address copied to clipboard'),
                                duration: Duration(seconds: 2),
                                backgroundColor: Colors.green,
                              ),
                            );
                          }
                        },
                        tooltip: 'Copy address',
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(
                    '${walletAddress!.substring(0, 6)}...${walletAddress!.substring(walletAddress!.length - 4)}',
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                      fontFamily: 'monospace',
                    ),
                  ),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildStravaSection() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.black.withOpacity(0.8),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: const Color(0xFFFC4C02), // Strava orange
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Icon(Icons.directions_run, color: Colors.white, size: 24),
              ),
              const SizedBox(width: 12),
              const Expanded(
                child: Text(
                  'Strava Integration',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              if (isStravaConnected)
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: Colors.green,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Text(
                    'Connected',
                    style: TextStyle(color: Colors.white, fontSize: 12),
                  ),
                ),
            ],
          ),
          const SizedBox(height: 16),
          Text(
            isStravaConnected
                ? 'Your Strava account is connected! Complete activities to earn rewards for your Sprouts.'
                : 'Connect your Strava account to earn coins and XP for your Sprouts when you complete activities.',
            style: const TextStyle(color: Colors.white70, fontSize: 14),
          ),
          
          if (stravaError != null) ...[
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.red.withOpacity(0.2),
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: Colors.red),
              ),
              child: Text(
                'Error: $stravaError',
                style: const TextStyle(color: Colors.red, fontSize: 12),
              ),
            ),
          ],
          
          const SizedBox(height: 16),
          
          if (isStravaConnected) ...[
            Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () {
                      Navigator.of(context).push(
                        MaterialPageRoute(
                          builder: (context) => const StravaActivitiesScreen(),
                        ),
                      );
                    },
                    icon: const Icon(Icons.list, size: 20),
                    label: const Text('View Activities'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFFFC4C02),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 12),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: TextButton.icon(
                    onPressed: _disconnectStrava,
                    icon: const Icon(Icons.link_off, size: 20),
                    label: const Text('Disconnect'),
                    style: TextButton.styleFrom(
                      foregroundColor: Colors.red,
                      padding: const EdgeInsets.symmetric(vertical: 12),
                    ),
                  ),
                ),
              ],
            ),
          ] else ...[
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: isConnectingStrava ? null : _connectStrava,
                icon: isConnectingStrava
                    ? const SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                      )
                    : const Icon(Icons.link, size: 20),
                label: Text(isConnectingStrava ? 'Connecting...' : 'Connect Strava'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFFC4C02),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 12),
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildCurrencySection() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.black.withOpacity(0.8),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            children: [
              Icon(Icons.monetization_on, color: Colors.amber, size: 24),
              SizedBox(width: 12),
              Text(
                'Currency & Rewards',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: AppTheme.vanimalPurple.withOpacity(0.3),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Column(
                    children: [
                      const Icon(Icons.monetization_on, color: Colors.amber, size: 32),
                      const SizedBox(height: 8),
                      Text(
                        userBalance.toString(),
                        style: const TextStyle(
                          color: Colors.amber,
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const Text(
                        'Coins',
                        style: TextStyle(color: Colors.white70, fontSize: 12),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: AppTheme.vanimalPink.withOpacity(0.3),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Column(
                    children: [
                      Icon(Icons.star, color: Colors.yellow, size: 32),
                      SizedBox(height: 8),
                      Text(
                        '1,250',
                        style: TextStyle(
                          color: Colors.yellow,
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Text(
                        'Total XP',
                        style: TextStyle(color: Colors.white70, fontSize: 12),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          const Text(
            'Earn coins and XP by completing Strava activities. Use coins for breeding and purchasing items.',
            style: TextStyle(color: Colors.white70, fontSize: 14),
          ),
        ],
      ),
    );
  }

  Widget _buildAppSettingsSection() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.black.withOpacity(0.8),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            children: [
              Icon(Icons.settings, color: Colors.white, size: 24),
              SizedBox(width: 12),
              Text(
                'App Settings',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          _buildSettingItem(
            icon: Icons.notifications,
            title: 'Notifications',
            subtitle: 'Activity rewards, breeding updates',
            onTap: () {
              // TODO: Implement notifications settings
            },
          ),
          _buildSettingItem(
            icon: Icons.privacy_tip,
            title: 'Privacy',
            subtitle: 'Data sharing and privacy preferences',
            onTap: () {
              // TODO: Implement privacy settings
            },
          ),
          _buildSettingItem(
            icon: Icons.backup,
            title: 'Data Backup',
            subtitle: 'Backup your Sprouts collection',
            onTap: () {
              // TODO: Implement data backup
            },
          ),
          _buildSettingItem(
            icon: Icons.network_check,
            title: 'Test Backend Connection',
            subtitle: isTestingBackend 
                ? 'Testing connection...'
                : backendTestResult ?? 'Verify API connection',
            onTap: isTestingBackend ? null : _testBackendConnection,
          ),
        ],
      ),
    );
  }

  Widget _buildAboutSection() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.black.withOpacity(0.8),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            children: [
              Icon(Icons.info, color: Colors.white, size: 24),
              SizedBox(width: 12),
              Text(
                'About',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          _buildSettingItem(
            icon: Icons.help,
            title: 'Help & Support',
            subtitle: 'Get help with your Sprouts',
            onTap: () {
              // TODO: Implement help screen
            },
          ),
          _buildSettingItem(
            icon: Icons.star_rate,
            title: 'Rate App',
            subtitle: 'Rate Sprouts on the App Store',
            onTap: () {
              // TODO: Implement app rating
            },
          ),
          _buildSettingItem(
            icon: Icons.description,
            title: 'Terms & Privacy',
            subtitle: 'Read our terms and privacy policy',
            onTap: () {
              // TODO: Implement terms screen
            },
          ),
          const SizedBox(height: 12),
          const Divider(color: Colors.white30),
          _buildSettingItem(
            icon: Icons.logout,
            title: 'Logout',
            subtitle: 'Sign out of your account',
            onTap: _logout,
          ),
          const SizedBox(height: 16),
          const Center(
            child: Text(
              'Sprouts v1.0.0\nDigital AR Pet Companions',
              textAlign: TextAlign.center,
              style: TextStyle(
                color: Colors.white60,
                fontSize: 12,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSettingItem({
    required IconData icon,
    required String title,
    required String subtitle,
    required VoidCallback? onTap,
  }) {
    return ListTile(
      leading: isTestingBackend && title == 'Test Backend Connection'
          ? const SizedBox(
              width: 24,
              height: 24,
              child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
            )
          : Icon(icon, color: AppTheme.vanimalPurple),
      title: Text(
        title,
        style: TextStyle(
          color: onTap == null ? Colors.white54 : Colors.white, 
          fontWeight: FontWeight.w500
        ),
      ),
      subtitle: Text(
        subtitle,
        style: TextStyle(
          color: backendTestResult != null && title == 'Test Backend Connection'
              ? (backendTestResult!.startsWith('✅') ? Colors.green : Colors.red)
              : Colors.white70,
          fontSize: 12,
        ),
      ),
      trailing: onTap != null 
          ? const Icon(Icons.chevron_right, color: Colors.white54)
          : null,
      onTap: onTap,
      contentPadding: EdgeInsets.zero,
    );
  }
}