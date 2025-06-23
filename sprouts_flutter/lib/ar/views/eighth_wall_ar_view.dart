import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';
import '../../presentation/theme/app_theme.dart';

class EighthWallARView extends StatefulWidget {
  final String vanimalType;
  final String vanimalName;
  final VoidCallback? onClose;

  const EighthWallARView({
    super.key,
    required this.vanimalType,
    required this.vanimalName,
    this.onClose,
  });

  @override
  State<EighthWallARView> createState() => _EighthWallARViewState();
}

class _EighthWallARViewState extends State<EighthWallARView> {
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
      ..setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15')
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
      ..addJavaScriptChannel(
        'FlutterAR',
        onMessageReceived: (JavaScriptMessage message) {
          _handleWebMessage(message.message);
        },
      )
      ..loadRequest(Uri.parse(_getARUrl()));
  }

  String _getARUrl() {
    // For development, you'll need to serve this from a web server
    // Options:
    // 1. Deploy to Netlify/Vercel (free)
    // 2. Use local dev server
    // 3. Use 8th Wall cloud hosting
    
    final baseUrl = 'https://your-app.netlify.app'; // REPLACE WITH YOUR DEPLOYED URL
    return '$baseUrl/ar/?type=${widget.vanimalType}&name=${Uri.encodeComponent(widget.vanimalName)}';
  }

  void _handleWebMessage(String message) {
    debugPrint('8th Wall Message: $message');
    
    if (message == 'closeAR') {
      widget.onClose?.call() ?? Navigator.of(context).pop();
    } else if (message.contains('vanimalPlaced')) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('🎉 ${widget.vanimalName} placed in AR!'),
          backgroundColor: AppTheme.vanimalPurple,
          duration: const Duration(seconds: 2),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: Stack(
        children: [
          // 8th Wall WebView (Pokemon GO style AR)
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
                      'Loading 8th Wall AR...',
                      style: AppTheme.bodyLarge.copyWith(color: Colors.white),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 10),
                    Text(
                      'Preparing ${widget.vanimalName} for AR',
                      style: AppTheme.bodyMedium.copyWith(color: Colors.white70),
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
              ),
            ),

          // Instructions overlay (only shown initially)
          if (showInstructions && !isLoading)
            _buildInstructionsOverlay(),

          // Emergency close button (in case web AR doesn't work)
          if (!isLoading)
            Positioned(
              top: MediaQuery.of(context).padding.top + 10,
              right: 20,
              child: Container(
                decoration: BoxDecoration(
                  color: Colors.black.withOpacity(0.7),
                  shape: BoxShape.circle,
                ),
                child: IconButton(
                  icon: const Icon(Icons.close, color: Colors.white),
                  onPressed: widget.onClose ?? () => Navigator.of(context).pop(),
                ),
              ),
            ),
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
                size: 80,
                color: Colors.white,
              ),
              const SizedBox(height: 20),
              Text(
                '8th Wall AR Experience',
                style: AppTheme.headlineSmall.copyWith(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 12),
              Text(
                'Experience ${widget.vanimalName} in professional-grade AR!\n\n'
                '🎯 Real surface detection\n'
                '📱 Works on 5+ billion devices\n'
                '🦁 Pokemon GO style placement\n'
                '📸 AR photos and videos\n\n'
                'Powered by 8th Wall WebAR',
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
                  'Continue to 8th Wall AR',
                  style: TextStyle(fontWeight: FontWeight.bold),
                ),
              ),
              const SizedBox(height: 12),
              Text(
                'Grant camera permissions when prompted',
                style: AppTheme.bodySmall.copyWith(
                  color: Colors.white70,
                  fontStyle: FontStyle.italic,
                ),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  void dispose() {
    super.dispose();
  }
}