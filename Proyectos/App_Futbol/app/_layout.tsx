import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

import { Palette } from '@/constants/design';
import { PlantillaProvider } from '@/context/plantilla';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const esOscuro = useColorScheme() === 'dark';
  const paleta = esOscuro ? Palette.dark : Palette.light;

  const navTheme = {
    ...(esOscuro ? DarkTheme : DefaultTheme),
    colors: {
      ...(esOscuro ? DarkTheme : DefaultTheme).colors,
      primary: paleta.primary,
      background: paleta.bg,
      card: paleta.surface,
      text: paleta.text,
      border: paleta.border,
    },
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PlantillaProvider>
        <ThemeProvider value={navTheme}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
          </Stack>
          <StatusBar style="light" />
        </ThemeProvider>
      </PlantillaProvider>
    </GestureHandlerRootView>
  );
}
