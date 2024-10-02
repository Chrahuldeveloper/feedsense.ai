import { db } from "../Firebase";
import { doc, setDoc } from "firebase/firestore";

interface User {
  uid: string;
  email: string;
}

export default class dbService {
  async savewebsite(user: User, data: any) {
    try {
      await setDoc(doc(db, "USERS", user.uid), {
        data,
      });
    } catch (error) {
      console.log(error);
    }
  }
}
