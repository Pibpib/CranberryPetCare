import React, { useState, useEffect } from 'react';
import {View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, } from 'react-native';
import { useUser } from '@/contexts/UserContext';
import { router } from 'expo-router';

export default function Profile() {
  const { current: user, logout, updateUser } = useUser();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');

  const [originalData, setOriginalData] = useState({ name, email, phone });

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setOriginalData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const hasChanges =
    name !== originalData.name ||
    email !== originalData.email ||
    phone !== originalData.phone;

  const handleSave = async () => {
    if (updateUser) {
      const updated = await updateUser({ name, email, phone });
      if (updated) {
        setOriginalData({ name, email, phone });
        Alert.alert('Profile Saved', 'Your profile details have been updated.');
      } else {
        Alert.alert('Update Failed', 'Something went wrong. Please try again.');
      }
    }
  };

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Profile</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
        placeholderTextColor="#aaa"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        placeholderTextColor="#aaa"
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        placeholderTextColor="#aaa"
      />

      {hasChanges && (
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2B2943',
    padding: 20,
  },
  header: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 40,
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#1E1D2F',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#fff',
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: '#FFBD69',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  saveText: {
    color: '#2B2943',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: '#FF6363',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  logoutText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
