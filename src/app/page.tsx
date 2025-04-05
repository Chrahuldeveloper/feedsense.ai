"use client";

import AnimatedBackground from "@/background/AnimatedBackground";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { LuBrain } from "react-icons/lu";
import { TiTickOutline } from "react-icons/ti";
import AOS from "aos";
import "aos/dist/aos.css";
import { GoGraph } from "react-icons/go";
import { FiMessageCircle } from "react-icons/fi";
import { AiOutlineThunderbolt } from "react-icons/ai";
import { BsGraphUpArrow } from "react-icons/bs";
import { IoIosTimer } from "react-icons/io";
import { MdSettingsSuggest } from "react-icons/md";
import Cookies from "js-cookie";
import dbService from "@/firebase/utils/db";
import useAuth from "@/hooks/CurrentUser";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface User {
  uid: string;
}

const Page = () => {
  useEffect(() => {
    AOS.init();
  }, []);

  const data = [
    {
      icon: <LuBrain size={25} color="#00a3ff" />,
      title: "AI-Powered Analysis",
      desc: "Advanced machine learning algorithms that analyze feedback and extract actionable insights.",
    },
    {
      icon: <GoGraph size={25} color="#00a3ff" />,
      title: "Trend Identification",
      desc: "Automatically identify emerging patterns and trends across all customer feedback channels.",
    },
    {
      icon: <FiMessageCircle size={25} color="#00a3ff" />,
      title: "Sentiment Analysis",
      desc: "Understand the emotional tone behind feedback to gauge customer satisfaction .",
    },
    {
      icon: <AiOutlineThunderbolt size={25} color="#00a3ff" />,
      title: "Real-Time Alerts",
      desc: "Receive instant notifications about critical feedback that requires immediate attention.",
    },
    {
      icon: <BsGraphUpArrow size={25} color="#00a3ff" />,
      title: "Custom Dashboards",
      desc: "Create personalized dashboards to track the metrics that matter most to your business.",
    },
    {
      icon: <IoIosTimer size={25} color="#00a3ff" />,
      title: "In-Depth Reports",
      desc: "Generate comprehensive reports with visual data representations for stakeholder presentations.",
    },
  ];

  const list = [
    {
      icon: <LuBrain size={35} color="#00a3ff" />,
      title: "Collect Feedback",
      desc: "Connect your feedback channels, including survey responses, app reviews, support tickets, and social mentions.",
    },
    {
      icon: <GoGraph size={35} color="#00a3ff" />,
      title: "AI Processing",
      desc: "Our AI engine analyzes the feedback, categorizes issues, detects sentiment, and identifies actionable insights.",
    },
    {
      icon: <AiOutlineThunderbolt size={35} color="#00a3ff" />,
      title: "Generate Insights",
      desc: "View detailed dashboards showing trends, sentiment analysis, and prioritized action items.",
    },
    {
      icon: <BsGraphUpArrow size={35} color="#00a3ff" />,
      title: "Take Action",
      desc: "Implement changes based on insights, track improvements, and measure impact over time.",
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
    <div className="w-screen h-full bg-[#1c2031]">
      <ToastContainer theme="dark" toastClassName={"custom-toast"} />

      <div className="relative min-h-screen bg-[#1c2031] text-white flex flex-col items-center justify-center px-6 overflow-hidden">
        <div className="absolute top-1/4 left-10 w-96 h-72 bg-[#172d42] opacity-40 blur-3xl rounded-full"></div>
        <div className="absolute bottom-1/3 right-20 w-60 h-60 bg-[#172d42] opacity-30 blur-3xl rounded-full"></div>
        <div className="absolute top-10 right-40 w-32 h-72 bg-[#172d42] opacity-20 blur-2xl rounded-full"></div>
        <div className="absolute inset-0 bg-grid bg-opacity-10 pointer-events-none"></div>

        <Navbar />

        <AnimatedBackground />
        <div
          className="text-center relative "
          data-aos="fade-up"
          data-aos-offset="200"
          data-aos-delay="50"
          data-aos-duration="1000"
          data-aos-easing="ease-in-out"
        >
          <div className="absolute top-1/4 left-10 w-96 h-72 bg-[#172d42] opacity-40 blur-3xl rounded-full"></div>
          <div className="absolute bottom-1/3 right-20 w-60 h-60 bg-[#172d42] opacity-30 blur-3xl rounded-full"></div>
          <div className="absolute top-10 right-40 w-32 h-72 bg-[#172d42] opacity-20 blur-2xl rounded-full"></div>

          <span className="border border-blue-400 px-4 py-1 text-sm text-blue-400 rounded-full ">
            Next-Generation Feedback Analytics
          </span>
          <h1 className="text-5xl md:text-6xl font-bold mt-4">
            Turn Feedback into <br />
            <span className="text-blue-400 drop-shadow-[0_0_10px_#00bfff]">
              Actionable Insights
            </span>
            <br /> with AI
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto mt-4 z-10">
            FeedSenseAI transforms your customer feedback into clear, actionable
            insights with powerful AI analysis. Understand sentiment, identify
            trends, and make data-driven decisions faster than ever.
          </p>

          <div className="mt-6 flex justify-center space-x-4">
            {userSession === null ? (
              <Link href="/login">
                <button className=" cursor-pointer bg-blue-500 px-6 py-3 text-lg font-medium rounded-lg text-white shadow-lg shadow-blue-500/50 hover:bg-blue-600 transition z-10">
                  Get Started Free
                </button>
              </Link>
            ) : (
              <Link href="/dashboard">
                <li className=" cursor-pointer bg-blue-500 px-6 py-3 text-lg font-medium rounded-lg text-white shadow-lg shadow-blue-500/50 hover:bg-blue-600 transition z-10">
                  Your Account
                </li>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="text-center space-y-5 mt-20">
        <h1 className="text-xl font-semibold text-[#b2ecfe] md:text-lg xl:text-5xl">
          Powerful Features
        </h1>
        <p className="text-gray-300">
          Unlock the full potential of your customer feedback with our
          comprehensive suite of AI-powered tools.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 justify-center place-items-center md:place-items-start  mt-16 gap-7 md:px-36">
        {data.map((_, id) => {
          return (
            <div key={id}>
              <div
                data-aos="fade-up"
                data-aos-offset="200"
                data-aos-delay="50"
                data-aos-duration="1000"
                data-aos-easing="ease-in-out"
                data-aos-once="true"
                className="space-y-3 rounded-lg p-6 border-[1px] border-[#2f3a49] bg-[#1a2030] max-w-md cursor-pointer shadow-xl hover:shadow-cyan-800 duration-500 ease-in-out"
              >
                <div className="bg-[#142346] p-3 rounded-lg w-14 flex justify-center">
                  {_.icon}
                </div>
                <h1 className="text-lg md:text-xl font-semibold text-white">
                  {_.title}
                </h1>
                <p className=" max-w-sm text-gray-300">{_.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center space-y-5 mt-20">
        <h1 className="text-xl font-semibold text-[#b2ecfe] md:text-lg xl:text-5xl">
          How It Works
        </h1>
        <p className="text-gray-300">
          A simple four-step process to transform your feedback into valuable
          business insights.
        </p>
      </div>

      <div className="md:flex justify-center hidden  gap-12 items-center mt-5">
        {list.map((i, id) => (
          <div
            key={id}
            className="flex flex-col items-center cursor-pointer "
            onMouseEnter={() => setHoveredIndex(id)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <h1 className="text-lg text-white bg-blue-500 rounded-full p-3 w-12 h-12 text-center">
              {id + 1}
            </h1>
            <div className="bg-[#151923] rounded-xl w-32 h-2 mt-2 overflow-hidden">
              <div
                className={`h-full bg-blue-500 transition-all duration-500 ${
                  hoveredIndex === id || (hoveredIndex === null && id === 0)
                    ? "w-full"
                    : "w-0"
                }`}
              ></div>
            </div>
            <h1 className="text-gray-300 mt-2">{i.title}</h1>
          </div>
        ))}
      </div>

      <div
        data-aos="fade-up"
        data-aos-offset="200"
        data-aos-delay="50"
        data-aos-duration="1000"
        data-aos-easing="ease-in-out"
        data-aos-once="true"
        className="bg-[#1a2030] hidden p-5 rounded-xl max-w-md md:max-w-3xl border-[1px] border-[#2f3a49] mx-auto h-[30vh] mt-10 md:flex items-center justify-center"
      >
        <div className="flex flex-col justify-center items-center gap-6">
          <div className="bg-[#142346] p-3 rounded-lg w-14 flex justify-center">
            {hoveredIndex !== null && hoveredIndex !== undefined
              ? data[hoveredIndex]?.icon
              : data[0]?.icon}
          </div>
          <p className="text-gray-300 text-center px-6 max-w-md">
            {hoveredIndex !== null && hoveredIndex !== undefined
              ? data[hoveredIndex]?.desc
              : data[0]?.desc}
          </p>
        </div>
      </div>

      <div className="flex flex-col justify-center items-center md:hidden">
        {list.map((i, id) => {
          return (
            <div key={id}>
              <div
                data-aos="fade-up"
                data-aos-offset="200"
                data-aos-delay="50"
                data-aos-duration="1000"
                data-aos-easing="ease-in-out"
                data-aos-once="true"
                className="bg-[#1a2030]  p-5 rounded-xl max-w-md md:max-w-3xl border-[1px] border-[#2f3a49] mx-auto h-[30vh] mt-10 md:flex items-center justify-center hover:shadow-cyan-800 duration-300 ease-in-out cursor-pointer"
              >
                <div className="flex flex-col justify-center items-center gap-6">
                  <div className="bg-[#142346] p-3 rounded-lg w-14 flex justify-center">
                    {i.icon}
                  </div>
                  <p className="text-gray-300 text-center px-6 max-w-md">
                    {i.desc}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div
        className={` ${
          offer === "true" ? "hidden" : "block"
        } text-center space-y-5 mt-20`}
      >
        <h1 className="text-xl font-semibold text-[#b2ecfe] md:text-lg xl:text-5xl">
          Simple, Transparent Pricing
        </h1>
        <p className="text-gray-300">
          Choose the plan that best fits your needs. No hidden fees.
        </p>
      </div>

      <div
        className={`flex flex-col md:flex-row gap-8 px-6 md:px-10 pb-14 justify-center mt-16  ${
          offer === "true" ? "hidden" : "block"
        }  `}
      >
        {Plans.map((plan, idx) => {
          return (
            <div
              key={idx}
              data-aos="fade-up"
              data-aos-offset="200"
              data-aos-delay="50"
              data-aos-duration="1000"
              data-aos-easing="ease-in-out"
              data-aos-once="true"
              className="relative flex flex-col rounded-lg  bg-gradient-to-r from-[#1a202f] via-[#1a202f] to-[#1a202f] border-t-4 border-t-cyan-500  transform transition-transform duration-300 hover:scale-105 w-full max-w-md cursor-pointer shadow-2xl"
            >
              {plan.name === "Pro" && (
                <div className="absolute top-0 right-0 bg-cyan-500 text-white text-xs font-bold py-1 px-3 rounded-bl-lg">
                  Free Offer
                </div>
              )}
              <div className="p-6 space-y-3.5 rounded-t-lg">
                <h1 className="text-white text-xl font-bold">{plan.name}</h1>
                <p className="text-3xl font-bold text-slate-200">
                  {plan.price}
                </p>
                <p className="text-slate-300">
                  Perfect for small businesses looking to improve customer
                  experience.
                </p>
              </div>
              <div className="px-7 mt-auto">
                {/* <Link href={`/subscription/${plan.name}`}> */}
                <>
                  <button
                    onClick={handleAvailOffer}
                    className="w-full  bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600   transitionmt-4 text-white py-3 font-semibold rounded-lg  transition-shadow duration-200 shadow-xl text-sm"
                  >
                    Grab Now
                  </button>
                </>
                {/* </Link> */}
              </div>
              <ul className="space-y-4 text-slate-300 p-6 flex-grow bg-[#181c2b] mt-5 border-t-[1px] border-[#2f3a49]">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <TiTickOutline size={20} color="#00a3ff" />
                    <span className=" text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="fixed bottom-10 right-10">
        <Link href="https://feedsenseai.vercel.app/integrate/9vd5wxinC8TnqN4uF1AIegjb4db2/feedsenseai">
          <button className="text-white cursor-pointer hover:scale-110 duration-500 ease-in-out">
            <MdSettingsSuggest
              size={47}
              color="white"
              className="bg-gradient-to-r from-blue-400 via-blue-600 to-blue-700 rounded-full p-3"
            />
          </button>
        </Link>
      </div>

      <footer className="bg-gray-900 text-gray-400 p-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between space-y-8 md:space-y-0">
          <div className="md:w-1/3">
            <h2 className="text-white text-2xl font-semibold">
              Feed<span className="text-cyan-400">Sense</span>AI
            </h2>
            <p className="mt-2 text-sm">
              Transforming feedback into actionable insights with the power of
              artificial intelligence.
            </p>
            <div className="flex space-x-5 mt-4">
              <a href="#" className="hover:text-white">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="hover:text-white">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href="#" className="hover:text-white">
                <i className="fab fa-github"></i>
              </a>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:space-x-16">
            <div>
              <h3 className="text-white font-semibold">Company</h3>
              <ul className="mt-2 space-y-4 text-sm">
                <li>
                  <Link href="/contactUs" className="hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://merchant.razorpay.com/policy/P8XFEmJQOPeGVU/refund"
                    className="hover:text-white"
                  >
                    Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://merchant.razorpay.com/policy/P8XFEmJQOPeGVU/terms"
                    className="hover:text-white"
                  >
                    Terms of Service{" "}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mt-6 md:mt-0">Support</h3>
              <ul className="mt-2 space-y-5 text-sm">
                <li>
                  <Link href="#" className="hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold">Contact</h3>
            <ul className="mt-2 space-y-5 text-sm">
              <li>
                <a
                  href="mailto:hello@feedsenseai.com"
                  className="hover:text-white"
                >
                  📧 chrahulofficial@gmail.com
                </a>
              </li>
              <li>
                <a href="91+8317680338" className="hover:text-white">
                  📞 8317680338
                </a>
              </li>
              <li>📍 Hyderabad 501401,India</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-4 text-sm text-center">
          <p>© 2025 FeedSenseAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Page;
