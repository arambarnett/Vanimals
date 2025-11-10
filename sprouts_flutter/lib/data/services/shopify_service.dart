import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

/// Service for handling Shopify purchases
/// Configure with your Shopify store details when ready
class ShopifyService {
  // TODO: Replace with your Shopify store domain
  static const String shopifyStoreDomain = 'your-store.myshopify.com';

  // TODO: Replace with your product handles
  static const String prismProductHandle = '4d-prism';
  static const String premiumPassHandle = 'premium-pass';
  static const String eggPackHandle = 'egg-pack';

  /// Open Shopify storefront in WebView or browser
  static Future<void> openStorefront(BuildContext context) async {
    final url = Uri.parse('https://$shopifyStoreDomain');

    if (await canLaunchUrl(url)) {
      await launchUrl(
        url,
        mode: LaunchMode.inAppWebView,
      );
    } else {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Could not open shop. Please try again later.'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  /// Open specific product page for 4D Prism
  static Future<void> openPrismProduct(BuildContext context) async {
    final url = Uri.parse('https://$shopifyStoreDomain/products/$prismProductHandle');

    if (await canLaunchUrl(url)) {
      await launchUrl(
        url,
        mode: LaunchMode.inAppWebView,
      );
    } else {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Could not open product. Please try again later.'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  /// Open specific product page for Premium Pass
  static Future<void> openPremiumProduct(BuildContext context) async {
    final url = Uri.parse('https://$shopifyStoreDomain/products/$premiumPassHandle');

    if (await canLaunchUrl(url)) {
      await launchUrl(
        url,
        mode: LaunchMode.inAppWebView,
      );
    } else {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Could not open product. Please try again later.'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  /// Open specific product page for Egg Pack
  static Future<void> openEggPackProduct(BuildContext context) async {
    final url = Uri.parse('https://$shopifyStoreDomain/products/$eggPackHandle');

    if (await canLaunchUrl(url)) {
      await launchUrl(
        url,
        mode: LaunchMode.inAppWebView,
      );
    } else {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Could not open product. Please try again later.'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  /// Show shop options dialog
  static void showShopDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: const Color(0xFF1a1a1a),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
        ),
        title: const Text(
          'Shop Sprouts',
          style: TextStyle(
            color: Colors.white,
            fontSize: 24,
            fontWeight: FontWeight.bold,
          ),
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            _buildShopOption(
              context,
              icon: Icons.view_in_ar,
              title: '4D Prism',
              description: 'Unlock AR magic',
              reward: '+200 Feed',
              onTap: () {
                Navigator.of(context).pop();
                openPrismProduct(context);
              },
            ),
            const SizedBox(height: 12),
            _buildShopOption(
              context,
              icon: Icons.star,
              title: 'Premium Pass',
              description: 'Unlock exclusive features',
              reward: '+150 Feed',
              onTap: () {
                Navigator.of(context).pop();
                openPremiumProduct(context);
              },
            ),
            const SizedBox(height: 12),
            _buildShopOption(
              context,
              icon: Icons.egg,
              title: 'Extra Eggs',
              description: 'Hatch more Sprouts',
              reward: 'More Eggs',
              onTap: () {
                Navigator.of(context).pop();
                openEggPackProduct(context);
              },
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text(
              'Cancel',
              style: TextStyle(color: Colors.white70),
            ),
          ),
        ],
      ),
    );
  }

  static Widget _buildShopOption(
    BuildContext context, {
    required IconData icon,
    required String title,
    required String description,
    required String reward,
    required VoidCallback onTap,
  }) {
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: Colors.white.withOpacity(0.2),
          width: 1,
        ),
        color: Colors.white.withOpacity(0.05),
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(12),
          onTap: onTap,
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Container(
                  width: 40,
                  height: 40,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: Colors.purple.withOpacity(0.3),
                  ),
                  child: Icon(
                    icon,
                    color: Colors.white,
                    size: 22,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        title,
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                      Text(
                        description,
                        style: TextStyle(
                          fontSize: 12,
                          color: Colors.white.withOpacity(0.6),
                        ),
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 4,
                  ),
                  decoration: BoxDecoration(
                    color: Colors.amber.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(
                      color: Colors.amber.withOpacity(0.5),
                      width: 1,
                    ),
                  ),
                  child: Text(
                    reward,
                    style: const TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                      color: Colors.amber,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
