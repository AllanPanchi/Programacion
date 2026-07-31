import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HapticTab } from '@/components/haptic-tab';
import { useTema } from '@/hooks/use-tema';

function IconoJugadores({ color, focused }: { color: string; focused: boolean }) {
  return <Ionicons name={focused ? 'people' : 'people-outline'} size={23} color={color} />;
}

function IconoAlineacion({ color, focused }: { color: string; focused: boolean }) {
  return <Ionicons name={focused ? 'football' : 'football-outline'} size={23} color={color} />;
}

export default function TabLayout() {
  const t = useTema();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: t.primary,
        tabBarInactiveTintColor: t.textFaint,
        // La altura se calcula a mano para dejar sitio al indicador inferior del dispositivo.
        tabBarStyle: {
          backgroundColor: t.surface,
          borderTopColor: t.border,
          height: 68 + insets.bottom,
          paddingTop: 8,
          paddingBottom: insets.bottom + 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          letterSpacing: 0.2,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{ title: 'Jugadores', tabBarIcon: IconoJugadores }}
      />
      <Tabs.Screen
        name="alineacion"
        options={{ title: 'Alineación', tabBarIcon: IconoAlineacion }}
      />
    </Tabs>
  );
}
