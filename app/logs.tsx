import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useLogData } from '@/contexts/LogDataContext';
import { router } from 'expo-router'; 


type RouteParams = {
    logsScreen: {
    dogId: string;
  };
};

export default function logsScreen() {
  const route = useRoute<RouteProp<RouteParams, 'logsScreen'>>();
  const { dogId } = route.params;
  const { current: allLogs } = useLogData();
  const [filteredLogs, setFilteredLogs] = useState<any[]>([]);

  useEffect(() => {
    const logs = allLogs.filter((log: any) => log.dogId === dogId);
    setFilteredLogs(logs);
  }, [allLogs, dogId]);

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.logItem}>
      <Text style={styles.logTitle}>{item.activityName}</Text>
      <Text style={styles.logDate}>{item.activityDate}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/(tabs)/')}>
          <MaterialIcons name="arrow-back" size={30} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Activity Logs</Text>
        <TouchableOpacity onPress={() => router.push({ pathname: 'addLog', params: { dogId } })}>
          <AntDesign name="pluscircleo" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredLogs}
        keyExtractor={(item) => item.activityId}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 20 }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No logs found for this pet.</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 20,
    height: 80,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: 'Inknut Antiqua',
  },
  logItem: {
    backgroundColor: '#1E1D2F',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
  },
  logTitle: {
    fontSize: 18,
    color: '#FFE390',
    fontWeight: 'bold',
  },
  logDate: {
    color: '#ccc',
    marginTop: 4,
  },
  emptyText: {
    color: '#ccc',
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
  },
});
