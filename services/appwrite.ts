import { Client, Account, Databases, Storage, Avatars } from 'appwrite';

const client = new Client();

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

if (!endpoint || !projectId) {
  console.warn("Appwrite configuration missing. Please check NEXT_PUBLIC_APPWRITE_ENDPOINT and NEXT_PUBLIC_APPWRITE_PROJECT_ID");
}

client
  .setEndpoint(endpoint || "https://cloud.appwrite.io/v1") // Fallback to cloud if missing, prevents crash but might fail auth
  .setProject(projectId || "");

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);

export { client };
