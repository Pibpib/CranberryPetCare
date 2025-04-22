import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { usePetData } from '@/contexts/PetDataContext';
import { useUser } from '@/contexts/UserContext';
import { router } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import RNPickerSelect from 'react-native-picker-select';
import { useReminderData } from '@/contexts/ReminderContext'; 


export default function AddReminder() {
  const { current: pets = [] } = usePetData();
  const { current: user } = useUser();
  const { addReminder } = useReminderData();

  const [selectedPetId, setSelectedPetId] = useState<string>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [repeat, setRepeat] = useState<'once' | 'repeat'>('once');

  const navigation = useNavigation();

  const handleSubmit = async () => {
    if (!selectedPetId || !title || !date) {
      Alert.alert('Missing Info', 'Please complete all required fields.');
      return;
    }

    console.log({
      userId: user?.$id,
      petId: selectedPetId,
      title,
      description,
      date,
      repeat,
    });

    const reminderData = {
        userId: user?.$id,
        petId: selectedPetId,
        title,
        description,
        dateTime: date, 
        repeat,
      };
    
        // If repeat is set to 'repeat', add reminders on a specified interval
        if (repeat === 'repeat') {
        const repeatCount = 10; // Number of repeated instances
        const repeatInterval = 'weekly'; // Interval can be weekly, daily, etc.
        let nextDate = new Date(date); 

        for (let i = 0; i < repeatCount; i++) {
        const newReminder = { ...reminderData, dateTime: nextDate.toISOString() };
        await addReminder(newReminder);

        // Calculate the next date based on the interval
        if (repeatInterval === 'weekly') {
            nextDate.setDate(nextDate.getDate() + 7);
        } else if (repeatInterval === 'daily') {
            nextDate.setDate(nextDate.getDate() + 1);
        }
        // Add other intervals as needed (monthly, etc.)
        }
        } else {
            // Single reminder
            await addReminder(reminderData);
        }

    Alert.alert('Success', 'Reminder has been added!');
    router.back();
  };

  // Show loading indicator if pets are not yet loaded
  if (!pets || pets.length === 0) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#FFBD69" />
        <Text style={{ color: '#fff', marginTop: 10 }}>Loading pets...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={30} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Add Reminder</Text>
      </View>

      <Text style={styles.label}>Select Pet</Text>
      <View style={styles.pickerContainer}>
        <RNPickerSelect
          placeholder={{ label: 'Select a pet...', value: '' }}
          onValueChange={(value) => setSelectedPetId(value)}
          value={selectedPetId}
          items={pets.map((pet: any) => ({
            label: pet.name || 'Unnamed Pet',
            value: pet.$id,
          }))}
          style={{
            inputIOS: styles.input,
            inputAndroid: styles.input,
            placeholder: {
              color: '#aaa',
            },
          }}
        />
      </View>

      <Text style={styles.label}>Event Title</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="E.g. Vet Appointment"
        placeholderTextColor="#aaa"
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        value={description}
        onChangeText={setDescription}
        placeholder="Optional"
        multiline
        placeholderTextColor="#aaa"
      />
      
      <Text style={styles.label}>Date & Time</Text>
      <TextInput
        style={styles.input}
        placeholder="YYYY-MM-DD HH:MM"
        placeholderTextColor="#ccc"
        value={date}
        onChangeText={setDate}
      />
      
      <Text style={styles.label}>Repeat</Text>
      <View style={styles.pickerContainer}>
        <RNPickerSelect
          onValueChange={(value) => setRepeat(value)}
          value={repeat}
          items={[
            { label: 'Once', value: 'once' },
            { label: 'Daily', value: 'daily' },
            { label: 'Weekly', value: 'weekly' },
            { label: 'Monthly', value: 'monthly' },
          ]}
          style={{
            inputIOS: styles.input,
            inputAndroid: styles.input,
            placeholder: { color: '#aaa' },
          }}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Save Reminder</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2B2943',
    flex: 1,
  },
  header: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    color: '#fff',
    marginLeft: 10,
    fontWeight: 'bold',
    fontFamily: 'Inknut Antiqua',
    textAlign: 'center',
    flex: 1,
  },
  label: {
    color: '#FFBD69',
    fontSize: 16,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#1E1D2F',
    color: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  pickerContainer: {
    backgroundColor: '#1E1D2F',
    color: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  datePicker: {
    backgroundColor: '#1E1D2F',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#FF6363',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  pickerText: {
    color: '#fff',
    padding: 12,
  },
});
