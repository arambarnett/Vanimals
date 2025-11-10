import 'package:home_widget/home_widget.dart';
import 'dart:convert';

/// Service to manage home screen widget data for Sprouts
class SproutWidgetService {
  static const String _widgetGroupId = 'group.com.sprouts.app';

  /// Update widget with current sprout data
  static Future<void> updateWidget({
    required String sproutName,
    required int health,
    required String sproutType,
    required String imageUrl,
    int? currentGoalProgress,
    String? currentGoalName,
  }) async {
    try {
      // Save data to shared preferences for widget
      await HomeWidget.saveWidgetData<String>('sprout_name', sproutName);
      await HomeWidget.saveWidgetData<int>('sprout_health', health);
      await HomeWidget.saveWidgetData<String>('sprout_type', sproutType);
      await HomeWidget.saveWidgetData<String>('sprout_image', imageUrl);

      if (currentGoalProgress != null) {
        await HomeWidget.saveWidgetData<int>('goal_progress', currentGoalProgress);
      }

      if (currentGoalName != null) {
        await HomeWidget.saveWidgetData<String>('goal_name', currentGoalName);
      }

      // Update widget
      await HomeWidget.updateWidget(
        name: 'SproutWidget',
        iOSName: 'SproutWidget',
        androidName: 'SproutWidgetProvider',
      );
    } catch (e) {
      print('Error updating widget: $e');
    }
  }

  /// Clear widget data (when user logs out)
  static Future<void> clearWidget() async {
    try {
      await HomeWidget.saveWidgetData<String>('sprout_name', '');
      await HomeWidget.saveWidgetData<int>('sprout_health', 0);
      await HomeWidget.saveWidgetData<String>('sprout_type', '');
      await HomeWidget.saveWidgetData<String>('sprout_image', '');
      await HomeWidget.saveWidgetData<String>('goal_name', '');
      await HomeWidget.saveWidgetData<int>('goal_progress', 0);

      await HomeWidget.updateWidget(
        name: 'SproutWidget',
        iOSName: 'SproutWidget',
        androidName: 'SproutWidgetProvider',
      );
    } catch (e) {
      print('Error clearing widget: $e');
    }
  }

  /// Initialize widget (call on app start)
  static Future<void> initialize() async {
    try {
      await HomeWidget.setAppGroupId(_widgetGroupId);
    } catch (e) {
      print('Error initializing widget: $e');
    }
  }

  /// Handle widget tap (deep link into app)
  static Future<void> registerBackgroundCallback(Function callback) async {
    try {
      HomeWidget.registerBackgroundCallback(callback as dynamic Function(Uri?)?);
    } catch (e) {
      print('Error registering background callback: $e');
    }
  }
}
