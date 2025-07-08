"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Cookies from "js-cookie";
import dbService from "@/firebase/utils/db";
import useAuth from "@/hooks/CurrentUser";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import img1 from "../asserts/img1.png";
import Image from "next/image";
import { FiMessageSquare } from "react-icons/fi";
import { SlGraph } from "react-icons/sl";
import { VscGraph } from "react-icons/vsc";
import { AiOutlineThunderbolt } from "react-icons/ai";
import { BsGraphUpArrow } from "react-icons/bs";
import { FiCheckCircle, FiTrendingUp } from "react-icons/fi";
import { AiOutlineStar } from "react-icons/ai";
import { HiOutlineUsers } from "react-icons/hi2";
import { LuBrain } from "react-icons/lu";
import { FiArrowRight } from "react-icons/fi";

interface User {
  uid: string;
}

const Page = () => {
  useEffect(() => {
    AOS.init();
  }, []);

  const benefits = [
    {
      icon: <FiCheckCircle size={20} color="#22c55e" />,
      title: "Increase User Satisfaction by 31%",
      desc: "Our AI identifies pain points before they become problems, leading to happier users.",
    },
    {
      icon: <FiCheckCircle size={20} color="#06b6d4" />,
      title: "Reduce Support Tickets by 18%",
      desc: "Proactive insights help you fix issues before users need to contact support.",
    },
    {
      icon: <FiCheckCircle size={20} color="#facc15" />,
      title: "Boost Feature Adoption by 42%",
      desc: "Understand what users really want and deliver features they'll actually use.",
    },
  ];

  const stats = [
    {
      icon: <AiOutlineStar size={32} color="#facc15" />,
      value: "4.9/5",
      label: "Customer Rating",
    },
    {
      icon: <HiOutlineUsers size={32} color="#06b6d4" />,
      value: "50K+",
      label: "Active Users",
    },
    {
      icon: <FiTrendingUp size={32} color="#22c55e" />,
      value: "89%",
      label: "Accuracy Rate",
    },
    {
      icon: <AiOutlineThunderbolt size={32} color="#a855f7" />,
      value: "2.5x",
      label: "Faster Insights",
    },
  ];
  const features = [
    {
      icon: <LuBrain size={35} color="#00a3ff" />,
      title: "AI-Powered Analysis",
      desc: "Advanced machine learning algorithms analyze sentiment, trends, and patterns in real-time",
    },
    {
      icon: <FiMessageSquare size={35} color="#00a3ff" />,
      title: "Smart Feed Collection",
      desc: "Seamlessly integrate with your website to collect feedback through multiple channels",
    },
    {
      icon: <SlGraph size={35} color="#ffc107" />,
      title: "Predictive Insights",
      desc: "Get ahead of issues with predictive analytics and trend forecasting",
    },
    {
      icon: <VscGraph size={35} color="#a259ff" />,
      title: "Visual Dashboards",
      desc: "Beautiful, interactive charts and graphs that make complex data easy to understand",
    },
    {
      icon: <AiOutlineThunderbolt size={35} color="#ff5e5e" />,
      title: "Real-time Alerts",
      desc: "Instant notifications when critical feedback patterns are detected",
    },
    {
      icon: <BsGraphUpArrow size={35} color="#ff9900" />,
      title: "Actionable Recommendations",
      desc: "AI-generated suggestions to improve user experience and satisfaction",
    },
  ];

  const [hoveredIndex, setHoveredIndex] = useState<number | null>();

  const [userSession, setUserSession] = useState<string | null>(null);

  const [offer, setoffer] = useState<string | null>();

  useEffect(() => {
    const token = Cookies.get("auth-token");
    setUserSession(token ?? null);

    const getOfferStatus = localStorage.getItem("offerGrabbed");

    setoffer(getOfferStatus);
  }, []);

  const { user, loading } = useAuth() as {
    user: User | null;
    loading: boolean;
  };

  const db = new dbService();

  const Plans = [
    {
      name: "Pro",
      price: "Free",
      features: [
        "Unlimited feedback entries",
        "Automated task generation from feedback",
        "Priority Support",
        "Analytics",
        "Unlimited websites",
        "Incentivise Users",
      ],
      // Bill: "Billed once every 5 months",
      // para: "That's ₹540/month ≈ ₹18/day ≈ 6 coffees per month",
    },
    // {
    //   name: "Basic",
    //   price: "₹450",
    //   features: [
    //     "Collect up to 100 feedback",
    //     "Priority Support",
    //     "Analytics",
    //     "Only 3 websites integration",
    //     "Incentivise Users",
    //   ],
    //   Bill: "Billed monthly",
    //   para: "That's less than ₹12/day ≈ 2 coffees per month",
    // },
    // {
    //   name: "Pro",
    //   price: "₹2700",
    //   features: [
    //     "Unlimited feedback entries",
    //     "Automated task generation from feedback",
    //     "Priority Support",
    //     "Analytics",
    //     "Unlimited websites",
    //     "Incentivise Users",
    //   ],
    //   Bill: "Billed once every 5 months",
    //   para: "That's ₹540/month ≈ ₹18/day ≈ 6 coffees per month",
    // },
  ];

  const handleAvailOffer = async () => {
    try {
      const res = await db.availFreeOffer(user!.uid);
      console.log(res);
      localStorage.setItem("offerGrabbed", res.toString());
      return toast("Congratulations you have grabbed the free offer!");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-screen  bg-[#0b0c0d]">
      <Navbar />
      <div className="text-white pt-36 text-center space-y-10">
        <h1 className="text-3xl md:text-5xl font-bold lg:text-7xl ">
          Transform{" "}
          <span className="bg-gradient-to-r from-cyan-500 to-purple-500 text-transparent bg-clip-text">
            User Feedback
          </span>{" "}
          <br /> Into Actionable Insights
        </h1>
        <p className="max-w-lg mx-auto text-gray-300">
          Harness the power of artificial intelligence to understand your users
          better, make data-driven decisions, and boost your product's success
          with real-time feedback analytics.
        </p>
        <div>
          <button className="cursor-pointer  bg-gradient-to-r from-[#00bfff] via-[#00bfff] to-[#00bfff] px-7 py-2 rounded-xl text-black ">
            Get Started
          </button>
        </div>
        <div className="flex justify-center">
          <div className="relative group w-fit">
            <div
              className="absolute inset-0 rounded-xl bg-gradient-to-r
                    from-cyan-400 via-sky-400 to-purple-600
                    opacity-40 blur-md transition
                    group-hover:opacity-70 group-hover:blur-lg"
            />
            <Image
              src={img1}
              alt="img1"
              width={1000}
              height={550}
              className="relative rounded-xl cursor-pointer"
              priority
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center items-center py-12 bg-[#0b0c0d] min-h-screen text-white">
        <h1 className="text-3xl font-semibold mb-2 text-white">
          Powerful Features for{" "}
          <span className="bg-gradient-to-r from-cyan-500 to-purple-500 text-transparent bg-clip-text">
            Smart Analytics
          </span>
        </h1>
        <p className="text-gray-300 mb-10 text-center max-w-xl">
          Everything you need to understand, analyze, and act on user feedback
          in real-time
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6">
          {features.map((item, index) => (
            <div
              key={index}
              className="bg-[#0e0f11] p-6 rounded-xl max-w-sm text-white border border-[#1c1d20] hover:shadow-lg transition"
            >
              <div className="mb-4">{item.icon}</div>
              <h2 className="text-lg font-semibold mb-2">{item.title}</h2>
              <p className="text-sm text-gray-300">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <section className="w-[100vw] mx-auto bg-[#0b0c0d] text-white py-16 ">
        <div className="container mx-auto px-6 flex flex-col gap-14 lg:flex-row">
          <div className="flex-1 max-w-xl">
            <h2 className="text-3xl font-semibold mb-4">
              Why Choose{" "}
              <span className="bg-gradient-to-r from-cyan-500 to-purple-500 text-transparent bg-clip-text">
                FeedSenseAI?
              </span>
            </h2>
            <p className="text-gray-300 mb-8">
              Join hundreds of companies that trust FeedSenseAI to transform
              their user feedback into business growth.
            </p>

            <ul className="space-y-6">
              {benefits.map((b, idx) => (
                <li key={idx} className="flex items-start max-w-md gap-3">
                  {b.icon}
                  <div>
                    <h3 className="font-medium">{b.title}</h3>
                    <p className="text-gray-400 text-sm">{b.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex-1  grid grid-cols-2  mx-auto gap-6">
            {stats.map((s, idx) => (
              <div
                key={idx}
                className="bg-[#0e0f11] rounded-xl p-8 flex flex-col items-center text-center border border-[#1c1d20] "
              >
                <div className="mb-4">{s.icon}</div>
                <p className="text-2xl font-semibold mb-1">{s.value}</p>
                <p className="text-gray-400 text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full flex justify-center py-20 bg-[#0b0c0d]">
        <div className="relative max-w-3xl w-full group">
          <div
            className="absolute inset-0 rounded-2xl bg-gradient-to-r
                     from-cyan-400 via-sky-400 to-purple-600
                     opacity-40 blur-md transition
                     group-hover:opacity-70 group-hover:blur-lg"
          />

          <div
            className="relative rounded-2xl p-10 bg-[#0e0f11]/90 text-center
                     border border-transparent backdrop-blur-sm"
          >
            <h2 className="text-3xl font-semibold mb-4 text-white">
              Ready to Transform Your{" "}
              <span className="bg-gradient-to-r from-cyan-500 to-purple-500 text-transparent bg-clip-text">
                User Feedback?
              </span>
            </h2>

            <p className="text-gray-300 mb-10 max-w-2xl mx-auto">
              Join thousands of companies using FeedSenseAI to make smarter,
              data‑driven decisions. Start your free trial today and see the
              difference AI can make.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
              <button
                className="inline-flex items-center justify-center gap-2
                               bg-[#00c3ff] hover:bg-[#00b4eb] text-black
                               font-medium rounded-md px-6 py-3 shadow-lg transition"
              >
                Start Free Trial
              </button>
            </div>

            <p className="text-gray-400 text-sm">
              No credit card required • 14‑day free trial • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      <footer className="w-full bg-[#0b0c0d] border-t border-[#1c1d20] py-16 text-gray-300">
        <div className="container mx-auto px-6 grid gap-12 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 mb-4 text-white">
              <LuBrain size={24} color="#00c3ff" />
              <h3 className="text-xl font-semibold">
                <span className="bg-gradient-to-r from-cyan-500 to-purple-500 text-transparent bg-clip-text">
                  FeedSenseAI
                </span>
              </h3>
            </div>
            <p className="max-w-xs">
              Transform user feedback into actionable insights with the power of
              AI.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 lg:col-span-3 lg:grid-cols-3">
            <ul className="space-y-3">
              <h4 className="font-medium text-white mb-2">Product</h4>
              <li>
                <a href="#" className="hover:text-white">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Feedback
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Insights
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Integration
                </a>
              </li>
            </ul>

            <ul className="space-y-3">
              <h4 className="font-medium text-white mb-2">Company</h4>
              <li>
                <a href="#" className="hover:text-white">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Contact
                </a>
              </li>
            </ul>

            <ul className="space-y-3">
              <h4 className="font-medium text-white mb-2">Support</h4>
              <li>
                <a href="#" className="hover:text-white">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  API Reference
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Status
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Page;
