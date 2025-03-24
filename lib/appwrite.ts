import { Client, Databases, Account } from "react-native-appwrite"

const client = new Client()
.setEndpoint("https://cloud.appwrite.io/v1")
.setProject('67dc0ee60035456b5747')

export const account = new Account(client);
export const databases = new Databases(client);