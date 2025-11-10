import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../../data/services/api_service.dart';
import '../../data/services/web3auth_service.dart';
import 'collection_screen.dart';
import 'connect_strava_screen.dart';

class GoalCreateScreen extends StatefulWidget {
  final String category;
  final Color categoryColor;

  const GoalCreateScreen({
    super.key,
    required this.category,
    required this.categoryColor,
  });

  @override
  State<GoalCreateScreen> createState() => _GoalCreateScreenState();
}

class _GoalCreateScreenState extends State<GoalCreateScreen> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _targetValueController = TextEditingController();

  String _selectedUnit = 'miles';
  String _selectedFrequency = 'weekly';
  bool _isCreating = false;
  bool _isStravaConnected = false;
  bool _isCheckingStrava = true;

  // Category-specific templates
  Map<String, Map<String, dynamic>> get _categoryTemplates => {
        'fitness': {
          'units': ['miles', 'km', 'steps', 'minutes', 'workouts'],
          'placeholder': 'Run 10 miles',
          'example': 'Complete 3 workouts this week',
        },
        'finance': {
          'units': ['USD', 'EUR', 'percent'],
          'placeholder': 'Save \$500',
          'example': 'Save \$500 this month',
        },
        'education': {
          'units': ['hours', 'pages', 'courses', 'books'],
          'placeholder': 'Read 2 books',
          'example': 'Read 2 books this month',
        },
        'faith': {
          'units': ['minutes', 'sessions', 'hours', 'days'],
          'placeholder': 'Meditate daily',
          'example': 'Meditate for 10 minutes daily',
        },
        'screentime': {
          'units': ['hours', 'minutes', 'percent'],
          'placeholder': 'Reduce to 2 hours',
          'example': 'Limit screen time to 2 hours per day',
        },
        'work': {
          'units': ['hours', 'tasks', 'projects', 'meetings'],
          'placeholder': 'Complete 10 tasks',
          'example': 'Complete 10 high-priority tasks this week',
        },
      };

  @override
  void initState() {
    super.initState();
    // Set default unit based on category
    final template = _categoryTemplates[widget.category];
    if (template != null) {
      _selectedUnit = (template['units'] as List<String>).first;
    }

    // Check Strava connection for fitness goals
    if (widget.category == 'fitness') {
      _checkStravaConnection();
    } else {
      setState(() {
        _isCheckingStrava = false;
      });
    }
  }

  Future<void> _checkStravaConnection() async {
    try {
      final userId = await Web3AuthService.getUserId();
      if (userId != null) {
        // Check if user has Strava integration
        final integration = await ApiService.getStravaIntegration(userId);
        setState(() {
          _isStravaConnected = integration.isActive;
          _isCheckingStrava = false;
        });
      }
    } catch (e) {
      // No Strava connection found
      setState(() {
        _isStravaConnected = false;
        _isCheckingStrava = false;
      });
    }
  }

  @override
  void dispose() {
    _titleController.dispose();
    _descriptionController.dispose();
    _targetValueController.dispose();
    super.dispose();
  }

  Future<void> _createGoal() async {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    // For fitness goals, require Strava connection
    if (widget.category == 'fitness' && !_isStravaConnected) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please connect Strava first to auto-track your workouts'),
          backgroundColor: Color(0xFFFC4C02),
          duration: Duration(seconds: 3),
        ),
      );
      return;
    }

    setState(() {
      _isCreating = true;
    });

    try {
      // Get authenticated user ID
      final userId = await Web3AuthService.getUserId();

      if (userId == null) {
        throw Exception('No authenticated user found');
      }

      // Create goal via API
      await ApiService.createGoal(
        userId: userId,
        title: _titleController.text.trim(),
        description: _descriptionController.text.trim(),
        type: widget.category,
        category: widget.category,
        targetValue: double.parse(_targetValueController.text),
        unit: _selectedUnit,
        frequency: _selectedFrequency,
      );

      if (mounted) {
        // Show success message
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: const Text('Goal created! Your Sprout is being minted...'),
            backgroundColor: Colors.green,
            duration: const Duration(seconds: 3),
          ),
        );

        // Navigate back to collection screen
        Navigator.of(context).pushAndRemoveUntil(
          MaterialPageRoute(builder: (context) => const CollectionScreen()),
          (route) => false,
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to create goal: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          _isCreating = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final template = _categoryTemplates[widget.category];

    return Scaffold(
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
          child: Column(
            children: [
              // Header
              Padding(
                padding: const EdgeInsets.all(20),
                child: Row(
                  children: [
                    IconButton(
                      icon: const Icon(Icons.arrow_back, color: Colors.white),
                      onPressed: () => Navigator.of(context).pop(),
                    ),
                    Expanded(
                      child: Text(
                        'Create ${widget.category.toUpperCase()} Goal',
                        style: AppTheme.headlineMedium,
                        textAlign: TextAlign.center,
                      ),
                    ),
                    const SizedBox(width: 48),
                  ],
                ),
              ),

              // Form
              Expanded(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.all(20),
                  child: Form(
                    key: _formKey,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Example card
                        Container(
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: widget.categoryColor.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(
                              color: widget.categoryColor.withOpacity(0.3),
                            ),
                          ),
                          child: Row(
                            children: [
                              Icon(
                                Icons.lightbulb_outline,
                                color: widget.categoryColor,
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Text(
                                  'Example: ${template?['example'] ?? 'Set your goal'}',
                                  style: AppTheme.bodyMedium.copyWith(
                                    color: widget.categoryColor,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 24),

                        // Goal Title
                        Text(
                          'Goal Title',
                          style: AppTheme.labelLarge,
                        ),
                        const SizedBox(height: 8),
                        TextFormField(
                          controller: _titleController,
                          style: const TextStyle(color: Colors.white),
                          decoration: InputDecoration(
                            hintText: template?['placeholder'] ?? 'Enter goal title',
                            hintStyle: TextStyle(color: Colors.white.withOpacity(0.5)),
                            filled: true,
                            fillColor: Colors.white.withOpacity(0.1),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: BorderSide.none,
                            ),
                          ),
                          validator: (value) {
                            if (value == null || value.trim().isEmpty) {
                              return 'Please enter a goal title';
                            }
                            return null;
                          },
                        ),
                        const SizedBox(height: 20),

                        // Description
                        Text(
                          'Description (optional)',
                          style: AppTheme.labelLarge,
                        ),
                        const SizedBox(height: 8),
                        TextFormField(
                          controller: _descriptionController,
                          style: const TextStyle(color: Colors.white),
                          maxLines: 3,
                          decoration: InputDecoration(
                            hintText: 'Why is this goal important to you?',
                            hintStyle: TextStyle(color: Colors.white.withOpacity(0.5)),
                            filled: true,
                            fillColor: Colors.white.withOpacity(0.1),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: BorderSide.none,
                            ),
                          ),
                        ),
                        const SizedBox(height: 20),

                        // Target Value
                        Text(
                          'Target Value',
                          style: AppTheme.labelLarge,
                        ),
                        const SizedBox(height: 8),
                        TextFormField(
                          controller: _targetValueController,
                          style: const TextStyle(color: Colors.white),
                          keyboardType: TextInputType.number,
                          decoration: InputDecoration(
                            hintText: 'e.g., 10',
                            hintStyle: TextStyle(color: Colors.white.withOpacity(0.5)),
                            filled: true,
                            fillColor: Colors.white.withOpacity(0.1),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: BorderSide.none,
                            ),
                          ),
                          validator: (value) {
                            if (value == null || value.trim().isEmpty) {
                              return 'Please enter a target value';
                            }
                            if (double.tryParse(value) == null) {
                              return 'Please enter a valid number';
                            }
                            return null;
                          },
                        ),
                        const SizedBox(height: 20),

                        // Unit Selector
                        Text(
                          'Unit',
                          style: AppTheme.labelLarge,
                        ),
                        const SizedBox(height: 8),
                        Container(
                          decoration: BoxDecoration(
                            color: Colors.white.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: DropdownButtonFormField<String>(
                            value: _selectedUnit,
                            dropdownColor: const Color(0xFF1a1a2e),
                            style: const TextStyle(color: Colors.white),
                            decoration: InputDecoration(
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(12),
                                borderSide: BorderSide.none,
                              ),
                              contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                            ),
                            items: (template?['units'] as List<String>)
                                .map((unit) => DropdownMenuItem(
                                      value: unit,
                                      child: Text(unit),
                                    ))
                                .toList(),
                            onChanged: (value) {
                              setState(() {
                                _selectedUnit = value!;
                              });
                            },
                          ),
                        ),
                        const SizedBox(height: 20),

                        // Frequency Selector
                        Text(
                          'Frequency',
                          style: AppTheme.labelLarge,
                        ),
                        const SizedBox(height: 8),
                        Container(
                          decoration: BoxDecoration(
                            color: Colors.white.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: DropdownButtonFormField<String>(
                            value: _selectedFrequency,
                            dropdownColor: const Color(0xFF1a1a2e),
                            style: const TextStyle(color: Colors.white),
                            decoration: InputDecoration(
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(12),
                                borderSide: BorderSide.none,
                              ),
                              contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                            ),
                            items: const [
                              DropdownMenuItem(value: 'daily', child: Text('Daily')),
                              DropdownMenuItem(value: 'weekly', child: Text('Weekly')),
                              DropdownMenuItem(value: 'monthly', child: Text('Monthly')),
                            ],
                            onChanged: (value) {
                              setState(() {
                                _selectedFrequency = value!;
                              });
                            },
                          ),
                        ),
                        const SizedBox(height: 30),

                        // Auto-tracking requirement for fitness
                        if (widget.category == 'fitness')
                          Container(
                            padding: const EdgeInsets.all(16),
                            decoration: BoxDecoration(
                              color: const Color(0xFFFC4C02).withOpacity(0.1),
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(
                                color: const Color(0xFFFC4C02).withOpacity(0.3),
                              ),
                            ),
                            child: _isCheckingStrava
                                ? const Center(
                                    child: Padding(
                                      padding: EdgeInsets.all(16.0),
                                      child: CircularProgressIndicator(
                                        strokeWidth: 2,
                                        color: Color(0xFFFC4C02),
                                      ),
                                    ),
                                  )
                                : Column(
                                    children: [
                                      Row(
                                        children: [
                                          Icon(
                                            _isStravaConnected ? Icons.check_circle : Icons.directions_run,
                                            color: _isStravaConnected ? Colors.green : const Color(0xFFFC4C02),
                                            size: 32,
                                          ),
                                          const SizedBox(width: 12),
                                          Expanded(
                                            child: Column(
                                              crossAxisAlignment: CrossAxisAlignment.start,
                                              children: [
                                                Text(
                                                  _isStravaConnected
                                                      ? 'Strava Connected ✓'
                                                      : 'Connect Strava Required',
                                                  style: TextStyle(
                                                    color: _isStravaConnected ? Colors.green : const Color(0xFFFC4C02),
                                                    fontWeight: FontWeight.bold,
                                                    fontSize: 16,
                                                  ),
                                                ),
                                                Text(
                                                  _isStravaConnected
                                                      ? 'Your workouts will be tracked automatically'
                                                      : 'Connect Strava to auto-track your workouts',
                                                  style: TextStyle(
                                                    color: Colors.white.withOpacity(0.7),
                                                    fontSize: 12,
                                                  ),
                                                ),
                                              ],
                                            ),
                                          ),
                                        ],
                                      ),
                                      if (!_isStravaConnected) ...[
                                        const SizedBox(height: 12),
                                        SizedBox(
                                          width: double.infinity,
                                          child: ElevatedButton.icon(
                                            onPressed: () async {
                                              await Navigator.of(context).push(
                                                MaterialPageRoute(
                                                  builder: (context) => const ConnectStravaScreen(),
                                                ),
                                              );
                                              // Recheck connection after returning
                                              _checkStravaConnection();
                                            },
                                            icon: const Icon(Icons.link, size: 16),
                                            label: const Text('Connect Strava Now'),
                                            style: ElevatedButton.styleFrom(
                                              backgroundColor: const Color(0xFFFC4C02),
                                              foregroundColor: Colors.white,
                                              shape: RoundedRectangleBorder(
                                                borderRadius: BorderRadius.circular(8),
                                              ),
                                            ),
                                          ),
                                        ),
                                      ],
                                    ],
                                  ),
                          ),
                        if (widget.category == 'fitness') const SizedBox(height: 20),

                        // Create Button
                        SizedBox(
                          width: double.infinity,
                          child: ElevatedButton(
                            onPressed: _isCreating ? null : _createGoal,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: widget.categoryColor,
                              foregroundColor: Colors.white,
                              padding: const EdgeInsets.symmetric(vertical: 16),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12),
                              ),
                              elevation: 8,
                            ),
                            child: _isCreating
                                ? const SizedBox(
                                    height: 20,
                                    width: 20,
                                    child: CircularProgressIndicator(
                                      strokeWidth: 2,
                                      color: Colors.white,
                                    ),
                                  )
                                : const Text(
                                    'Create Goal & Mint Sprout',
                                    style: TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                          ),
                        ),
                        const SizedBox(height: 16),

                        // Info text
                        Center(
                          child: Text(
                            'Your Sprout NFT will be minted automatically',
                            style: AppTheme.bodySmall.copyWith(
                              color: Colors.white.withOpacity(0.6),
                            ),
                            textAlign: TextAlign.center,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
