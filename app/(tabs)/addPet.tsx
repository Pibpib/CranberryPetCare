import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function AddPetScreen() {
  const navigation = useNavigation();
  const [petName, setPetName] = useState('');
  const [breed, setBreed] = useState('');
  const [dob, setDOB] = useState('');
  const [gender, setGender] = useState('');

  const handleAddPet = () => {
    if (petName && breed && dob && gender) {
      console.log('Pet Added:', { petName, breed, dob, gender });
      navigation.goBack();
    } else {
      alert('Please fill in all fields.');
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
          style={[styles.genderButton, gender === 'Female' ? styles.selected : null]}
          onPress={() => setGender('Female')}
        >
          <Text style={styles.genderText}>Female</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.genderButton, gender === 'Male' ? styles.selected : null]}
          onPress={() => setGender('Male')}
        >
          <Text style={styles.genderText}>Male</Text>
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
    backgroundColor: '#555469',
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
    backgroundColor: '#555469',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  selected: {
    backgroundColor: '#FFE390',
  },
  genderText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
