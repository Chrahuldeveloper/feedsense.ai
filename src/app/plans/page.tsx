"use client";
import Navbar from "@/components/Navbar";
import React, { useState } from "react";
import { TiTickOutline } from "react-icons/ti";
import Footer from "@/components/Footer";
import dbService from "@/firebase/utils/db";
import useAuth from "@/hooks/CurrentUser";
import { useRouter } from "next/navigation";
import {  toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Loader from "../../components/Loader";
export default function page() {
  const db = new dbService();

  interface User {
    uid: string;
  }

  const { user, loading }: { user: User | null; loading: boolean } = useAuth();

  const navigate = useRouter();

  const [isloading, setisloading] = useState<boolean>(false);

  return (
    <div className="w-screen min-h-screen bg-[#0b0c0d] ">
      <Navbar />
      <section className="px-6 md:px-20  pb-20 pt-28 text-center ">
        <h1 className="text-4xl text-white font-bold mb-4">
          About{" "}
          <span className="bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent">
            FeedSenseAI
          </span>
        </h1>
        <p className="text-gray-300 max-w-2xl mx-auto">
          We're on a mission to transform how businesses understand and act on
          user feedback through the power of artificial intelligence.
        </p>
      </section>

      <div className="flex flex-col md:flex-row justify-center gap-6 px-6  pb-28">
        {[
          {
            name: "Basic",
            price: "$29",
            desc: "Perfect for small teams getting started with AI feedback analysis",
            features: [
              { label: "Up to 1,000 feedback entries/month", available: true },
              { label: "Basic sentiment analysis", available: true },
              { label: "Simple dashboard", available: true },
              { label: "Email support", available: true },
              { label: "1 website integration", available: true },
              { label: "Basic reporting", available: true },
              { label: "Advanced AI insights", available: false },
              { label: "Real-time alerts", available: false },
              { label: "API access", available: false },
              { label: "Custom integrations", available: false },
              { label: "Priority support", available: false },
            ],
            highlight: false,
          },
          {
            name: "Pro",
            price: "$99",
            desc: "Advanced features for growing businesses and teams",
            features: [
              { label: "Unlimited feedback entries", available: true },
              { label: "Advanced sentiment analysis", available: true },
              { label: "Custom dashboard", available: true },
              { label: "24/7 phone & email support", available: true },
              { label: "Unlimited website integrations", available: true },
              { label: "Custom reporting & analytics", available: true },
              { label: "Advanced AI insights", available: true },
              { label: "Real-time alerts", available: true },
              { label: "Full API access", available: true },
              { label: "Custom integrations", available: true },
              { label: "Priority support", available: true },
            ],
            highlight: true,
          },
        ].map((plan, i) => (
          <div
            key={i}
            className={`relative w-full max-w-sm bg-[#0e0f11] rounded-xl border border-[#2a2a2a] shadow-xl ${
              plan.highlight ? "border-cyan-500 scale-105" : ""
            } transition-all duration-300`}
          >
            {plan.highlight && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-cyan-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                Most Popular
              </div>
            )}
            <div className="flex flex-col p-6 space-y-4">
              <div className="flex flex-col items-start space-y-2">
                <h3 className="text-white text-xl font-bold">
                  {plan.name.toUpperCase()}
                </h3>
                <p className="text-gray-400 text-sm">{plan.desc}</p>
                <p className="text-3xl font-bold text-white">
                  {plan.price}
                  <span className="text-sm text-gray-400">/month</span>
                </p>
              </div>
              <button
                onClick={async () => {
                  console.log(user);
                  if (!loading) {
                    if (user!.uid === null) {
                      alert("please login");
                    }
                    try {
                      setisloading(true);
                      await db.availFreeOffer(user!.uid);
                      localStorage.setItem("paid", "true");
                      toast("Congratulations you have grabbed the offer 🎉");
                      setisloading(false);
                      setTimeout(() => {
                        navigate.push("/dashboard");
                      }, 2000);
                    } catch (error) {
                      console.log(error);
                      setisloading(false);
                    }
                  }
                }}
                className="bg-white text-black text-sm font-semibold py-2 rounded-md hover:bg-gray-100 transition"
              >
                Grab Now
              </button>
              <ul className="pt-4 space-y-3 text-sm">
                {plan.features.map((f, idx) => (
                  <li
                    key={idx}
                    className={`flex items-start gap-2 ${
                      f.available ? "text-white" : "text-gray-500 line-through"
                    }`}
                  >
                    <TiTickOutline
                      className={`min-w-[20px] ${
                        f.available ? "text-green-400" : "text-gray-600"
                      }`}
                      size={20}
                    />
                    {f.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
      {isloading ? <Loader message="Grabing the offer for you" /> : null}

      <Footer />
    </div>
  );
}
