import React, { useState, useCallback } from 'react'
import { View, Text, StyleSheet, ScrollView, Dimensions, RefreshControl } from 'react-native'
import { LineChart, PieChart } from 'react-native-chart-kit'
import { useFocusEffect } from '@react-navigation/native'
import { StorageService } from '../services/StorageService'
import Card from '../components/Card'
import { useTheme } from '../context/ThemeContext'
import { SPACING, FONTS, SHADOWS } from '../constants/theme'

const screenWidth = Dimensions.get('window').width

export default function AnalyticsScreen() {
  const { theme } = useTheme()
  const [moodData, setMoodData] = useState(null)
  const [moodDistribution, setMoodDistribution] = useState([])
  const [positiveCorrelations, setPositiveCorrelations] = useState([])
  const [negativeCorrelations, setNegativeCorrelations] = useState([])
  const [topMeals, setTopMeals] = useState([])
  const [refreshing, setRefreshing] = useState(false)

  const loadData = async () => {
    const meals = await StorageService.getMeals()
    const moods = await StorageService.getMoods()
    processData(meals, moods)
  }

  const processData = (meals, moods) => {
    if (moods.length === 0) {
      setMoodData(null)
      setMoodDistribution([])
      return
    }

    
    const sortedMoods = [...moods].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
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

    const distribution = {}
    moods.forEach(m => {
      distribution[m.mood] = (distribution[m.mood] || 0) + 1
    })

    const pieData = Object.keys(distribution).map((mood, index) => {
      let color = '#BDC3C7' 
      if (['Happy', 'Energetic'].includes(mood)) color = '#2ECC71'
      if (['Neutral'].includes(mood)) color = '#F1C40F'
      if (['Sad', 'Tired', 'Stressed'].includes(mood)) color = '#E74C3C'

      return {
        name: mood,
        population: distribution[mood],
        color: color,
        legendFontColor: theme.textSecondary,
        legendFontSize: 12
      }
    })
    setMoodDistribution(pieData)

    const findCorrelations = (targetMoods) => {
      const found = []
      targetMoods.forEach(mood => {
        const moodTime = new Date(mood.timestamp).getTime()
        const relevantMeals = meals.filter(meal => {
          const mealTime = new Date(meal.timestamp).getTime()
          const diff = moodTime - mealTime
          return diff > 0 && diff <= 2 * 60 * 60 * 1000 // 2 hours
        })
        relevantMeals.forEach(meal => {
          found.push({ meal: meal.foodName, mood: mood.mood, emoji: mood.emoji })
        })
      })
      return [...new Set(found.map(JSON.stringify))].map(JSON.parse).slice(0, 3)
    }

    const positiveMoods = moods.filter(m => m.value >= 4)
    setPositiveCorrelations(findCorrelations(positiveMoods))

    const negativeMoods = moods.filter(m => m.value <= 2)
    setNegativeCorrelations(findCorrelations(negativeMoods))

    const mealCounts = {}
    meals.forEach(m => {
      mealCounts[m.foodName] = (mealCounts[m.foodName] || 0) + 1
    })
    const sortedMeals = Object.entries(mealCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }))
    setTopMeals(sortedMeals)
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
              style: { borderRadius: 16 },
              propsForDots: { r: '6', strokeWidth: '2', stroke: theme.primary }
            }}
            bezier
            style={styles.chart}
          />
        </View>
      ) : (
        <Text style={[styles.emptyText, { color: theme.textSecondary }]}>Not enough data for trends.</Text>
      )}

      <Text style={[styles.title, { color: theme.text }]}>Mood Distribution</Text>
      {moodDistribution.length > 0 ? (
        <View style={styles.chartContainer}>
          <PieChart
            data={moodDistribution}
            width={screenWidth - 40}
            height={220}
            chartConfig={{
              color: (opacity = 1) => theme.text,
            }}
            accessor={'population'}
            backgroundColor={'transparent'}
            paddingLeft={'15'}
            center={[10, 0]}
            absolute
          />
        </View>
      ) : (
        <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No moods logged yet.</Text>
      )}

      <Text style={[styles.title, { color: theme.text }]}>Insights</Text>


      {positiveCorrelations.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.subtitle, { color: theme.success }]}>Mood Boosters 🚀</Text>
          {positiveCorrelations.map((item, index) => (
            <Card key={`pos-${index}`} style={[styles.insightCard, { borderLeftColor: theme.success }]}>
              <Text style={[styles.insightText, { color: theme.text }]}>
                <Text style={{ fontWeight: 'bold' }}>{item.meal}</Text> followed by {item.emoji}
              </Text>
            </Card>
          ))}
        </View>
      )}

      {negativeCorrelations.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.subtitle, { color: theme.error }]}>Foods to Watch ⚠️</Text>
          {negativeCorrelations.map((item, index) => (
            <Card key={`neg-${index}`} style={[styles.insightCard, { borderLeftColor: theme.error }]}>
              <Text style={[styles.insightText, { color: theme.text }]}>
                <Text style={{ fontWeight: 'bold' }}>{item.meal}</Text> followed by {item.emoji}
              </Text>
            </Card>
          ))}
        </View>
      )}

      {/* Top Meals */}
      <View style={styles.section}>
        <Text style={[styles.subtitle, { color: theme.primary }]}>Frequent Meals 🍽️</Text>
        {topMeals.length > 0 ? (
          topMeals.map((item, index) => (
            <View key={index} style={[styles.row, { borderBottomColor: theme.border }]}>
              <Text style={[styles.rowText, { color: theme.text }]}>{item.name}</Text>
              <Text style={[styles.rowText, { color: theme.textSecondary }]}>{item.count}x</Text>
            </View>
          ))
        ) : (
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No meals logged yet.</Text>
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
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: SPACING.m,
    marginTop: SPACING.l,
    fontFamily: FONTS.bold
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: SPACING.s,
    marginTop: SPACING.s,
    fontFamily: FONTS.medium
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: SPACING.m,
    overflow: 'hidden' // fix for chart shadow clipping
  },
  chart: {
    marginVertical: SPACING.s,
    borderRadius: 16,
    ...SHADOWS.small
  },
  section: {
    marginBottom: SPACING.m
  },
  insightCard: {
    borderLeftWidth: 5,
    marginBottom: SPACING.s,
    paddingVertical: SPACING.s
  },
  insightText: {
    fontSize: 16,
    fontFamily: FONTS.regular
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.s,
    borderBottomWidth: 1
  },
  rowText: {
    fontSize: 16,
    fontFamily: FONTS.regular
  },
  emptyText: {
    fontStyle: 'italic',
    marginLeft: SPACING.xs,
    marginBottom: SPACING.m,
    fontFamily: FONTS.regular
  }
})
