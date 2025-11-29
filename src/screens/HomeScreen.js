import React, { useState, useCallback } from 'react'
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { StorageService } from '../services/StorageService'
import Card from '../components/Card'
import { useTheme } from '../context/ThemeContext'
import { SPACING, FONTS, SHADOWS } from '../constants/theme'

export default function HomeScreen({ navigation }) {
  const { theme } = useTheme()
  const [recentMeals, setRecentMeals] = useState([])
  const [recentMoods, setRecentMoods] = useState([])
  const [refreshing, setRefreshing] = useState(false)

  // load data from storage
  const loadData = async () => {
    // console.log("loading data")
    const meals = await StorageService.getMeals()
    const moods = await StorageService.getMoods()
    setRecentMeals(meals.slice(0, 3)) // show last 3
    setRecentMoods(moods.slice(0, 3)) // show last 3
  }

  useFocusEffect(
    useCallback(() => {
      loadData()
    }, [])
  )

  const onRefresh = async () => {
    setRefreshing(true)
    await loadData()
    setRefreshing(false)
  }

  const formatDate = (isoString) => {
    const date = new Date(isoString)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />
      }
    >
      <View style={styles.header}>
        <Text style={[styles.greeting, { color: theme.text }]}>Hello!</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Track your meals and mood.</Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Quick Actions</Text>
        <View style={styles.actionGrid}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.primary }]}
            onPress={() => navigation.navigate('LogMeal')}
          >
            <Text style={[styles.actionButtonText, { color: theme.surface }]}>Log Meal</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.secondary }]}
            onPress={() => navigation.navigate('LogMood')}
          >
            <Text style={[styles.actionButtonText, { color: theme.surface }]}>Log Mood</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.fullWidthButton, { backgroundColor: theme.surface, borderColor: theme.primary }]}
          onPress={() => navigation.navigate('Analytics')}
        >
          <Text style={[styles.fullWidthButtonText, { color: theme.primary }]}>View Analytics</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Meals</Text>
        {recentMeals.length === 0 ? (
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No meals logged yet.</Text>
        ) : (
          recentMeals.map((meal) => (
            <Card key={meal.id} style={styles.logCard}>
              <View>
                <Text style={[styles.logTitle, { color: theme.text }]}>{meal.foodName}</Text>
                <Text style={[styles.logSubtitle, { color: theme.textSecondary }]}>{meal.category}</Text>
              </View>
              <Text style={[styles.logTime, { color: theme.textSecondary }]}>{formatDate(meal.timestamp)}</Text>
            </Card>
          ))
        )}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Moods</Text>
        {recentMoods.length === 0 ? (
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No moods logged yet.</Text>
        ) : (
          recentMoods.map((mood) => (
            <Card key={mood.id} style={styles.logCard}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 24, marginRight: 10 }}>{mood.emoji}</Text>
                <Text style={[styles.logTitle, { color: theme.text }]}>{mood.mood}</Text>
              </View>
              <Text style={[styles.logTime, { color: theme.textSecondary }]}>{formatDate(mood.timestamp)}</Text>
            </Card>
          ))
        )}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.m
  },
  header: {
    marginBottom: SPACING.l,
    marginTop: SPACING.m
  },
  greeting: {
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: FONTS.bold
  },
  subtitle: {
    fontSize: 16,
    marginTop: SPACING.xs,
    fontFamily: FONTS.regular
  },
  section: {
    marginBottom: SPACING.xl
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: SPACING.s,
    fontFamily: FONTS.medium
  },
  actionGrid: {
    flexDirection: 'row',
    gap: SPACING.m,
    marginBottom: SPACING.m
  },
  actionButton: {
    flex: 1,
    paddingVertical: SPACING.l,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.medium
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: FONTS.bold
  },
  fullWidthButton: {
    paddingVertical: SPACING.m,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1
  },
  fullWidthButtonText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: FONTS.medium
  },
  logCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logTitle: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: FONTS.medium
  },
  logSubtitle: {
    fontSize: 14,
    marginTop: 2,
    fontFamily: FONTS.regular
  },
  logTime: {
    fontSize: 12,
    fontFamily: FONTS.regular
  },
  emptyText: {
    fontStyle: 'italic',
    marginLeft: SPACING.xs,
    fontFamily: FONTS.regular
  }
})
