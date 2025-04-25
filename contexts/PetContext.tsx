import { createContext, useContext, useEffect, useState } from "react";
import { databases } from "../lib/appwrite";
import { PET_DATABASE_ID, PET_COLLECTION_ID } from "./PetDataContext";

const PetContext = createContext<any>(null);

export function usePet() {
  return useContext(PetContext);
}

export function PetProvider(props: any) {
  const [pet, setPet] = useState<any>(null);

  // Fetch pet details
  async function getPet(dogId: string) {
    try {
      // Use databases service to fetch the pet document
      const petDetails = await databases.getDocument(
        PET_DATABASE_ID,
        PET_COLLECTION_ID,
        dogId
      );
      setPet(petDetails);
      console.log("Pet details fetched:", petDetails);
      return petDetails;
    } catch (error: any) {
      console.error("Failed to fetch pet details:", error.message);
      return null;
    }
  }

  useEffect(() => {
    // Fetch pet details if needed, depending on the use case
  }, []);

  return (
    <PetContext.Provider value={{ current: pet, getPet }}>
      {props.children}
    </PetContext.Provider>
  );
}
