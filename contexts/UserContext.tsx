import { ID } from "react-native-appwrite";
import { createContext, useContext, useEffect, useState } from "react";
import { account, databases} from "../lib/appwrite";
import { USER_DATABASE_ID, USER_COLLECTION_ID } from "./UserDataContext";
import { Query } from "react-native-appwrite";


const UserContext = createContext<any>(null);

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider(props: any) {
  const [user, setUser] = useState<any>(null);

  async function login(email: string, password: string) {
    try {
      const session = await account.createEmailPasswordSession(email, password);
      const loggedInUser = await account.get();
      setUser(loggedInUser);
      console.log("Login successful", loggedInUser);
      return loggedInUser;
    } catch (error: any) {
      console.error("Login failed:", error.message);
      return null;
    }
  }

  async function logout() {
    try {
      await account.deleteSession("current");
      setUser(null);
      console.log("Logout successful");
    } catch (error: any) {
      console.error("Logout failed:", error.message);
    }
  }

  async function register(email: string, password: string) {
    try {
      await account.create(ID.unique(), email, password);
      return await login(email, password);
    } catch (error: any) {
      console.error("Registration failed:", error.message);
      return null;
    }
  }

  async function updateUser(data: { name: string; email: string; phone: string }) {
    if (!user) {
      console.error("No user to update.");
      return null;
    }
  
    try {
      //find user's document
      const response = await databases.listDocuments(
        USER_DATABASE_ID,
        USER_COLLECTION_ID,
        [Query.equal("userId", user.$id)]
      );
  
      if (response.total === 0) {
        console.error("User document not found.");
        return null;
      }
  
      const userDocId = response.documents[0].$id;
  
      //update the document
      const updated = await databases.updateDocument(
        USER_DATABASE_ID,
        USER_COLLECTION_ID,
        userDocId,
        {
          name: data.name,
          email: data.email,
          phone: data.phone,
        }
      );
  
      setUser({ ...user, name: data.name, email: data.email, phone: data.phone });
  
      console.log("User updated:", updated);
      return updated;
    } catch (error: any) {
      console.error("Failed to update user:", error.message);
      return null;
    }
  }
  
  
  async function init() {
    try {
      const currentUser = await account.get();
      setUser(currentUser);
      console.log("User session restored:", currentUser);
    } catch (error) {
      console.log("No active session found");
      setUser(null);
    }
  }

  async function getUser() {
    try {
      const currentUser = await account.get();
      setUser(currentUser);
      return currentUser;
    } catch (error : any) {
      console.error("Error fetching user:", error.message);
      setUser(null);
      return null;
    }
  }  

    

  useEffect(() => {
    init();
  }, []);

  return (
    <UserContext.Provider value={{ current: user, login, logout, register, getUser, updateUser }}>
      {props.children}
    </UserContext.Provider>
  );
}
