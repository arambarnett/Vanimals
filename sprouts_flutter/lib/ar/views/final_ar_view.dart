import 'package:flutter/material.dart';
import 'package:camera/camera.dart';
import 'package:model_viewer_plus/model_viewer_plus.dart';
import '../../presentation/theme/app_theme.dart';

class FinalARView extends StatefulWidget {
  final String vanimalType;
  final String vanimalName;
  final VoidCallback? onClose;

  const FinalARView({
    super.key,
    required this.vanimalType,
    required this.vanimalName,
    this.onClose,
  });

  @override
  State<FinalARView> createState() => _FinalARViewState();
}

class _FinalARViewState extends State<FinalARView> with SingleTickerProviderStateMixin {
  CameraController? cameraController;
  List<CameraDescription>? cameras;
  bool isLoading = true;
  bool showInstructions = true;
  bool vanimalPlaced = false;
  bool showARModel = false;
  String statusText = "Initializing AR Camera...";

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: const Duration(seconds: 2),
      vsync: this,
    );
    _initializeCamera();
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
        statusText = "Camera initialization failed: $e";
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
          // Camera background - FULL SCREEN
          if (!isLoading && cameraController != null && cameraController!.value.isInitialized)
            Positioned.fill(
              child: CameraPreview(cameraController!),
            ),

          // Surface detection animation overlay
          if (!showInstructions && !vanimalPlaced && !isLoading)
            _buildSurfaceDetectionOverlay(),

          // AR Model anchored to detected surface
          if (showARModel && vanimalPlaced)
            _buildAnchoredARModel(),

          // Loading overlay
          if (isLoading)
            Container(
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
            ),

          // Instructions overlay
          if (showInstructions && !isLoading)
            _buildInstructionsOverlay(),

          // Top control bar
          if (!isLoading)
            _buildTopControlBar(),

          // Bottom control panel
          if (!isLoading && !showInstructions)
            _buildBottomControlPanel(),

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

  Widget _buildSurfaceDetectionOverlay() {
    return Positioned.fill(
      child: Container(
        decoration: BoxDecoration(
          border: Border.all(
            color: AppTheme.vanimalPurple.withOpacity(0.5),
            width: 2,
          ),
        ),
        child: Stack(
          children: [
            // Animated scanning lines
            _buildScanningAnimation(),
            
            // Surface indicators
            _buildSurfaceIndicators(),
          ],
        ),
      ),
    );
  }

  Widget _buildScanningAnimation() {
    return Positioned.fill(
      child: AnimatedBuilder(
        animation: _animationController,
        builder: (context, child) {
          return CustomPaint(
            painter: ScanningPainter(_animationController.value),
            size: Size.infinite,
          );
        },
      ),
    );
  }

  Widget _buildSurfaceIndicators() {
    return Stack(
      children: [
        // Bottom surface indicator (floor/table)
        Positioned(
          bottom: 80,
          left: 40,
          right: 40,
          child: GestureDetector(
            onTap: () => _placeSurface('bottom'),
            child: Container(
              height: 60,
              decoration: BoxDecoration(
                color: Colors.transparent,
                border: Border.all(
                  color: AppTheme.vanimalPurple,
                  width: 2,
                ),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Center(
                child: Text(
                  'Tap to place on surface',
                  style: AppTheme.bodyMedium.copyWith(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
          ),
        ),
        
        // Center surface indicator
        Positioned(
          top: MediaQuery.of(context).size.height * 0.4,
          left: MediaQuery.of(context).size.width * 0.3,
          right: MediaQuery.of(context).size.width * 0.3,
          child: GestureDetector(
            onTap: () => _placeSurface('center'),
            child: Container(
              height: 40,
              decoration: BoxDecoration(
                color: Colors.transparent,
                border: Border.all(
                  color: AppTheme.vanimalPurple,
                  width: 2,
                ),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Center(
                child: Text(
                  'Surface detected',
                  style: AppTheme.bodySmall.copyWith(
                    color: Colors.white,
                    fontSize: 12,
                  ),
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildAnchoredARModel() {
    return Positioned(
      bottom: _modelBottom,
      left: _modelLeft,
      right: _modelRight,
      child: Container(
        height: 180,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(10),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.6),
              blurRadius: 25,
              spreadRadius: 8,
              offset: const Offset(0, 15),
            ),
          ],
        ),
        child: Stack(
          children: [
            // Ground shadow circle
            Positioned(
              bottom: -10,
              left: 20,
              right: 20,
              child: Container(
                height: 20,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.elliptical(40, 10),
                  color: Colors.black.withOpacity(0.4),
                  boxShadow: [
                    BoxShadow(
                      color: AppTheme.vanimalPurple.withOpacity(0.3),
                      blurRadius: 20,
                      spreadRadius: 10,
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
              shadowSoftness: 0.8,
              environmentImage: 'neutral',
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInstructionsOverlay() {
    return Container(
      color: Colors.black.withOpacity(0.85),
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
                'AR Surface Detection',
                style: AppTheme.headlineSmall.copyWith(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 12),
              Text(
                'Point your camera at a flat surface and watch for surface detection indicators. Tap where you see the highlighted areas to place ${widget.vanimalName} anchored to that spot.',
                style: AppTheme.bodyMedium.copyWith(color: Colors.white),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: () {
                  setState(() {
                    showInstructions = false;
                  });
                  _startSurfaceDetection();
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.white,
                  foregroundColor: AppTheme.vanimalPurple,
                  padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 14),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(25),
                  ),
                ),
                child: Text(
                  'Start Surface Detection',
                  style: TextStyle(fontWeight: FontWeight.bold),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTopControlBar() {
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

  Widget _buildBottomControlPanel() {
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
              icon: Icons.open_in_new,
              label: 'Native AR',
              onPressed: _openNativeAR,
              isEnabled: vanimalPlaced,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPlacementUI() {
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
        child: Row(
          children: [
            const Icon(
              Icons.search,
              color: Colors.white,
              size: 24,
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                'Scanning surfaces... Tap highlighted areas to place ${widget.vanimalName}',
                style: AppTheme.bodySmall.copyWith(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ],
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

  // Animation controller for surface scanning
  late AnimationController _animationController;

  // Model position variables
  double _modelBottom = 120;
  double _modelLeft = 60;
  double _modelRight = 60;

  void _startSurfaceDetection() {
    _animationController.repeat();
  }

  void _placeSurface(String position) {
    setState(() {
      vanimalPlaced = true;
      showARModel = true;
      
      // Adjust model position based on placement
      if (position == 'bottom') {
        _modelBottom = 120;
        _modelLeft = 60;
        _modelRight = 60;
      } else {
        _modelBottom = MediaQuery.of(context).size.height * 0.3;
        _modelLeft = 80;
        _modelRight = 80;
      }
    });
    
    _animationController.stop();
    
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('🎉 ${widget.vanimalName} anchored to surface!'),
        backgroundColor: AppTheme.vanimalPurple,
        duration: const Duration(seconds: 2),
      ),
    );
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

  void _resetAR() {
    setState(() {
      vanimalPlaced = false;
      showARModel = false;
    });
    
    _startSurfaceDetection();
    
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
    
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(showARModel ? '👁️ ${widget.vanimalName} visible' : '🙈 ${widget.vanimalName} hidden'),
        backgroundColor: AppTheme.vanimalPurple,
        duration: const Duration(seconds: 1),
      ),
    );
  }

  void _openNativeAR() {
    Navigator.of(context).push(
      MaterialPageRoute(
        fullscreenDialog: true,
        builder: (context) => Scaffold(
          backgroundColor: Colors.black,
          appBar: AppBar(
            backgroundColor: Colors.transparent,
            elevation: 0,
            leading: IconButton(
              icon: const Icon(Icons.close, color: Colors.white),
              onPressed: () => Navigator.of(context).pop(),
            ),
            title: Text(
              '${widget.vanimalName} Native AR',
              style: const TextStyle(color: Colors.white),
            ),
          ),
          body: ModelViewer(
            backgroundColor: const Color(0xFF070707),
            src: _getModelPath(widget.vanimalType),
            alt: widget.vanimalName,
            ar: true,
            arModes: const ['scene-viewer', 'webxr', 'quick-look'],
            autoRotate: true,
            cameraControls: true,
            disableZoom: false,
            loading: Loading.eager,
            arPlacement: ArPlacement.floor,
            autoPlay: true,
            shadowIntensity: 1.0,
            shadowSoftness: 0.5,
            environmentImage: 'neutral',
          ),
        ),
      ),
    );
  }

  @override
  void dispose() {
    _animationController.dispose();
    cameraController?.dispose();
    super.dispose();
  }
}

// Custom painter for scanning animation
class ScanningPainter extends CustomPainter {
  final double animationValue;
  
  ScanningPainter(this.animationValue);
  
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = AppTheme.vanimalPurple.withOpacity(0.6)
      ..strokeWidth = 2
      ..style = PaintingStyle.stroke;
    
    // Draw scanning line
    final y = size.height * animationValue;
    canvas.drawLine(
      Offset(0, y),
      Offset(size.width, y),
      paint,
    );
    
    // Draw grid pattern
    final gridPaint = Paint()
      ..color = AppTheme.vanimalPurple.withOpacity(0.3)
      ..strokeWidth = 1;
    
    const gridSize = 40.0;
    for (double i = 0; i < size.width; i += gridSize) {
      canvas.drawLine(Offset(i, 0), Offset(i, size.height), gridPaint);
    }
    for (double i = 0; i < size.height; i += gridSize) {
      canvas.drawLine(Offset(0, i), Offset(size.width, i), gridPaint);
    }
  }
  
  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => true;
}

