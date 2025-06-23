import 'package:flutter/material.dart';
import 'package:camera/camera.dart';
import 'package:model_viewer_plus/model_viewer_plus.dart';
import '../../presentation/theme/app_theme.dart';

class WorkingARView extends StatefulWidget {
  final String vanimalType;
  final String vanimalName;
  final VoidCallback? onClose;

  const WorkingARView({
    super.key,
    required this.vanimalType,
    required this.vanimalName,
    this.onClose,
  });

  @override
  State<WorkingARView> createState() => _WorkingARViewState();
}

class _WorkingARViewState extends State<WorkingARView> {
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
          // Camera background
          if (!isLoading && cameraController != null && cameraController!.value.isInitialized)
            Positioned.fill(
              child: GestureDetector(
                onTap: _placeVanimal,
                child: CameraPreview(cameraController!),
              ),
            ),

          // AR Model placed in scene
          if (showARModel && vanimalPlaced)
            _buildARModel(),

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

          // Crosshair for targeting
          if (!showInstructions && !vanimalPlaced && !isLoading)
            _buildCrosshair(),

          // Success indicator
          if (vanimalPlaced && !showInstructions)
            _buildSuccessIndicator(),
        ],
      ),
    );
  }

  Widget _buildARModel() {
    return Positioned(
      bottom: 120,
      left: MediaQuery.of(context).size.width * 0.25,
      right: MediaQuery.of(context).size.width * 0.25,
      child: Container(
        height: 180,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(10),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.4),
              blurRadius: 20,
              spreadRadius: 5,
              offset: const Offset(0, 10),
            ),
          ],
        ),
        child: ModelViewer(
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
          shadowIntensity: 0.8,
          shadowSoftness: 0.6,
          environmentImage: 'neutral',
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
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: AppTheme.vanimalPurple.withOpacity(0.95),
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
                style: AppTheme.headlineSmall.copyWith(color: Colors.white),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 10),
              Text(
                '1. Point your camera at a flat surface\n'
                '2. Use the crosshair to aim\n'
                '3. Tap anywhere to place your Vanimal\n'
                '4. Watch it appear in your real world!',
                style: AppTheme.bodyMedium.copyWith(color: Colors.white),
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
                  padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                ),
                child: const Text('Start AR'),
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

  Widget _buildCrosshair() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              border: Border.all(
                color: AppTheme.vanimalPurple,
                width: 3,
              ),
            ),
            child: Icon(
              Icons.add,
              color: AppTheme.vanimalPurple,
              size: 20,
            ),
          ),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            decoration: BoxDecoration(
              color: Colors.black.withOpacity(0.7),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Text(
              'Tap to place ${widget.vanimalName}',
              style: AppTheme.bodySmall.copyWith(
                color: Colors.white,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSuccessIndicator() {
    return Positioned(
      top: MediaQuery.of(context).padding.top + 80,
      left: 20,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          color: AppTheme.vanimalPurple.withOpacity(0.9),
          borderRadius: BorderRadius.circular(20),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(
              Icons.check_circle,
              color: Colors.white,
              size: 20,
            ),
            const SizedBox(width: 8),
            Text(
              '${widget.vanimalName} placed!',
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
            icon: Icon(icon, color: Colors.white, size: 20),
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
      showARModel = true;
    });
    
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('🎉 ${widget.vanimalName} placed in AR!'),
        backgroundColor: AppTheme.vanimalPurple,
        duration: const Duration(seconds: 2),
      ),
    );
  }

  void _resetAR() {
    setState(() {
      vanimalPlaced = false;
      showARModel = false;
    });
    
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
    // Launch full-screen native AR
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
            shadowIntensity: 0.8,
            shadowSoftness: 0.5,
            environmentImage: 'neutral',
          ),
        ),
      ),
    );
  }

  @override
  void dispose() {
    cameraController?.dispose();
    super.dispose();
  }
}