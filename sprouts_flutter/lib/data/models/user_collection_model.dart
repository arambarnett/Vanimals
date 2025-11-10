class UserCollectionItem {
  final String id;
  final String name;
  final String species;
  final int level;
  final String rarity;
  final String? imagePath;
  final String? category;
  final int? healthPoints;
  final int? restScore;
  final int? waterScore;
  final int? foodScore;
  final String? mood;

  UserCollectionItem({
    required this.id,
    required this.name,
    required this.species,
    required this.level,
    required this.rarity,
    this.imagePath,
    this.category,
    this.healthPoints,
    this.restScore,
    this.waterScore,
    this.foodScore,
    this.mood,
  });

  factory UserCollectionItem.fromHabit(dynamic habit) {
    // Parse the title format: "Cosmic Pigeon (Pigeon) - Level 5 - Common"
    final title = habit['title'] as String;
    final parts = title.split(' - ');
    
    if (parts.length >= 3) {
      final nameAndSpecies = parts[0];
      final levelPart = parts[1];
      final rarity = parts[2];
      
      // Extract name and species from "Cosmic Pigeon (Pigeon)"
      final speciesMatch = RegExp(r'\(([^)]+)\)').firstMatch(nameAndSpecies);
      final species = speciesMatch?.group(1) ?? 'Unknown';
      final name = nameAndSpecies.replaceAll(RegExp(r'\s*\([^)]+\)'), '');
      
      // Extract level from "Level 5"
      final levelMatch = RegExp(r'Level (\d+)').firstMatch(levelPart);
      final level = int.tryParse(levelMatch?.group(1) ?? '1') ?? 1;
      
      return UserCollectionItem(
        id: habit['id'] as String,
        name: name,
        species: species,
        level: level,
        rarity: rarity,
        imagePath: 'assets/images/animals/${species.toLowerCase()}.png',
      );
    }
    
    // Fallback for malformed titles
    return UserCollectionItem(
      id: habit['id'] as String,
      name: title,
      species: 'Unknown',
      level: 1,
      rarity: 'Common',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'species': species,
      'level': level,
      'rarity': rarity,
      'imagePath': imagePath,
      'category': category,
      'healthPoints': healthPoints,
      'restScore': restScore,
      'waterScore': waterScore,
      'foodScore': foodScore,
      'mood': mood,
    };
  }
}