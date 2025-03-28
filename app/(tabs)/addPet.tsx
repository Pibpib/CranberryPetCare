import React, { useState, useContext, useEffect} from 'react';
import { useUser } from '@/contexts/UserContext';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { usePetData } from '@/contexts/PetDataContext';  

export default function AddPetScreen() {
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

  const navigation = useNavigation();
  const { addPet } = usePetData();


  const [petName, setPetName] = useState('');
  const [breed, setBreed] = useState('');
  const [dob, setDOB] = useState('');
  const [gender, setGender] = useState('');

  const handleAddPet = async () => {
    if (petName && breed && dob && gender) {
      if (!userId) {
        alert("User ID not found. Please try again.");
        return;
      }
  
      const petData = {
        name: petName,
        breed: breed,
        birthDate: dob,
        gender: gender,
      };
  
      try {
        await addPet(petData, userId); // Pass userId
        console.log("user id:", userId);
        console.log("Pet Added:", petData);
        navigation.goBack(); // Go back after successfully adding the pet
      } catch (error) {
        console.error("Error adding pet:", error);
        alert("There was an error adding the pet. Please try again.");
      }
    } else {
      alert("Please fill in all fields.");
    }
  };  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>New Dog</Text>
      <TextInput
        style={styles.input}
        placeholder="Pet Name"
        placeholderTextColor="#ccc"
        value={petName}
        onChangeText={setPetName}
      />

      <TextInput
        style={styles.input}
        placeholder="Breed"
        placeholderTextColor="#ccc"
        value={breed}
        onChangeText={setBreed}
      />

      <TextInput
        style={styles.input}
        placeholder="Date of Birth"
        placeholderTextColor="#ccc"
        keyboardType="numeric"
        value={dob}
        onChangeText={setDOB}
      />

      <View style={styles.genderContainer}>
        <TouchableOpacity
          style={[styles.genderButton, gender === 'Male' ? styles.selected : null]}
          onPress={() => setGender('Male')}
        >
          <MaterialIcons name="male" size={24} color="#00BBFF" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.genderButton, gender === 'Female' ? styles.selected : null]}
          onPress={() => setGender('Female')}
        >
          <MaterialIcons name="female" size={24} color="#FF0FFB" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleAddPet}>
        <Text style={styles.buttonText}>Create</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2B2943',
    padding: 20,
    justifyContent: 'center'
  },
  title: {
    fontSize: 32,
    color: '#fff',
    marginBottom: 20,
    fontWeight: 'bold',
    fontFamily: 'Inknut Antiqua',
    textAlign: 'center'
  },
  input: {
    backgroundColor: '#1E1D2F',
    color: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  genderButton: {
    backgroundColor: '#1E1D2F',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  selected: {
    backgroundColor: '#555469',
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
