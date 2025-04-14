import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useLogData } from '@/contexts/LogDataContext';
import { useVaccineData } from '@/contexts/VaccineDataContext';
import { useUser } from '@/contexts/UserContext';

type ScheduleItem = {
  type: 'log' | 'vaccine';
  title: string;
  date: string;
};

export default function ScheduleScreen() {
  const { current: user } = useUser();
  const { current: allLogs } = useLogData();
  const { vaccines } = useVaccineData();
  const [combined, setCombined] = useState<ScheduleItem[]>([]);

  useEffect(() => {
    if (!user) return;

    const userLogs = allLogs
      .filter((log: any) => log.userId === user.$id)
      .map((log: any) => ({
        type: 'log',
        title: log.activityName,
        date: log.activityDate,
      }));

    const userVaccines = vaccines
      .filter((vaccine: any) => vaccine.userId === user.$id)
      .map((vaccine: any) => ({
        type: 'vaccine',
        title: vaccine.vaccineName,
        date: vaccine.applicationDate,
      }));

    const all = [...userLogs, ...userVaccines];
    all.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    setCombined(all);
  }, [user, allLogs, vaccines]);

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
        contentContainerStyle={{ padding: 20 }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No logs or vaccines found.</Text>
        }
      />
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
});
