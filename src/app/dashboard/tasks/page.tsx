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
import { MdOutlineEventNote } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { BiMessageRounded } from "react-icons/bi";
import { LuBrain } from "react-icons/lu";
import { GoGraph } from "react-icons/go";
import { FiCheck } from "react-icons/fi";

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

  const getdata = searchParams?.get("feedback");
  const getImage = searchParams?.get("image")!;
  const getName = searchParams?.get("name")!;
  const getPlan = searchParams?.get("Plan")!;
  const TotalFeedback = searchParams?.get("TotalFeedback")!;

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
        backgroundColor: ["#00a3ff", "#9f7aea", "#fc8181"],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <>
      {isloading && <Loader message="Deleting..." />}
      <div className="bg-[#0b0d0d]  w-full flex overflow-x-clip">
        <SideBar page="Home" />
        <div className="md:w-[100vw] mx-auto md:ml-44 space-y-16 rounded-xl">
          <div className="overflow-x-auto rounded-xl my-12">
            <div className="flex md:mx-auto items-center justify-center rounded-lg w-[100vw] md:w-[73vw] px-8 py-2 border-[1px] border-[#0e1012]">
              <div className="flex flex-col items-center gap-4">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-[#68a8fd] to-cyan-500 bg-clip-text text-transparent">
                  AI-Powered Insights
                </h1>
                <p className="text-[#95a4ab]">
                  Unlock the power of artificial intelligence to understand your
                  users better and make data-driven decisions
                </p>
              </div>
            </div>

            <div className="flex justify-center items-center flex-col md:flex-row gap-10 my-6">
              {[
                { title: "Happy", count: HappyCount },
                { title: "Neutral", count: NeutralCount },
                { title: "Sad", count: SadCount },
              ].map(({ title, count }, idx) => (
                <div
                  key={title}
                  className="bg-[#161617] py-5 px-5 rounded-xl w-[60vw] lg:w-[18vw] flex justify-evenly gap-5 cursor-pointer border-[1px] border-[#2c2c2d] hover:scale-105 ease-in-out duration-500"
                >
                  <div className="space-y-3">
                    <h1 className="text-white text-xl">{title} Count</h1>
                    <p className="text-lg text-gray-300">{count}</p>
                  </div>
                  <BiMessageRounded
                    size={33}
                    color="#00a3ff"
                    className="w-12 p-2 h-12 rounded-full bg-[#13293c]"
                  />
                </div>
              ))}
            </div>

            <div className="w-[58vw] mx-auto p-5 rounded-xl bg-[#161617] h-[50vh]">
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
                                    getName // comes from searchParams
                                  );
                                }

                                setFeedbackData((prev) =>
                                  prev.filter((_, i) => i !== idx)
                                );
                              } catch (error) {
                                console.error("Error updating status:", error);
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
                  <div className="py-10 text-center text-slate-300">
                    <div className="flex flex-col items-center gap-5">
                      <FaRegCircleStop size={25} color="#9ca3af" />
                      <p className="font-semibold">No Analysis Yet</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="w-[58vw] mx-auto p-5 rounded-xl bg-[#161617] h-[50vh] my-5">
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
                <div className="py-36 text-center text-slate-300">
                  <div className="flex flex-col items-center gap-5">
                    <FaRegCircleStop size={25} color="#9ca3af" />
                    <p className="font-semibold">No Feedbacks Yet</p>
                  </div>
                </div>
              )}
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
