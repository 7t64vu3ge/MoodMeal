import React, { useState } from 'react'
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert, ScrollView } from 'react-native'
import { useTheme } from '../context/ThemeContext'
import { StorageService } from '../services/StorageService'
import { SPACING, FONTS, SHADOWS } from '../constants/theme'

export default function SettingsScreen() {
    const { theme, isDark, toggleTheme } = useTheme()
    const [clearing, setClearing] = useState(false)

    const handleClearData = () => {
        // confirm before delete
        Alert.alert(
            'Clear All Data',
            'Are you sure you want to delete all your meal and mood logs? This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        setClearing(true)
                        const success = await StorageService.clearData()
                        setClearing(false)
                        if (success) {
                            Alert.alert('Success', 'All data has been cleared.')
                        } else {
                            Alert.alert('Error', 'Failed to clear data.')
                        }
                    }
                }
            ]
        )
    }

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
            <Text style={[styles.header, { color: theme.text }]}>Settings</Text>

            <View style={[styles.section, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <View style={styles.row}>
                    <Text style={[styles.label, { color: theme.text }]}>Dark Mode</Text>
                    <Switch
                        value={isDark}
                        onValueChange={toggleTheme}
                        trackColor={{ false: '#767577', true: theme.primary }}
                        thumbColor={isDark ? '#fff' : '#f4f3f4'}
                    />
                </View>
            </View>

            <View style={[styles.section, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <TouchableOpacity
                    style={styles.dangerButton}
                    onPress={handleClearData}
                    disabled={clearing}
                >
                    <Text style={styles.dangerText}>{clearing ? 'Clearing...' : 'Clear All Data'}</Text>
                </TouchableOpacity>
                <Text style={[styles.hint, { color: theme.textSecondary }]}>
                    This will permanently delete all your logged meals and moods.
                </Text>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: SPACING.m
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        fontFamily: FONTS.bold,
        marginBottom: SPACING.l,
        marginTop: SPACING.s
    },
    section: {
        borderRadius: 16,
        padding: SPACING.m,
        marginBottom: SPACING.l,
        borderWidth: 1,
        ...SHADOWS.small
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    label: {
        fontSize: 18,
        fontFamily: FONTS.medium
    },
    dangerButton: {
        paddingVertical: SPACING.s,
        alignItems: 'center'
    },
    dangerText: {
        color: '#E74C3C', // Always red for danger
        fontSize: 18,
        fontWeight: '600',
        fontFamily: FONTS.medium
    },
    hint: {
        fontSize: 14,
        textAlign: 'center',
        marginTop: SPACING.s,
        fontFamily: FONTS.regular
    }
})
