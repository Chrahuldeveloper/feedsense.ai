const conf = {
  appWriteUrl: String(process.env.NEXT_PUBLIC_APPWRITE_URL),
  appWriteProjectId: String(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID),
  appWriteDatabaseId: String(process.env.NEXT_PUBLIC_APP_DATABASE_ID),
  appWriteCollectionId: String(process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID),
};

export default conf;
