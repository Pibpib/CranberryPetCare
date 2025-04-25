import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useLogData } from '@/contexts/LogDataContext';
import { useVaccineData } from '@/contexts/VaccineDataContext';
import { useReminderData } from '@/contexts/ReminderDataContext';
import { useUser } from '@/contexts/UserContext';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";

type ScheduleItem = {
  type: 'log' | 'vaccine' | 'reminder';
  title: string;
  date: string;
};

export default function Schedule() {
  const { current: user } = useUser();
  const { current: allLogs } = useLogData();
  const { reminders } = useReminderData();
  const { vaccines } = useVaccineData();
  const [combined, setCombined] = useState<ScheduleItem[]>([]);

  // Function to format date as 'DD/MM/YYYY HH:mm'
  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  // Function to handle repeating reminders
  const generateRepeatingReminders = (reminder: any) => {
    const repeatType = reminder.repeat; 
    if (!['daily', 'weekly', 'monthly'].includes(repeatType)) return [];
    const startDate = new Date(reminder.dateTime);
    if (isNaN(startDate.getTime())) return [];
    const futureReminders: ScheduleItem[] = [];
    const endDate = new Date();
    endDate.setFullYear(endDate.getFullYear() + 1); 

    let currentDate = new Date(startDate);
    let count = 0;

    while (currentDate <= endDate && count < 50) {
      futureReminders.push({
        type: 'reminder',
        title: reminder.title,
        date: formatDate(currentDate),
      });

      // Move to next occurrence based on repeat type
      if (repeatType === 'weekly') {
        currentDate.setDate(currentDate.getDate() + 7);
      } else if (repeatType === 'daily') {
        currentDate.setDate(currentDate.getDate() + 1);
      } else if (repeatType === 'monthly') {
        currentDate.setMonth(currentDate.getMonth() + 1);
      }
      count++;
    }

    return futureReminders;
  };

  useEffect(() => {
    if (!user) return;

    // Process logs, vaccines, and reminders
    const userLogs = allLogs
      .filter((log: any) => log.userId === user.$id)
      .map((log: any) => ({
        type: 'log',
        title: log.activityName,
        date: formatDate(new Date(log.activityDate)),
      }));

    const userVaccines = vaccines
      .filter((vaccine: any) => vaccine.userId === user.$id)
      .map((vaccine: any) => ({
        type: 'vaccine',
        title: vaccine.vaccineName,
        date: formatDate(new Date(vaccine.applicationDate)),
      }));

    const userReminders = reminders
      .filter((reminder: any) => reminder.userId === user.$id)
      .flatMap((reminder: any) => {
        const reminderDate = new Date(reminder.dateTime);
        if (isNaN(reminderDate.getTime())) return [];
        const futureReminders = reminder.repeat ? generateRepeatingReminders(reminder) : [];
        return [
          {
            type: 'reminder',
            title: reminder.title,
            date: formatDate(reminderDate),
          },
          ...futureReminders,
        ];
      });

    // Combine logs, vaccines, and reminders into a single list
    const all = [...userLogs, ...userVaccines, ...userReminders];
    all.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    setCombined(all);
  }, [user, allLogs, vaccines, reminders]);

  const renderItem = ({ item }: { item: ScheduleItem }) => (
    <View style={styles.item}>
      <Text style={styles.type}>{item.type.toUpperCase()}</Text>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.date}>{item.date}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Schedule</Text>
      <FlatList
        data={combined}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No logs, vaccines, or reminders found.</Text>
        }
      />
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => router.push('../addReminder')} 
      >
        <MaterialIcons name="add-circle" size={100} color="#D9D9D9" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2B2943',
  },
  header: { 
    fontSize: 28, 
    color: "#fff", 
    marginTop: 50, 
    marginLeft: 30, 
    fontWeight: "bold" 
  },
  item: {
    backgroundColor: '#1E1D2F',
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
  },
  type: {
    color: '#FFBD69',
    fontWeight: 'bold',
    fontSize: 14,
  },
  title: {
    color: '#FFE390',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
  date: {
    color: '#ccc',
    marginTop: 4,
  },
  emptyText: {
    color: '#ccc',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
  addButton: { 
    position: "absolute", 
    right: 20, 
    bottom: 20, 
    borderRadius: 50, 
    backgroundColor: "#2B2943", 
    padding: 15 
  },
  listContent: {
    padding: 20,
  },
});
