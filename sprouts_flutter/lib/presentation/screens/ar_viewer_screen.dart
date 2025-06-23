import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:camera/camera.dart';
import 'package:model_viewer_plus/model_viewer_plus.dart';
import '../theme/app_theme.dart';

class ARViewerScreen extends StatefulWidget {
  final String vanimalName;
  final String vanimalSpecies;
  final String? modelPath;

  const ARViewerScreen({
    super.key,
    required this.vanimalName,
    required this.vanimalSpecies,
    this.modelPath,
  });

  @override
  State<ARViewerScreen> createState() => _ARViewerScreenState();
}

class _ARViewerScreenState extends State<ARViewerScreen> {
  CameraController? cameraController;
  List<CameraDescription>? cameras;
  
  bool isVanimalPlaced = false;
  bool isARReady = false;
  Offset? vanimalPosition;

  @override
  void initState() {
    super.initState();
    _initializeCamera();
  }
  
  @override
  void dispose() {
    cameraController?.dispose();
    super.dispose();
  }
  
  Future<void> _initializeCamera() async {
    cameras = await availableCameras();
    if (cameras!.isNotEmpty) {
      cameraController = CameraController(
        cameras!.first,
        ResolutionPreset.high,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('${widget.vanimalName} in AR'),
        backgroundColor: Colors.transparent,
        elevation: 0,
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
        child: Stack(
          children: [
            // AR View Area
            if (isARReady)
              Positioned.fill(
                child: _buildARView(),
              )
            else
              Center(
                child: Container(
                  width: 300,
                  height: 400,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(
                      color: AppTheme.vanimalPurple.withOpacity(0.5),
                      width: 2,
                    ),
                    color: Colors.black.withOpacity(0.3),
                  ),
                  child: _buildARInstructions(),
                ),
              ),
            
            // Control Panel
            if (!isARReady)
              Positioned(
                bottom: 50,
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
                        icon: Icons.view_in_ar,
                        label: 'Start AR',
                        onPressed: _startAR,
                      ),
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
                        icon: Icons.play_arrow,
                        label: 'Animate',
                        onPressed: _playAnimation,
                      ),
                    ],
                  ),
                ),
              )
            else
              // AR Controls when camera is active
              Positioned(
                top: 60,
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
                        onPressed: () {
                          setState(() {
                            isARReady = false;
                            isVanimalPlaced = false;
                            vanimalPosition = null;
                          });
                        },
                      ),
                    ),
                    if (isVanimalPlaced)
                      Container(
                        decoration: const BoxDecoration(
                          color: Colors.black54,
                          shape: BoxShape.circle,
                        ),
                        child: IconButton(
                          icon: const Icon(Icons.refresh, color: Colors.white),
                          onPressed: _resetAR,
                        ),
                      ),
                  ],
                ),
              ),
            
            // Vanimal Info Card
            if (isVanimalPlaced && isARReady)
              Positioned(
                bottom: 100,
                left: 20,
                right: 20,
                child: Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.black.withOpacity(0.8),
                    borderRadius: BorderRadius.circular(15),
                  ),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        widget.vanimalName,
                        style: AppTheme.labelLarge.copyWith(fontSize: 18),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        '${widget.vanimalSpecies} • 🌟 In AR',
                        style: AppTheme.bodySmall.copyWith(
                          color: AppTheme.vanimalPurple,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildARInstructions() {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Icon(
          Icons.view_in_ar,
          size: 80,
          color: AppTheme.vanimalPurple.withOpacity(0.7),
        ),
        const SizedBox(height: 20),
        Text(
          'AR Mode',
          style: AppTheme.headlineMedium,
        ),
        const SizedBox(height: 12),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Text(
            isARReady 
                ? 'Point camera at a flat surface (table, floor) and tap to place your ${widget.vanimalSpecies}'
                : 'Tap "Start AR" to begin AR camera view',
            style: AppTheme.bodyLarge.copyWith(
              color: Colors.white.withOpacity(0.8),
            ),
            textAlign: TextAlign.center,
          ),
        ),
        const SizedBox(height: 20),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          decoration: BoxDecoration(
            color: AppTheme.vanimalPurple.withOpacity(0.3),
            borderRadius: BorderRadius.circular(20),
          ),
          child: Text(
            '🚀 Tap "Start AR" to launch camera view!',
            style: AppTheme.bodySmall,
          ),
        ),
      ],
    );
  }

  Widget _buildPlacedVanimal() {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        // Show the actual Sprout sprite if available
        if (widget.modelPath != null)
          Container(
            width: 150,
            height: 150,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(15),
              border: Border.all(
                color: AppTheme.vanimalPurple,
                width: 2,
              ),
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(15),
              child: Image.asset(
                _getSproutImage(),
                fit: BoxFit.cover,
              ),
            ),
          )
        else
          Container(
            width: 120,
            height: 120,
            decoration: BoxDecoration(
              color: AppTheme.vanimalPurple.withOpacity(0.3),
              shape: BoxShape.circle,
              border: Border.all(
                color: AppTheme.vanimalPurple,
                width: 3,
              ),
            ),
            child: Icon(
              Icons.pets,
              size: 60,
              color: AppTheme.vanimalPurple,
            ),
          ),
        
        const SizedBox(height: 20),
        Text(
          '${widget.vanimalName} is here!',
          style: AppTheme.headlineSmall,
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 8),
        Text(
          'Your ${widget.vanimalSpecies} is now in AR view',
          style: AppTheme.bodyMedium.copyWith(
            color: Colors.white.withOpacity(0.8),
          ),
          textAlign: TextAlign.center,
        ),
      ],
    );
  }


  Widget _buildControlButton({
    required IconData icon,
    required String label,
    required VoidCallback onPressed,
  }) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          decoration: const BoxDecoration(
            color: AppTheme.vanimalPurple,
            shape: BoxShape.circle,
          ),
          child: IconButton(
            icon: Icon(icon, color: Colors.white),
            onPressed: onPressed,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: AppTheme.bodySmall.copyWith(fontSize: 10),
        ),
      ],
    );
  }

  void _simulateARPlacement() {
    setState(() {
      isVanimalPlaced = true;
    });
  }

  Future<void> _startAR() async {
    if (cameraController != null && !cameraController!.value.isInitialized) {
      await cameraController!.initialize();
    }
    
    setState(() {
      isARReady = true;
    });
    
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('🚀 AR Camera started! Tap anywhere to place ${widget.vanimalName}'),
        backgroundColor: AppTheme.vanimalPurple,
        duration: const Duration(seconds: 3),
      ),
    );
  }
  
  Widget _buildARView() {
    if (cameraController == null || !cameraController!.value.isInitialized) {
      return const Center(
        child: CircularProgressIndicator(color: AppTheme.vanimalPurple),
      );
    }
    
    return GestureDetector(
      onTapDown: (details) {
        if (!isVanimalPlaced) {
          // Calculate position relative to screen center for better placement
          final screenSize = MediaQuery.of(context).size;
          final adjustedPosition = Offset(
            details.localPosition.dx.clamp(60.0, screenSize.width - 60.0),
            details.localPosition.dy.clamp(60.0, screenSize.height - 120.0),
          );
          
          setState(() {
            vanimalPosition = adjustedPosition;
            isVanimalPlaced = true;
          });
          
          // Haptic feedback for surface placement
          HapticFeedback.mediumImpact();
          
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('🎉 ${widget.vanimalName} placed on surface!'),
              backgroundColor: Colors.green,
              duration: const Duration(seconds: 2),
            ),
          );
        }
      },
      child: Stack(
        children: [
          CameraPreview(cameraController!),
          if (isVanimalPlaced && vanimalPosition != null)
            Positioned(
              left: vanimalPosition!.dx - 40,
              top: vanimalPosition!.dy - 40,
              child: _buildPlaced3DObject(),
            ),
        ],
      ),
    );
  }
  
  Widget _buildPlaced3DObject() {
    return Container(
      width: 120,
      height: 120,
      child: Stack(
        alignment: Alignment.center,
        children: [
          // Subtle ground shadow only
          Positioned(
            bottom: 0,
            child: Container(
              width: 60,
              height: 10,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(30),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.3),
                    blurRadius: 8,
                    spreadRadius: 2,
                  ),
                ],
              ),
            ),
          ),
          // 3D Model Viewer - clean with no bubble
          SizedBox(
            width: 120,
            height: 120,
            child: ModelViewer(
              backgroundColor: Colors.transparent,
              src: _get3DModelPath(),
              alt: '${widget.vanimalSpecies} 3D Model',
              ar: true,
              autoRotate: true,
              disableZoom: false,
              cameraControls: true,
              loading: Loading.eager,
            ),
          ),
        ],
      ),
    );
  }
  
  String _get3DModelPath() {
    switch (widget.vanimalSpecies.toLowerCase()) {
      case 'pigeon':
        return 'assets/models/pigeon.glb';
      case 'elephant':
        return 'assets/models/elephant.glb';
      case 'tiger':
        return 'assets/models/tiger.glb';
      case 'penguin':
        return 'assets/models/penguin.glb';
      case 'axolotl':
        return 'assets/models/axolotl.glb';
      case 'chimpanzee':
      case 'chimp':
        return 'assets/models/chimpanzee.glb';
      default:
        return 'assets/models/pigeon.glb';
    }
  }

  void _resetAR() {
    setState(() {
      isVanimalPlaced = false;
      vanimalPosition = null;
    });
  }

  void _takePhoto() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('📸 AR Photo captured! Check your gallery'),
        backgroundColor: AppTheme.vanimalPurple,
      ),
    );
  }

  void _playAnimation() {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('🎬 ${widget.vanimalName} is dancing!'),
        backgroundColor: AppTheme.vanimalPink,
      ),
    );
  }
  
  String _getSproutImage() {
    switch (widget.vanimalSpecies.toLowerCase()) {
      case 'pigeon':
      case 'pidgeon':
        return 'assets/images/animals/pigeon.png';
      case 'elephant':
        return 'assets/images/animals/elephant.png';
      case 'tiger':
        return 'assets/images/animals/tiger.png';
      case 'penguin':
        return 'assets/images/animals/penguin.png';
      case 'axolotl':
        return 'assets/images/animals/penguin.png';
      case 'chimpanzee':
      case 'chimp':
        return 'assets/images/animals/tiger.png';
      default:
        return 'assets/images/animals/pigeon.png';
    }
  }
}