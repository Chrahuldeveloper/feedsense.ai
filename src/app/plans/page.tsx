"use client";
import Navbar from "@/components/Navbar";
import React from "react";
import { TiTickOutline } from "react-icons/ti";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";
export default function page() {
  const navigate = useRouter();
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
            price: "₹499",
            desc: "Perfect for small teams getting started with AI feedback analysis",
            features: [
              { label: "Simple dashboard", available: true },
              { label: "Email support", available: true },
              { label: "3 website integration", available: true },
              { label: "Basic reporting", available: true },
            ],
            highlight: false,
          },
          {
            name: "Pro",
            price: "₹1499",
            desc: "Advanced features for growing businesses and teams",
            features: [
              { label: "Unlimited feedback entries", available: true },
              { label: "Email support", available: true },
              { label: "Advanced sentiment analysis", available: true },
              { label: "Unlimited website integrations", available: true },
              { label: "Adavance Feedback analytics", available: true },
              { label: "Priority support", available: true },
              { label: "Add Developers Email", available: true },
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
                 navigate.push(`/subscription/${plan.name}`)
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
      <Footer />
    </div>
  );
}

