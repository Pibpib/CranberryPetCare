import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useUser, UserProvider } from '../contexts/UserContext';
import { useColorScheme } from '../hooks/useColorScheme';
import { PetDataProvider } from '../contexts/PetDataContext'; // Import PetDataProvider

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const user = useUser();
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <UserProvider value={user}>
        <PetDataProvider>
          <Stack screenOptions={{ headerShown: false }}>
            {/* Only render tabs if user is logged in */}
            {user?.user ? (
              <Stack.Screen name="(tabs)" />
            ) : (
              <Stack.Screen name="signup" />
            )}
          </Stack>
        </PetDataProvider>
      </UserProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
