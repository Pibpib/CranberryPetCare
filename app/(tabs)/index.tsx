import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "@/contexts/UserContext";
import { usePetData } from "@/contexts/PetDataContext";
import { router } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

export default function HomeScreen() {
  const user = useUser();
  const { current: pets, refreshPets } = usePetData();  // Assuming you have a refreshPets function in context
  const [userId, setUserId] = useState<string | null>(null);
  const [userPets, setUserPets] = useState<any[]>([]);

  useEffect(() => {
    async function fetchUser() {
      const loggedInUser = await user.getUser();
      if (loggedInUser && loggedInUser.$id) {
        setUserId(loggedInUser.$id);
      }
    }
    fetchUser();
  }, []);

  useEffect(() => {
    if (userId && pets.length > 0) {
      const filteredPets = pets.filter((pet: any) => pet.userId === userId);
      setUserPets(filteredPets);
    }
  }, [userId, pets]);

  // Reload pets when returning to the home screen
  useFocusEffect(
    useCallback(() => {
      refreshPets();
    }, [])
  );

  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    const today = new Date();
  
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
  
    // Adjust if birth month hasn't occurred yet this year
    if (months < 0) {
      years--;
      months += 12;
    }
  
    return `${years} Years ${months} Months`;
  };  

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>My Pets</Text>

      {userPets.length === 0 ? (
        <Text style={styles.noPetsText}>No pets found</Text>
      ) : (
        <FlatList
          data={userPets}
          keyExtractor={(item) => item.$id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.row}>
                <Image source={{ uri: item.image }} style={styles.image} />
                <View style={styles.infoContainer}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.info}>{item.breed}</Text>
                  <Text style={styles.info}>{calculateAge(item.birthDate)}</Text>
                </View>
              </View>

              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => router.push({
                    pathname: "../(tabs)/addLog",
                    params: { dogId: item.dogId }
                  })}
                >
                  <AntDesign name="filetext1" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}
                  onPress={() => router.push({
                    pathname: "../(tabs)/addVaccine",
                    params: { dogId: item.dogId }
                  })}
                >
                  <MaterialIcons name="vaccines" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                  <MaterialIcons name="groups" size={24} color="black" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

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
  container: { flex: 1, backgroundColor: "#2B2943" },
  title: { fontSize: 28, color: "#fff", marginTop: 50, marginLeft: 30, fontWeight: "bold" },
  noPetsText: { fontSize: 18, color: "#fff", textAlign: "center", marginTop: 20 },
  card: { margin: 20, backgroundColor: "#555469", borderRadius: 10, padding: 20 },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  image: { width: 150, height: 150, borderRadius: 75, marginRight: 20 },
  infoContainer: { flex: 1 },
  name: { fontSize: 20, fontWeight: "bold", color: "white" },
  info: { fontSize: 16, color: "#FFFFFF" },
  buttonsContainer: { flexDirection: "row", justifyContent: "space-between" },
  button: { backgroundColor: "#FFE390", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 5, width: 100, alignItems: "center" },
  addButton: { position: "absolute", right: 20, bottom: 20, borderRadius: 50, backgroundColor: "#2B2943", padding: 15 },
});
