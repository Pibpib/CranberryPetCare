import { createContext, useContext, useEffect, useState } from "react";
import { account } from "@/lib/appwrite";

const VaccineUserContext = createContext<any>(null);

export function useVaccineUser() {
  return useContext(VaccineUserContext);
}

export function VaccineUserProvider(props: any) {
  const [user, setUser] = useState<any>(null);

  async function getUser() {
    try {
      const currentUser = await account.get();
      setUser(currentUser);
      return currentUser;
    } catch (error: any) {
      console.error("Vaccine context: Error getting user:", error.message);
      setUser(null);
      return null;
    }
  }

  useEffect(() => {
    getUser();
  }, []);

  return (
    <VaccineUserContext.Provider value={{ current: user, getUser }}>
      {props.children}
    </VaccineUserContext.Provider>
  );
}
