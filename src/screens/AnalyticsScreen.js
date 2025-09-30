import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button, Dimensions, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

export default function AnalyticsScreen() {
  const [meals, setMeals] = useState([]);
  const [moods, setMoods] = useState([]);
  const [patterns, setPatterns] = useState([]);
  const [filter, setFilter] = useState('all'); // today | week | all

  useEffect(() => {
    const loadData = async () => {
      const storedMeals = JSON.parse(await AsyncStorage.getItem('meals')) || [];
      const storedMoods = JSON.parse(await AsyncStorage.getItem('moods')) || [];
      setMeals(storedMeals);
      setMoods(storedMoods);

      const foundPatterns = computePatterns(storedMeals, storedMoods, filter);
      setPatterns(foundPatterns);
    };

    loadData();
  }, [filter]);

  const computePatterns = (meals, moods, filterType) => {
    let result = {};

    const now = new Date();
    let filteredMoods = moods;

    if (filterType === 'today') {
      filteredMoods = moods.filter(
        (m) => new Date(m.time).toDateString() === now.toDateString()
      );
    } else if (filterType === 'week') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(now.getDate() - 7);
      filteredMoods = moods.filter((m) => new Date(m.time) >= oneWeekAgo);
    }

    filteredMoods.forEach((moodEntry) => {
      const moodTime = new Date(moodEntry.time);

      const previousMeals = meals.filter(
        (meal) => new Date(meal.time) <= moodTime
      );
      if (previousMeals.length === 0) return;

      const lastMeal = previousMeals[previousMeals.length - 1];

      if (!result[lastMeal.meal]) {
        result[lastMeal.meal] = {};
      }
      if (!result[lastMeal.meal][moodEntry.mood]) {
        result[lastMeal.meal][moodEntry.mood] = 0;
      }
      result[lastMeal.meal][moodEntry.mood] += 1;
    });

    return Object.entries(result).map(([meal, moodCounts]) => {
      const total = Object.values(moodCounts).reduce((a, b) => a + b, 0);
      const moodPercents = {};
      Object.entries(moodCounts).forEach(([mood, count]) => {
        moodPercents[mood] = ((count / total) * 100).toFixed(1);
      });
      return { meal, moods: moodPercents, total };
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Meal → Mood Correlations</Text>

      <View style={styles.filterRow}>
        <Button title="Today" onPress={() => setFilter('today')} />
        <Button title="Last 7 Days" onPress={() => setFilter('week')} />
        <Button title="All Time" onPress={() => setFilter('all')} />
      </View>

      {patterns.length === 0 ? (
        <Text style={styles.empty}>Not enough data yet.</Text>
      ) : (
        patterns.map((item, index) => {
          const chartData = Object.entries(item.moods).map(([mood, percent], i) => ({
            name: `${mood} (${percent}%)`,
            population: parseFloat(percent),
            color: chartColors[i % chartColors.length],
            legendFontColor: '#333',
            legendFontSize: 14,
          }));

          return (
            <View key={index} style={styles.patternBox}>
              <Text style={styles.meal}>{item.meal} (n={item.total})</Text>
              {Object.entries(item.moods).map(([mood, percent], i) => (
                <Text key={i} style={styles.mood}>
                  → {mood}: {percent}%
                </Text>
              ))}
              <PieChart
                data={chartData}
                width={screenWidth - 40}
                height={180}
                chartConfig={{
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
              />
            </View>
          );
        })
      )}
    </ScrollView>
  );
}

const chartColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  heading: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  empty: { fontSize: 14, color: 'gray', fontStyle: 'italic' },
  patternBox: {
    marginBottom: 25,
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  meal: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  mood: { fontSize: 16, marginLeft: 10 },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
});
