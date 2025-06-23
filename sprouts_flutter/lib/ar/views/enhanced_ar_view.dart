import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:camera/camera.dart';
import 'package:model_viewer_plus/model_viewer_plus.dart';
import 'package:sensors_plus/sensors_plus.dart';
import '../../presentation/theme/app_theme.dart';
import 'dart:async';
import 'dart:math' as math;

class EnhancedARView extends StatefulWidget {
  final String vanimalType;
  final String vanimalName;
  final VoidCallback? onClose;

  const EnhancedARView({
    super.key,
    required this.vanimalType,
    required this.vanimalName,
    this.onClose,
  });

  @override
  State<EnhancedARView> createState() => _EnhancedARViewState();
}

class _EnhancedARViewState extends State<EnhancedARView> with TickerProviderStateMixin {
  CameraController? cameraController;
  List<CameraDescription>? cameras;
  bool isLoading = true;
  bool showInstructions = true;
  bool vanimalPlaced = false;
  bool showARModel = false;
  String statusText = "Initializing AR Camera...";

  // Motion tracking
  StreamSubscription<AccelerometerEvent>? accelerometerSubscription;
  double deviceTilt = 0.0;
  
  // Animation controllers
  late AnimationController scanningController;
  late AnimationController placementController;
  
  // AR model positioning
  double modelX = 0.5; // Center horizontally (0.0 to 1.0)
  double modelY = 0.7; // Bottom area (0.0 to 1.0)
  double modelScale = 1.0;

  @override
  void initState() {
    super.initState();
    _initializeAnimations();
    _initializeCamera();
    _startMotionTracking();
  }

  void _initializeAnimations() {
    scanningController = AnimationController(
      duration: const Duration(seconds: 3),
      vsync: this,
    );
    
    placementController = AnimationController(
      duration: const Duration(milliseconds: 800),
      vsync: this,
    );
  }

  void _startMotionTracking() {
    accelerometerSubscription = accelerometerEventStream().listen((AccelerometerEvent event) {
      setState(() {
        // Use device tilt to slightly adjust model position for realism
        deviceTilt = event.x * 0.01; // Subtle movement
      });
    });
  }

  Future<void> _initializeCamera() async {
    try {
      cameras = await availableCameras();
      if (cameras != null && cameras!.isNotEmpty) {
        cameraController = CameraController(
          cameras![0], // Use back camera
          ResolutionPreset.high,
          enableAudio: false,
        );
        
        await cameraController!.initialize();
        
        setState(() {
          statusText = "AR Camera Ready";
          isLoading = false;
        });
      }
    } catch (e) {
      setState(() {
        statusText = "Camera initialization failed";
        isLoading = false;
      });
      debugPrint("Camera error: $e");
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: Stack(
        children: [
          // Full-screen camera background
          if (!isLoading && cameraController != null && cameraController!.value.isInitialized)
            Positioned.fill(
              child: CameraPreview(cameraController!),
            ),

          // Surface scanning overlay
          if (!showInstructions && !vanimalPlaced && !isLoading)
            _buildScanningOverlay(),

          // AR Model (positioned with motion tracking)
          if (showARModel && vanimalPlaced)
            _buildARModel(),

          // Loading overlay
          if (isLoading)
            _buildLoadingOverlay(),

          // Instructions overlay
          if (showInstructions && !isLoading)
            _buildInstructionsOverlay(),

          // Top controls
          _buildTopControls(),

          // Bottom controls
          if (!isLoading && !showInstructions)
            _buildBottomControls(),

          // Placement UI
          if (!showInstructions && !vanimalPlaced && !isLoading)
            _buildPlacementUI(),

          // Success indicator
          if (vanimalPlaced && !showInstructions)
            _buildSuccessIndicator(),
        ],
      ),
    );
  }

  Widget _buildLoadingOverlay() {
    return Container(
      color: Colors.black,
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
    );
  }

  Widget _buildInstructionsOverlay() {
    return Container(
      color: Colors.black.withOpacity(0.8),
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
                size: 70,
                color: Colors.white,
              ),
              const SizedBox(height: 20),
              Text(
                'Enhanced AR Experience',
                style: AppTheme.headlineSmall.copyWith(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 12),
              Text(
                'Point your camera at a flat surface and watch for surface detection. '
                'Tap anywhere to place ${widget.vanimalName} with realistic anchoring and shadows.',
                style: AppTheme.bodyMedium.copyWith(color: Colors.white),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: () {
                  setState(() {
                    showInstructions = false;
                  });
                  _startScanning();
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

  Widget _buildScanningOverlay() {
    return AnimatedBuilder(
      animation: scanningController,
      builder: (context, child) {
        return CustomPaint(
          painter: SurfaceScanningPainter(
            scanningController.value,
            AppTheme.vanimalPurple,
          ),
          size: Size.infinite,
        );
      },
    );
  }

  Widget _buildARModel() {
    final screenWidth = MediaQuery.of(context).size.width;
    final screenHeight = MediaQuery.of(context).size.height;
    
    return AnimatedBuilder(
      animation: placementController,
      builder: (context, child) {
        final animationValue = placementController.value;
        final scale = 0.5 + (animationValue * 0.5); // Scale from 0.5 to 1.0
        
        return Positioned(
          left: (modelX * screenWidth) - 90 + (deviceTilt * 20), // Motion tracking
          top: (modelY * screenHeight) - 90,
          child: Transform.scale(
            scale: scale * modelScale,
            child: Container(
              width: 180,
              height: 180,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(15),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.4),
                    blurRadius: 20,
                    spreadRadius: 5,
                    offset: const Offset(0, 10),
                  ),
                ],
              ),
              child: Stack(
                children: [
                  // Ground shadow
                  Positioned(
                    bottom: -5,
                    left: 20,
                    right: 20,
                    child: Container(
                      height: 15,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(25),
                        color: Colors.black.withOpacity(0.3),
                        boxShadow: [
                          BoxShadow(
                            color: AppTheme.vanimalPurple.withOpacity(0.2),
                            blurRadius: 15,
                            spreadRadius: 8,
                          ),
                        ],
                      ),
                    ),
                  ),
                  
                  // 3D Model
                  ModelViewer(
                    backgroundColor: Colors.transparent,
                    src: _getModelPath(widget.vanimalType),
                    alt: widget.vanimalName,
                    ar: true,
                    arModes: const ['scene-viewer', 'webxr', 'quick-look'],
                    autoRotate: false,
                    cameraControls: true,
                    disableZoom: true,
                    loading: Loading.eager,
                    arPlacement: ArPlacement.floor,
                    autoPlay: true,
                    shadowIntensity: 1.0,
                    shadowSoftness: 0.5,
                    environmentImage: 'neutral',
                  ),
                ],
              ),
            ),
          ),
        );
      },
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
          Container(
            decoration: const BoxDecoration(
              color: Colors.black54,
              shape: BoxShape.circle,
            ),
            child: IconButton(
              icon: const Icon(Icons.close, color: Colors.white),
              onPressed: widget.onClose ?? () => Navigator.of(context).pop(),
            ),
          ),
          
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
              onPressed: _takePhoto,
            ),
            _buildControlButton(
              icon: showARModel ? Icons.visibility_off : Icons.visibility,
              label: showARModel ? 'Hide' : 'Show',
              onPressed: _toggleModel,
              isEnabled: vanimalPlaced,
            ),
            _buildControlButton(
              icon: Icons.zoom_in,
              label: 'Scale+',
              onPressed: _scaleUp,
              isEnabled: vanimalPlaced,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPlacementUI() {
    return Positioned.fill(
      child: GestureDetector(
        onTapDown: (details) {
          _placeSurface(details.localPosition);
        },
        child: Container(
          color: Colors.transparent,
          child: Stack(
            children: [
              // Crosshair
              Center(
                child: Container(
                  width: 50,
                  height: 50,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    border: Border.all(
                      color: AppTheme.vanimalPurple,
                      width: 3,
                    ),
                  ),
                  child: const Icon(
                    Icons.add,
                    color: AppTheme.vanimalPurple,
                    size: 24,
                  ),
                ),
              ),
              
              // Status message
              Positioned(
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
                    '🎯 Surface detected! Tap anywhere to place ${widget.vanimalName}',
                    style: AppTheme.bodyMedium.copyWith(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                    ),
                    textAlign: TextAlign.center,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSuccessIndicator() {
    return Positioned(
      top: MediaQuery.of(context).padding.top + 80,
      left: 20,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
        decoration: BoxDecoration(
          color: AppTheme.vanimalPurple.withOpacity(0.95),
          borderRadius: BorderRadius.circular(20),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(
              Icons.check_circle,
              color: Colors.white,
              size: 22,
            ),
            const SizedBox(width: 10),
            Text(
              '${widget.vanimalName} anchored!',
              style: AppTheme.bodySmall.copyWith(
                color: Colors.white,
                fontWeight: FontWeight.bold,
              ),
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

  void _startScanning() {
    scanningController.repeat();
    
    // Simulate surface detection after 2 seconds
    Timer(const Duration(seconds: 2), () {
      if (mounted && !vanimalPlaced) {
        scanningController.stop();
        HapticFeedback.lightImpact();
      }
    });
  }

  void _placeSurface(Offset position) {
    final screenSize = MediaQuery.of(context).size;
    
    setState(() {
      vanimalPlaced = true;
      showARModel = true;
      modelX = position.dx / screenSize.width;
      modelY = position.dy / screenSize.height;
    });
    
    // Haptic feedback
    HapticFeedback.mediumImpact();
    
    // Start placement animation
    placementController.forward();
    
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('🎉 ${widget.vanimalName} anchored to surface!'),
        backgroundColor: AppTheme.vanimalPurple,
        duration: const Duration(seconds: 2),
      ),
    );
  }

  void _resetAR() {
    setState(() {
      vanimalPlaced = false;
      showARModel = false;
      modelScale = 1.0;
    });
    
    placementController.reset();
    _startScanning();
    
    HapticFeedback.lightImpact();
    
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('🔄 AR scene reset'),
        backgroundColor: AppTheme.vanimalPurple,
        duration: Duration(seconds: 1),
      ),
    );
  }

  void _takePhoto() async {
    if (cameraController != null && cameraController!.value.isInitialized) {
      try {
        await cameraController!.takePicture();
        HapticFeedback.lightImpact();
        
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('📸 AR photo captured!'),
            backgroundColor: AppTheme.vanimalPurple,
            duration: Duration(seconds: 1),
          ),
        );
      } catch (e) {
        debugPrint('Error taking photo: $e');
      }
    }
  }

  void _toggleModel() {
    setState(() {
      showARModel = !showARModel;
    });
    
    HapticFeedback.lightImpact();
    
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(showARModel ? '👁️ ${widget.vanimalName} visible' : '🙈 ${widget.vanimalName} hidden'),
        backgroundColor: AppTheme.vanimalPurple,
        duration: const Duration(seconds: 1),
      ),
    );
  }

  void _scaleUp() {
    setState(() {
      modelScale = math.min(modelScale + 0.2, 2.0);
    });
    
    HapticFeedback.lightImpact();
  }

  String _getModelPath(String vanimalType) {
    switch (vanimalType.toLowerCase()) {
      case 'pigeon':
      case 'pidgeon':
        return "assets/models/pigeon.glb";
      case 'elephant':
        return "assets/models/elephant.glb";
      case 'tiger':
        return "assets/models/tiger.glb";
      case 'penguin':
        return "assets/models/penguin.glb";
      case 'axolotl':
        return "assets/models/axolotl.glb";
      case 'chimpanzee':
      case 'chimp':
        return "assets/models/chimpanzee.glb";
      default:
        return "assets/models/pigeon.glb";
    }
  }

  @override
  void dispose() {
    scanningController.dispose();
    placementController.dispose();
    accelerometerSubscription?.cancel();
    cameraController?.dispose();
    super.dispose();
  }
}

// Custom painter for surface scanning effect
class SurfaceScanningPainter extends CustomPainter {
  final double animationValue;
  final Color color;
  
  SurfaceScanningPainter(this.animationValue, this.color);
  
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color.withOpacity(0.6)
      ..strokeWidth = 2
      ..style = PaintingStyle.stroke;
    
    // Scanning line
    final y = size.height * animationValue;
    canvas.drawLine(
      Offset(0, y),
      Offset(size.width, y),
      paint,
    );
    
    // Grid overlay
    final gridPaint = Paint()
      ..color = color.withOpacity(0.3)
      ..strokeWidth = 1;
    
    const gridSize = 60.0;
    for (double i = 0; i < size.width; i += gridSize) {
      canvas.drawLine(Offset(i, 0), Offset(i, size.height), gridPaint);
    }
    for (double i = 0; i < size.height; i += gridSize) {
      canvas.drawLine(Offset(0, i), Offset(size.width, i), gridPaint);
    }
    
    // Surface detection rectangles
    final rectPaint = Paint()
      ..color = color.withOpacity(0.4)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2;
    
    // Draw detection rectangles at bottom (simulating floor detection)
    final rect1 = Rect.fromLTWH(
      size.width * 0.1,
      size.height * 0.7,
      size.width * 0.8,
      size.height * 0.2,
    );
    canvas.drawRect(rect1, rectPaint);
    
    // Center detection rectangle
    final rect2 = Rect.fromLTWH(
      size.width * 0.3,
      size.height * 0.4,
      size.width * 0.4,
      size.height * 0.2,
    );
    canvas.drawRect(rect2, rectPaint);
  }
  
  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => true;
}