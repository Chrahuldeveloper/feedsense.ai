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
    userID: any,
    websiteIndex: any,
    data: { name: string; email: string; feedback: string }
  ) {
    try {
      const userDocRef = doc(db, "USERS", userID);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        const websites = docSnap.data()?.websites;

        if (websites && websites[websiteIndex]) {
          const currentFeedback = websites[websiteIndex].feedback || [];

          const updatedWebsite = {
            ...websites[websiteIndex],
            feedback: [...currentFeedback, data],
          };

          websites[websiteIndex] = updatedWebsite;

          await updateDoc(userDocRef, {
            websites,
          });

          console.log("Feedback saved successfully");
        } else {
          console.log("Website not found");
        }
      } else {
        console.log("User not found");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async fetchWebsites(user: any) {
    const userDocRef = doc(db, "USERS", user);

    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const usertWebsites = docSnap.data()?.websites;
      return usertWebsites;
    } else {
      return "user not exitsts";
    }
  }
}
