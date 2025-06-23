class User {
  final String id;
  final String privyId;
  final String? email;
  final String name;
  final int experience;
  final int level;
  final String animalId;
  final Animal animal;
  final List<Habit> habits;
  final List<Milestone> milestones;
  final List<Integration> integrations;
  final DateTime createdAt;

  User({
    required this.id,
    required this.privyId,
    this.email,
    required this.name,
    required this.experience,
    required this.level,
    required this.animalId,
    required this.animal,
    required this.habits,
    required this.milestones,
    required this.integrations,
    required this.createdAt,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'],
      privyId: json['privyId'],
      email: json['email'],
      name: json['name'],
      experience: json['experience'],
      level: json['level'],
      animalId: json['animalId'],
      animal: Animal.fromJson(json['animal']),
      habits: (json['habits'] as List<dynamic>?)
          ?.map((h) => Habit.fromJson(h))
          .toList() ?? [],
      milestones: (json['milestones'] as List<dynamic>?)
          ?.map((m) => Milestone.fromJson(m))
          .toList() ?? [],
      integrations: (json['integrations'] as List<dynamic>?)
          ?.map((i) => Integration.fromJson(i))
          .toList() ?? [],
      createdAt: DateTime.parse(json['createdAt']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'privyId': privyId,
      'email': email,
      'name': name,
      'experience': experience,
      'level': level,
      'animalId': animalId,
      'animal': animal.toJson(),
      'habits': habits.map((h) => h.toJson()).toList(),
      'milestones': milestones.map((m) => m.toJson()).toList(),
      'integrations': integrations.map((i) => i.toJson()).toList(),
      'createdAt': createdAt.toIso8601String(),
    };
  }
}

class Animal {
  final String id;
  final String name;
  final String imageUrl;
  final DateTime createdAt;

  Animal({
    required this.id,
    required this.name,
    required this.imageUrl,
    required this.createdAt,
  });

  factory Animal.fromJson(Map<String, dynamic> json) {
    return Animal(
      id: json['id'],
      name: json['name'],
      imageUrl: json['imageUrl'],
      createdAt: DateTime.parse(json['createdAt']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'imageUrl': imageUrl,
      'createdAt': createdAt.toIso8601String(),
    };
  }
}

class Habit {
  final String id;
  final String title;
  final String frequency;
  final String userId;
  final DateTime createdAt;

  Habit({
    required this.id,
    required this.title,
    required this.frequency,
    required this.userId,
    required this.createdAt,
  });

  factory Habit.fromJson(Map<String, dynamic> json) {
    return Habit(
      id: json['id'],
      title: json['title'],
      frequency: json['frequency'],
      userId: json['userId'],
      createdAt: DateTime.parse(json['createdAt']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'frequency': frequency,
      'userId': userId,
      'createdAt': createdAt.toIso8601String(),
    };
  }
}

class Milestone {
  final String id;
  final String title;
  final bool achieved;
  final String userId;
  final DateTime createdAt;

  Milestone({
    required this.id,
    required this.title,
    required this.achieved,
    required this.userId,
    required this.createdAt,
  });

  factory Milestone.fromJson(Map<String, dynamic> json) {
    return Milestone(
      id: json['id'],
      title: json['title'],
      achieved: json['achieved'],
      userId: json['userId'],
      createdAt: DateTime.parse(json['createdAt']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'achieved': achieved,
      'userId': userId,
      'createdAt': createdAt.toIso8601String(),
    };
  }
}

class Integration {
  final String id;
  final String userId;
  final String provider;
  final String providerId;
  final String? accessToken;
  final String? refreshToken;
  final bool isActive;
  final DateTime? lastSync;
  final String? syncFrequency;
  final Map<String, dynamic>? metadata;
  final DateTime createdAt;
  final DateTime updatedAt;

  Integration({
    required this.id,
    required this.userId,
    required this.provider,
    required this.providerId,
    this.accessToken,
    this.refreshToken,
    required this.isActive,
    this.lastSync,
    this.syncFrequency,
    this.metadata,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Integration.fromJson(Map<String, dynamic> json) {
    return Integration(
      id: json['id'],
      userId: json['userId'],
      provider: json['provider'],
      providerId: json['providerId'],
      accessToken: json['accessToken'],
      refreshToken: json['refreshToken'],
      isActive: json['isActive'],
      lastSync: json['lastSync'] != null ? DateTime.parse(json['lastSync']) : null,
      syncFrequency: json['syncFrequency'],
      metadata: json['metadata'] as Map<String, dynamic>?,
      createdAt: DateTime.parse(json['createdAt']),
      updatedAt: DateTime.parse(json['updatedAt']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'userId': userId,
      'provider': provider,
      'providerId': providerId,
      'accessToken': accessToken,
      'refreshToken': refreshToken,
      'isActive': isActive,
      'lastSync': lastSync?.toIso8601String(),
      'syncFrequency': syncFrequency,
      'metadata': metadata,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }
}