package com.sprouts.app

import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.widget.RemoteViews
import es.antonborri.home_widget.HomeWidgetPlugin

class SproutWidgetProvider : AppWidgetProvider() {
    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray
    ) {
        for (appWidgetId in appWidgetIds) {
            // Get widget data from shared preferences
            val widgetData = HomeWidgetPlugin.getData(context)
            val sproutName = widgetData.getString("sprout_name", "My Sprout")
            val health = widgetData.getInt("sprout_health", 50)
            val sproutType = widgetData.getString("sprout_type", "dragon")
            val goalProgress = widgetData.getInt("goal_progress", 0)
            val goalName = widgetData.getString("goal_name", "No active goal")

            // Create widget views
            val views = RemoteViews(context.packageName, R.layout.sprout_widget)

            // Update widget views
            views.setTextViewText(R.id.sprout_name, sproutName)
            views.setTextViewText(R.id.health_text, "$health%")
            views.setProgressBar(R.id.health_bar, 100, health, false)
            views.setTextViewText(R.id.goal_name, goalName)
            views.setTextViewText(R.id.goal_progress, "$goalProgress%")
            views.setProgressBar(R.id.goal_bar, 100, goalProgress, false)

            // Set sprout emoji based on type
            val emoji = when (sproutType.lowercase()) {
                "dragon" -> "🐉"
                "cat" -> "🐱"
                "dog" -> "🐶"
                "bird" -> "🐦"
                "fish" -> "🐠"
                "plant" -> "🌱"
                else -> "🌟"
            }
            views.setTextViewText(R.id.sprout_emoji, emoji)

            // Update the widget
            appWidgetManager.updateAppWidget(appWidgetId, views)
        }
    }
}
