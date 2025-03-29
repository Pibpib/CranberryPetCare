import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform
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

export default function ReminderForm({
  visible = false,
  onClose = () => {},
  onSubmit = () => {},
}: Partial<ReminderFormProps>) {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [type, setType] = useState('');
  const [dateTime, setDateTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSubmit = () => {
    onSubmit({ title, notes, type, dateTime });
    onClose(); // close after submit
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.heading}>Add Reminder</Text>

          <TextInput
            style={styles.input}
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
          />

          <TextInput
            style={styles.input}
            placeholder="Notes"
            value={notes}
            onChangeText={setNotes}
          />

          <TextInput
            style={styles.input}
            placeholder="Type (e.g., Vet, Grooming)"
            value={type}
            onChangeText={setType}
          />

          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
            <Text>{dateTime.toLocaleString()}</Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={dateTime}
              mode="datetime"
              display={Platform.OS === 'ios' ? 'inline' : 'default'}
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setDateTime(selectedDate);
              }}
            />
          )}

          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={onClose} style={styles.buttonCancel}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSubmit} style={styles.buttonSubmit}>
              <Text style={styles.buttonText}>Add</Text>
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
    backgroundColor: '#000000AA',
    justifyContent: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginVertical: 6,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  buttonCancel: {
    backgroundColor: '#999',
    padding: 10,
    borderRadius: 6,
    flex: 1,
    marginRight: 6,
  },
  buttonSubmit: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 6,
    flex: 1,
    marginLeft: 6,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
});