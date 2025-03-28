import { View, Text, StyleSheet } from 'react-native';
import React from 'react';

export default function ReminderScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Reminder screen coming soon!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
  },
});