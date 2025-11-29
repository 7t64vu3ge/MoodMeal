import React, { useState, useCallback } from 'react'
import { View, Text, StyleSheet, ScrollView, Dimensions, RefreshControl } from 'react-native'
import { LineChart } from 'react-native-chart-kit'
import { useFocusEffect } from '@react-navigation/native'
import { StorageService } from '../services/StorageService'
import Card from '../components/Card'
import { useTheme } from '../context/ThemeContext'
import { SPACING, FONTS, SHADOWS } from '../constants/theme'

const screenWidth = Dimensions.get('window').width

export default function AnalyticsScreen() {
  const { theme } = useTheme()
  const [moodData, setMoodData] = useState(null)
  const [correlations, setCorrelations] = useState([])
  const [refreshing, setRefreshing] = useState(false)

  const loadData = async () => {
    const meals = await StorageService.getMeals()
    const moods = await StorageService.getMoods()
    processData(meals, moods)
  }

  const processData = (meals, moods) => {
    // 1. prepare chart data (last 7 days)
    if (moods.length > 0) {
      // sort moods by time
      const sortedMoods = [...moods].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))

      // take last 7 entries for simplicity
      const recentMoods = sortedMoods.slice(-7)

      const labels = recentMoods.map(m => {
        const date = new Date(m.timestamp)
        return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`
      })
      const dataPoints = recentMoods.map(m => m.value)

      setMoodData({
        labels,
        datasets: [{ data: dataPoints }]
      })
    } else {
      setMoodData(null)
    }

    // 2. simple correlation logic
    // find meals eaten within 2 hours before a "Happy" or "Energetic" mood (value >= 4)
    const positiveMoods = moods.filter(m => m.value >= 4)
    const correlationsFound = []

    positiveMoods.forEach(mood => {
      const moodTime = new Date(mood.timestamp).getTime()
      // look for meals 2 hours before
      const relevantMeals = meals.filter(meal => {
        const mealTime = new Date(meal.timestamp).getTime()
        const diff = moodTime - mealTime
        return diff > 0 && diff <= 2 * 60 * 60 * 1000 // 2 hours in ms
      })

      relevantMeals.forEach(meal => {
        correlationsFound.push({
          meal: meal.foodName,
          mood: mood.mood,
          emoji: mood.emoji
        })
      })
    })

    // remove duplicates and take top 5
    const uniqueCorrelations = [...new Set(correlationsFound.map(JSON.stringify))].map(JSON.parse)
    setCorrelations(uniqueCorrelations.slice(0, 5))
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

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />}
    >
      <Text style={[styles.title, { color: theme.text }]}>Mood Trends</Text>

      {moodData ? (
        <View style={styles.chartContainer}>
          <LineChart
            data={moodData}
            width={screenWidth - 40}
            height={220}
            chartConfig={{
              backgroundColor: theme.surface,
              backgroundGradientFrom: theme.surface,
              backgroundGradientTo: theme.surface,
              decimalPlaces: 0,
              color: (opacity = 1) => theme.primary,
              labelColor: (opacity = 1) => theme.text,
              style: {
                borderRadius: 16
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: theme.primary
              }
            }}
            bezier
            style={{
              marginVertical: SPACING.s,
              borderRadius: 16,
              ...SHADOWS.small
            }}
          />
          <Text style={[styles.chartHelp, { color: theme.textSecondary }]}>Recent mood history</Text>
        </View>
      ) : (
        <Card style={styles.emptyCard}>
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>Log some moods to see your trends!</Text>
        </Card>
      )}

      <Text style={[styles.title, { color: theme.text }]}>Insights</Text>
      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Meals that might have boosted your mood:</Text>

      {correlations.length > 0 ? (
        correlations.map((item, index) => (
          <Card key={index} style={[styles.insightCard, { borderLeftColor: theme.success }]}>
            <Text style={[styles.insightText, { color: theme.text }]}>
              You felt <Text style={{ fontWeight: 'bold', color: theme.success }}>{item.mood} {item.emoji}</Text> after eating <Text style={{ fontWeight: 'bold', color: theme.primary }}>{item.meal}</Text>.
            </Text>
          </Card>
        ))
      ) : (
        <Card style={styles.emptyCard}>
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            No patterns found yet. Try logging meals and moods consistently!
          </Text>
        </Card>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.m
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: SPACING.s,
    marginTop: SPACING.m,
    fontFamily: FONTS.bold
  },
  subtitle: {
    fontSize: 14,
    marginBottom: SPACING.m,
    fontFamily: FONTS.regular
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: SPACING.l
  },
  chartHelp: {
    fontSize: 12,
    marginTop: SPACING.xs,
    fontFamily: FONTS.regular
  },
  emptyCard: {
    padding: SPACING.xl,
    alignItems: 'center'
  },
  emptyText: {
    textAlign: 'center',
    fontFamily: FONTS.regular
  },
  insightCard: {
    borderLeftWidth: 5
  },
  insightText: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: FONTS.regular
  }
})
