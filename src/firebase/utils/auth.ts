import { doc, getDoc } from "firebase/firestore";
import { db } from "../Firebase";

class authService {
  async checkUser(jwt: any) {
    const userRef = doc(db, "users", jwt);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
    } else {
      return false;
    }
  }
}

export default authService;
