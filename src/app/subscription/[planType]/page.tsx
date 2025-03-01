"use client";
import Bill from "@/components/Bill";
import React, { useState } from "react";
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
  displayPrice: string;
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

  const subscriptionPlans: SubscriptionPlan[] = [
    {
      id: 1,
      name: "Basic",
      price: 450,
      displayPrice: "₹450/month",
      features: [
        "Collect up to 100 feedback",
        "Email support",
        "Analytics",
        "Only 3 websites integration",
      ],
    },
    {
      id: 2,
      name: "Pro",
      price: 2000,
      displayPrice: "₹2000 for 4 months",
      features: [
        "Unlimited feedback entries",
        "Automated task generation from feedback",
        "Priority email support",
        "Analytics",
        "Unlimited websites",
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

  console.log(loading);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handlePayment = async () => {
    try {
      setIsLoading(true);
      const orderID = await axios.post("https://feedsenseai.vercel.app/api/subscribe", {
        amount: currentPlan.price * 100,
      });

      const data = orderID.data;

      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID as string,
        amount: currentPlan.price * 100,
        currency: "INR",
        name: "TASKFEED",
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
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const [istoggle, setistoggle] = useState(false);

  return (
    <div className="bg-[#111115] w-screen min-h-screen overflow-x-clip">
      {isLoading ? <Loader message="Please wait" /> : null}

      {istoggle ? <TermsConditions setistoggle={setistoggle} /> : null}

      <div className="flex justify-between w-[76vw] mx-auto pt-8 pb-10">
        <h1 className="text-gray-300  text-xl">Change Plan</h1>
        <Link href={"/dashboard"}>
          <RxCross2 size={24} color="white" />
        </Link>
      </div>

      <div className="flex flex-col md:flex-row justify-between w-[90vw] md:w-[75vw] mx-auto pt-8 gap-6 items-center border-[1px] border-[#1a1d22] p-6 bg-[#0e0f12]">
        <div className="space-y-4">
          <p className="text-slate-300">
            For more details on our plans, visit our{" "}
            <span className="border-b-[1px] border-slate-300 cursor-pointer">
              <Link href={"/plans"}>Pricing page</Link>
            </span>
            .
          </p>
          <p className="text-gray-400">
            Our
            <span
              onClick={() => {
                setistoggle(true);
              }}
              className=" cursor-pointer border-b-[1px] border-gray-500"
            >
              {" "}
              Terms and conditions
            </span>
          </p>
          <div>
            {subscriptionPlans.map((itm) => (
              <div
                key={itm.id}
                onClick={() => {
                  setCurrentPlan({ name: itm.name, price: itm.price });
                }}
                className={`p-5  space-y-1 border-[0.1px] bg-[#0e0f12]  shadow-2xl mt-5 w-[80vw] md:w-[50vw] cursor-pointer ${
                  currentPlan.name === itm.name
                    ? "border-blue-900"
                    : "border-[#1a1d22] "
                }`}
              >
                <h1 className="text-lg font-semibold text-gray-300">
                  {itm.name}{" "}
                  {currentPlan.name === itm.name && (
                    <span className="bg-[#0e0f12] px-3 py-1.5 rounded-full text-[10px] text-gray-300">
                      Current Plan
                    </span>
                  )}
                </h1>
                <p className="text-slate-300">{itm.displayPrice}</p>
              </div>
            ))}
          </div>
        </div>
        <Bill selectedPlan={currentPlan} />
      </div>

      <div className="border-t-[1px] bg-[#0e0f12] border-[#1a1d22] md:fixed md:bottom-0 w-full pr-10">
        <div className="flex justify-end gap-4 py-5">
          <button className="bg-[#1E1E1E] border-[1px] border-[#15171b] text-gray-300 px-5 rounded-lg text-sm py-2 cursor-pointer font-semibold">
            Cancel
          </button>
          <Script src="https://checkout.razorpay.com/v1/checkout.js" />
          <button
            onClick={handlePayment}
            className="bg-gradient-to-r from-blue-800 via-blue-600 to-blue-700 px-5 rounded-lg text-sm py-2 cursor-pointer font-semibold text-white"
          >
            Purchase
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
