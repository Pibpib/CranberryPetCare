import { ID, Permission, Role, Query } from "react-native-appwrite";
import { createContext, useContext, useEffect, useState } from "react";
import { databases } from "@/lib/appwrite";

export const ACTIVITY_DATABASE_ID = "67dc12010001c35043dd";
export const ACTIVITY_COLLECTION_ID = "67e11ac400369d2505f6"; 

const LogDataContext = createContext<any>(null);

export function useLogData() {
  return useContext(LogDataContext);
}

export function LogDataProvider(props: any) {
  const [activityLogs, setActivityLogs] = useState<any[]>([]);

  // Add a new activity log
  async function add(activity: any) {
    try {
      const response = await databases.createDocument(
        ACTIVITY_DATABASE_ID,
        ACTIVITY_COLLECTION_ID,
        ID.unique(),
        activity,
        [Permission.write(Role.user(activity.userId))]
      );
      console.log("Activity log added:", response);
      setActivityLogs((logs: any) => [response, ...logs].slice(0, 10));
    } catch (error) {
      console.error("Error adding activity log:", error);
    }
  }

  // Remove an activity log
  async function remove(id: string) {
    try {
      await databases.deleteDocument(ACTIVITY_DATABASE_ID, ACTIVITY_COLLECTION_ID, id);
      setActivityLogs((logs: any) => logs.filter((log: any) => log.$id !== id));
    } catch (error) {
      console.error("Error removing activity log:", error);
    }
  }

  // Initialize the list of activity logs
  async function init() {
    try {
      const response = await databases.listDocuments(
        ACTIVITY_DATABASE_ID,
        ACTIVITY_COLLECTION_ID,
        [Query.orderDesc("$createdAt"), Query.limit(10)]
      );
      setActivityLogs(response.documents);
    } catch (error) {
      console.error("Error fetching activity logs:", error);
    }
  }

  // Load activity logs on component mount
  useEffect(() => {
    init();
  }, []);

  return (
    <LogDataContext.Provider value={{ current: activityLogs, add, remove }}>
      {props.children}
    </LogDataContext.Provider>
  );
}
