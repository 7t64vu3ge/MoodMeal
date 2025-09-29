import { View, Button, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LogMoodScreen() {
  const moods = ['Happy', 'Neutral', 'Tired', 'Stressed'];

  const saveMood = async (mood) => {
    const existing = JSON.parse(await AsyncStorage.getItem('moods')) || [];
    existing.push({ mood, time: new Date().toISOString() });
    await AsyncStorage.setItem('moods', JSON.stringify(existing));
    alert(`Mood "${mood}" saved!`);
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>Select your mood:</Text>
      {moods.map((m, i) => (
        <Button key={i} title={m} onPress={() => saveMood(m)} />
      ))}
    </View>
  );
}
