import React, { createContext, useState, useEffect, useContext } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { lightTheme, darkTheme } from '../constants/theme'

const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(false)
    const theme = isDark ? darkTheme : lightTheme

    // load theme when app starts
    useEffect(() => {
        loadTheme()
        // console.log("theme loaded")
    }, [])

    const loadTheme = async () => {
        try {
            // get saved theme from storage
            const savedTheme = await AsyncStorage.getItem('theme')
            if (savedTheme === 'dark') {
                setIsDark(true)
            }
        } catch (e) {
            // console.log(e)
            console.error('Failed to load theme', e)
        }
    }

    const toggleTheme = async () => {
        try {
            const newIsDark = !isDark
            setIsDark(newIsDark)
            // save preference
            await AsyncStorage.setItem('theme', newIsDark ? 'dark' : 'light')
        } catch (e) {
            console.error('Failed to save theme', e)
        }
    }

    return (
        <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = () => useContext(ThemeContext)
