import 'package:equatable/equatable.dart';

class VanimalModel extends Equatable {
  final String id;
  final String name;
  final String species;
  final String location;
  final String habitat;
  final VanimalStats stats;
  final VanimalVisuals visuals;
  final VanimalState state;
  final DateTime createdAt;
  final DateTime updatedAt;

  const VanimalModel({
    required this.id,
    required this.name,
    required this.species,
    required this.location,
    required this.habitat,
    required this.stats,
    required this.visuals,
    required this.state,
    required this.createdAt,
    required this.updatedAt,
  });

  factory VanimalModel.fromJson(Map<String, dynamic> json) {
    return VanimalModel(
      id: json['id'] as String,
      name: json['name'] as String,
      species: json['species'] as String,
      location: json['location'] as String,
      habitat: json['habitat'] as String,
      stats: VanimalStats.fromJson(json['stats'] as Map<String, dynamic>),
      visuals: VanimalVisuals.fromJson(json['visuals'] as Map<String, dynamic>),
      state: VanimalState.fromJson(json['state'] as Map<String, dynamic>),
      createdAt: DateTime.parse(json['created_at'] as String),
      updatedAt: DateTime.parse(json['updated_at'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'species': species,
      'location': location,
      'habitat': habitat,
      'stats': stats.toJson(),
      'visuals': visuals.toJson(),
      'state': state.toJson(),
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
    };
  }

  VanimalModel copyWith({
    String? id,
    String? name,
    String? species,
    String? location,
    String? habitat,
    VanimalStats? stats,
    VanimalVisuals? visuals,
    VanimalState? state,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return VanimalModel(
      id: id ?? this.id,
      name: name ?? this.name,
      species: species ?? this.species,
      location: location ?? this.location,
      habitat: habitat ?? this.habitat,
      stats: stats ?? this.stats,
      visuals: visuals ?? this.visuals,
      state: state ?? this.state,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }

  @override
  List<Object> get props => [
        id,
        name,
        species,
        location,
        habitat,
        stats,
        visuals,
        state,
        createdAt,
        updatedAt,
      ];
}

class VanimalStats extends Equatable {
  final int speed;
  final int strength;
  final int intelligence;
  final int size;
  final int versatility;
  final int reproductiveSpeed;

  const VanimalStats({
    required this.speed,
    required this.strength,
    required this.intelligence,
    required this.size,
    required this.versatility,
    required this.reproductiveSpeed,
  });

  factory VanimalStats.fromJson(Map<String, dynamic> json) {
    return VanimalStats(
      speed: json['speed'] as int,
      strength: json['strength'] as int,
      intelligence: json['intelligence'] as int,
      size: json['size'] as int,
      versatility: json['versatility'] as int,
      reproductiveSpeed: json['reproductive_speed'] as int,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'speed': speed,
      'strength': strength,
      'intelligence': intelligence,
      'size': size,
      'versatility': versatility,
      'reproductive_speed': reproductiveSpeed,
    };
  }

  @override
  List<Object> get props => [
        speed,
        strength,
        intelligence,
        size,
        versatility,
        reproductiveSpeed,
      ];
}

class VanimalVisuals extends Equatable {
  final String logo;
  final String logoDetailed;
  final String bgImage;
  final String modelPath;
  final double modelScale;
  final String childNodeName;
  final bool runningEnabled;

  const VanimalVisuals({
    required this.logo,
    required this.logoDetailed,
    required this.bgImage,
    required this.modelPath,
    required this.modelScale,
    required this.childNodeName,
    required this.runningEnabled,
  });

  factory VanimalVisuals.fromJson(Map<String, dynamic> json) {
    return VanimalVisuals(
      logo: json['logo'] as String,
      logoDetailed: json['logo_detailed'] as String,
      bgImage: json['bg_image'] as String,
      modelPath: json['model_path'] as String,
      modelScale: (json['model_scale'] as num).toDouble(),
      childNodeName: json['child_node_name'] as String,
      runningEnabled: json['running_enabled'] as bool,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'logo': logo,
      'logo_detailed': logoDetailed,
      'bg_image': bgImage,
      'model_path': modelPath,
      'model_scale': modelScale,
      'child_node_name': childNodeName,
      'running_enabled': runningEnabled,
    };
  }

  @override
  List<Object> get props => [
        logo,
        logoDetailed,
        bgImage,
        modelPath,
        modelScale,
        childNodeName,
        runningEnabled,
      ];
}

class VanimalState extends Equatable {
  final double feedLevel; // 0.0 - 1.0
  final double sleepLevel; // 0.0 - 1.0
  final DateTime lastFed;
  final DateTime lastSlept;
  final int experience;
  final int level;

  const VanimalState({
    required this.feedLevel,
    required this.sleepLevel,
    required this.lastFed,
    required this.lastSlept,
    required this.experience,
    required this.level,
  });

  factory VanimalState.fromJson(Map<String, dynamic> json) {
    return VanimalState(
      feedLevel: (json['feed_level'] as num).toDouble(),
      sleepLevel: (json['sleep_level'] as num).toDouble(),
      lastFed: DateTime.parse(json['last_fed'] as String),
      lastSlept: DateTime.parse(json['last_slept'] as String),
      experience: json['experience'] as int,
      level: json['level'] as int,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'feed_level': feedLevel,
      'sleep_level': sleepLevel,
      'last_fed': lastFed.toIso8601String(),
      'last_slept': lastSlept.toIso8601String(),
      'experience': experience,
      'level': level,
    };
  }

  VanimalState copyWith({
    double? feedLevel,
    double? sleepLevel,
    DateTime? lastFed,
    DateTime? lastSlept,
    int? experience,
    int? level,
  }) {
    return VanimalState(
      feedLevel: feedLevel ?? this.feedLevel,
      sleepLevel: sleepLevel ?? this.sleepLevel,
      lastFed: lastFed ?? this.lastFed,
      lastSlept: lastSlept ?? this.lastSlept,
      experience: experience ?? this.experience,
      level: level ?? this.level,
    );
  }

  @override
  List<Object> get props => [
        feedLevel,
        sleepLevel,
        lastFed,
        lastSlept,
        experience,
        level,
      ];
}

enum VanimalLocation {
  northAmerica,
  singapore,
  southAmerica,
  antarctica,
}

enum VanimalHabitat {
  jungle,
  sahara,
  tundra,
  urban,
}

enum VanimalAnimation {
  idle,
  walk,
  dance,
  shake,
  hop,
}