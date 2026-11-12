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
import { HiOutlineSparkles } from "react-icons/hi2";
import { FiShield, FiZap, FiBarChart2 } from "react-icons/fi";

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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#05070a] px-4 py-10 text-white antialiased">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .fsl-root{font-family:'Plus Jakarta Sans',ui-sans-serif,system-ui,sans-serif}
        @keyframes fsl-a{0%,100%{transform:translate3d(0,0,0) scale(1)}50%{transform:translate3d(70px,40px,0) scale(1.15)}}
        @keyframes fsl-b{0%,100%{transform:translate3d(0,0,0) scale(1.1)}50%{transform:translate3d(-60px,-30px,0) scale(.95)}}
        .fsl-a{animation:fsl-a 16s ease-in-out infinite}.fsl-b{animation:fsl-b 20s ease-in-out infinite}
        @media (prefers-reduced-motion:reduce){.fsl-a,.fsl-b{animation:none!important}}
      `}</style>

      {isLoading && <Loader message="Signing you in" />}

      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="fsl-a absolute -left-32 -top-32 h-[34rem] w-[34rem] rounded-full bg-cyan-500/25 blur-[120px]" />
        <div className="fsl-b absolute -bottom-40 -right-32 h-[36rem] w-[36rem] rounded-full bg-violet-600/25 blur-[130px]" />
        <div
          className="absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className="fsl-root relative z-10 w-full max-w-md">
        <div className="rounded-3xl bg-gradient-to-b from-white/30 via-white/[0.06] to-cyan-400/30 p-px shadow-[0_30px_90px_-30px_rgba(34,211,238,0.45)]">
          <div className="rounded-[23px] bg-[#0a0d12]/95 p-8 text-center backdrop-blur-xl sm:p-10">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-500 text-[#05070a] shadow-[0_0_50px_-5px_rgba(34,211,238,0.7)]">
              <HiOutlineSparkles size={32} />
            </div>

            <h1 className="mt-7 bg-gradient-to-r from-white via-white to-cyan-200 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
              Welcome to FeedSenseAi
            </h1>
            <p className="mx-auto mt-3 max-w-xs text-sm text-slate-400">
              Sign in with Google to access your feedback analytics dashboard
            </p>

            {error && (
              <p
                role="alert"
                className="mt-6 rounded-xl border border-rose-400/25 bg-rose-400/10 px-4 py-3 text-sm text-rose-300"
              >
                {errorMessage || "Error while signing in"}
              </p>
            )}

            <button
              onClick={googleSignIn}
              className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl bg-white px-4 py-3.5 text-sm font-semibold text-[#05070a] shadow-[0_14px_40px_-14px_rgba(255,255,255,0.5)] transition hover:-translate-y-0.5 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-400/30"
            >
              <Image
                className="h-5 w-5"
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google logo"
                width={20}
                height={20}
              />
              Continue with Google
            </button>

            <ul className="mt-8 grid grid-cols-3 gap-3 text-xs text-slate-400">
              {[
                { i: <FiBarChart2 size={18} />, t: "AI insights" },
                { i: <FiZap size={18} />, t: "Real-time" },
                { i: <FiShield size={18} />, t: "Secure" },
              ].map((x) => (
                <li
                  key={x.t}
                  className="flex flex-col items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.03] py-3"
                >
                  <span className="text-cyan-300">{x.i}</span>
                  {x.t}
                </li>
              ))}
            </ul>

            <p className="mt-8 text-xs text-slate-500">
              By signing in, you agree to our{" "}
              <span className="cursor-pointer underline decoration-slate-600 underline-offset-2 hover:text-slate-300">
                Terms of Service
              </span>{" "}
              and{" "}
              <span className="cursor-pointer underline decoration-slate-600 underline-offset-2 hover:text-slate-300">
                Privacy Policy
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}