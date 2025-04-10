import React, { useEffect, useState } from 'react';
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
  const userContext = useUser();
  const petContext = usePet();
  
  const user = userContext?.current;
  const selectedPet = petContext?.current;
  const today = new Date();
  const formattedToday = today.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });

  const [reminders, setReminders] = useState<ReminderData[]>([]);

  useEffect(() => {
    const fetchReminders = async () => {
      if (!user?.$id || !selectedPet?.$id) return;
      try {
        const fetched = await getReminders(user.$id, selectedPet.$id);
        console.log(fetched); // Log the response to inspect
        const reminders = fetched.documents.map((doc: any) => ({
          title: doc.title,
          notes: doc.notes,
          type: doc.type,
          dateTime: new Date(doc.dateTime),
          userId: doc.userId,
          petId: doc.petId,
        }));
        setReminders(reminders);
      } catch (error) {
        console.error('Failed to fetch reminders:', error);
      }
    };
  
    fetchReminders();
  }, [user, selectedPet]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Schedule</Text>
      <Text style={styles.subTitle}>{`Today, ${formattedToday}`}</Text>
      
      <ScrollView style={styles.scrollArea}>
        {reminders.length > 0 ? (
          reminders.map((reminder, index) => (
            <View key={index} style={styles.eventBlock}>
              <AntDesign name="calendar" size={16} color="#fff" style={styles.icon} />
              <View>
                <Text style={styles.eventTitle}>{reminder.title}</Text>
                <Text style={styles.eventTime}>
                  {reminder.dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noEvent}>No events. Enjoy your day!</Text>
        )}
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => setFormVisible(true)}>
        <AntDesign name="plus" size={24} color="#1C1C2E" />
      </TouchableOpacity>

      <ReminderForm
        visible={formVisible}
        onClose={() => setFormVisible(false)}
        userId={user?.$id || ''}
        petId={selectedPet?.$id || ''}
        onSubmit={async (data: ReminderData) => {
          try {
            await createReminder({
              ...data,
              dateTime: new Date(data.dateTime),
              userId: user?.$id ?? '',
              petId: selectedPet?.$id ?? '',
            });
            console.log('Reminder saved to Appwrite!');
            // Optionally re-fetch reminders here to update the UI
          } catch (error) {
            console.error('Error saving reminder:', error);
          } finally {
            setFormVisible(false);
          }
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