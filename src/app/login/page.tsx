"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../firebase/Firebase";
import { signInWithPopup } from "firebase/auth";
import { GoogleAuthProvider, UserCredential } from "firebase/auth";
import Cookies from "js-cookie";
import SendEmail from "../../emailJs/Email";
import Loader from "../../components/Loader";
import Image from "next/image";
import dynamic from "next/dynamic";
import { PiGoogleChromeLogo } from "react-icons/pi";

type ErrorMessage = string;

export default function LoginPage() {
  const LottiePlayer = dynamic(() => import("react-lottie-player"), {
    ssr: false,
  });
  const navigate = useRouter();
  const provider = new GoogleAuthProvider();

  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>("");

  const Email = new SendEmail();
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
      localStorage.setItem("authstate", "true");
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
    <div className="min-h-screen bg-gradient-to-br from-[#172038] to-black flex items-center justify-center px-4">
      {error ? <p className="text-red-500">Error while signing in</p> : null}
      <div className="bg-[##0e0f11] border border-[#282e32] shadow-2xl rounded-xl p-8 w-full max-w-md text-center relative z-10">
        <div className="mb-6 flex justify-center">
          <div className="w-12 h-12 rounded-full bg-[#0f172a] flex items-center justify-center shadow-[0_0_15px_2px_rgba(0,255,255,0.4)]">
            <PiGoogleChromeLogo size={28} color="#00bfff" />
          </div>
        </div>

        <h1 className="text-white text-xl md:text-2xl lg:text-3xl font-semibold mb-4">
          Welcome to FeedSenseAI
        </h1>
        <p className="text-gray-400 text-sm mb-6">
          Sign in with Google to access your feedback analytics dashboard
        </p>

        <button
          onClick={googleSignIn}
          className="w-full flex items-center justify-center bg-[#00b4ff] hover:bg-[#00a2e3] transition-colors  py-2 rounded-lg text-sm font-medium shadow-lg text-black"
        >
          <Image
            className="w-5 h-5 mr-2"
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google logo"
            width={20}
            height={20}
          />
          Continue with Google
        </button>

        <p className="text-gray-500 text-xs mt-8 ">
          By signing in, you agree to our{" "}
          <span className="underline cursor-pointer">Terms of Service</span> and{" "}
          <span className="underline cursor-pointer">Privacy Policy</span>
        </p>
      </div>
    </div>
  );
}
