import { createContext, useContext, useEffect, useState } from "react";
import { databases } from "@/lib/appwrite";
import { ID, Permission, Role, Query } from "react-native-appwrite";

export const REMINDER_DATABASE_ID = "67dc12010001c35043dd";
export const REMINDER_COLLECTION_ID = "67e56e4b00320f59c79d";

const ReminderContext = createContext<any>(null);

export function useReminderData() {
  return useContext(ReminderContext);
}

export function ReminderDataProvider(props: any) {
  const [reminders, setReminders] = useState<any[]>([]);

  async function addReminder(reminder: any) {
    const response = await databases.createDocument(
      REMINDER_DATABASE_ID,
      REMINDER_COLLECTION_ID,
      ID.unique(),
      reminder,
      [Permission.write(Role.user(reminder.userId))]
    );
    console.log("Added reminder:", response);
    setReminders((prev) => [response, ...prev]);
  }

  async function deleteReminder(id: string) {
    await databases.deleteDocument(REMINDER_DATABASE_ID, REMINDER_COLLECTION_ID, id);
    setReminders((prev) => prev.filter((r) => r.$id !== id));
  }

  async function fetchReminders() {
    const res = await databases.listDocuments(
      REMINDER_DATABASE_ID,
      REMINDER_COLLECTION_ID,
      [Query.orderAsc("dateTime")]
    );
    setReminders(res.documents);
  }

  async function fetchRemindersFromPetId(petId?: string) {
    const queries = [Query.orderAsc("dateTime")];
    if (petId) {
      queries.push(Query.equal("petId", petId));
    }
  
    const res = await databases.listDocuments(
      REMINDER_DATABASE_ID,
      REMINDER_COLLECTION_ID,
      queries
    );
    setReminders(res.documents);
  }
  

  useEffect(() => {
    fetchReminders();
  }, []);

  return (
    <ReminderContext.Provider value={{ reminders, addReminder, deleteReminder, fetchReminders, fetchRemindersFromPetId }}>
      {props.children}
    </ReminderContext.Provider>
  );
}
