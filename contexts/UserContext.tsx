import { ID } from "react-native-appwrite";
import { createContext, useContext, useEffect, useState } from "react";
import { account } from "../lib/appwrite";

const UserContext = createContext<any>(null);

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider(props: any) {
  const [user, setUser] = useState<any>(null);

  // ✅ Login Function with Error Handling
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

  // ✅ Logout Function with Confirmation
  async function logout() {
    try {
      await account.deleteSession("current");
      setUser(null);
      console.log("Logout successful");
    } catch (error: any) {
      console.error("Logout failed:", error.message);
    }
  }

  // ✅ Registration with Auto-Login
  async function register(email: string, password: string) {
    try {
      await account.create(ID.unique(), email, password);
      return await login(email, password);
    } catch (error: any) {
      console.error("Registration failed:", error.message);
      return null;
    }
  }
  

  // ✅ Initialize Session on App Start
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

  useEffect(() => {
    init();
  }, []);

  return (
    <UserContext.Provider value={{ current: user, login, logout, register }}>
      {props.children}
    </UserContext.Provider>
  );
}
