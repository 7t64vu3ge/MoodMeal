export const SPACING = {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32
}

// fonts used in app
export const FONTS = {
    regular: 'System',
    medium: 'System',
    bold: 'System'
}

// shadow styles for depth
export const SHADOWS = {
    small: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2
    },
    medium: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4
    }
}

// colors for light mode
export const lightTheme = {
    primary: '#4A90E2',
    secondary: '#50E3C2',
    background: '#F7F9FC',
    surface: '#FFFFFF',
    text: '#2C3E50',
    textSecondary: '#7F8C8D',
    error: '#E74C3C',
    success: '#2ECC71',
    border: '#E0E6ED',
    isDark: false
}

// colors for dark mode
export const darkTheme = {
    primary: '#5DADE2', // lighter blue
    secondary: '#48C9B0',
    background: '#1A202C', // dark blue grey
    surface: '#2D3748',    // lighter dark grey
    text: '#ECF0F1',       // off white
    textSecondary: '#BDC3C7',
    error: '#E74C3C',
    success: '#2ECC71',
    border: '#4A5568',
    isDark: true
}
