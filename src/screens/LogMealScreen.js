import { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LogMealScreen() {
  const [meal, setMeal] = useState('');

  const saveMeal = async () => {
    const existing = JSON.parse(await AsyncStorage.getItem('meals')) || [];
    existing.push({ meal, time: new Date().toISOString() });
    await AsyncStorage.setItem('meals', JSON.stringify(existing));
    setMeal('');
    alert('Meal saved!');
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18 }}>Enter your meal:</Text>
      <TextInput
        value={meal}
        onChangeText={setMeal}
        placeholder="e.g. Rice & Vegetables"
        style={{ borderWidth: 1, marginVertical: 10, padding: 8 }}
      />
      <Button title="Save Meal" onPress={saveMeal} />
    </View>
  );
}
