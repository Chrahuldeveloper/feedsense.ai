import { db } from "../Firebase";
import { arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import cache from "../../cache/cache";

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

      let updatedWebsites;

      if (docSnap.exists()) {
        await updateDoc(userDocRef, {
          websites: arrayUnion(data),
        });

        updatedWebsites = [...docSnap.data().websites, data];

        cache.set(user.uid, updatedWebsites);
      } else {
        await setDoc(userDocRef, {
          websites: [data],
        });
        updatedWebsites = [data];
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

          console.log("Feedback and task saved successfully");
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
    try {
      const cachedWebsites = cache.get(user.uid);

      if (cachedWebsites) {
        console.log("Fetched websites from cache");
        return cachedWebsites;
      }

      const userDocRef = doc(db, "USERS", user.uid);

      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        const userWebsites = await docSnap.data()?.websites;
        cache.set(user.uid, userWebsites);
        return userWebsites;
      } else {
        return "user not exitsts";
      }
    } catch (error) {
      console.log(error);
    }
  }

  async fetchDashBoardDetails(user: any) {
    try {
      const userDocRef = doc(db, "USERS", user);

      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        const websites = await docSnap.data()?.websites;

        const totalFeedback = websites.reduce(
          (total: any, user: any) => total + user.feedback.length,
          0
        );

        const totalWebsites = await docSnap.data()?.websites.length;

        return { totalWebsites, totalFeedback };
      } else {
        return "user not exitsts";
      }
    } catch (error) {
      console.log(error);
    }
  }

  async fetchFeedbacks(user: any) {
    try {
      const userDocRef = doc(db, "USERS", user);

      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        const websites = await docSnap.data()?.websites;
        if (websites && websites.length > 0) {
          const allFeedbacks = [];

          for (let i = 0; i < websites.length; i++) {
            const feedbackArray = websites[i].feedback || [];

            for (let j = 0; j < feedbackArray.length; j++) {
              allFeedbacks.push(feedbackArray[j].feedback);
            }
          }

          return allFeedbacks;
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async Subcribe(user: any) {
    try {
      const userDocRef = doc(db, "USERS", user);

      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        await updateDoc(userDocRef, {
          subscribe: "true",
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
  async isSubcribe(user: any) {
    try {
      const userDocRef = doc(db, "USERS", user);

      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        return docSnap.data()?.subscribe;
      }
    } catch (error) {
      console.log(error);
    }
  }
}
