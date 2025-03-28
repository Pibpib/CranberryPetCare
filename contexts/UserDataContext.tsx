import { ID, Permission, Role, Query } from "react-native-appwrite";
import { createContext, useContext, useEffect, useState } from "react";
import { databases } from "@/lib/appwrite";
import { account } from "@/lib/appwrite";


export const USER_DATABASE_ID = "67dc12010001c35043dd"; // Replace with your database ID
export const USER_COLLECTION_ID = "67dc120b001980acc4fb"; // Replace with your collection ID

const DataContext = createContext<any>(null);

export function useData() {
  return useContext(DataContext);
}

export function DataProvider(props:any) {
  const [ideas, setIdeas] = useState<any>([]);

  async function add(item:any) {
    const response = await databases.createDocument(
      USER_DATABASE_ID,
      USER_COLLECTION_ID,
      ID.unique(),
      item,
      [Permission.write(Role.user(item.userId))]
    );
    console.log( item )
    setIdeas((items:any) => [response, ...items].slice(0, 10));
  }

  async function remove(id:string) {
    await databases.deleteDocument(USER_DATABASE_ID, USER_COLLECTION_ID, id);
    setIdeas((ideas:any) => ideas.filter((idea:any) => idea.$id !== id));
    await init(); // Refetch ideas to ensure we have 10 items
  }

  async function init() {
    try {
      const session = await account.get(); // Check if user session exists
      if (!session) return; // No session, exit quietly
  
      const response = await databases.listDocuments(
        USER_DATABASE_ID,
        USER_COLLECTION_ID,
        [Query.orderDesc("$createdAt"), Query.limit(10)]
      );
      setIdeas(response.documents);
    } catch (err) {
      console.log("No session or failed to fetch ideas:", err);
    }
  }
  useEffect(() => {
    account.get()
      .then(() => init())
      .catch(() => console.log("No user session, skipping data fetch"));
  }, []);

  return (
    <DataContext.Provider value={{ current: ideas, add, remove }}>
      {props.children}
    </DataContext.Provider>
  );
}
