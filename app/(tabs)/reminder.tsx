import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function ReminderScreen() {
  const today = new Date().toDateString(); // e.g. "Mon Mar 25 2025"

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>Schedule</Text>
      <Text style={styles.date}>{today}</Text>

      {/* Timeline */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.timeline}>
        {['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'].map((time) => (
          <TouchableOpacity key={time} style={styles.timeBlock}>
            <Text style={styles.timeText}>{time}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Example Reminder Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Vet Appointment</Text>
        <Text style={styles.cardSubtitle}>10:00 AM • PetCare Clinic</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C2E',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  date: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 16,
  },
  timeline: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  timeBlock: {
    backgroundColor: '#2E2E3E',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginRight: 12,
  },
  timeText: {
    color: '#fff',
    fontSize: 14,
  },
  card: {
    backgroundColor: '#2A2A38',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  cardSubtitle: {
    color: '#ccc',
    marginTop: 4,
    fontSize: 14,
  },
});