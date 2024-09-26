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
  async saveUser({ email, password, name }: userdata) {
    try {
      return databases.createDocument(
        "users",
        "66f56afc00221626c5ed",
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
