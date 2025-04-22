import { Tabs } from 'expo-router';
 import React from 'react';
 import { Platform } from 'react-native';
 
 import { HapticTab } from '@/components/HapticTab';
 import { IconSymbol } from '@/components/ui/IconSymbol';
 import AntDesign from '@expo/vector-icons/AntDesign';
 import FontAwesome from '@expo/vector-icons/FontAwesome';
 import TabBarBackground from '@/components/ui/TabBarBackground';
 import { Colors } from '@/constants/Colors';
 import { useColorScheme } from '@/hooks/useColorScheme';
 
 export default function TabLayout() {
   const colorScheme = useColorScheme();
 
   return (
     <Tabs
       screenOptions={{
         tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
         headerShown: false,
         tabBarButton: HapticTab,
         tabBarBackground: TabBarBackground,
         tabBarStyle: Platform.select({
           ios: {
             position: 'absolute',
           },
           default: {},
         }),
       }}>
       <Tabs.Screen
         name="index"
         options={{
           title: 'Home',
           tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
         }}
       />
       <Tabs.Screen
         name="schedule"
         options={{
           title: 'Calendar',
           tabBarIcon: ({ color }) => <AntDesign name="calendar" size={24} color="black" />,
         }}
       />
       <Tabs.Screen
         name="profile"
         options={{
           title: 'Profile',
           tabBarIcon: ({ color }) => <FontAwesome name="user" size={24} color="black" />,
         }}
       />
     </Tabs>
   );
 }