import React from 'react'
import { View, StyleSheet } from 'react-native'
import { useTheme } from '../context/ThemeContext'
import { SPACING, SHADOWS } from '../constants/theme'

export default function Card({ children, style }) {
    const { theme } = useTheme()

    // render card view
    return (
        <View style={[
            styles.card,
            { backgroundColor: theme.surface, borderColor: theme.border },
            style
        ]}>
            {children}
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 16,
        padding: SPACING.m,
        marginVertical: SPACING.s,
        ...SHADOWS.small,
        borderWidth: 1
    }
})
