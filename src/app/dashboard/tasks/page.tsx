"use client";

import React, { useEffect, useState, Suspense } from "react";
import MobileSideBar from "@/components/MobileSideBar";
import SideBar from "@/components/SideBar";
import { CiMenuFries } from "react-icons/ci";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { RxCross2 } from "react-icons/rx";
import Image from "next/image";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import dbService from "@/firebase/utils/db";
import useAuth from "@/hooks/CurrentUser";
import Loader from "@/components/Loader";
import { FaRegCircleStop } from "react-icons/fa6";
import ModelLogout from "@/components/ModelLogout";
import { MdOutlineEventNote, MdOutlineSentimentNeutral } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { BiMessageRounded } from "react-icons/bi";
import { LuBrain } from "react-icons/lu";
import { GoGraph } from "react-icons/go";
import { FiCheck } from "react-icons/fi";
import { IoMdHappy, IoMdSad } from "react-icons/io";

ChartJS.register(
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

interface Feedback {
  emotion: string;
  Rating: number;
  feedback: string;
  parsedFeedback?: { response: string };
}

interface User {
  uid: string;
  displayName: string;
}

interface Bug {
  email: string;
  priority: string;
  tittle: string;
  desc: string;
}

type Feature = Bug;

const Page = () => {
  const searchParams = useSearchParams();
  const { user, loading } = useAuth() as {
    user: User | null;
    loading: boolean;
  };
  const [feedbackData, setFeedbackData] = useState<Feedback[]>([]);
  const [HappyCount, setHappyCount] = useState<number>(0);
  const [NeutralCount, setNeutralCount] = useState<number>(0);
  const [SadCount, setSadCount] = useState<number>(0);
  const [isloading, setisloading] = useState<boolean>(false);
  const [toggleLogout, setToggleLogout] = useState(false);
  const [toggle, setToggle] = useState(true);
  const [bugsdata, setbugsdata] = useState<Bug[]>([]);
  const [featuredata, setfeaturedata] = useState<Feature[]>([]);
  const getdata = searchParams?.get("feedback");
  const getName = searchParams?.get("name")!;
  const getPlan = searchParams?.get("Plan")!;
  const db = new dbService();

  useEffect(() => {
    if (getdata) {
      try {
        const data: Feedback[] = JSON.parse(getdata);
        setFeedbackData(data);

        const happy = data.filter(
          (item) => item.emotion.toLowerCase() === "happy"
        ).length;
        const neutral = data.filter(
          (item) => item.emotion.toLowerCase() === "neutral"
        ).length;
        const sad = data.filter(
          (item) => item.emotion.toLowerCase() === "sad"
        ).length;

        setHappyCount(happy);
        setNeutralCount(neutral);
        setSadCount(sad);
      } catch (e) {
        console.error("Error parsing feedback:", e);
      }
    }
  }, [getdata]);

  const analytics = {
    labels: ["Happy", "Neutral", "Sad"],
    datasets: [
      {
        label: "Feedback Summary",
        data: [HappyCount, NeutralCount, SadCount],
        backgroundColor: ["white", "#00bfff", "#3c4a5a"],
        hoverOffset: 4,
      },
    ],
  };

  const getBugsData = async () => {
    try {
      if (user) {
        const getBugs = await db.getBugs(user?.uid.toString(), getName);
        console.log(getBugs);
        setbugsdata(getBugs);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getsetFeatureData = async () => {
    try {
      if (user) {
        const getFeatures = await db.getFeatures(user?.uid.toString(), getName);
        console.log(getFeatures);
        setfeaturedata(getFeatures);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBugsData();
    getsetFeatureData();
  }, [user]);

  return (
    <>
      {toggle && (
        <MobileSideBar
          setToggle={setToggle}
          setToggleLogout={setToggleLogout}
          Page="Home"
        />
      )}
      {isloading && <Loader message="Deleting..." />}

      <nav className="md:hidden bg-[#0b0d0e] p-7 w-screen border-b-[1px] border-[#1f2327] flex justify-between items-center">
        <h1 className="text-xl font-semibold text-slate-300">FeedSense.ai</h1>
        <CiMenuFries
          size={26}
          color="white"
          className="cursor-pointer"
          onClick={() => setToggle(true)}
        />
      </nav>
      <div className="bg-[#0b0d0d]  w-full flex overflow-x-clip">
        <SideBar page="Home" />
        <div className="md:w-[100vw] mx-auto md:ml-44 space-y-16 rounded-xl">
          <div className="overflow-x-auto rounded-xl my-12">
            <div className="flex md:mx-auto   w-[100vw] md:w-[73vw] px-8 py-2 border-[1px] border-[#0e1012]">
              <div className="flex flex-col  gap-4">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-[#68a8fd] to-cyan-500 bg-clip-text text-transparent">
                  AI-Powered Insights
                </h1>
                <p className="text-[#95a4ab] text-sm">
                  Unlock the power of artificial intelligence to understand your
                  users better and make data-driven decisions
                </p>
              </div>
            </div>

            <div className="">
              {HappyCount > 0 && NeutralCount > 0 && SadCount > 0 ? (
                <Doughnut data={analytics} className="w-96 mx-auto p-10" />
              ) : null}
            </div>

            <div className="flex flex-col lg:flex-row justify-center px-3 items-center lg:ml-24">
              <div className="w-[86vw] md:w-[70vw] lg:w-[40vw] mx-auto p-5  bg-[#161617] h-[50vh]">
                <div className="flex justify-between">
                  <div className="flex items-center space-x-3">
                    <LuBrain size={25} color="#00a3ff" />
                    <h1 className="font-semibold text-white">AI Insights</h1>
                  </div>
                  <div className="text-sm text-white">AI analyzing...</div>
                </div>

                <div className="flex justify-center flex-col gap-3 mt-4">
                  {feedbackData.length > 0 ? (
                    feedbackData.map((fb, idx) =>
                      fb?.parsedFeedback?.response ? (
                        <div
                          key={idx}
                          className={`bg-[#2c2016] text-[#d1d1d1] flex items-center rounded-lg p-5 gap-4 border-l-4 border-orange-500 w-full mb-4 ${
                            getPlan === "Basic"
                              ? "cursor-not-allowed"
                              : "cursor-pointer"
                          }`}
                        >
                          <div className="bg-[#244445] p-3 rounded-md text-cyan-400 text-xl">
                            💡
                          </div>
                          <div className="flex-1">
                            <p
                              className={`${
                                getPlan === "Basic" ? "blur-sm" : ""
                              }`}
                            >
                              {fb.parsedFeedback.response.replace(/"/g, "")}
                            </p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <RxCross2
                              size={40}
                              color="red"
                              className="hover:bg-red-900 p-2 rounded-full cursor-pointer"
                              onClick={() => {
                                if (getPlan !== "Basic") {
                                  setFeedbackData((prev) =>
                                    prev.filter((_, i) => i !== idx)
                                  );
                                }
                              }}
                            />
                            <FiCheck
                              size={40}
                              color="green"
                              className={`hover:bg-green-900 p-2 rounded-full cursor-pointer ${
                                getPlan === "Basic"
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                              onClick={async () => {
                                if (getPlan === "Basic") return;
                                try {
                                  setisloading(true);
                                  if (fb.parsedFeedback?.response) {
                                    await db.handleStatusChange(
                                      user!,
                                      "Completed",
                                      fb.feedback,
                                      getName
                                    );
                                  }

                                  setFeedbackData((prev) =>
                                    prev.filter((_, i) => i !== idx)
                                  );
                                } catch (error) {
                                  console.error(
                                    "Error updating status:",
                                    error
                                  );
                                } finally {
                                  setisloading(false);
                                }
                              }}
                            />
                          </div>
                        </div>
                      ) : null
                    )
                  ) : (
                    <div className="py-24 text-center text-slate-300">
                      <div className="flex flex-col items-center gap-5">
                        <FaRegCircleStop size={25} color="#9ca3af" />
                        <p className="font-semibold">No Analysis Yet</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="w-[86vw] md:w-[70vw] lg:w-[40vw] mx-auto p-5  bg-[#161617] h-[50vh] my-5">
                <div className="flex justify-between">
                  <div className="flex items-center space-x-3">
                    <GoGraph size={25} color="#00a3ff" />
                    <h1 className="font-semibold text-white">User Feedback</h1>
                  </div>
                </div>

                {feedbackData.length > 0 ? (
                  feedbackData.map((fb, idx) => (
                    <div
                      key={idx}
                      className="bg-[#17291f] text-[#d1d1d1] flex items-center rounded-lg p-5 gap-4 border-l-4 border-orange-500 w-full cursor-pointer mt-4"
                    >
                      <div className="bg-[#244445] p-3 rounded-md text-cyan-400 text-xl">
                        💡
                      </div>
                      <div className="flex-1">
                        <p className="text-[#b0b0b0] my-2">{fb.feedback}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-24 text-center text-slate-300">
                    <div className="flex flex-col items-center gap-5">
                      <FaRegCircleStop size={25} color="#9ca3af" />
                      <p className="font-semibold">No Feedbacks Yet</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col lg:flex-row justify-between items-center px-3 lg:ml-24 ">
              <div className="w-[86vw] md:w-[70vw] lg:w-[40vw]  mx-auto  p-5  bg-[#161617] h-[50vh] overflow-y-scroll">
                <div className="flex items-center space-x-3">
                  <LuBrain size={25} color="#00a3ff" />
                  <h1 className="font-semibold text-white">Bugs Reported</h1>
                </div>
                {bugsdata?.length > 0 ? (
                  <div className="">
                    {bugsdata?.map((i, id) => (
                      <div
                        key={id}
                        className={`w-full my-5 rounded-xl p-5 text-white shadow-lg border-l-8 border-orange-500 bg-[#3a2516] cursor-pointer`}
                      >
                        <div className="flex items-center gap-2 text-orange-400 font-semibold">
                          <span>⚠</span>
                          <span>{i.priority.replace(" Priority", "")}</span>
                        </div>

                        <div className="flex items-center gap-3 mt-3">
                          <div className="bg-red-500 w-10 h-10 flex items-center justify-center rounded-full font-bold">
                            {i.email[0].toUpperCase()}
                          </div>
                          <div>
                            <h2 className="font-semibold">
                              {i.email.split("@")[0]}
                            </h2>
                            <div className="flex gap-2 mt-1">
                              <span className="bg-red-600 text-xs px-4 py-1.5 rounded-full font-semibold">
                                Open
                              </span>
                              <span className="bg-[#09343e] text-cyan-400 text-xs px-4 py-1.5 rounded-full font-semibold">
                                Bug
                              </span>
                            </div>
                          </div>
                        </div>

                        <h3 className="mt-4 font-bold text-lg">{i.tittle}</h3>
                        <p className="text-sm mt-2 text-gray-300">{i.desc}</p>

                        <div className="flex justify-between mt-5 text-sm text-gray-400">
                          <span className="bg-red-500 font-semibold text-white  px-3 py-1 rounded-full text-xs">
                            Close
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-24 text-center text-slate-300">
                    <div className="flex flex-col items-center gap-5">
                      <FaRegCircleStop size={25} color="#9ca3af" />
                      <p className="font-semibold">No Bugs Reported</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="w-[86vw] md:w-[70vw] lg:w-[40vw]  mx-auto  p-5  bg-[#161617] h-[50vh] overflow-y-scroll">
                <div className="flex items-center space-x-3">
                  <LuBrain size={25} color="#00a3ff" />
                  <h1 className="font-semibold text-white">Feature Requests</h1>
                </div>
                {featuredata?.length > 0 ? (
                  <div className="">
                    {featuredata?.map((i, id) => (
                      <div
                        key={id}
                        className={`w-full my-5 rounded-xl p-5 text-white shadow-lg border-l-8 border-yellow-500 bg-[#211f16] cursor-pointer`}
                      >
                        <div className="flex items-center gap-2 text-orange-400 font-semibold">
                          <span>⚠</span>
                          <span>{i.priority.replace(" Priority", "")}</span>
                        </div>

                        <div className="flex items-center gap-3 mt-3">
                          <div className="bg-red-500 w-10 h-10 flex items-center justify-center rounded-full font-bold">
                            {i.email[0].toUpperCase()}
                          </div>
                          <div>
                            <h2 className="font-semibold">
                              {i.email.split("@")[0]}
                            </h2>
                            <div className="flex gap-2 mt-1">
                              <span className="bg-red-600 text-xs px-4 py-1.5 rounded-full font-semibold">
                                Open
                              </span>
                              <span className="bg-[#09343e] text-cyan-400  text-xs  px-4 py-1.5 rounded-full font-semibold">
                                Feature
                              </span>
                            </div>
                          </div>
                        </div>

                        <h3 className="mt-4 font-bold text-lg">{i.tittle}</h3>
                        <p className="text-sm mt-2 text-gray-300">{i.desc}</p>

                        <div className="flex justify-between mt-5 text-sm text-gray-400">
                          <span className="bg-red-500 font-semibold text-white px-3 py-1 rounded-full text-xs">
                            Close
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-24 text-center text-slate-300">
                    <div className="flex flex-col items-center gap-5">
                      <FaRegCircleStop size={25} color="#9ca3af" />
                      <p className="font-semibold">No Feature Requests</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {toggleLogout && <ModelLogout settoggle={setToggleLogout} />}
    </>
  );
};

const PageWithSuspense = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <Page />
  </Suspense>
);

export default PageWithSuspense;
