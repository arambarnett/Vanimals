class AppConstants {
  // App Info
  static const String appName = 'Sprouts AR';
  static const String appVersion = '1.0.0';
  
  // API Configuration
  static const String baseUrl = 'https://prevocational-unvenial-wes.ngrok-free.dev';
  static const String supabaseUrl = 'https://fuznyncrufagipokvrub.supabase.co';
  static const String supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1em55bmNydWZhZ2lwb2t2cnViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzODg4OTksImV4cCI6MjA2ODk2NDg5OX0.TPxXKY5cEOSzKP1SEDK9wwpHzyymJhqsjdoSmiqXrqs';
  
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