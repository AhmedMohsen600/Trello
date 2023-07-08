import { ID, storage } from '@/appwrite';

export const uploadImage = async (file: File) => {
  if (!file) return;
  const fileUploaded = await storage.createFile(
    process.env.NEXT_PUBLIC_BUCKET_ID!,
    ID.unique(),
    file
  );
  return fileUploaded;
};
