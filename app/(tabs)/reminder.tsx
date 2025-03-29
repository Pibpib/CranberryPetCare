import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import ReminderForm, { ReminderData } from '@/components/ui/ReminderForm';
import { useUser } from '@/contexts/UserContext';
import { usePet } from '@/contexts/PetContext';
import { createReminder, getReminders } from '@/lib/appwrite';

export default function ReminderScreen() {
  const [formVisible, setFormVisible] = useState(false);
  const { current: user } = useUser();
  const { selectedPet } = usePet();
  const [reminders, setReminders] = useState<ReminderData[]>([]);

  useEffect(() => {
    const fetchReminders = async () => {
      if (!user?.$id || !selectedPet?.$id) return;
      try {
        const res = await getReminders(user.$id, selectedPet.$id);
        const mappedReminders: ReminderData[] = res.documents.map((doc: any) => ({
          title: doc.title,
          notes: doc.notes,
          type: doc.type,
          dateTime: new Date(doc.dateTime),
        }));
        setReminders(mappedReminders);
      } catch (err) {
        console.error('Failed to fetch reminders:', err);
      }
    };

    fetchReminders();
  }, [user, selectedPet]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Schedule</Text>
      <Text style={styles.subTitle}>Today, Mon, 10 Mar</Text>
      {reminders.length === 0 && (
        <Text style={styles.noEvent}>No events — Enjoy your day!</Text>
      )}

      <ScrollView style={styles.scrollArea}>
        {reminders.map((reminder, index) => (
          <View key={index}>
            <Text style={styles.dateHeader}>
              {new Date(reminder.dateTime).toDateString()}
            </Text>
            <View style={styles.eventBlock}>
              <AntDesign name="calendar" size={16} color="#fff" style={styles.icon} />
              <View>
                <Text style={styles.eventTitle}>{reminder.title}</Text>
                <Text style={styles.eventTime}>
                  {new Date(reminder.dateTime).toLocaleTimeString()}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => setFormVisible(true)}>
        <AntDesign name="plus" size={24} color="#1C1C2E" />
      </TouchableOpacity>

      <ReminderForm
        visible={formVisible}
        onClose={() => setFormVisible(false)}
        onSubmit={async (data: ReminderData) => {
          try {
            await createReminder({
              ...data,
              dateTime: data.dateTime.toISOString(),
              userId: user?.$id || '',
              petId: selectedPet?.$id || '',
            });

            const res = await getReminders(user?.$id || '', selectedPet?.$id || '');
            const mappedReminders: ReminderData[] = res.documents.map((doc: any) => ({
              title: doc.title,
              notes: doc.notes,
              type: doc.type,
              dateTime: new Date(doc.dateTime),
            }));
            setReminders(mappedReminders);
            console.log('Reminder added and list updated');
          } catch (error) {
            console.error('Failed to create reminder:', error);
          }
          setFormVisible(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C2E',
    paddingTop: 60,
    paddingHorizontal: 20,
    position: 'relative',
  },
  title: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  subTitle: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 10,
  },
  noEvent: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 20,
  },
  dateHeader: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 10,
    marginBottom: 6,
  },
  eventBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A38',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  icon: {
    marginRight: 10,
  },
  eventTitle: {
    color: '#fff',
    fontSize: 16,
  },
  eventTime: {
    color: '#ccc',
    fontSize: 13,
  },
  scrollArea: {
    marginTop: 10,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#FFE390',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
});
