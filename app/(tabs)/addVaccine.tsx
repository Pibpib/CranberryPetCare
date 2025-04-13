import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { useUser } from '@/contexts/UserContext';
import { useVaccineData } from '@/contexts/VaccineDataContext';
import { useRoute } from '@react-navigation/native'; 

export default function AddVaccineScreen() {
  const navigation = useNavigation();
  const { addVaccine } = useVaccineData();
  const user = useUser();
  const [userId, setUserId] = useState<string | null>(null);
  const route = useRoute();
  const { dogId } = route.params as { dogId: string };

  const [vaccineName, setVaccineName] = useState('');
  const [applicationDate, setApplicationDate] = useState('');
  const [expirationDate, setExpirationDate] = useState('');

  useEffect(() => {
    async function fetchUser() {
      const loggedInUser = await user.getUser();
      if (loggedInUser?.$id) {
        setUserId(loggedInUser.$id);
      }
    }
    fetchUser();
  }, []);

  const handleAddVaccine = async () => {
    if (!vaccineName || !applicationDate || !expirationDate) {
      alert("Please fill in all fields.");
      return;
    }

    if (!userId) {
      alert("User ID not found.");
      return;
    }

    const vaccineData = {
      vaccineName,
      applicationDate,
      expirationDate,
      userId,
      dogId
    };

    try {
      await addVaccine(vaccineData);
      console.log("Vaccine added:", vaccineData);
      router.push('../(tabs)/');
    } catch (error) {
      console.error("Error adding vaccine:", error);
      alert("Failed to add vaccine. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={30} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Add Vaccine</Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Vaccine Name"
          placeholderTextColor="#ccc"
          value={vaccineName}
          onChangeText={setVaccineName}
        />

        <TextInput
          style={styles.input}
          placeholder="Application Date: YYYY-MM-DD"
          placeholderTextColor="#ccc"
          value={applicationDate}
          onChangeText={setApplicationDate}
        />

        <TextInput
          style={styles.input}
          placeholder="Expiration Date: YYYY-MM-DD"
          placeholderTextColor="#ccc"
          value={expirationDate}
          onChangeText={setExpirationDate}
        />

        <TouchableOpacity style={styles.button} onPress={handleAddVaccine}>
          <Text style={styles.buttonText}>Save Vaccine</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
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
    backgroundColor: '#2B2943',
    height: 80,
  },
  title: {
    fontSize: 32,
    color: '#fff',
    marginLeft: 10,
    fontWeight: 'bold',
    fontFamily: 'Inknut Antiqua',
    textAlign: 'center',
    flex: 1,
  },
  formContainer: {
    paddingHorizontal: 20,
    justifyContent: 'center',
    flex: 1,
  },
  input: {
    backgroundColor: '#1E1D2F',
    color: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#FFE390',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
