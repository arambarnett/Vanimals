class UserPreferences {
  // Simple in-memory storage for demo purposes
  // In a real app, you'd use SharedPreferences or secure storage
  static bool _hasCompletedOnboarding = false;
  static bool _isStravaConnected = false;
  static bool _hasReceivedStarterEgg = false;

  // Onboarding status
  static bool get hasCompletedOnboarding => _hasCompletedOnboarding;
  static void setOnboardingCompleted(bool completed) {
    _hasCompletedOnboarding = completed;
  }

  // Strava connection status
  static bool get isStravaConnected => _isStravaConnected;
  static void setStravaConnected(bool connected) {
    _isStravaConnected = connected;
  }

  // Starter egg status
  static bool get hasReceivedStarterEgg => _hasReceivedStarterEgg;
  static void setStarterEggReceived(bool received) {
    _hasReceivedStarterEgg = received;
  }

  // Reset all preferences (for logout)
  static void reset() {
    _hasCompletedOnboarding = false;
    _isStravaConnected = false;
    _hasReceivedStarterEgg = false;
  }

  // Complete onboarding with optional Strava connection
  static void completeOnboarding({bool connectedStrava = false}) {
    _hasCompletedOnboarding = true;
    if (connectedStrava) {
      _isStravaConnected = true;
      _hasReceivedStarterEgg = true;
    }
  }
}