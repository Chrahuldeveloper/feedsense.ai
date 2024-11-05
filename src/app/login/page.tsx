"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../firebase/Firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { Mail, Lock, ArrowRight } from "lucide-react";
import Cookies from "js-cookie";
import SendEmail from "../../emailJs/Email";
import Loader from "../../components/Loader";
import ErrorModel from "@/components/ErrorModel";

export default function LoginPage() {
  const navigate = useRouter();
  const provider = new GoogleAuthProvider();

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const Email = new SendEmail();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (Object.values(data).every((i) => i !== "")) {
      setIsLoading(true);
      try {
        const user = await signInWithEmailAndPassword(
          auth,
          data.email,
          data.password
        );
        console.log(user.user);
        const message = `Thank you for logging in ${user.user.displayName}! If you need any help navigating your account or have questions, we're just a message away.`;
        Email.sendLoginEmail(user.user.email, user.user.displayName, message);
        Cookies.set("auth-token", "authenticated", { expires: 1 });
        navigate.push("/plans");
      } catch (error: any) {
        console.log(error.code);
        setError(true);
        setIsLoading(false);
        if (error.code === "auth/invalid-credential") {
          setErrorMessage("Invalid credentials.");
        } else if (error.code === "auth/email-already-in-use") {
          setErrorMessage("Mail already in Use.");
        } else if (error.code === "auth/wrong-password") {
          setErrorMessage("Incorrect password.");
        } else {
          setErrorMessage("An error occurred. Please try again.");
        }
      }
    } else {
      alert("Enter all the details");
    }
  };

  const googleSignIn = async () => {
    setIsLoading(true);
    try {
      const user = await signInWithPopup(auth, provider);
      console.log(user.user);
      const message = `Thank you for logging in ${user.user.displayName}! If you need any help navigating your account or have questions, we're just a message away.`;
      Email.sendLoginEmail(user.user.email, user.user.displayName, message);
      Cookies.set("auth-token", "authenticated", { expires: 1 });
      navigate.push("/plans");
    } catch (error: any) {
      console.log(error);
      setError(true);
      setIsLoading(false);
      setErrorMessage("Google sign-in failed. Please try again.");
    }
  };

  return (
    <div className="bg-[#000000] w-full overflow-hidden min-h-screen relative">
      {error && (
        <ErrorModel message={errorMessage} setError={setError} />
      )}
      {isLoading && <Loader message="Loading" />}

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 right-96 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500 rounded-full opacity-20 blur-[120px]" />
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-blue-500 rounded-full opacity-15 blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[700px] h-[700px] bg-blue-600 rounded-full opacity-10 blur-[130px]" />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen pt-14">
        <div className="bg-[#121212] p-8 rounded-lg w-full max-w-md mx-auto border-[#282e32] border-[1px] shadow-2xl">
          <div className="space-y-6 text-center">
            <h1 className="text-3xl font-bold text-white">Welcome back</h1>
            <p className="text-sm font-semibold text-slate-400">
              Sign in or Login to your account
            </p>
          </div>

          <div className="space-y-6 mt-8">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-slate-300"
              >
                Email
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  id="email"
                  type="email"
                  value={data.email}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                  autoComplete="email"
                  className="bg-[#1E1E1E] border-[1px] border-[#282e32] pl-10 pr-4 py-2 w-full rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Enter your email"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-slate-300"
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  id="password"
                  type="password"
                  value={data.password}
                  onChange={(e) =>
                    setData({ ...data, password: e.target.value })
                  }
                  autoComplete="current-password"
                  className="bg-[#1E1E1E] border-[1px] border-[#282e32] pl-10 pr-4 py-2 w-full rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Enter your password"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="bg-gradient-to-r from-blue-400 via-blue-600 to-blue-700 mt-8 text-white py-2 px-4 w-full font-semibold rounded-lg flex items-center justify-center"
          >
            <span>Login</span>
            <ArrowRight className="ml-2" size={18} />
          </button>

          <div className="mt-6 text-center">
            <span className="text-slate-400">
              Sign In or Login into your account
            </span>
          </div>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#121212] text-slate-400">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={googleSignIn}
                className="w-full bg-white text-black py-2 px-4 rounded-lg font-semibold flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <img
                  className="w-6 h-6 mr-2"
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google logo"
                />
                Log in with Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
