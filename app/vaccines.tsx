import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useLocalSearchParams, router } from 'expo-router';
import { useVaccineData } from '@/contexts/VaccineDataContext';

export default function vaccinesScreen() {
  const { dogId } = useLocalSearchParams<{ dogId: string }>();
  const { vaccines } = useVaccineData();
  const [filteredVaccines, setFilteredVaccines] = useState<any[]>([]);

  useEffect(() => {
    const relatedVaccines = vaccines.filter((vaccine: any) => vaccine.dogId === dogId);
    setFilteredVaccines(relatedVaccines);
  }, [vaccines, dogId]);

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.vaccineItem}>
      <Text style={styles.vaccineTitle}>{item.vaccineName}</Text>
      <Text style={styles.vaccineDate}>{item.applicationDate}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/(tabs)/')}>
          <MaterialIcons name="arrow-back" size={30} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Vaccinations</Text>
        <TouchableOpacity onPress={() => router.push({ pathname: 'addVaccine', params: { dogId } })}>
          <AntDesign name="pluscircleo" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredVaccines}
        keyExtractor={(item) => item.$id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 20 }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No vaccine records found for this pet.</Text>
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
  vaccineItem: {
    backgroundColor: '#1E1D2F',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
  },
  vaccineTitle: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  vaccineDate: {
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
