import { createContext, useContext, useEffect, useState } from "react";
import { databases } from "@/lib/appwrite";
import { ID, Permission, Role, Query } from "react-native-appwrite";

export const PET_DATABASE_ID = "67dc12010001c35043dd"; 
export const PET_COLLECTION_ID = "67e0b901000189989423"; 

const PetDataContext = createContext<any>(null);

export function usePetData() {
  return useContext(PetDataContext);
}

export function PetDataProvider(props: any) {
  const [pets, setPets] = useState<any>([]);

  // Add a new pet
  async function addPet(pet: any, userId: string) {
    try {
      const petData = { 
        ...pet, 
        userId: userId, 
        dogId: ID.unique() 
      };
      
      const response = await databases.createDocument(
        PET_DATABASE_ID,
        PET_COLLECTION_ID,
        ID.unique(),
        petData, 
        [
          Permission.write(Role.user(userId)),  
          Permission.read(Role.user(userId)),  
        ]
      );
    
      console.log("Pet Added:", response);
    } catch (error) {
      console.error("Failed to add pet:", error);
    }
  }
  

  // Modify an existing pet by ID
  async function modifyPet(id: string, petData: any) {
    try {
      const response = await databases.updateDocument(
        PET_DATABASE_ID,
        PET_COLLECTION_ID,
        id,
        petData
      );
      setPets((prevPets: any) =>
        prevPets.map((pet: any) =>
          pet.$id === id ? { ...pet, ...response } : pet
        )
      );
      console.log("Pet modified:", response);
    } catch (error: any) {
      console.error("Failed to modify pet:", error.message);
    }
  }

  // Remove a pet by ID
  async function removePet(id: string) {
    try {
      await databases.deleteDocument(PET_DATABASE_ID, PET_COLLECTION_ID, id);
      setPets((prevPets: any) => prevPets.filter((pet: any) => pet.$id !== id));
      console.log("Pet removed:", id);
    } catch (error: any) {
      console.error("Failed to remove pet:", error.message);
    }
  }

  // Initialize the pet data (fetch the list of pets)
  async function initPets() {
    try {
      const response = await databases.listDocuments(
        PET_DATABASE_ID,
        PET_COLLECTION_ID,
        [Query.orderDesc("$createdAt"), Query.limit(10)]
      );
      setPets(response.documents);
    } catch (error: any) {
      console.error("Failed to fetch pets:", error.message);
    }
  }

  function refreshPets() {
    initPets();
  }

  useEffect(() => {
    initPets();
  }, []);

  return (
    <PetDataContext.Provider value={{ current: pets, refreshPets, addPet, modifyPet, removePet }}>
      {props.children}
    </PetDataContext.Provider>
  );
}
