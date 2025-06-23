import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';
import '../../presentation/theme/app_theme.dart';

class WebARView extends StatefulWidget {
  final String vanimalType;
  final String vanimalName;
  final VoidCallback? onClose;

  const WebARView({
    super.key,
    required this.vanimalType,
    required this.vanimalName,
    this.onClose,
  });

  @override
  State<WebARView> createState() => _WebARViewState();
}

class _WebARViewState extends State<WebARView> {
  late WebViewController webViewController;
  bool isLoading = true;
  bool showInstructions = true;

  @override
  void initState() {
    super.initState();
    _initializeWebView();
  }

  void _initializeWebView() {
    webViewController = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setNavigationDelegate(
        NavigationDelegate(
          onPageStarted: (String url) {
            setState(() {
              isLoading = true;
            });
          },
          onPageFinished: (String url) {
            setState(() {
              isLoading = false;
            });
          },
        ),
      )
      ..loadHtmlString(_generateARHTML());
  }

  String _generateARHTML() {
    final modelPath = _getModelPath(widget.vanimalType);
    
    return '''
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${widget.vanimalName} AR</title>
    <script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js"></script>
    <style>
        body {
            margin: 0;
            padding: 0;
            background: #000;
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        model-viewer {
            width: 100vw;
            height: 100vh;
            background-color: transparent;
        }
        
        .ar-prompt {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(138, 43, 226, 0.95);
            color: white;
            padding: 24px;
            border-radius: 20px;
            text-align: center;
            max-width: 320px;
            z-index: 1000;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }
        
        .ar-button {
            background: white;
            color: #8A2BE2;
            border: none;
            padding: 12px 24px;
            border-radius: 25px;
            font-weight: bold;
            cursor: pointer;
            margin-top: 16px;
            font-size: 16px;
        }
        
        .controls {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 10px;
            z-index: 1000;
        }
        
        .control-btn {
            background: rgba(0,0,0,0.8);
            color: white;
            border: none;
            padding: 12px;
            border-radius: 50%;
            cursor: pointer;
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .ar-instructions {
            position: fixed;
            top: 80px;
            left: 20px;
            right: 20px;
            background: rgba(0,128,0,0.9);
            color: white;
            padding: 16px;
            border-radius: 15px;
            z-index: 1000;
            display: none;
        }
        
        .ar-instructions.show {
            display: block;
        }
        
        #ar-button {
            background: #8A2BE2 !important;
            border: 2px solid white;
        }
        
        model-viewer::part(default-ar-button) {
            background: #8A2BE2;
            color: white;
            border: 2px solid white;
            border-radius: 25px;
            padding: 12px 24px;
            font-weight: bold;
            bottom: 20px;
            right: 20px;
        }
    </style>
</head>
<body>
    <div class="ar-prompt" id="welcome-prompt">
        <h2>🦁 ${widget.vanimalName} AR</h2>
        <p>Experience your Vanimal in real-world AR! This will use your device's camera to detect surfaces and place your 3D model in the real world.</p>
        <button class="ar-button" onclick="startAR()">Start AR Experience</button>
    </div>
    
    <div class="ar-instructions" id="ar-instructions">
        <strong>🎯 AR Instructions:</strong><br>
        1. Point camera at flat surface (table/floor)<br>
        2. Move device slowly to detect planes<br>
        3. Tap to place ${widget.vanimalName}<br>
        4. Move around to see it from all angles!
    </div>
    
    <model-viewer 
        id="vanimal-model"
        src="${modelPath}"
        alt="${widget.vanimalName} 3D Model"
        ar
        ar-modes="webxr scene-viewer quick-look"
        ar-scale="auto"
        ar-placement="floor"
        camera-controls
        auto-rotate
        shadow-intensity="1"
        shadow-softness="0.5"
        environment-image="neutral"
        exposure="1"
        style="display: none;"
        ios-src="${modelPath}">
        
        <button slot="ar-button" id="ar-button">
            📱 Place in AR
        </button>
    </model-viewer>
    
    <div class="controls" id="controls" style="display: none;">
        <button class="control-btn" onclick="toggleInstructions()" title="Help">❓</button>
        <button class="control-btn" onclick="resetModel()" title="Reset">🔄</button>
        <button class="control-btn" onclick="closeAR()" title="Close">✕</button>
    </div>

    <script>
        const modelViewer = document.getElementById('vanimal-model');
        const welcomePrompt = document.getElementById('welcome-prompt');
        const controls = document.getElementById('controls');
        const instructions = document.getElementById('ar-instructions');
        
        function startAR() {
            welcomePrompt.style.display = 'none';
            modelViewer.style.display = 'block';
            controls.style.display = 'flex';
            
            // Show instructions briefly
            instructions.classList.add('show');
            setTimeout(() => {
                instructions.classList.remove('show');
            }, 5000);
        }
        
        function toggleInstructions() {
            instructions.classList.toggle('show');
        }
        
        function resetModel() {
            // Reset model position and scale
            modelViewer.cameraTarget = "auto auto auto";
            modelViewer.cameraOrbit = "0deg 75deg 105%";
        }
        
        function closeAR() {
            // Send message to Flutter to close
            if (window.flutter_inappwebview) {
                window.flutter_inappwebview.callHandler('closeAR');
            }
        }
        
        // AR session events
        modelViewer.addEventListener('ar-status', (event) => {
            if (event.detail.status === 'session-started') {
                instructions.classList.add('show');
                instructions.innerHTML = '<strong>🎯 AR Active!</strong><br>Move your device to scan surfaces, then tap to place ${widget.vanimalName}';
            } else if (event.detail.status === 'object-placed') {
                instructions.innerHTML = '<strong>🎉 ${widget.vanimalName} Placed!</strong><br>Move around to see it from different angles';
                setTimeout(() => {
                    instructions.classList.remove('show');
                }, 3000);
            }
        });
        
        // Handle model loading
        modelViewer.addEventListener('load', () => {
            console.log('${widget.vanimalName} model loaded successfully');
        });
        
        modelViewer.addEventListener('error', (event) => {
            console.error('Model loading error:', event.detail);
            alert('Failed to load ${widget.vanimalName} model. Please try again.');
        });
        
        // Auto-start if on mobile
        if (/Mobi|Android/i.test(navigator.userAgent)) {
            // Mobile device detected
            setTimeout(() => {
                if (welcomePrompt.style.display !== 'none') {
                    startAR();
                }
            }, 2000);
        }
    </script>
</body>
</html>
    ''';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: Stack(
        children: [
          // WebView with AR content
          Positioned.fill(
            child: WebViewWidget(controller: webViewController),
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
                      'Loading ${widget.vanimalName} AR...',
                      style: AppTheme.bodyLarge.copyWith(color: Colors.white),
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
              ),
            ),

          // Instructions overlay (only shown initially)
          if (showInstructions && !isLoading)
            _buildInstructionsOverlay(),

          // Top control bar
          _buildTopControlBar(),
        ],
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
                'Real WebAR Experience',
                style: AppTheme.headlineSmall.copyWith(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 12),
              Text(
                'This uses your device\'s built-in AR capabilities to detect real surfaces and place ${widget.vanimalName} in your environment.\n\n'
                'Works on:\n'
                '• iOS devices with ARKit\n'
                '• Android devices with ARCore\n'
                '• Automatically detects your platform',
                style: AppTheme.bodyMedium.copyWith(color: Colors.white),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: () {
                  setState(() {
                    showInstructions = false;
                  });
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
                  'Continue to AR',
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
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            decoration: BoxDecoration(
              color: AppTheme.vanimalPurple.withOpacity(0.9),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Text(
              '${widget.vanimalName} WebAR',
              style: AppTheme.labelLarge.copyWith(
                color: Colors.white,
                fontWeight: FontWeight.bold,
              ),
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

  String _getModelPath(String vanimalType) {
    // For WebAR, we need to serve the models from a web server
    // For now, using relative paths that would work with assets
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
    super.dispose();
  }
}