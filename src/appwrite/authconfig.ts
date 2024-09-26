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

type userLoginType = {
  email: string;
  password: string;
};

class AppWriteService {
  async login({ email, password }: userLoginType) {
    return account.createEmailPasswordSession(email, password);
  }

  async logOut() {
    try {
      return await account.deleteSession("current");
    } catch (error) {
      console.log(error);
    }
  }

  async currentUser() {
    try {
      return account.get();
    } catch (error) {
      console.log(error);
    }
  }

  async isLogin(): Promise<boolean> {
    try {
      const data = await this.currentUser();
      return Boolean(data);
    } catch (error) {
      console.log(error);
    }

    return false;
  }

  async creatUserAccount({ email, password, name }: creatUserAccountType) {
    try {
      const userAccount = await account.create(
        ID.unique(),
        email,
        password,
        name
      );

      if (userAccount) {
        this.login({ email, password });
      }
    } catch (error) {
      console.log(error);
    }
  }
}

export default AppWriteService;
