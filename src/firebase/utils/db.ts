import { db } from "../Firebase";
import { arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

interface User {
  uid: string;
  email: string;
}

export default class dbService {
  async savewebsite(
    user: User,
    data: { name: string; url: string; type: string }
  ) {
    try {
      const userDocRef = doc(db, "USERS", user.uid);

      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        await updateDoc(userDocRef, {
          websites: arrayUnion(data),
        });
      } else {
        await setDoc(userDocRef, {
          websites: [data],
        });
      }

      console.log("data saved");
    } catch (error) {
      console.log(error);
    }
  }

  async saveFeedBack(
    user: User,
    data: { name: string; email: string; feedback: string }
  ) {
    try {
      const userDocRef = doc(db, "USERS", user.uid);
      const docSnap = await getDoc(userDocRef);

      const website = docSnap.data()?.websites;

      const updatedWebsiteFeedBack = [...website.feedback, data.feedback];

      await updateDoc(userDocRef, {
        updatedWebsiteFeedBack,
      });

      console.log("done");
    } catch (error) {
      console.log(error);
    }
  }
}
