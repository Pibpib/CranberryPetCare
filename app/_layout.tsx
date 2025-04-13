import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useUser, UserProvider } from '../contexts/UserContext';
import { useColorScheme } from '../hooks/useColorScheme';
import { PetDataProvider } from '../contexts/PetDataContext';
import { LogDataProvider } from '../contexts/LogDataContext';
import { VaccineDataProvider } from '../contexts/VaccineDataContext'; 

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const user = useUser();
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <UserProvider value={user}>
        <PetDataProvider>
          <LogDataProvider>
            <VaccineDataProvider> 
              <Stack screenOptions={{ headerShown: false }} />
            </VaccineDataProvider>
          </LogDataProvider>
        </PetDataProvider>
      </UserProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
