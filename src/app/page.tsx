"use client";

import Navbar from "@/components/Navbar";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaCode, FaXTwitter } from "react-icons/fa6";
import { FiInstagram } from "react-icons/fi";
import { FaFacebookF } from "react-icons/fa";
import Cookies from "js-cookie";
import AOS from "aos";
import "aos/dist/aos.css";
import { MdSettingsSuggest } from "react-icons/md";
import Image from "next/image";
import TermsConditions from "../components/TermsConditions";
import { CiChat1 } from "react-icons/ci";
import { SlMagnifier } from "react-icons/sl";
import { IoRocketOutline } from "react-icons/io5";
import { FaArrowsTurnRight } from "react-icons/fa6";
import Footer from "@/components/Footer";

export default function Page() {
  const [userSession, setUserSession] = useState<string | null>(null);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: false,
    });

    const authToken = Cookies.get("auth-token");
    setUserSession(authToken || null);
    console.log(authToken);
  }, []);

  const [istoogle, setistoggle] = useState(false);

  const data = [
    {
      title: "Unified Feedback Management",
      para: "Easily gather feedback from multiple websites and your business services in one place. Streamline your workflow by centralizing all user and client insights.",
    },
    {
      title: "AI-Driven Feedback Analysis",
      para: "Our AI goes beyond simple data collection, transforming user and client feedback into actionable insights and prioritized suggestions for improvement.",
    },
    {
      title: "Smart Suggestions for Improvement",
      para: "Let AI guide you with tailored suggestions based on feedback. Quickly identify areas to enhance your business services and online presence.",
    },
    {
      title: "Centralized Data, Maximum Efficiency",
      para: "Save time and resources by collecting and analyzing feedback from all your websites and business services in one dashboard, powered by intelligent automation.",
    },
  ];

  const howItWorks = [
    {
      title: "Integrate Feedback Form",
      para: "Simply add our feedback form to each of your websites and services. Our form is easy to integrate and starts collecting user and client input immediately.",
    },
    {
      title: "Gather User and Client Insights",
      para: "Your users and clients can submit feedback directly through the form on your websites or services. All responses are stored and organized in one place for easy access.",
    },
    {
      title: "AI-Generated Improvement Suggestions",
      para: "Our AI analyzes the feedback and provides actionable, prioritized suggestions, helping you enhance both your services and user experience efficiently.",
    },
  ];

  const faq = [
    {
      qes: "How does your tool work with multiple websites and business services?",
      ans: "Our tool lets you integrate a feedback form on any number of websites or service pages. All collected data is centralized, making it easy to manage and review feedback from one dashboard.",
    },
    {
      qes: "What kind of feedback does AI analyze?",
      ans: "The AI identifies trends and patterns in user and client feedback, offering insights on areas needing improvement, from service enhancements to functionality upgrades.",
    },
    {
      qes: "How do I get started?",
      ans: "Install our feedback form on your websites and services, and our AI will start gathering and analyzing responses, providing actionable suggestions for improvement.",
    },
    {
      qes: "Is my data secure when using your feedback tool?",
      ans: "Yes, we prioritize data security and privacy. All feedback data collected is encrypted and stored securely, ensuring that only authorized personnel can access it.",
    },
  ];

  const features = [
    {
      icon: <CiChat1 size={20} color="white" />,
      tittle: "Collect Feedback",
    },
    {
      icon: <SlMagnifier size={20} color="white" />,
      tittle: "Analyze Insights",
    },
    {
      icon: <FaCode size={20} color="white" />,
      tittle: "Develop Solution",
    },
    {
      icon: <IoRocketOutline size={20} color="white" />,
      tittle: "Launch Feature",
    },
  ];

  const feedbackComparison = [
    {
      type: "Before",
      points: [
        "The old way feedback feels like a nightmare 😩",
        "Exhausting manual feedback collection",
        "Frustrating platform switching",
        "Time-consuming manual analysis",
        "Overwhelmed by too much feedback",
      ],
    },
    {
      type: "After",
      points: [
        "Let FeedsenseAi do the hard work for you 🤩",
        "Centralized feedback,reducing platform switching by 40%",
        "Automated collection saves hours each week",
        "30% more actionable insights with AI-powered analysis",
        "Cut 70% of manual work",
        "Boost customer engagement by 15% by showing users their feedback matters",
      ],
    },
  ];

  return (
    <div className="bg-black w-full min-h-screen">
      <Navbar />
      <div className="flex flex-col items-center space-y-8 pt-24 px-4">
        <div
          className="absolute inset-0 overflow-hidden "
          data-aos="fade-up"
          data-aos-duration="1400"
          data-aos-easing="ease-in-out"
          data-aos-once="false"
        >
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[30vh] bg-blue-600 rounded-full opacity-20 blur-[120px]" />
            <div className="absolute top-1/4 left-1/4 w-[60vw] h-[30vh] bg-blue-500 rounded-full opacity-15 blur-[100px]" />
            <div className="absolute bottom-1/4 right-1/4 w-[70vw] h-[50vh] bg-blue-400 rounded-full opacity-10 blur-[130px]" />
          </div>
        </div>
        <p className="bg-white p-2 rounded-full text-[11px] font-semibold">
          AI Powered Feedback Collection & Prioritization Technology
        </p>
        <h1 className="text-3xl lg:text-5xl text-center font-semibold text-white leading-8 md:z-50">
          Build What Users Truly Need – <br />{" "}
          <span className=" font-bold bg-gradient-to-r from-blue-500 to-cyan-500 text-transparent bg-clip-text">
            Don’t Waste
          </span>{" "}
          Time or Resources
        </h1>
        <p className="text-[#a2a2a2] max-w-lg text-center md:z-50 text-sm md:text-base">
          Collect, Analyze, and Prioritize Feedback to Shape Your Product’s
          Future with Visionari’s AI Feedback Collection & Prioritization
          Technology <br /> <p className="text-4xl cursor-pointer">💡</p>
        </p>
        <Link
          href={`${userSession === null ? "/login" : "/dashboard"}`}
          className="z-50"
        >
          <button className="bg-white text-black py-2 px-8 md:px-16 lg:px-20 font-semibold rounded-lg text-sm">
            {userSession === null ? "Login" : "Your Account"}
          </button>
        </Link>

        <Image
          width={1024}
          height={768}
          data-aos="fade-up"
          data-aos-duration="2000"
          data-aos-easing="ease-in-out"
          data-aos-once="false"
          src="https://firebasestorage.googleapis.com/v0/b/notes-app-e3995.appspot.com/o/TaskFeed-10-24-2024_09_01_PM.png?alt=media&token=48ce631d-3bd7-4df3-a7c1-6147d9503532"
          alt="Centralized Feedback Visualization"
          className="lg:max-w-5xl mx-auto"
        />
      </div>

      <div className="grid grid-cols-2 gap-6 md:gap-0 place-items-center justify-center md:flex flex-col md:justify-evenly items-center md:flex-row mt-10">
        {features.map((i, id) => {
          return (
            <React.Fragment key={id}>
              <div className="flex flex-col items-center justify-center bg-[#121212] p-4 rounded-full w-24 h-24 space-y-2 cursor-pointer hover:scale-125 duration-500 ease-in-out">
                {i.icon}
                <h1 className="text-[#a2a2a2] font-semibold text-center text-[11px]">
                  {i.tittle}
                </h1>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      <div className="flex flex-col md:flex-row justify-center gap-14 mt-20">
        {feedbackComparison.map((i, id) => {
          return (
            <React.Fragment key={id}>
              <div>
                <div
                  className={`border-[#191d1f] border-[1px] p-5 rounded-lg max-w-sm md:max-w-md mx-auto ${
                    i.type === "After"
                      ? "bg-gradient-to-r from-[#000000] via-[black] to-[#191d1f]"
                      : "bg-[#121212]"
                  }`}
                >
                  <div className="flex items-center gap-4 ">
                    <FaArrowsTurnRight size={14} color="white" />
                    <h1 className="text-white font-semibold text-lg">
                      {i.type}
                    </h1>
                  </div>
                  <ul className="space-y-5 mt-5 pl-3">
                    {i.points.map((i, id) => {
                      return (
                        <li
                          key={id}
                          className="text-[#a2a2a2] text-sm list-disc "
                        >
                          {i}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      <div className="mt-32 md:mt-44 px-4">
        <div className="space-y-8 flex flex-col items-center justify-center">
          <h1 className="text-xl md:text-3xl text-white">
            Simplify Feedback Management
          </h1>
          <p className="text-[#a2a2a2] max-w-xl text-center text-sm md:text-base">
            Our tool collects user and client feedback across multiple websites
            and business services and consolidates it for easy review and
            action.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10">
            {data.map((i, idx) => (
              <div
                className="p-5 max-w-lg text-center space-y-3 bg-[#121212] border-[#191d1f] border-[1px] rounded-lg cursor-pointer hover:scale-105 ease-in-out duration-300"
                data-aos="fade-up"
                data-aos-duration="1000"
                data-aos-easing="ease-in-out"
                data-aos-once="false"
                key={idx}
              >
                <h1 className="text-white font-semibold text-xl">{i.title}</h1>
                <p className="text-[#a2a2a2] leading-7">{i.para}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-10 right-10 ">
        <Link href="https://feedsenseai.vercel.app/integrate/9vd5wxinC8TnqN4uF1AIegjb4db2/feedsense AI">
          <button className="text-white cursor-pointer hover:scale-110 duration-500 ease-in-out">
            <MdSettingsSuggest
              size={47}
              color="white"
              className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-600 rounded-full p-3"
            />
          </button>
        </Link>
      </div>

      <div className="mt-44 px-4">
        <div className="space-y-8 flex flex-col items-center justify-center">
          <h1 className="text-xl md:text-3xl text-white">How does it work?</h1>
          <p className="text-[#a2a2a2] max-w-xl text-center text-sm md:text-base">
            From integration to AI-powered analysis, here’s how our tool
            centralizes feedback from both your websites and services,
            generating improvement suggestions.
          </p>
          <div className="flex flex-col gap-8 md:flex-row">
            {howItWorks.map((i, idx) => (
              <div
                className="p-5 max-w-sm text-center space-y-3 bg-[#121212] border-[#191d1f] border-[1px] rounded-lg cursor-pointer hover:scale-105 ease-in-out duration-300"
                data-aos="fade-up"
                data-aos-duration="1000"
                data-aos-easing="ease-in-out"
                data-aos-once="false"
                key={idx}
              >
                <h1 className="bg-[#323334] rounded-full w-8 mx-auto px-3 py-1 text-center text-white font-semibold text-xl">
                  {idx + 1}
                </h1>
                <h1 className="text-white font-semibold text-xl">{i.title}</h1>
                <p className="text-[#a2a2a2] leading-7">{i.para}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="py-24 px-4">
        <div className="space-y-8 flex flex-col items-center justify-center">
          <h1 className="text-xl md:text-3xl text-white">FAQs</h1>
          <p className="text-[#a2a2a2] max-w-xl text-center text-sm md:text-base">
            Still have questions? We’ve compiled a list of frequently asked
            questions to help you out.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 justify-center gap-4">
            {faq.map((i, idx) => (
              <div
                key={idx}
                className="bg-[#121212] text-white p-5 rounded-xl border-[1px] border-[#191d1f] max-w-md space-y-3"
                data-aos="fade-up"
                data-aos-duration="1000"
                data-aos-easing="ease-in-out"
                data-aos-once="false"
              >
                <h1 className="font-semibold text-lg">{i.qes}</h1>
                <p className="text-[#a2a2a2]">{i.ans}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {istoogle ? <TermsConditions setistoggle={setistoggle} /> : null}

      <Footer />
    </div>
  );
}
