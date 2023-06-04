import { Storage, Account, Client, Databases, ID } from 'appwrite';

const client = new Client();

client
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject(process.env.NEXT_PUBLIC_APPWRITER_PROJECT_ID!);

const databases = new Databases(client);
const account = new Account(client);
const storage = new Storage(client);

export { client, account, databases, storage, ID };
