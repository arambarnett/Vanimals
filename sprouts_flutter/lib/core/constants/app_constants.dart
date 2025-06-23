class AppConstants {
  // App Info
  static const String appName = 'Sprouts AR';
  static const String appVersion = '1.0.0';
  
  // API Configuration
  static const String baseUrl = 'https://your-node-backend.com/api';
  static const String supabaseUrl = 'https://your-supabase-url.supabase.co';
  static const String supabaseAnonKey = 'your-supabase-anon-key';
  
  // Animation Durations
  static const Duration shortAnimation = Duration(milliseconds: 300);
  static const Duration mediumAnimation = Duration(milliseconds: 500);
  static const Duration longAnimation = Duration(milliseconds: 800);
  
  // AR Constants
  static const int maxVideoRecordingDuration = 30; // seconds
  static const double defaultModelScale = 0.0015;
  
  // Vanimal Care System
  static const Duration hungerInterval = Duration(hours: 6);
  static const Duration sleepInterval = Duration(hours: 8);
  static const double maxFeedLevel = 1.0;
  static const double maxSleepLevel = 1.0;
  
  // Grid Layout
  static const int collectionGridCrossAxisCount = 2;
  static const double collectionGridAspectRatio = 0.8;
  
  // Pagination
  static const int defaultPageSize = 20;
}