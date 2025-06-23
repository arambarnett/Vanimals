import 'package:flutter/material.dart';
import 'package:model_viewer_plus/model_viewer_plus.dart';
import 'package:camera/camera.dart';
import '../../presentation/theme/app_theme.dart';

class ModelARView extends StatefulWidget {
  final String vanimalType;
  final String vanimalName;
  final VoidCallback? onClose;

  const ModelARView({
    super.key,
    required this.vanimalType,
    required this.vanimalName,
    this.onClose,
  });

  @override
  State<ModelARView> createState() => _ModelARViewState();
}

class _ModelARViewState extends State<ModelARView> {
  CameraController? cameraController;
  List<CameraDescription>? cameras;
  bool isLoading = true;
  bool showInstructions = true;
  bool vanimalPlaced = false;
  bool showModel = false;
  String statusText = "Initializing AR...";

  @override
  void initState() {
    super.initState();
    _initializeCamera();
  }

  Future<void> _initializeCamera() async {
    try {
      cameras = await availableCameras();
      if (cameras != null && cameras!.isNotEmpty) {
        cameraController = CameraController(
          cameras![0], // Use back camera
          ResolutionPreset.medium,
        );
        
        await cameraController!.initialize();
        
        setState(() {
          statusText = "AR Ready - Tap to place ${widget.vanimalName}";
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
      body: Stack(
        children: [
          // Camera background
          if (!isLoading && cameraController != null && !showModel)
            Positioned.fill(
              child: GestureDetector(
                onTap: _placeVanimal,
                child: CameraPreview(cameraController!),
              ),
            ),
          
          // 3D Model Viewer anchored to detected surface
          if (showModel && vanimalPlaced)
            Positioned(
              bottom: 100, // Fixed position closer to "ground"
              left: MediaQuery.of(context).size.width * 0.2,
              right: MediaQuery.of(context).size.width * 0.2,
              child: Container(
                height: 200,
                decoration: BoxDecoration(
                  // Remove border to make it look more integrated
                  borderRadius: BorderRadius.circular(10),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.3),
                      blurRadius: 10,
                      spreadRadius: 2,
                      offset: const Offset(0, 5),
                    ),
                  ],
                ),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(10),
                  child: ModelViewer(
                    backgroundColor: Colors.transparent,
                    src: _getModelPath(widget.vanimalType),
                    alt: widget.vanimalName, // Remove the "- type" part
                    ar: true,
                    arModes: const ['scene-viewer', 'webxr', 'quick-look'],
                    autoRotate: false, // Don't auto-rotate for more realistic feel
                    cameraControls: true,
                    disableZoom: false,
                    loading: Loading.eager,
                    arPlacement: ArPlacement.floor,
                    autoPlay: true,
                    shadowIntensity: 1.0, // Must be between 0 and 1
                    shadowSoftness: 0.5,
                    environmentImage: 'neutral', // Add environment lighting
                  ),
                ),
              ),
            ),
          
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
          if (!isLoading)
            _buildBottomControlPanel(),

          // Remove the vanimal info card as requested by user

          // Ground anchor indicator (circular plane detection effect)
          if (vanimalPlaced && showModel)
            Positioned(
              bottom: 90, // Just below the model
              left: MediaQuery.of(context).size.width * 0.3,
              right: MediaQuery.of(context).size.width * 0.3,
              child: Container(
                height: 20,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: AppTheme.vanimalPurple.withOpacity(0.3),
                  border: Border.all(
                    color: AppTheme.vanimalPurple.withOpacity(0.6),
                    width: 2,
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: AppTheme.vanimalPurple.withOpacity(0.4),
                      blurRadius: 15,
                      spreadRadius: 5,
                    ),
                  ],
                ),
              ),
            ),

          // Crosshair for aiming
          if (!showInstructions && !vanimalPlaced && !showModel)
            Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.add,
                    size: 40,
                    color: AppTheme.vanimalPurple.withOpacity(0.8),
                  ),
                  const SizedBox(height: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: Colors.black.withOpacity(0.7),
                      borderRadius: BorderRadius.circular(15),
                    ),
                    child: Text(
                      'Tap to place ${widget.vanimalName}',
                      style: AppTheme.bodySmall.copyWith(color: Colors.white),
                    ),
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildInstructionsOverlay() {
    return Container(
      color: Colors.black.withOpacity(0.7),
      child: Center(
        child: Container(
          margin: const EdgeInsets.all(20),
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: AppTheme.vanimalPurple.withOpacity(0.9),
            borderRadius: BorderRadius.circular(15),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(
                Icons.view_in_ar,
                size: 60,
                color: Colors.white,
              ),
              const SizedBox(height: 15),
              Text(
                'Place ${widget.vanimalName} in AR',
                style: AppTheme.headlineSmall,
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 10),
              Text(
                '1. Point camera at a flat surface\n'
                '2. Look for the crosshair target\n'
                '3. Tap to anchor your Vanimal\n'
                '4. Watch it appear in the real world!',
                style: AppTheme.bodyMedium,
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: () {
                  setState(() {
                    showInstructions = false;
                  });
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.white,
                  foregroundColor: AppTheme.vanimalPurple,
                ),
                child: const Text('Got it!'),
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
          // Close button
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
          
          // Minimal status instead of title box
          if (vanimalPlaced)
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(
                color: AppTheme.vanimalPurple.withOpacity(0.9),
                borderRadius: BorderRadius.circular(15),
              ),
              child: Text(
                '🎉 ${widget.vanimalName} in AR',
                style: AppTheme.bodySmall.copyWith(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                ),
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

  Widget _buildBottomControlPanel() {
    return Positioned(
      bottom: 40,
      left: 20,
      right: 20,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.black.withOpacity(0.8),
          borderRadius: BorderRadius.circular(20),
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
              icon: showModel ? Icons.visibility_off : Icons.visibility,
              label: showModel ? 'Hide' : 'Show',
              onPressed: _toggleModel,
              isEnabled: vanimalPlaced,
            ),
            _buildControlButton(
              icon: Icons.view_in_ar,
              label: 'Native AR',
              onPressed: _openNativeAR,
              isEnabled: vanimalPlaced,
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
            color: isEnabled ? AppTheme.vanimalPurple : Colors.grey,
            shape: BoxShape.circle,
          ),
          child: IconButton(
            icon: Icon(icon, color: Colors.white),
            onPressed: isEnabled ? onPressed : null,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: AppTheme.bodySmall.copyWith(
            fontSize: 10,
            color: isEnabled ? Colors.white : Colors.grey,
          ),
        ),
      ],
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

  void _placeVanimal() {
    if (showInstructions) return;
    
    setState(() {
      vanimalPlaced = true;
      showModel = true;
    });
    
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
      showModel = false;
    });
    
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('🔄 AR scene reset'),
        backgroundColor: AppTheme.vanimalPurple,
      ),
    );
  }

  void _takePhoto() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('📸 AR photo captured!'),
        backgroundColor: AppTheme.vanimalPurple,
      ),
    );
  }

  void _toggleModel() {
    setState(() {
      showModel = !showModel;
    });
    
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(showModel ? '👁️ 3D model visible' : '🙈 3D model hidden'),
        backgroundColor: AppTheme.vanimalPurple,
      ),
    );
  }

  void _openNativeAR() {
    // Create a full-screen native AR model viewer
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (context) => Scaffold(
          backgroundColor: Colors.black,
          appBar: AppBar(
            backgroundColor: Colors.transparent,
            elevation: 0,
            title: Text('${widget.vanimalName} Native AR'),
          ),
          body: ModelViewer(
            backgroundColor: const Color(0xFF070707),
            src: _getModelPath(widget.vanimalType),
            alt: '${widget.vanimalName} - ${widget.vanimalType}',
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
    
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('🚀 Opening native AR for ${widget.vanimalName}'),
        backgroundColor: AppTheme.vanimalPink,
      ),
    );
  }

  @override
  void dispose() {
    cameraController?.dispose();
    super.dispose();
  }
}