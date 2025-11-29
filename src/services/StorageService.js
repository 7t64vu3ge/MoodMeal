import AsyncStorage from '@react-native-async-storage/async-storage'

// keys for storage
const MEALS_KEY = '@meals'
const MOODS_KEY = '@moods'

export const StorageService = {
  // save meal to storage
  saveMeal: async (meal) => {
    try {
      const existingMeals = await StorageService.getMeals()
      const newMeals = [meal, ...existingMeals]
      await AsyncStorage.setItem(MEALS_KEY, JSON.stringify(newMeals))
      // console.log("meal saved")
      return true
    } catch (e) {
      console.error(e)
      return false
    }
  },

  // get all meals
  getMeals: async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(MEALS_KEY)
      return jsonValue != null ? JSON.parse(jsonValue) : []
    } catch (e) {
      console.error(e)
      return []
    }
  },

  saveMood: async (mood) => {
    try {
      const existingMoods = await StorageService.getMoods()
      const newMoods = [mood, ...existingMoods]
      await AsyncStorage.setItem(MOODS_KEY, JSON.stringify(newMoods))
      // console.log("mood saved")
      return true
    } catch (e) {
      console.error(e)
      return false
    }
  },

  getMoods: async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(MOODS_KEY)
      return jsonValue != null ? JSON.parse(jsonValue) : []
    } catch (e) {
      console.error(e)
      return []
    }
  },

  // clear everything
  clearData: async () => {
    try {
      await AsyncStorage.multiRemove([MEALS_KEY, MOODS_KEY])
      return true
    } catch (e) {
      console.error(e)
      return false
    }
  }
}
