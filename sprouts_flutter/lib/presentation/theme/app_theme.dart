import 'package:flutter/material.dart';

class AppTheme {
  // Colors
  static const Color vanimalPurple = Color(0xFF6e67f4);
  static const Color vanimalPink = Color(0xFFe58a9f);
  static const Color spaceBackground = Color(0xFF000814);
  static const Color darkGrey = Color(0xFF444444);
  static const Color midGrey = Color(0xFFd8d8d8);
  static const Color lightGray = Color(0xFFa2a5aa);
  
  // Material Color Swatches
  static const Map<int, Color> purpleSwatches = {
    50: Color.fromRGBO(110, 103, 244, .1),
    100: Color.fromRGBO(110, 103, 244, .2),
    200: Color.fromRGBO(110, 103, 244, .3),
    300: Color.fromRGBO(110, 103, 244, .4),
    400: Color.fromRGBO(110, 103, 244, .5),
    500: Color.fromRGBO(110, 103, 244, .6),
    600: Color.fromRGBO(110, 103, 244, .7),
    700: Color.fromRGBO(110, 103, 244, .8),
    800: Color.fromRGBO(110, 103, 244, .9),
    900: Color.fromRGBO(110, 103, 244, 1),
  };
  
  static MaterialColor vanimalPurpleSwatch = MaterialColor(0xFF6e67f4, purpleSwatches);
  
  // Text Styles (using Vanimals fonts)
  static const TextStyle headlineLarge = TextStyle(
    fontSize: 28,
    fontWeight: FontWeight.bold,
    fontFamily: 'Raleway',
    color: Colors.white,
  );
  
  static const TextStyle headlineMedium = TextStyle(
    fontSize: 24,
    fontWeight: FontWeight.w600,
    fontFamily: 'Raleway',
    color: Colors.white,
  );
  
  static const TextStyle headlineSmall = TextStyle(
    fontSize: 20,
    fontWeight: FontWeight.w500,
    fontFamily: 'Raleway',
    color: Colors.white,
  );
  
  static const TextStyle bodyLarge = TextStyle(
    fontSize: 16,
    fontWeight: FontWeight.normal,
    fontFamily: 'Avenir',
    color: Colors.white,
  );
  
  static const TextStyle bodyMedium = TextStyle(
    fontSize: 14,
    fontWeight: FontWeight.normal,
    fontFamily: 'Avenir',
    color: Colors.white,
  );
  
  static const TextStyle bodySmall = TextStyle(
    fontSize: 12,
    fontWeight: FontWeight.normal,
    fontFamily: 'Avenir',
    color: lightGray,
  );
  
  static const TextStyle labelLarge = TextStyle(
    fontSize: 14,
    fontWeight: FontWeight.w600,
    fontFamily: 'Lato',
    color: Colors.white,
  );
  
  // Button Styles
  static final ButtonStyle primaryButtonStyle = ElevatedButton.styleFrom(
    backgroundColor: vanimalPurple,
    foregroundColor: Colors.white,
    elevation: 8,
    shadowColor: vanimalPurple.withOpacity(0.4),
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(25),
    ),
    padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
  );
  
  static final ButtonStyle secondaryButtonStyle = ElevatedButton.styleFrom(
    backgroundColor: vanimalPink,
    foregroundColor: Colors.white,
    elevation: 6,
    shadowColor: vanimalPink.withOpacity(0.4),
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(20),
    ),
    padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
  );
  
  // Input Decoration
  static final InputDecorationTheme inputDecorationTheme = InputDecorationTheme(
    filled: true,
    fillColor: Colors.white.withOpacity(0.1),
    border: OutlineInputBorder(
      borderRadius: BorderRadius.circular(15),
      borderSide: BorderSide.none,
    ),
    enabledBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(15),
      borderSide: BorderSide(color: Colors.white.withOpacity(0.3)),
    ),
    focusedBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(15),
      borderSide: const BorderSide(color: vanimalPurple, width: 2),
    ),
    hintStyle: TextStyle(
      color: Colors.white.withOpacity(0.6),
    ),
    labelStyle: const TextStyle(
      color: Colors.white,
    ),
  );
  
  // Card Theme
  static final CardThemeData cardTheme = CardThemeData(
    elevation: 8,
    shadowColor: Colors.black.withOpacity(0.3),
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(20),
    ),
    color: Colors.white.withOpacity(0.1),
  );
  
  // App Bar Theme
  static const AppBarTheme appBarTheme = AppBarTheme(
    backgroundColor: Colors.transparent,
    elevation: 0,
    iconTheme: IconThemeData(color: Colors.white),
    titleTextStyle: TextStyle(
      color: Colors.white,
      fontSize: 20,
      fontWeight: FontWeight.w600,
    ),
  );
  
  // Main Theme
  static ThemeData get lightTheme {
    return ThemeData(
      primarySwatch: vanimalPurpleSwatch,
      primaryColor: vanimalPurple,
      scaffoldBackgroundColor: spaceBackground,
      
      // Text Theme
      textTheme: const TextTheme(
        headlineLarge: headlineLarge,
        headlineMedium: headlineMedium,
        headlineSmall: headlineSmall,
        bodyLarge: bodyLarge,
        bodyMedium: bodyMedium,
        bodySmall: bodySmall,
        labelLarge: labelLarge,
      ),
      
      // Component Themes
      appBarTheme: appBarTheme,
      cardTheme: cardTheme,
      inputDecorationTheme: inputDecorationTheme,
      
      // Button Themes
      elevatedButtonTheme: ElevatedButtonThemeData(style: primaryButtonStyle),
      
      // Icon Theme
      iconTheme: const IconThemeData(
        color: Colors.white,
        size: 24,
      ),
      
      // Floating Action Button Theme
      floatingActionButtonTheme: const FloatingActionButtonThemeData(
        backgroundColor: vanimalPurple,
        foregroundColor: Colors.white,
        elevation: 8,
      ),
      
      // Bottom Navigation Bar Theme
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: Colors.black,
        selectedItemColor: vanimalPurple,
        unselectedItemColor: lightGray,
        type: BottomNavigationBarType.fixed,
      ),
      
      // Drawer Theme
      drawerTheme: DrawerThemeData(
        backgroundColor: spaceBackground,
        scrimColor: Colors.black.withOpacity(0.6),
      ),
      
      // Progress Indicator Theme
      progressIndicatorTheme: const ProgressIndicatorThemeData(
        color: vanimalPurple,
        linearTrackColor: midGrey,
      ),
      
      // Divider Theme
      dividerTheme: DividerThemeData(
        color: Colors.white.withOpacity(0.2),
        thickness: 1,
      ),
    );
  }
}