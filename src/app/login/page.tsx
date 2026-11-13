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
import { FiLock, FiCheckCircle } from "react-icons/fi";
import { LuBrain } from "react-icons/lu";

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

  const perks = [
    { n: "31%", t: "higher user satisfaction" },
    { n: "18%", t: "fewer support tickets" },
    { n: "42%", t: "more feature adoption" },
  ];

  return (
    <div className="fsg-root grid min-h-screen bg-[#05070a] text-[#06080b] lg:grid-cols-[1.15fr_1fr]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .fsg-root{font-family:'Plus Jakarta Sans',ui-sans-serif,system-ui,sans-serif;-webkit-font-smoothing:antialiased}
        @keyframes fsg-a{0%,100%{transform:translate3d(0,0,0) scale(1)}50%{transform:translate3d(70px,40px,0) scale(1.15)}}
        @keyframes fsg-b{0%,100%{transform:translate3d(0,0,0) scale(1.1)}50%{transform:translate3d(-60px,-30px,0) scale(.95)}}
        @keyframes fsg-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
        @keyframes fsg-ping{0%{transform:scale(1);opacity:.7}100%{transform:scale(2.5);opacity:0}}
        @keyframes fsg-grow{from{transform:scaleY(0)}to{transform:scaleY(1)}}
        .fsg-a{animation:fsg-a 16s ease-in-out infinite}.fsg-b{animation:fsg-b 20s ease-in-out infinite}
        .fsg-float{animation:fsg-float 6s ease-in-out infinite}
        .fsg-ping{animation:fsg-ping 2s ease-out infinite}
        .fsg-bar{transform-origin:bottom;animation:fsg-grow 1s cubic-bezier(.2,.7,.2,1) both}
        @media (prefers-reduced-motion:reduce){.fsg-a,.fsg-b,.fsg-float,.fsg-ping,.fsg-bar{animation:none!important}}
      `}</style>

      {isLoading && <Loader message="Signing you in" />}

      {/* ============ LEFT: brand showcase ============ */}
      <section className="relative hidden overflow-hidden border-r border-white/[0.07] lg:flex lg:flex-col lg:justify-between lg:p-14 xl:p-16">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="fsg-a absolute -left-32 -top-32 h-[34rem] w-[34rem] rounded-full bg-cyan-500/25 blur-[130px]" />
          <div className="fsg-b absolute -bottom-40 -right-24 h-[36rem] w-[36rem] rounded-full bg-violet-600/25 blur-[140px]" />
          <div
            className="absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
        </div>

        <div className="relative flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 text-[#05070a] shadow-[0_0_30px_-4px_rgba(34,211,238,0.7)]">
            <HiOutlineSparkles size={24} />
          </span>
          <span className="bg-gradient-to-r from-cyan-300 to-violet-400 bg-clip-text text-2xl font-bold tracking-tight text-transparent">
            FeedSenseAI
          </span>
        </div>

        <div className="relative">
          <h2 className="max-w-xl text-5xl font-extrabold leading-[1.05] tracking-tight xl:text-6xl">
            Turn feedback into{" "}
            <span className="bg-gradient-to-r from-cyan-300 via-sky-400 to-violet-400 bg-clip-text text-transparent">
              actionable insights
            </span>
          </h2>
          <p className="mt-6 max-w-md text-lg text-slate-400">
            Transform user feedback into actionable insights with the power of
            AI.
          </p>

          {/* mini live dashboard */}
          <div className="relative mt-12 max-w-lg">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-r from-cyan-500/25 to-violet-600/25 blur-2xl" />
            <div className="relative rounded-3xl bg-gradient-to-br from-white/30 via-white/10 to-white/[0.04] p-px">
              <div className="rounded-[23px] bg-[#0a0d12]/95 p-6 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-[#06080b]">Live insights</p>
                  <span className="flex items-center gap-2 text-xs text-emerald-300">
                    <span className="relative flex h-2 w-2">
                      <span className="fsg-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                    </span>
                    Analyzing
                  </span>
                </div>

                <div className="mt-6 flex h-24 items-end gap-2">
                  {[40, 62, 48, 78, 58, 90, 70, 100, 82, 95].map((h, i) => (
                    <div
                      key={i}
                      className="fsg-bar flex-1 rounded-t-md bg-gradient-to-t from-cyan-500/20 to-violet-400/80"
                      style={{ height: `${h}%`, animationDelay: `${i * 70}ms` }}
                    />
                  ))}
                </div>

                <div className="mt-6 flex items-start gap-3 rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.07] p-4">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-cyan-400/15 text-cyan-300">
                    <LuBrain size={18} />
                  </span>
                  <p className="text-sm text-slate-200">
                    3 themes found. Checkout friction is your top issue this
                    week.
                  </p>
                </div>
              </div>
            </div>

            <div className="fsg-float absolute -right-6 -top-8 hidden rounded-2xl border border-white/15 bg-[#0c1016]/85 px-4 py-3 shadow-2xl backdrop-blur-xl xl:block">
              <p className="text-xs text-slate-400">Satisfaction</p>
              <p className="text-2xl font-extrabold text-emerald-300">+31%</p>
            </div>
          </div>
        </div>

        <ul className="relative grid max-w-xl grid-cols-3 gap-6">
          {perks.map((p) => (
            <li key={p.n}>
              <p className="bg-gradient-to-b from-white to-slate-400 bg-clip-text text-3xl font-extrabold text-transparent">
                {p.n}
              </p>
              <p className="mt-1 text-xs text-slate-500">{p.t}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* ============ RIGHT: sign in ============ */}
      <section className="relative flex items-center justify-center overflow-hidden px-6 py-12 sm:px-10">
        <div aria-hidden className="pointer-events-none absolute inset-0 lg:hidden">
          <div className="fsg-a absolute -left-32 -top-32 h-[26rem] w-[26rem] rounded-full bg-cyan-500/25 blur-[110px]" />
          <div className="fsg-b absolute -bottom-32 -right-24 h-[28rem] w-[28rem] rounded-full bg-violet-600/25 blur-[120px]" />
        </div>

        <div className="relative w-full max-w-sm">
          {/* mobile brand */}
          <div className="mb-10 flex items-center justify-center gap-3 lg:hidden">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 text-[#05070a]">
              <HiOutlineSparkles size={24} />
            </span>
            <span className="bg-gradient-to-r from-cyan-300 to-violet-400 bg-clip-text text-2xl font-bold text-transparent">
              FeedSenseAI
            </span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Welcome to FeedSenseAi
          </h1>
          <p className="mt-3 text-slate-400">
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
            className="group relative mt-8 flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-white px-4 py-4 text-sm font-bold text-[#05070a] shadow-[0_18px_50px_-18px_rgba(34,211,238,0.7)] transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-400/30"
          >
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-cyan-200/60 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            <Image
              className="relative h-5 w-5"
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google logo"
              width={20}
              height={20}
            />
            <span className="relative">Continue with Google</span>
          </button>

          <div className="mt-8 flex items-center gap-3 text-xs text-slate-600">
            <span className="h-px flex-1 bg-white/[0.08]" />
            <span className="inline-flex items-center gap-1.5">
              <FiLock size={12} /> Secure sign-in
            </span>
            <span className="h-px flex-1 bg-white/[0.08]" />
          </div>

          <ul className="mt-6 space-y-3 text-sm text-slate-400">
            {[
              "AI-powered feedback analytics",
              "Real-time alerts and insights",
              "Set up in minutes",
            ].map((t) => (
              <li key={t} className="flex items-center gap-3">
                <FiCheckCircle className="shrink-0 text-emerald-400" size={16} />
                {t}
              </li>
            ))}
          </ul>

          <p className="mt-10 text-xs leading-5 text-slate-500">
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
      </section>
    </div>
  );
}