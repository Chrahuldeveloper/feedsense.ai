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
    <div className="fss-root relative min-h-screen w-full overflow-x-clip bg-[#09090b] text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        .fss-root{font-family:'Inter',ui-sans-serif,system-ui,sans-serif;-webkit-font-smoothing:antialiased}
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
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[26rem] bg-[radial-gradient(60%_100%_at_50%_0%,rgba(129,140,248,0.09),transparent)]" />
      </div>

      <div className="relative z-10">
        {/* top bar */}
        <header className="border-b border-white/[0.06] bg-[#09090b]/60 backdrop-blur-xl">
          <div className="mx-auto flex h-[4.5rem] max-w-6xl items-center justify-between px-5 sm:px-8">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl text-white bg-indigo-500">
                <HiOutlineSparkles size={20} />
              </span>
              <span className=" text-lg font-bold text-indigo-300">
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
                className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-white transition hover:bg-white/10"
              >
                <RxCross2 size={22} />
              </Link>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-5 pb-20 pt-10 sm:px-8 lg:pt-14">
          <h1 className=" text-4xl font-semibold tracking-tight sm:text-5xl text-white">
            Buy Plan
          </h1>
          <p className="mt-3 text-zinc-400">
            For more details on our plans, visit our{" "}
            <Link
              href={"/plans"}
              className="font-medium text-indigo-300 underline decoration-indigo-400/40 underline-offset-4 hover:text-indigo-200"
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
 ? " bg-white/10"
 : " hover: bg-white/10"
 }`}
                  >
                    <div className="relative overflow-hidden rounded-[23px] bg-[#111113] p-6 sm:p-8">
                      <div className="relative flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <span
                            className={`mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition ${
 selected
 ? "border-indigo-400 bg-indigo-400 text-white"
 : "border-white/20"
 }`}
                          >
                            {selected && <FiCheck size={14} strokeWidth={3} />}
                          </span>
                          <div>
                            <h2 className="flex flex-wrap items-center gap-3 text-xl font-bold text-white">
                              {itm.name}
                              {selected && (
                                <span className="rounded-full px-3 py-1 text-[11px] font-semibold text-indigo-200 ring-1 ring-inset ring-indigo-400/30 bg-indigo-400/20">
                                  Current Plan
                                </span>
                              )}
                            </h2>
                            <p className="mt-2 max-w-sm text-sm text-zinc-400">
                              {itm.desc}
                            </p>
                          </div>
                        </div>
                        <p className="shrink-0 text-right text-3xl font-semibold tracking-tight text-white">
                          ₹{itm.price}
                          <span className="block text-xs font-medium text-zinc-500">
                            /month
                          </span>
                        </p>
                      </div>

                      <ul className="relative mt-6 grid gap-3 border-t border-white/[0.07] pt-6 text-sm sm:grid-cols-2">
                        {itm.features.map((f) => (
                          <li key={f} className="flex items-start gap-3 text-zinc-200">
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
              <div className="rounded-3xl p-px bg-white/10">
                <div className="rounded-[23px] bg-[#111113] p-6 sm:p-8">
                  <h2 className="text-lg font-bold text-white">Order summary</h2>

                  <div className="mt-5 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4">
                    <Bill selectedPlan={currentPlan} />
                  </div>

                  <div className="mt-6 flex flex-col gap-3">
                    <Script src="https://checkout.razorpay.com/v1/checkout.js" />
                    <button
                      onClick={handlePayment}
                      className=" flex w-full items-center justify-center gap-2 rounded-xl px-5 py-4 text-sm font-bold text-white transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-400/30 bg-indigo-500 hover:bg-indigo-400"
                    >
                      <FiLock size={16} />
                      Purchase · ₹{currentPlan.price}
                    </button>
                    <Link href="/dashboard">
                      <button className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3.5 text-sm font-semibold text-zinc-300 transition hover:bg-white/10">
                        Cancel
                      </button>
                    </Link>
                  </div>

                  <p className="mt-6 text-center text-sm text-zinc-500">
                    Our{" "}
                    <span
                      onClick={() => {
                        setistoggle(true);
                      }}
                      className="cursor-pointer text-zinc-300 underline decoration-zinc-600 underline-offset-4 hover:text-white"
                    >
                      Terms and conditions
                    </span>
                  </p>

                  <div className="mt-5 flex items-center justify-center gap-2 text-xs text-zinc-500">
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