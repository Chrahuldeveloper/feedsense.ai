"use client";
// import { doc, getDoc } from "firebase/firestore";
// import { db } from "../Firebase";
import { signOut } from "firebase/auth";
import { auth } from "../Firebase";
import Cookies from "js-cookie";

class authService {
  // async checkUser(jwt: any) {
  //   const userRef = doc(db, "users", jwt);
  //   const userSnap = await getDoc(userRef);
  //   if (userSnap.exists()) {
  //   } else {
  //     return false;
  //   }
  // }

  async signOut() {
    try {
      await signOut(auth);
      Cookies.remove("auth-token");
      console.log("sign out successfully");
    } catch (error) {
      console.log(error);
    }
  }
}

export default authService;
