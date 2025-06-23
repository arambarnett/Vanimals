import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../../data/repositories/user_repository.dart';
import '../../data/models/user_model.dart';

class BackendTestScreen extends StatefulWidget {
  const BackendTestScreen({super.key});

  @override
  State<BackendTestScreen> createState() => _BackendTestScreenState();
}

class _BackendTestScreenState extends State<BackendTestScreen> {
  bool isLoading = false;
  String statusMessage = 'Not tested yet';
  Color statusColor = Colors.grey;
  List<Animal> animals = [];
  User? testUser;

  @override
  void initState() {
    super.initState();
    _testBackendConnection();
  }

  Future<void> _testBackendConnection() async {
    setState(() {
      isLoading = true;
      statusMessage = 'Testing backend connection...';
      statusColor = Colors.orange;
    });

    try {
      // Test health check
      final isHealthy = await UserRepository.isBackendHealthy();
      
      if (isHealthy) {
        setState(() {
          statusMessage = '✅ Backend is healthy!';
          statusColor = Colors.green;
        });
        
        // Test getting animals
        await _testGetAnimals();
      } else {
        setState(() {
          statusMessage = '❌ Backend health check failed';
          statusColor = Colors.red;
        });
      }
    } catch (e) {
      setState(() {
        statusMessage = '❌ Connection failed: $e';
        statusColor = Colors.red;
      });
    } finally {
      setState(() {
        isLoading = false;
      });
    }
  }

  Future<void> _testGetAnimals() async {
    try {
      final animalList = await UserRepository.getAvailableAnimals();
      setState(() {
        animals = animalList;
      });
    } catch (e) {
      print('Failed to get animals: $e');
    }
  }

  Future<void> _testCreateUser() async {
    setState(() {
      isLoading = true;
    });

    try {
      // Create a test user (you'll need to implement these endpoints in backend)
      final user = await UserRepository.createUser(
        privyId: 'test_privy_${DateTime.now().millisecondsSinceEpoch}',
        name: 'Test User',
        email: 'test@example.com',
        animalId: animals.isNotEmpty ? animals.first.id : 'default',
      );
      
      setState(() {
        testUser = user;
        statusMessage = '✅ Test user created successfully!';
        statusColor = Colors.green;
      });
    } catch (e) {
      setState(() {
        statusMessage = '❌ Failed to create user: $e';
        statusColor = Colors.red;
      });
    } finally {
      setState(() {
        isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Backend Integration Test'),
        backgroundColor: AppTheme.vanimalPurple,
        foregroundColor: Colors.white,
      ),
      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: const BoxDecoration(
          image: DecorationImage(
            image: AssetImage('assets/images/backgrounds/space_bg.jpg'),
            fit: BoxFit.cover,
          ),
        ),
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Status Card
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: Colors.black.withOpacity(0.8),
                    borderRadius: BorderRadius.circular(15),
                    border: Border.all(color: statusColor, width: 2),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Icon(
                            isLoading ? Icons.sync : Icons.cloud,
                            color: statusColor,
                            size: 24,
                          ),
                          const SizedBox(width: 12),
                          Text(
                            'Backend Status',
                            style: AppTheme.headlineSmall.copyWith(
                              color: Colors.white,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      if (isLoading)
                        const LinearProgressIndicator(
                          color: AppTheme.vanimalPurple,
                        ),
                      const SizedBox(height: 12),
                      Text(
                        statusMessage,
                        style: AppTheme.bodyLarge.copyWith(
                          color: statusColor,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ),
                
                const SizedBox(height: 20),
                
                // Backend Info
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: Colors.black.withOpacity(0.8),
                    borderRadius: BorderRadius.circular(15),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Backend Configuration',
                        style: AppTheme.headlineSmall.copyWith(
                          color: Colors.white,
                        ),
                      ),
                      const SizedBox(height: 12),
                      _buildInfoRow('URL:', 'http://localhost:3000'),
                      _buildInfoRow('Database:', 'PostgreSQL + Prisma'),
                      _buildInfoRow('Features:', 'Users, Animals, Habits, Strava'),
                      _buildInfoRow('Animals Found:', '${animals.length}'),
                    ],
                  ),
                ),
                
                const SizedBox(height: 20),
                
                // Animals List
                if (animals.isNotEmpty) ...[
                  Text(
                    'Available Animals',
                    style: AppTheme.headlineSmall.copyWith(
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 12),
                  Expanded(
                    child: ListView.builder(
                      itemCount: animals.length,
                      itemBuilder: (context, index) {
                        final animal = animals[index];
                        return Container(
                          margin: const EdgeInsets.only(bottom: 8),
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: AppTheme.vanimalPurple.withOpacity(0.8),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: Row(
                            children: [
                              Icon(
                                Icons.pets,
                                color: Colors.white,
                                size: 24,
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Text(
                                  animal.name,
                                  style: AppTheme.labelLarge.copyWith(
                                    color: Colors.white,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        );
                      },
                    ),
                  ),
                ],
                
                // Test Actions
                const SizedBox(height: 20),
                Row(
                  children: [
                    Expanded(
                      child: ElevatedButton(
                        onPressed: isLoading ? null : _testBackendConnection,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppTheme.vanimalPurple,
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(vertical: 12),
                        ),
                        child: const Text('Retest Connection'),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: ElevatedButton(
                        onPressed: (isLoading || animals.isEmpty) ? null : _testCreateUser,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppTheme.vanimalPink,
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(vertical: 12),
                        ),
                        child: const Text('Test Create User'),
                      ),
                    ),
                  ],
                ),
                
                // Test User Info
                if (testUser != null) ...[
                  const SizedBox(height: 20),
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.green.withOpacity(0.8),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Test User Created',
                          style: AppTheme.labelLarge.copyWith(
                            color: Colors.white,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Name: ${testUser!.name}',
                          style: AppTheme.bodyMedium.copyWith(
                            color: Colors.white,
                          ),
                        ),
                        Text(
                          'Level: ${testUser!.level}',
                          style: AppTheme.bodyMedium.copyWith(
                            color: Colors.white,
                          ),
                        ),
                        Text(
                          'Experience: ${testUser!.experience}',
                          style: AppTheme.bodyMedium.copyWith(
                            color: Colors.white,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 100,
            child: Text(
              label,
              style: AppTheme.bodyMedium.copyWith(
                color: Colors.white70,
              ),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: AppTheme.bodyMedium.copyWith(
                color: Colors.white,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ],
      ),
    );
  }
}