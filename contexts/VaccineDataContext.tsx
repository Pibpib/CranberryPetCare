import { ID, Permission, Role, Query } from "react-native-appwrite";
import { createContext, useContext, useEffect, useState } from "react";
import { databases } from "@/lib/appwrite";

export const VACCINE_DATABASE_ID = "67dc12010001c35043dd";
export const VACCINE_COLLECTION_ID = "67fa685c00330c425708";

const VaccineDataContext = createContext<any>(null);

export function useVaccineData() {
  return useContext(VaccineDataContext);
}

export function VaccineDataProvider(props: any) {
  const [vaccines, setVaccines] = useState<any[]>([]);

  async function addVaccine(vaccine: any) {
    const response = await databases.createDocument(
      VACCINE_DATABASE_ID,
      VACCINE_COLLECTION_ID,
      ID.unique(),
      vaccine,
      [Permission.write(Role.user(vaccine.userId))]
    );
    console.log("Vaccine added:", response);
    setVaccines((prev) => [response, ...prev].slice(0, 20));
  }

  async function deleteVaccine(id: string) {
    await databases.deleteDocument(VACCINE_DATABASE_ID, VACCINE_COLLECTION_ID, id);
    setVaccines((prev) => prev.filter((v) => v.$id !== id));
    await fetchVaccines(); 
  }

  async function fetchVaccines() {
    const response = await databases.listDocuments(
      VACCINE_DATABASE_ID,
      VACCINE_COLLECTION_ID,
      [Query.orderDesc("$createdAt"), Query.limit(20)]
    );
    setVaccines(response.documents);
  }

  useEffect(() => {
    fetchVaccines();
  }, []);

  return (
    <VaccineDataContext.Provider value={{ vaccines, addVaccine, deleteVaccine, fetchVaccines }}>
      {props.children}
    </VaccineDataContext.Provider>
  );
}
