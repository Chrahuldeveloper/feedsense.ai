import conf from "../config/config";
import { Client, Databases, ID } from "appwrite";

const client = new Client();
client.setEndpoint(conf.appWriteUrl).setProject(conf.appWriteProjectId);

export const databases = new Databases(client);

type userdata = {
  email: string;
  password: string;
  name: string;
};

class DatabasesService {
  async saveWebsite(userId: string, websiteData: object) {
    try {
      const userDoc = await databases.getDocument(
        "users",
        "66f6d054000e132d6845",
        userId
      );

      const updateDoc = {
        ...userDoc,
        websites: userDoc.websites
          ? [...userDoc.websites, websiteData]
          : [websiteData],
      };

      return databases.updateDocument(
        "users",
        "66f6d054000e132d6845",
        userId,
        updateDoc
      );
    } catch (error) {
      console.log(error);
    }
  }

  async saveUser({ email, password, name }: userdata) {
    try {
      return databases.createDocument(
        "users",
        "66f6d054000e132d6845",
        ID.unique(),
        {
          email,
          password,
          name,
        }
      );
    } catch (error) {
      console.log(error);
    }
  }
}

export default DatabasesService;
