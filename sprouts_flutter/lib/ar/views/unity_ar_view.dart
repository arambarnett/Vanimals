import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_unity_widget/flutter_unity_widget.dart';
import '../../presentation/theme/app_theme.dart';

class UnityARView extends StatefulWidget {
  final String vanimalType;
  final String vanimalName;
  final VoidCallback? onClose;

  const UnityARView({
    super.key,
    required this.vanimalType,
    required this.vanimalName,
    this.onClose,
  });

  @override
  State<UnityARView> createState() => _UnityARViewState();
}

class _UnityARViewState extends State<UnityARView> {
  UnityWidgetController? unityWidgetController;
  bool isLoading = true;
  bool showInstructions = true;
  bool arSessionActive = false;
  String statusText = "Initializing Unity AR...";

  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: Stack(
        children: [
          // Unity AR Widget (Pokemon GO style - models in live camera)
          if (!showInstructions)
            UnityWidget(
              onUnityCreated: _onUnityCreated,
              onUnityMessage: _onUnityMessage,
              fullscreen: true,
              enablePlaceholder: false,
            ),

          // Loading overlay
          if (isLoading && !showInstructions)
            Container(
              color: Colors.black.withOpacity(0.8),
              child: Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const CircularProgressIndicator(
                      color: AppTheme.vanimalPurple,
                    ),
                    const SizedBox(height: 20),
                    Text(
                      statusText,
                      style: AppTheme.bodyLarge.copyWith(color: Colors.white),
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
              ),
            ),

          // Instructions overlay
          if (showInstructions)
            _buildInstructionsOverlay(),

          // Top controls (only show when AR is active)
          if (!showInstructions && !isLoading)
            _buildTopControls(),

          // AR status indicator
          if (arSessionActive && !showInstructions)
            _buildARStatusIndicator(),

          // Bottom controls for AR interaction
          if (!showInstructions && !isLoading)
            _buildBottomControls(),
        ],
      ),
    );
  }

  Widget _buildInstructionsOverlay() {
    return Container(
      color: Colors.black,
      child: Center(
        child: Container(
          margin: const EdgeInsets.all(20),
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            color: AppTheme.vanimalPurple.withOpacity(0.95),
            borderRadius: BorderRadius.circular(20),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(
                Icons.view_in_ar,
                size: 80,
                color: Colors.white,
              ),
              const SizedBox(height: 20),
              Text(
                'Pokemon GO Style AR',
                style: AppTheme.headlineSmall.copyWith(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 12),
              Text(
                'Experience ${widget.vanimalName} in true AR!\n\n'
                '• Real surface detection using ARKit/ARCore\n'
                '• 3D models appear directly in camera feed\n'
                '• Move around to see from all angles\n'
                '• Tap on detected surfaces to place',
                style: AppTheme.bodyMedium.copyWith(color: Colors.white),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: () {
                  setState(() {
                    showInstructions = false;
                  });
                  _startUnityAR();
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.white,
                  foregroundColor: AppTheme.vanimalPurple,
                  padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 14),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(25),
                  ),
                ),
                child: const Text(
                  'Start AR Experience',
                  style: TextStyle(fontWeight: FontWeight.bold),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTopControls() {
    return Positioned(
      top: MediaQuery.of(context).padding.top + 10,
      left: 20,
      right: 20,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          // Close button
          Container(
            decoration: const BoxDecoration(
              color: Colors.black54,
              shape: BoxShape.circle,
            ),
            child: IconButton(
              icon: const Icon(Icons.close, color: Colors.white),
              onPressed: () {
                _stopAR();
                widget.onClose?.call() ?? Navigator.of(context).pop();
              },
            ),
          ),
          
          // AR session indicator
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            decoration: BoxDecoration(
              color: arSessionActive 
                ? Colors.green.withOpacity(0.9)
                : Colors.orange.withOpacity(0.9),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(
                  arSessionActive ? Icons.camera_alt : Icons.search,
                  color: Colors.white,
                  size: 16,
                ),
                const SizedBox(width: 8),
                Text(
                  arSessionActive ? 'AR Active' : 'Scanning...',
                  style: AppTheme.bodySmall.copyWith(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          ),
          
          // Help button
          Container(
            decoration: const BoxDecoration(
              color: Colors.black54,
              shape: BoxShape.circle,
            ),
            child: IconButton(
              icon: const Icon(Icons.help_outline, color: Colors.white),
              onPressed: () {
                setState(() {
                  showInstructions = true;
                });
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildARStatusIndicator() {
    return Positioned(
      top: MediaQuery.of(context).padding.top + 80,
      left: 20,
      right: 20,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.green.withOpacity(0.9),
          borderRadius: BorderRadius.circular(15),
        ),
        child: Text(
          '🎯 Surface detection active! Move device slowly over flat surfaces, then tap to place ${widget.vanimalName}',
          style: AppTheme.bodyMedium.copyWith(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
          textAlign: TextAlign.center,
        ),
      ),
    );
  }

  Widget _buildBottomControls() {
    return Positioned(
      bottom: 40,
      left: 20,
      right: 20,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.black.withOpacity(0.85),
          borderRadius: BorderRadius.circular(25),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            _buildControlButton(
              icon: Icons.refresh,
              label: 'Reset',
              onPressed: _resetAR,
            ),
            _buildControlButton(
              icon: Icons.camera_alt,
              label: 'Photo',
              onPressed: _takeScreenshot,
            ),
            _buildControlButton(
              icon: Icons.rotate_right,
              label: 'Rotate',
              onPressed: _rotateVanimal,
            ),
            _buildControlButton(
              icon: Icons.zoom_in,
              label: 'Scale',
              onPressed: _scaleVanimal,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildControlButton({
    required IconData icon,
    required String label,
    required VoidCallback onPressed,
    bool isEnabled = true,
  }) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          decoration: BoxDecoration(
            color: isEnabled ? AppTheme.vanimalPurple : Colors.grey.withOpacity(0.5),
            shape: BoxShape.circle,
          ),
          child: IconButton(
            icon: Icon(icon, color: Colors.white, size: 22),
            onPressed: isEnabled ? onPressed : null,
          ),
        ),
        const SizedBox(height: 6),
        Text(
          label,
          style: AppTheme.bodySmall.copyWith(
            fontSize: 11,
            color: isEnabled ? Colors.white : Colors.grey,
            fontWeight: FontWeight.w500,
          ),
        ),
      ],
    );
  }

  // Unity Integration Methods
  void _onUnityCreated(UnityWidgetController controller) {
    unityWidgetController = controller;
    
    setState(() {
      isLoading = false;
      statusText = "Unity AR Ready";
    });

    // Send vanimal data to Unity
    _sendVanimalDataToUnity();
  }

  void _onUnityMessage(message) {
    debugPrint('Unity Message: $message');
    
    // Handle messages from Unity AR scene
    if (message.toString().contains('ARSessionStarted')) {
      setState(() {
        arSessionActive = true;
      });
      
      HapticFeedback.lightImpact();
      
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('🎯 AR session started - look for surfaces!'),
          backgroundColor: Colors.green,
          duration: Duration(seconds: 2),
        ),
      );
    } else if (message.toString().contains('VanimalPlaced')) {
      HapticFeedback.mediumImpact();
      
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('🎉 ${widget.vanimalName} placed in AR!'),
          backgroundColor: AppTheme.vanimalPurple,
          duration: const Duration(seconds: 2),
        ),
      );
    } else if (message.toString().contains('PlaneDetected')) {
      HapticFeedback.lightImpact();
    }
  }

  void _startUnityAR() {
    // Send message to Unity to start AR session
    unityWidgetController?.postMessage(
      'ARManager',
      'StartARSession',
      '{"vanimalType": "${widget.vanimalType}", "vanimalName": "${widget.vanimalName}"}',
    );
  }

  void _sendVanimalDataToUnity() {
    // Send vanimal model path and data to Unity
    final vanimalData = {
      'type': widget.vanimalType,
      'name': widget.vanimalName,
      'modelPath': _getUnityModelPath(widget.vanimalType),
    };
    
    unityWidgetController?.postMessage(
      'VanimalManager',
      'SetVanimalData',
      vanimalData.toString(),
    );
  }

  void _resetAR() {
    unityWidgetController?.postMessage('ARManager', 'ResetAR', '');
    
    HapticFeedback.lightImpact();
    
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('🔄 AR scene reset'),
        backgroundColor: AppTheme.vanimalPurple,
        duration: Duration(seconds: 1),
      ),
    );
  }

  void _takeScreenshot() {
    unityWidgetController?.postMessage('ARManager', 'TakeScreenshot', '');
    
    HapticFeedback.lightImpact();
    
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('📸 AR screenshot captured!'),
        backgroundColor: AppTheme.vanimalPurple,
        duration: Duration(seconds: 1),
      ),
    );
  }

  void _rotateVanimal() {
    unityWidgetController?.postMessage('VanimalManager', 'RotateVanimal', '45');
    
    HapticFeedback.lightImpact();
  }

  void _scaleVanimal() {
    unityWidgetController?.postMessage('VanimalManager', 'ScaleVanimal', '1.2');
    
    HapticFeedback.lightImpact();
  }

  void _stopAR() {
    unityWidgetController?.postMessage('ARManager', 'StopAR', '');
  }

  String _getUnityModelPath(String vanimalType) {
    // Unity will look for these models in Resources folder
    switch (vanimalType.toLowerCase()) {
      case 'pigeon':
      case 'pidgeon':
        return "Models/Pigeon";
      case 'elephant':
        return "Models/Elephant";
      case 'tiger':
        return "Models/Tiger";
      case 'penguin':
        return "Models/Penguin";
      case 'axolotl':
        return "Models/Axolotl";
      case 'chimpanzee':
      case 'chimp':
        return "Models/Chimpanzee";
      default:
        return "Models/Pigeon";
    }
  }

  @override
  void dispose() {
    unityWidgetController?.dispose();
    super.dispose();
  }
}