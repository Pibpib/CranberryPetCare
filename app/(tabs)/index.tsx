import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '@/contexts/UserContext';
import { useEffect, useState } from "react";
import { router } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function HomeScreen() {
  const user = useUser();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      const loggedInUser = await user.getUser();
      if (loggedInUser && loggedInUser.$id) {
        setUserId(loggedInUser.$id);
      }
    }
    fetchUser();
  }, []);

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Loading...</Text>
      </SafeAreaView>
    );
  }

  // Placeholder dog data
  const dogData = {
    name: "Max",
    type: "Golden Retriever",
    age: 4,
    image: "https://example.com/dog-image.jpg" // Replace with a valid image URL
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* <Text style={styles.title}>
        Welcome, {user.current.$id}, {user.current.name || user.current.email}!
      </Text> */}

      <Text style={styles.subTitle}>My Dogs</Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <Image source={{ uri: dogData.image }} style={styles.image} />
          <View style={styles.infoContainer}>
            <Text style={styles.name}>{dogData.name}</Text>
            <Text style={styles.info}>{dogData.type}</Text>
            <Text style={styles.info}>{dogData.age} years old</Text>
          </View>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button}>
            <AntDesign name="filetext1" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <MaterialIcons name="vaccines" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <MaterialIcons name="groups" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => router.push('../(tabs)/addPet')} 
      >
        <MaterialIcons name="add-circle" size={100} color="#D9D9D9" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#2B2943' },
  title: { fontSize: 28, color: '#fff', marginTop: 50, marginLeft: 30, fontWeight: 'bold' },
  subTitle: { fontSize: 24, color: '#fff', marginTop: 20, marginLeft: 30 },
  card: {
    margin: 20,
    backgroundColor: '#555469',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  image: { width: 150, height: 150, borderRadius: 75, marginRight: 20 },
  infoContainer: { flex: 1 },
  name: { fontSize: 20, fontWeight: 'bold', marginBottom: 5, color: 'white' },
  info: { fontSize: 16, color: '#FFFFFF', marginBottom: 5 },
  buttonsContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  button: {
    backgroundColor: '#FFE390',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 5,
    width: 100,
    alignItems: 'center',
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    borderRadius: 50,
    backgroundColor: '#2B2943',
    padding: 15,
  },
});
