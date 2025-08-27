"use client";
import { signOut } from "firebase/auth";
import { auth } from "../Firebase";
import Cookies from "js-cookie";

class authService {

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
