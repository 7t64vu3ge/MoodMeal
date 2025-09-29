import { View, Text, Button } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 22, marginBottom: 20 }}>MoodMeal</Text>
      <Button title="Log Meal" onPress={() => navigation.navigate('LogMeal')} />
      <Button title="Log Mood" onPress={() => navigation.navigate('LogMood')} />
      <Button title="Analytics" onPress={() => navigation.navigate('Analytics')} />
    </View>
  );
}
