import { Client, Databases, Account } from "react-native-appwrite"

import { Query } from 'react-native-appwrite';

const client = new Client()
.setEndpoint("https://cloud.appwrite.io/v1")
.setProject('67dc0ee60035456b5747')

export const account = new Account(client);
export const databases = new Databases(client);

import { ID } from "react-native-appwrite";

const DATABASE_ID = '67dc12010001c35043dd'; // replace this with your actual database ID
const REMINDER_COLLECTION_ID = '67e56e4b00320f59c79d'; // replace this with your actual collection ID

export async function createReminder(data: {
  title: string;
  notes: string;
  type: string;
  dateTime: Date;
  userId: string;
  petId: string;
}) {
  try {
    await databases.createDocument(
      DATABASE_ID,
      REMINDER_COLLECTION_ID,
      ID.unique(),
      {
        title: data.title,
        notes: data.notes,
        type: data.type,
        dateTime: data.dateTime,  // Store as Date object
        userId: data.userId,
        petId: data.petId,
      }
    );
  } catch (error) {
    console.error('Error creating reminder:', error);
  }
}

export async function getReminders(userId: string, petId: string) {
  return await databases.listDocuments(DATABASE_ID, REMINDER_COLLECTION_ID, [
    Query.equal('userId', userId),
    Query.equal('petId', petId),
  ]);
}
