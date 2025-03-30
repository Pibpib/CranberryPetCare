import { createContext, useContext, useEffect, useState } from "react";
import { databases } from "@/lib/appwrite";
import { ID, Permission, Role, Query } from "react-native-appwrite";

export const REMINDER_DATABASE_ID = "67dc12010001c35043dd"; 
export const REMINDER_COLLECTION_ID = "67e56e4b00320f59c79d"; 

const ReminderDataContext = createContext<any>(null);

export function useReminderData() {
  return useContext(ReminderDataContext);
}

export function ReminderDataProvider(props: any) {
  const [reminders, setReminders] = useState<any>([]);

  // Add a new reminder
  async function addReminder(reminder: any, userId: string, petId: string) {
    try {
      const reminderData = {
        ...reminder,
        userId: userId,
        petId: petId,
        dateTime: new Date(reminder.dateTime).toISOString() // Convert date to ISO string
      };

      const response = await databases.createDocument(
        REMINDER_DATABASE_ID,
        REMINDER_COLLECTION_ID,
        ID.unique(), // Generate a unique ID for the reminder
        reminderData,
        [
          Permission.write(Role.user(userId)),
          Permission.read(Role.user(userId)),
        ]
      );

      console.log("Reminder Added:", response);
      // Optionally update the reminders list after adding a new reminder
    } catch (error) {
      console.error("Failed to add reminder:", error);
    }
  }

  // Modify an existing reminder by ID
  async function modifyReminder(id: string, reminderData: any) {
    try {
      const response = await databases.updateDocument(
        REMINDER_DATABASE_ID,
        REMINDER_COLLECTION_ID,
        id,
        reminderData
      );
      setReminders((prevReminders: any) =>
        prevReminders.map((reminder: any) =>
          reminder.$id === id ? { ...reminder, ...response } : reminder
        )
      );
      console.log("Reminder modified:", response);
    } catch (error: any) {
      console.error("Failed to modify reminder:", error.message);
    }
  }

  // Remove a reminder by ID
  async function removeReminder(id: string) {
    try {
      await databases.deleteDocument(REMINDER_DATABASE_ID, REMINDER_COLLECTION_ID, id);
      setReminders((prevReminders: any) => prevReminders.filter((reminder: any) => reminder.$id !== id));
      console.log("Reminder removed:", id);
    } catch (error: any) {
      console.error("Failed to remove reminder:", error.message);
    }
  }

  // Initialize the reminder data (fetch the list of reminders)
  async function initReminders() {
    try {
      const response = await databases.listDocuments(
        REMINDER_DATABASE_ID,
        REMINDER_COLLECTION_ID,
        [Query.orderDesc("$createdAt"), Query.limit(10)]
      );
      setReminders(response.documents);
    } catch (error: any) {
      console.error("Failed to fetch reminders:", error.message);
    }
  }

  useEffect(() => {
    initReminders();
  }, []);

  return (
    <ReminderDataContext.Provider value={{ current: reminders, addReminder, modifyReminder, removeReminder }}>
      {props.children}
    </ReminderDataContext.Provider>
  );
}