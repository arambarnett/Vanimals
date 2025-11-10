import WidgetKit
import SwiftUI

struct Provider: TimelineProvider {
    func placeholder(in context: Context) -> SproutEntry {
        SproutEntry(date: Date(), sproutName: "My Sprout", health: 85, sproutType: "dragon", goalProgress: 75, goalName: "Daily Steps")
    }

    func getSnapshot(in context: Context, completion: @escaping (SproutEntry) -> ()) {
        let entry = SproutEntry(date: Date(), sproutName: "My Sprout", health: 85, sproutType: "dragon", goalProgress: 75, goalName: "Daily Steps")
        completion(entry)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<Entry>) -> ()) {
        // Read data from App Group shared preferences
        let sharedDefaults = UserDefaults(suiteName: "group.com.sprouts.app")

        let sproutName = sharedDefaults?.string(forKey: "sprout_name") ?? "My Sprout"
        let health = sharedDefaults?.integer(forKey: "sprout_health") ?? 50
        let sproutType = sharedDefaults?.string(forKey: "sprout_type") ?? "dragon"
        let goalProgress = sharedDefaults?.integer(forKey: "goal_progress") ?? 0
        let goalName = sharedDefaults?.string(forKey: "goal_name") ?? "No active goal"

        let entry = SproutEntry(
            date: Date(),
            sproutName: sproutName,
            health: health,
            sproutType: sproutType,
            goalProgress: goalProgress,
            goalName: goalName
        )

        // Update every 15 minutes
        let timeline = Timeline(entries: [entry], policy: .after(Date().addingTimeInterval(15 * 60)))
        completion(timeline)
    }
}

struct SproutEntry: TimelineEntry {
    let date: Date
    let sproutName: String
    let health: Int
    let sproutType: String
    let goalProgress: Int
    let goalName: String
}

struct SproutWidgetEntryView : View {
    var entry: Provider.Entry
    @Environment(\.widgetFamily) var family

    var body: some View {
        switch family {
        case .systemSmall:
            SmallWidgetView(entry: entry)
        case .systemMedium:
            MediumWidgetView(entry: entry)
        case .systemLarge:
            LargeWidgetView(entry: entry)
        @unknown default:
            SmallWidgetView(entry: entry)
        }
    }
}

// Small Widget (2x2)
struct SmallWidgetView: View {
    var entry: SproutEntry

    var body: some View {
        ZStack {
            LinearGradient(
                gradient: Gradient(colors: [Color(red: 0.43, green: 0.40, blue: 0.96), Color(red: 0.26, green: 0.10, blue: 0.18)]),
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )

            VStack(spacing: 8) {
                // Sprout emoji/icon
                Text(sproutEmoji(for: entry.sproutType))
                    .font(.system(size: 50))

                // Sprout name
                Text(entry.sproutName)
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundColor(.white)
                    .lineLimit(1)

                // Health bar
                VStack(spacing: 4) {
                    HStack {
                        Image(systemName: "heart.fill")
                            .font(.system(size: 10))
                            .foregroundColor(.red)
                        Text("\(entry.health)%")
                            .font(.system(size: 10, weight: .bold))
                            .foregroundColor(.white)
                    }

                    GeometryReader { geometry in
                        ZStack(alignment: .leading) {
                            RoundedRectangle(cornerRadius: 4)
                                .fill(Color.white.opacity(0.3))
                                .frame(height: 6)

                            RoundedRectangle(cornerRadius: 4)
                                .fill(healthColor(for: entry.health))
                                .frame(width: geometry.size.width * CGFloat(entry.health) / 100, height: 6)
                        }
                    }
                    .frame(height: 6)
                }
                .padding(.horizontal, 8)
            }
            .padding()
        }
    }
}

// Medium Widget (4x2)
struct MediumWidgetView: View {
    var entry: SproutEntry

    var body: some View {
        ZStack {
            LinearGradient(
                gradient: Gradient(colors: [Color(red: 0.43, green: 0.40, blue: 0.96), Color(red: 0.26, green: 0.10, blue: 0.18)]),
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )

            HStack(spacing: 16) {
                // Left side - Sprout
                VStack(spacing: 8) {
                    Text(sproutEmoji(for: entry.sproutType))
                        .font(.system(size: 60))

                    Text(entry.sproutName)
                        .font(.system(size: 16, weight: .semibold))
                        .foregroundColor(.white)
                        .lineLimit(1)

                    // Health bar
                    VStack(spacing: 4) {
                        HStack {
                            Image(systemName: "heart.fill")
                                .font(.system(size: 10))
                                .foregroundColor(.red)
                            Text("\(entry.health)%")
                                .font(.system(size: 12, weight: .bold))
                                .foregroundColor(.white)
                        }

                        GeometryReader { geometry in
                            ZStack(alignment: .leading) {
                                RoundedRectangle(cornerRadius: 4)
                                    .fill(Color.white.opacity(0.3))
                                    .frame(height: 8)

                                RoundedRectangle(cornerRadius: 4)
                                    .fill(healthColor(for: entry.health))
                                    .frame(width: geometry.size.width * CGFloat(entry.health) / 100, height: 8)
                            }
                        }
                        .frame(height: 8)
                    }
                }
                .frame(maxWidth: .infinity)

                // Right side - Goal Progress
                VStack(alignment: .leading, spacing: 8) {
                    Text("Current Goal")
                        .font(.system(size: 12, weight: .semibold))
                        .foregroundColor(.white.opacity(0.8))

                    Text(entry.goalName)
                        .font(.system(size: 14, weight: .bold))
                        .foregroundColor(.white)
                        .lineLimit(2)

                    Spacer()

                    // Goal progress
                    VStack(spacing: 4) {
                        HStack {
                            Image(systemName: "target")
                                .font(.system(size: 10))
                                .foregroundColor(.green)
                            Text("\(entry.goalProgress)%")
                                .font(.system(size: 12, weight: .bold))
                                .foregroundColor(.white)
                        }

                        GeometryReader { geometry in
                            ZStack(alignment: .leading) {
                                RoundedRectangle(cornerRadius: 4)
                                    .fill(Color.white.opacity(0.3))
                                    .frame(height: 8)

                                RoundedRectangle(cornerRadius: 4)
                                    .fill(Color.green)
                                    .frame(width: geometry.size.width * CGFloat(entry.goalProgress) / 100, height: 8)
                            }
                        }
                        .frame(height: 8)
                    }
                }
                .frame(maxWidth: .infinity)
            }
            .padding()
        }
    }
}

// Large Widget (4x4)
struct LargeWidgetView: View {
    var entry: SproutEntry

    var body: some View {
        ZStack {
            LinearGradient(
                gradient: Gradient(colors: [Color(red: 0.43, green: 0.40, blue: 0.96), Color(red: 0.26, green: 0.10, blue: 0.18)]),
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )

            VStack(spacing: 16) {
                // Title
                HStack {
                    Image(systemName: "leaf.fill")
                        .foregroundColor(.green)
                    Text("My Sprout")
                        .font(.system(size: 20, weight: .bold))
                        .foregroundColor(.white)
                    Spacer()
                }
                .padding(.horizontal)

                // Sprout Display
                VStack(spacing: 12) {
                    Text(sproutEmoji(for: entry.sproutType))
                        .font(.system(size: 100))

                    Text(entry.sproutName)
                        .font(.system(size: 24, weight: .bold))
                        .foregroundColor(.white)

                    // Health bar
                    VStack(spacing: 6) {
                        HStack {
                            Image(systemName: "heart.fill")
                                .font(.system(size: 12))
                                .foregroundColor(.red)
                            Text("Health: \(entry.health)%")
                                .font(.system(size: 14, weight: .bold))
                                .foregroundColor(.white)
                        }

                        GeometryReader { geometry in
                            ZStack(alignment: .leading) {
                                RoundedRectangle(cornerRadius: 6)
                                    .fill(Color.white.opacity(0.3))
                                    .frame(height: 12)

                                RoundedRectangle(cornerRadius: 6)
                                    .fill(healthColor(for: entry.health))
                                    .frame(width: geometry.size.width * CGFloat(entry.health) / 100, height: 12)
                            }
                        }
                        .frame(height: 12)
                    }
                    .padding(.horizontal)
                }

                Divider()
                    .background(Color.white.opacity(0.5))
                    .padding(.horizontal)

                // Goal Progress
                VStack(alignment: .leading, spacing: 12) {
                    HStack {
                        Image(systemName: "target")
                            .foregroundColor(.green)
                        Text("Current Goal")
                            .font(.system(size: 16, weight: .semibold))
                            .foregroundColor(.white)
                    }

                    Text(entry.goalName)
                        .font(.system(size: 18, weight: .bold))
                        .foregroundColor(.white)
                        .lineLimit(2)

                    VStack(spacing: 6) {
                        HStack {
                            Text("Progress: \(entry.goalProgress)%")
                                .font(.system(size: 14, weight: .semibold))
                                .foregroundColor(.white)
                        }

                        GeometryReader { geometry in
                            ZStack(alignment: .leading) {
                                RoundedRectangle(cornerRadius: 6)
                                    .fill(Color.white.opacity(0.3))
                                    .frame(height: 12)

                                RoundedRectangle(cornerRadius: 6)
                                    .fill(Color.green)
                                    .frame(width: geometry.size.width * CGFloat(entry.goalProgress) / 100, height: 12)
                            }
                        }
                        .frame(height: 12)
                    }
                }
                .padding(.horizontal)

                Spacer()
            }
            .padding(.vertical)
        }
    }
}

// Helper functions
func sproutEmoji(for type: String) -> String {
    switch type.lowercased() {
    case "dragon":
        return "🐉"
    case "cat":
        return "🐱"
    case "dog":
        return "🐶"
    case "bird":
        return "🐦"
    case "fish":
        return "🐠"
    case "plant":
        return "🌱"
    default:
        return "🌟"
    }
}

func healthColor(for health: Int) -> Color {
    if health >= 70 {
        return Color.green
    } else if health >= 40 {
        return Color.orange
    } else {
        return Color.red
    }
}

@main
struct SproutWidget: Widget {
    let kind: String = "SproutWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            SproutWidgetEntryView(entry: entry)
        }
        .configurationDisplayName("My Sprout")
        .description("Keep track of your Sprout's health and goals.")
        .supportedFamilies([.systemSmall, .systemMedium, .systemLarge])
    }
}

struct SproutWidget_Previews: PreviewProvider {
    static var previews: some View {
        Group {
            SproutWidgetEntryView(entry: SproutEntry(date: Date(), sproutName: "Dragon", health: 85, sproutType: "dragon", goalProgress: 75, goalName: "Daily Steps"))
                .previewContext(WidgetPreviewContext(family: .systemSmall))

            SproutWidgetEntryView(entry: SproutEntry(date: Date(), sproutName: "Dragon", health: 85, sproutType: "dragon", goalProgress: 75, goalName: "Daily Steps"))
                .previewContext(WidgetPreviewContext(family: .systemMedium))

            SproutWidgetEntryView(entry: SproutEntry(date: Date(), sproutName: "Dragon", health: 85, sproutType: "dragon", goalProgress: 75, goalName: "Daily Steps"))
                .previewContext(WidgetPreviewContext(family: .systemLarge))
        }
    }
}
