import React, { useState, useContext, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useLogData } from '@/contexts/LogDataContext'; // Add LogDataContext
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ID } from "react-native-appwrite";  // Import ID from Appwrite SDK
import { useRoute } from '@react-navigation/native'; // Import useRoute to access params

export default function AddLogScreen() {
  const user = useUser();
  const { add } = useLogData(); // Use the add function from LogDataContext
  const [userId, setUserId] = useState<string | null>(null);
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  
  // Access route params
  const route = useRoute();
  const { dogId } = route.params; 

  useEffect(() => {
    async function fetchUser() {
      const loggedInUser = await user.getUser();
      if (loggedInUser && loggedInUser.$id) {
        setUserId(loggedInUser.$id);
      }
    }
    fetchUser();
  }, []);

  const navigation = useNavigation();

  // Function to handle the saving of the log
  const handleSaveLog = async () => {
    if (!eventName || !eventDescription || !eventDate) {
      alert("Please fill out all fields");
      return;
    }

    if (!userId || !dogId) {
      alert("User ID or Dog ID is missing");
      return;
    }

    const newLog = {
      activityId: ID.unique(),
      activityName: eventName,
      activityDescription: eventDescription,
      activityDate: eventDate,
      userId: userId,
      dogId: dogId,  // Include the dogId when creating the log
    };

    // Add the log using the context's add function
    try {
      await add(newLog);  // Add log to Appwrite
      alert("Log added successfully!");
      navigation.goBack(); // Navigate back after saving the log
    } catch (error) {
      console.error("Error adding activity log:", error.message);
      alert("Failed to add log, please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={30} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Add Log</Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Event Name"
          placeholderTextColor="#ccc"
          value={eventName}
          onChangeText={setEventName}
        />

        <TextInput
          style={styles.input}
          placeholder="Describe this event"
          placeholderTextColor="#ccc"
          value={eventDescription}
          onChangeText={setEventDescription}
        />

        <TextInput
          style={styles.input}
          placeholder="Event Date and Time: YYYY-MM-DD HH:MM"
          placeholderTextColor="#ccc"
          keyboardType="numeric"
          value={eventDate}
          onChangeText={setEventDate}
        />

        <TouchableOpacity style={styles.button} onPress={handleSaveLog}>
          <Text style={styles.buttonText}>Save</Text>
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
