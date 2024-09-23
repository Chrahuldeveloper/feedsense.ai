import conf from "../config/config";
import { Client, Account, ID } from "appwrite";

const client = new Client();

client.setEndpoint(conf.appWriteUrl).setProject(conf.appWriteProjectId);

export const account = new Account(client);

type creatUserAccountType = {
  email: string;
  password: string;
  name: string;
};

class AppWriteService {
  async creatUserAccount({ email, password, name }: creatUserAccountType) {
    try {
      await account.create(ID.unique(), email, password, name);
    } catch (error) {
      console.log(error);
    }
  }
}
