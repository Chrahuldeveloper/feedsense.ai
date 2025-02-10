"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../firebase/Firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { GoogleAuthProvider, UserCredential } from "firebase/auth";
import { Mail, Lock } from "lucide-react";
import Cookies from "js-cookie";
import SendEmail from "../../emailJs/Email";
import Loader from "../../components/Loader";
import Image from "next/image";
import LottiePlayer from "react-lottie-player";
import Login from "../lottie-asserts/Login.json";
interface UserData {
  email: string;
  password: string;
}

type ErrorMessage = string;

export default function LoginPage() {
  const navigate = useRouter();
  const provider = new GoogleAuthProvider();

  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>("");

  const [data, setData] = useState<UserData>({
    email: "",
    password: "",
  });

  const Email = new SendEmail();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (): Promise<void> => {
    if (Object.values(data).every((i) => i !== "")) {
      setIsLoading(true);
      try {
        const userCredential: UserCredential = await signInWithEmailAndPassword(
          auth,
          data.email,
          data.password
        );
        const user = userCredential.user;
        console.log(user);
        const message = `Thank you for logging in ${user.displayName}! If you need any help navigating your account or have questions, we&apos;re just a message away.`;
        Email.sendLoginEmail(
          user.email!.toString(),
          user.displayName!.toString(),
          message
        );
        Cookies.set("auth-token", "authenticated", { expires: 1 });
        navigate.push("/dashboard");
      } catch (error: unknown) {
        setError(true);
        setIsLoading(false);
        setErrorMessage("Invalid credentials.");
      }
    } else {
      alert("Enter all the details");
    }
  };

  const googleSignIn = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const userCredential: UserCredential = await signInWithPopup(
        auth,
        provider
      );
      const user = userCredential.user;
      console.log(user);
      const message = `Thank you for logging in ${user.displayName}! If you need any help navigating your account or have questions, we're just a message away.`;
      Email.sendLoginEmail(
        user.email!.toString(),
        user.displayName!.toString(),
        message
      );
      Cookies.set("auth-token", "authenticated", { expires: 1 });
      navigate.push("/dashboard");
    } catch (error: unknown) {
      console.log(error);
      setError(true);
      setIsLoading(false);
      setErrorMessage("Google sign-in failed. Please try again.");
    }
  };

  return (
    <div className="bg-[#000000] w-full overflow-hidden min-h-screen relative">
      {/* {error && <ErrorModel message={errorMessage} setError={setError} />} */}
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

          {error && (
            <div>
              <h1 className="text-red-500 text-center mt-5">{errorMessage}</h1>
            </div>
          )}

          <div>
            <LottiePlayer
              loop
              animationData={Login}
              play
              className="w-72 mx-auto"
            />
          </div>

          {/* <div className="space-y-6 my-8">
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
            <button
              onClick={handleSubmit}
              className="w-full py-2 px-4 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-600 text-white rounded-lg  transition-colors mt-4"
            >
              Login
            </button>
          </div> */}
          <div className="flex flex-col items-center justify-between mt-2 text-sm text-slate-400">
            <button
              onClick={googleSignIn}
              className="flex w-full justify-center items-center space-x-2 text-white bg-gradient-to-r from-blue-400 via-blue-600 to-blue-700 py-2 px-4 rounded-lg mt-5"
            >
              <Image
                className="w-6 h-6 mr-2"
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google logo"
                width={24}
                height={24}
              />
              <span>Sign in with Google</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
