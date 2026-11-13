"use client";
import Bill from "@/components/Bill";
import React, { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import Script from "next/script";
import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";
import dbService from "@/firebase/utils/db";
import useAuth from "@/hooks/CurrentUser";
import { useRouter } from "next/navigation";
import Loader from "../../../components/Loader";
import TermsConditions from "../../../components/TermsConditions";
import { FiLock, FiCheck, FiShield } from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi2";
declare global {
  interface Window {
    Razorpay: {
      new (options: RazorpayOptions): RazorpayInstance;
    };
  }
}

interface RazorpayInstance {
  open: () => void;
  on: (event: string, callback: () => void) => void;
}

interface User {
  uid: string;
}

interface SubscriptionPlan {
  id: number;
  name: string;
  price: number;
  desc: string;
  features: string[];
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

const Page = () => {
  const { planType } = useParams();
  const navigate = useRouter();
  const [istoggle, setistoggle] = useState(false);

  const subscriptionPlans: SubscriptionPlan[] = [
    {
      id: 1,
      name: "Basic",
      price: 499,
      desc: "Perfect for small teams getting started with AI feedback analysis",
      features: [
        "Simple dashboard",
        "Email support",
        "3 website integration",
        "Basic reporting",
      ],
    },
    {
      id: 2,
      name: "Pro",
      price: 1499,
      desc: "Advanced features for growing businesses and teams",
      features: [
        "Unlimited feedback entries",
        "Email support",
        "Unlimited website integrations",
        "Advanced AI insights",
        "Priority support",
      ],
    },
  ];

  const initialPlan = subscriptionPlans.find(
    (plan) => plan.name === (planType || "Basic")
  );

  const db = new dbService();

  const [currentPlan, setCurrentPlan] = useState({
    name: initialPlan?.name || "Basic",
    price: initialPlan?.price || 450,
  });

  const { user, loading } = useAuth() as {
    user: User | null;
    loading: boolean;
  };

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [authState, setAuthState] = useState<string | null>(null);

  useEffect(() => {
    const state = localStorage.getItem("authstate");
    setAuthState(state);
  }, []);

  const handlePayment = async () => {
    try {
      if (authState == "true") {
        setIsLoading(true);
        const orderID = await axios.post(
          "https://feedsenseai.vercel.app/api/subscribe",
          { amount: currentPlan.price * 100 },
          { headers: { "Content-Type": "application/json" } }
        );
        const data = orderID.data;
        const options: RazorpayOptions = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID as string,
          amount: currentPlan.price * 100,
          currency: "INR",
          name: "FeedsenseAi",
          description: "TEST TRANSACTION",
          order_id: data.orderId,
          handler: async (response: RazorpayResponse) => {
            try {
              console.log("Payment is successful", response);
              const today = new Date();
              const formattedDate = `${String(today.getDate()).padStart(
                2,
                "0"
              )}/${String(today.getMonth() + 1).padStart(2, "0")}/${String(
                today.getFullYear()
              ).slice(-2)}`;
              await db.subscribe(user!.uid, currentPlan.name, formattedDate);
              navigate.push("/dashboard");
            } catch (error) {
              console.log(error);
              setIsLoading(false);
            }
          },
          prefill: {
            name: "Rahul",
            email: "chrahulofficial@gmail.com",
            contact: "8317680338",
          },
          theme: {
            color: "#3399cc",
          },
        };
        const rzp1 = new window.Razorpay(options);
        rzp1.open();
      } else {
        alert("please login");
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fss-root relative min-h-screen w-full overflow-x-clip bg-[#05070a] text-[#06080b]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .fss-root{font-family:'Plus Jakarta Sans',ui-sans-serif,system-ui,sans-serif;-webkit-font-smoothing:antialiased}
        @keyframes fss-a{0%,100%{transform:translate3d(0,0,0) scale(1)}50%{transform:translate3d(70px,40px,0) scale(1.15)}}
        @keyframes fss-b{0%,100%{transform:translate3d(0,0,0) scale(1.1)}50%{transform:translate3d(-60px,-30px,0) scale(.95)}}
        @keyframes fss-sheen{from{background-position:200% 0}to{background-position:-200% 0}}
        .fss-a{animation:fss-a 18s ease-in-out infinite}.fss-b{animation:fss-b 22s ease-in-out infinite}
        .fss-btn{background-size:200% 100%}.fss-btn:hover{animation:fss-sheen 2.2s linear infinite}
        @media (prefers-reduced-motion:reduce){.fss-a,.fss-b,.fss-btn:hover{animation:none!important}}
      `}</style>

      {isLoading ? <Loader message="Please wait" /> : null}
      {istoggle ? <TermsConditions setistoggle={setistoggle} /> : null}

      {/* ambient background */}
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="fss-a absolute -left-40 -top-40 h-[36rem] w-[36rem] rounded-full bg-cyan-500/[0.16] blur-[140px]" />
        <div className="fss-b absolute -right-40 top-40 h-[40rem] w-[40rem] rounded-full bg-violet-600/[0.18] blur-[150px]" />
        <div
          className="absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_top,black,transparent_65%)]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
      </div>

      <div className="relative z-10">
        {/* top bar */}
        <header className="border-b border-white/[0.06] bg-[#05070a]/60 backdrop-blur-xl">
          <div className="mx-auto flex h-[4.5rem] max-w-6xl items-center justify-between px-5 sm:px-8">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 text-[#05070a]">
                <HiOutlineSparkles size={20} />
              </span>
              <span className="bg-gradient-to-r from-cyan-300 to-violet-400 bg-clip-text text-lg font-bold text-transparent">
                FeedSense.ai
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <span className="hidden items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3.5 py-1.5 text-xs font-semibold text-emerald-300 sm:inline-flex">
                <FiLock size={13} />
                Secure checkout
              </span>
              <Link
                href={"/dashboard"}
                aria-label="Close"
                className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-[#06080b] transition hover:bg-white/10"
              >
                <RxCross2 size={22} />
              </Link>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-5 pb-20 pt-10 sm:px-8 lg:pt-14">
          <h1 className="bg-gradient-to-r from-white via-cyan-200 to-violet-300 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl">
            Buy Plan
          </h1>
          <p className="mt-3 text-slate-400">
            For more details on our plans, visit our{" "}
            <Link
              href={"/plans"}
              className="font-medium text-cyan-300 underline decoration-cyan-400/40 underline-offset-4 hover:text-cyan-200"
            >
              Pricing page
            </Link>
            .
          </p>

          <div className="mt-10 grid items-start gap-8 lg:grid-cols-5">
            {/* plan selector */}
            <div className="space-y-5 lg:col-span-3">
              {subscriptionPlans.map((itm) => {
                const selected = currentPlan.name === itm.name;
                return (
                  <button
                    type="button"
                    key={itm.id}
                    onClick={() => {
                      setCurrentPlan({ name: itm.name, price: itm.price });
                    }}
                    className={`block w-full rounded-3xl p-px text-left transition-all ${
                      selected
                        ? "bg-gradient-to-br from-cyan-300 via-white/15 to-violet-500 shadow-[0_20px_70px_-25px_rgba(34,211,238,0.6)]"
                        : "bg-gradient-to-b from-white/[0.18] via-white/[0.05] to-white/[0.03] hover:from-white/30"
                    }`}
                  >
                    <div className="relative overflow-hidden rounded-[23px] bg-[#0a0d12] p-6 sm:p-8">
                      {selected && (
                        <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-cyan-500/20 blur-3xl" />
                      )}
                      <div className="relative flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <span
                            className={`mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition ${
                              selected
                                ? "border-cyan-400 bg-cyan-400 text-[#05070a]"
                                : "border-white/20"
                            }`}
                          >
                            {selected && <FiCheck size={14} strokeWidth={3} />}
                          </span>
                          <div>
                            <h2 className="flex flex-wrap items-center gap-3 text-xl font-bold text-[#06080b]">
                              {itm.name}
                              {selected && (
                                <span className="rounded-full bg-gradient-to-r from-cyan-400/20 to-violet-500/20 px-3 py-1 text-[11px] font-semibold text-cyan-200 ring-1 ring-inset ring-cyan-400/30">
                                  Current Plan
                                </span>
                              )}
                            </h2>
                            <p className="mt-2 max-w-sm text-sm text-slate-400">
                              {itm.desc}
                            </p>
                          </div>
                        </div>
                        <p className="shrink-0 text-right text-3xl font-extrabold tracking-tight text-[#06080b]">
                          ₹{itm.price}
                          <span className="block text-xs font-medium text-slate-500">
                            /month
                          </span>
                        </p>
                      </div>

                      <ul className="relative mt-6 grid gap-3 border-t border-white/[0.07] pt-6 text-sm sm:grid-cols-2">
                        {itm.features.map((f) => (
                          <li key={f} className="flex items-start gap-3 text-slate-200">
                            <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-400/15 text-emerald-300">
                              <FiCheck size={12} strokeWidth={3} />
                            </span>
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* order summary */}
            <aside className="lg:sticky lg:top-8 lg:col-span-2">
              <div className="rounded-3xl bg-gradient-to-b from-white/25 via-white/[0.06] to-cyan-400/25 p-px shadow-[0_30px_90px_-40px_rgba(34,211,238,0.45)]">
                <div className="rounded-[23px] bg-[#0a0d12] p-6 sm:p-8">
                  <h2 className="text-lg font-bold text-[#06080b]">Order summary</h2>

                  <div className="mt-5 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4">
                    <Bill selectedPlan={currentPlan} />
                  </div>

                  <div className="mt-6 flex flex-col gap-3">
                    <Script src="https://checkout.razorpay.com/v1/checkout.js" />
                    <button
                      onClick={handlePayment}
                      className="fss-btn flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-500 px-5 py-4 text-sm font-bold text-[#06080b] shadow-[0_14px_40px_-12px_rgba(34,211,238,0.8)] transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-400/30"
                    >
                      <FiLock size={16} />
                      Purchase · ₹{currentPlan.price}
                    </button>
                    <Link href="/dashboard">
                      <button className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3.5 text-sm font-semibold text-slate-300 transition hover:bg-white/10">
                        Cancel
                      </button>
                    </Link>
                  </div>

                  <p className="mt-6 text-center text-sm text-slate-500">
                    Our{" "}
                    <span
                      onClick={() => {
                        setistoggle(true);
                      }}
                      className="cursor-pointer text-slate-300 underline decoration-slate-600 underline-offset-4 hover:text-[#06080b]"
                    >
                      Terms and conditions
                    </span>
                  </p>

                  <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-500">
                    <FiShield size={14} className="text-emerald-400" />
                    Payments are processed securely by Razorpay
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Page;