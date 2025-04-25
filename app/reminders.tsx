import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useReminderData } from '@/contexts/ReminderDataContext';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { router } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';

export default function RemindersScreen() {
  const { dogId } = useLocalSearchParams();
  console.log("dogId param from route:", dogId);
  const { reminders, fetchRemindersFromdogId } = useReminderData();

  useEffect(() => {
    if (dogId) {
      fetchRemindersFromdogId(String(dogId).trim());
    }
  }, [dogId]);
  

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.reminderItem}>
      <Text style={styles.reminderTitle}>{item.title}</Text>
      <Text style={styles.reminderDate}>{new Date(item.dateTime).toLocaleString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/(tabs)/')}>
          <MaterialIcons name="arrow-back" size={30} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Reminders</Text>
        <TouchableOpacity onPress={() => router.push('/addReminder')}>
          <AntDesign name="pluscircleo" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={reminders}
        keyExtractor={(item) => item.$id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 20 }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No reminders yet. Add one!</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2B2943',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 20,
    height: 80,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: 'Inknut Antiqua',
  },
  reminderItem: {
    backgroundColor: '#1E1D2F',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
  },
  reminderTitle: {
    fontSize: 18,
    color: '#FFE390',
    fontWeight: 'bold',
  },
  reminderDate: {
    color: '#ccc',
    marginTop: 4,
  },
  emptyText: {
    color: '#ccc',
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
  },
});
