import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';

export default function ReminderScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Schedule</Text>
      <Text style={styles.subTitle}>Today, Mon, 10 Mar</Text>
      <Text style={styles.noEvent}>No events{''}Enjoy your day!</Text>

      <ScrollView style={styles.scrollArea}>
        <Text style={styles.dateHeader}>Sat, 15 Mar</Text>
        <View style={styles.eventBlock}>
          <AntDesign name="calendar" size={16} color="#fff" style={styles.icon} />
          <View>
            <Text style={styles.eventTitle}>Oreo's 1st Birthday</Text>
            <Text style={styles.eventTime}>all day</Text>
          </View>
        </View>

        <View style={styles.eventBlock}>
          <AntDesign name="calendar" size={16} color="#fff" style={styles.icon} />
          <View>
            <Text style={styles.eventTitle}>Camil Doctor Appointment</Text>
            <Text style={styles.eventTime}>13:00 - 15:00</Text>
          </View>
        </View>

        <Text style={styles.dateHeader}>Mon, 17 Mar</Text>
        <View style={styles.eventBlock}>
          <AntDesign name="calendar" size={16} color="#fff" style={styles.icon} />
          <View>
            <Text style={styles.eventTitle}>Camil Grooming</Text>
            <Text style={styles.eventTime}>11:00</Text>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.fab}>
        <AntDesign name="plus" size={24} color="#1C1C2E" />
      </TouchableOpacity>
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
