import { db } from "../Firebase";
import { arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import cache from "../../cache/cache";

interface User {
  uid: string;
  email: string;
}

export default class dbService {
  async deleteWebsite(userId: string, websiteName: string) {
    try {
      const userDocRef = doc(db, "USERS", userId);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        const websites = docSnap.data()?.websites || [];
        const updatedWebsites = websites.filter(
          (website: { name: string }) => website.name !== websiteName
        );

        await updateDoc(userDocRef, {
          websites: updatedWebsites,
        });

        console.log("Website deleted successfully");
        cache.set(userId, updatedWebsites);
      } else {
        console.error("User not found");
      }
    } catch (error) {
      console.error("Error deleting website:", error);
    }
  }

  async saveWebsite(
    user: User,
    data: { id: string; name: string; url: string; type: string }
  ) {
    try {
      const userDocRef = doc(db, "USERS", user.uid);
      const docSnap = await getDoc(userDocRef);
      let updatedWebsites: any[] = [];

      if (docSnap.exists()) {
        await updateDoc(userDocRef, {
          websites: arrayUnion(data),
        });
        updatedWebsites = [...docSnap.data().websites, data];
      } else {
        await setDoc(userDocRef, {
          websites: [data],
        });
        updatedWebsites = [data];
      }

      console.log("Website data saved successfully");
      cache.set(user.uid, updatedWebsites);
    } catch (error) {
      console.error("Error saving website:", error);
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
        const userWebsites = docSnap.data()?.websites || [];
        cache.set(user.uid, userWebsites);
        return userWebsites;
      } else {
        console.error("User does not exist");
        return [];
      }
    } catch (error) {
      console.error("Error fetching websites:", error);
      return [];
    }
  }

  async fetchDashboardDetails(user: any) {
    try {
      const cachedDashboard = cache.get(`${user}-dashboard`);

      if (cachedDashboard) {
        console.log("Fetched dashboard details from cache");
        return cachedDashboard;
      }

      const userDocRef = doc(db, "USERS", user);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        const websites = docSnap.data()?.websites || [];
        const totalFeedback = websites.reduce(
          (total: number, site: any) => total + (site.feedback?.length || 0),
          0
        );
        const totalWebsites = websites.length;

        const dashboardDetails = { totalWebsites, totalFeedback };
        cache.set(`${user}-dashboard`, dashboardDetails);
        return dashboardDetails;
      } else {
        console.error("User does not exist");
        return null;
      }
    } catch (error) {
      console.error("Error fetching dashboard details:", error);
      return null;
    }
  }

  async fetchFeedbacks(user: any) {
    try {
      const cachedFeedbacks = cache.get(`${user}-feedbacks`);

      if (cachedFeedbacks) {
        console.log("Fetched feedbacks from cache");
        return cachedFeedbacks;
      }

      const userDocRef = doc(db, "USERS", user);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        const websites = docSnap.data()?.websites || [];
        const allFeedbacks = websites.flatMap(
          (website: any) => website.feedback || []
        );
        cache.set(`${user}-feedbacks`, allFeedbacks);
        return allFeedbacks;
      } else {
        console.error("User does not exist");
        return [];
      }
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
      return [];
    }
  }

  async saveFeedback(
    userID: string,
    websiteIndex: number,
    data: { name: string; email: string; feedback: string }
  ) {
    try {
      const userDocRef = doc(db, "USERS", userID);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        const websites = docSnap.data()?.websites || [];

        if (websites[websiteIndex]) {
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
          cache.set(userID, websites);
        } else {
          console.error("Website not found at the specified index");
        }
      } else {
        console.error("User not found");
      }
    } catch (error) {
      console.error("Error saving feedback:", error);
    }
  }

  async subscribe(user: any) {
    try {
      const userDocRef = doc(db, "USERS", user);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        await updateDoc(userDocRef, {
          subscribe: true,
        });
        console.log("User subscribed successfully");
      } else {
        console.error("User does not exist");
      }
    } catch (error) {
      console.error("Error subscribing user:", error);
    }
  }

  async isSubscribed(user: any) {
    try {
      const userDocRef = doc(db, "USERS", user);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        return docSnap.data()?.subscribe || false;
      } else {
        console.error("User does not exist");
        return false;
      }
    } catch (error) {
      console.error("Error checking subscription status:", error);
      return false;
    }
  }
}
