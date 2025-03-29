import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface ReminderFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: ReminderData) => void;
}

export interface ReminderData {
  title: string;
  notes: string;
  type: string;
  dateTime: Date;
}

export default function ReminderForm({ visible, onClose, onSubmit }: ReminderFormProps) {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [type, setType] = useState('General');
  const [dateTime, setDateTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (_event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDateTime(selectedDate);
    }
  };

  const handleSubmit = () => {
    if (title.trim() === '') return;
    onSubmit({ title, notes, type, dateTime });
    setTitle('');
    setNotes('');
    setType('General');
    setDateTime(new Date());
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.heading}>New Reminder</Text>

          <TextInput
            placeholder="Title"
            style={styles.input}
            value={title}
            onChangeText={setTitle}
          />

          <TextInput
            placeholder="Notes (optional)"
            style={styles.input}
            value={notes}
            onChangeText={setNotes}
          />

          <TextInput
            placeholder="Type (e.g. Vet, Grooming)"
            style={styles.input}
            value={type}
            onChangeText={setType}
          />

          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <Text style={styles.dateButton}>Pick Date & Time</Text>
          </TouchableOpacity>
          <Text style={styles.preview}>Selected: {dateTime.toLocaleString()}</Text>

          {showDatePicker && (
            <DateTimePicker
              value={dateTime}
              mode="datetime"
              display={Platform.OS === 'ios' ? 'inline' : 'default'}
              onChange={handleDateChange}
            />
          )}

          <View style={styles.actions}>
            <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
              <Text>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSubmit} style={styles.submitBtn}>
              <Text style={{ color: '#fff' }}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    backgroundColor: '#1E1E3F',
    borderRadius: 12,
    padding: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#2E2E4D',
    color: '#FFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
  },
  dateButton: {
    color: '#FFE390',
    fontWeight: '600',
    marginBottom: 6,
  },
  preview: {
    color: '#CCC',
    marginBottom: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  cancelBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  submitBtn: {
    backgroundColor: '#FFE390',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
});
