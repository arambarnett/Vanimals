import 'package:flutter/material.dart';
import 'package:ar_flutter_plugin/ar_flutter_plugin.dart';
import 'package:vector_math/vector_math_64.dart' hide Colors;
import '../../presentation/theme/app_theme.dart';

class TrueARView extends StatefulWidget {
  final String vanimalType;
  final String vanimalName;
  final VoidCallback? onClose;

  const TrueARView({
    super.key,
    required this.vanimalType,
    required this.vanimalName,
    this.onClose,
  });

  @override
  State<TrueARView> createState() => _TrueARViewState();
}

class _TrueARViewState extends State<TrueARView> {
  ARSessionManager? arSessionManager;
  ARObjectManager? arObjectManager;
  ARAnchorManager? arAnchorManager;
  ARLocationManager? arLocationManager;
  
  List<ARNode> placedNodes = [];
  List<ARPlaneAnchor> placedAnchors = [];
  bool isLoading = true;
  bool showInstructions = true;
  String statusText = "Initializing AR...";

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          // AR View - This shows the live camera feed with AR objects
          ARView(
            onARViewCreated: _onARViewCreated,
            planeDetectionConfig: PlaneDetectionConfig.horizontalAndVertical,
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

          // Status indicator (minimal, no name box)
          if (placedNodes.isNotEmpty && !showInstructions)
            _buildMinimalStatusIndicator(),
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
                '2. Look for plane detection (grid overlay)\n'
                '3. Tap on the detected plane\n'
                '4. Watch your Vanimal appear in the real world!',
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
              icon: Icons.rotate_right,
              label: 'Rotate',
              onPressed: _rotateVanimal,
              isEnabled: placedNodes.isNotEmpty,
            ),
            _buildControlButton(
              icon: Icons.delete_outline,
              label: 'Remove',
              onPressed: _removeLastVanimal,
              isEnabled: placedNodes.isNotEmpty,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMinimalStatusIndicator() {
    return Positioned(
      top: MediaQuery.of(context).padding.top + 70,
      left: 20,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: AppTheme.vanimalPurple.withOpacity(0.9),
          borderRadius: BorderRadius.circular(15),
        ),
        child: Text(
          '🎉 ${placedNodes.length} ${widget.vanimalName}${placedNodes.length > 1 ? 's' : ''} in AR',
          style: AppTheme.bodySmall.copyWith(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
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

  void _onARViewCreated(
    ARSessionManager arSessionManager,
    ARObjectManager arObjectManager,
    ARAnchorManager arAnchorManager,
    ARLocationManager arLocationManager,
  ) {
    this.arSessionManager = arSessionManager;
    this.arObjectManager = arObjectManager;
    this.arAnchorManager = arAnchorManager;
    this.arLocationManager = arLocationManager;

    // Initialize AR session with plane detection
    this.arSessionManager!.onInitialize(
      showFeaturePoints: false,
      showPlanes: true,
      customPlaneTexturePath: null, // Use default plane visualization
      showWorldOrigin: false,
      handlePans: true,
      handleRotation: true,
    );
    
    this.arObjectManager!.onInitialize();
    this.arAnchorManager!.onInitialize();

    // Handle tap events on detected planes
    this.arSessionManager!.onPlaneOrPointTap = _onPlaneOrPointTapped;
    
    setState(() {
      isLoading = false;
      statusText = "AR Ready - Look for surfaces and tap to place";
    });
  }

  Future<void> _onPlaneOrPointTapped(List<ARHitTestResult> hitTestResults) async {
    if (hitTestResults.isEmpty) return;
    
    // Find the best hit result (prefer planes over points)
    var hitResult = hitTestResults.firstWhere(
      (result) => result.type == ARHitTestResultType.plane,
      orElse: () => hitTestResults.first,
    );
    
    // Create anchor at the tap location
    var anchor = ARPlaneAnchor(transformation: hitResult.worldTransform);
    bool? didAddAnchor = await arAnchorManager!.addAnchor(anchor);
    
    if (didAddAnchor == true) {
      await _add3DVanimalNode(anchor);
    }
  }

  Future<void> _add3DVanimalNode(ARPlaneAnchor anchor) async {
    String modelPath = _getModelPath(widget.vanimalType);
    
    // Create 3D node with the actual GLB model
    var vanimalNode = ARNode(
      type: NodeType.fileSystemAppFolderGLTF2,
      uri: modelPath,
      scale: Vector3(0.15, 0.15, 0.15), // Smaller scale for better AR experience
      position: Vector3(0.0, 0.0, 0.0), // Position relative to anchor
      rotation: Vector4(1.0, 0.0, 0.0, 0.0), // No initial rotation
    );
    
    // Add the node to the AR scene anchored to the detected plane
    bool? didAddNode = await arObjectManager!.addNode(vanimalNode, planeAnchor: anchor);
    
    if (didAddNode == true) {
      placedNodes.add(vanimalNode);
      placedAnchors.add(anchor);
      setState(() {});
      
      // Show success message
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('🎉 ${widget.vanimalName} placed in AR!'),
          backgroundColor: AppTheme.vanimalPurple,
          duration: const Duration(seconds: 2),
        ),
      );
    }
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

  void _resetAR() async {
    // Remove all placed nodes and anchors
    for (int i = 0; i < placedNodes.length; i++) {
      await arObjectManager!.removeNode(placedNodes[i]);
      await arAnchorManager!.removeAnchor(placedAnchors[i]);
    }
    
    placedNodes.clear();
    placedAnchors.clear();
    setState(() {});
    
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('🔄 AR scene cleared'),
        backgroundColor: AppTheme.vanimalPurple,
        duration: Duration(seconds: 1),
      ),
    );
  }

  void _takePhoto() async {
    var image = await arSessionManager!.snapshot();
    if (image != null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('📸 AR photo captured!'),
          backgroundColor: AppTheme.vanimalPurple,
          duration: Duration(seconds: 1),
        ),
      );
    }
  }

  void _rotateVanimal() async {
    if (placedNodes.isNotEmpty) {
      var node = placedNodes.last;
      // Rotate by 45 degrees around Y axis
      var currentRotation = node.rotation;
      var newRotation = Vector4(0.0, 1.0, 0.0, currentRotation.w + 0.785398); // 45 degrees in radians
      node.rotation = newRotation;
      
      await arObjectManager!.updateNode(node);
      
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('🔄 ${widget.vanimalName} rotated'),
          backgroundColor: AppTheme.vanimalPink,
          duration: const Duration(seconds: 1),
        ),
      );
    }
  }

  void _removeLastVanimal() async {
    if (placedNodes.isNotEmpty) {
      var nodeToRemove = placedNodes.last;
      var anchorToRemove = placedAnchors.last;
      
      await arObjectManager!.removeNode(nodeToRemove);
      await arAnchorManager!.removeAnchor(anchorToRemove);
      
      placedNodes.removeLast();
      placedAnchors.removeLast();
      setState(() {});
      
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('👋 ${widget.vanimalName} removed'),
          backgroundColor: AppTheme.vanimalPink,
          duration: const Duration(seconds: 1),
        ),
      );
    }
  }

  @override
  void dispose() {
    arSessionManager?.dispose();
    super.dispose();
  }
}