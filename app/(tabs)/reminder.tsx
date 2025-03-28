import { View, Text, StyleSheet } from 'react-native';
import React from 'react';

export default function ReminderScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reminders</Text>
      <Text style={styles.description}>Manage your pet care reminders here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1C1C2E',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    color: '#fff',
  },
  description: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    marginHorizontal: 24,
  },
});