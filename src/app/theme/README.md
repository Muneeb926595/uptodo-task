# Theme System with React Native Unistyles

Professional multi-theme system built with **react-native-unistyles v3** and React Context.

## 🎨 Available Themes

1. **Purple Dream** 💜 - Elegant purple with lavender accents
2. **Ocean Blue** 🌊 - Deep ocean blue with aqua tones
3. **Forest Green** 🌲 - Nature-inspired green theme
4. **Sunset Orange** 🌅 - Warm orange with vibrant hues
5. **Rose Pink** 🌸 - Romantic pink with soft tones

## 📚 Usage

### Basic Theme Access

\`\`\`tsx
import { useTheme } from '@/app/theme';

function MyComponent() {
const { colors, currentTheme, setTheme } = useTheme();

return (
<View style={{ backgroundColor: colors.background }}>
<Text style={{ color: colors.text }}>Hello {currentTheme}!</Text>
<Button onPress={() => setTheme('oceanBlue')}>
Switch to Ocean Blue
</Button>
</View>
);
}
\`\`\`

### Creating Reactive Styles

\`\`\`tsx
import { createStyles } from '@/app/theme';

const useStyles = createStyles((colors) => ({
container: {
backgroundColor: colors.background,
padding: 20,
},
title: {
color: colors.text,
fontSize: 24,
fontWeight: '600' as const,
},
}));
\`\`\`

## 🎨 Color Palette

Each theme includes: background, text, primary, brand, surface, typography, borders, and action colors with multiple shades.

## 🔧 Configuration

Themes are auto-persisted with MMKV. Default theme: **Purple Dream**

## 📦 Built With

- react-native-unistyles v3
- React Context API
- MMKV storage
- TypeScript
