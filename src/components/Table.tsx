"use client";
import Link from "next/link";
import React, { useEffect, useState, useMemo } from "react";
import { CiMenuFries } from "react-icons/ci";
import MobileSideBar from "./MobileSideBar";
import dbService from "@/firebase/utils/db";
import useAuth from "@/hooks/CurrentUser";
import Analytics from "./Analytics";
import { CgProfile } from "react-icons/cg";
import { FaRegCircleStop } from "react-icons/fa6";
import cache from "../cache/cache";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/Firebase";
import { CiShare1 } from "react-icons/ci";
import ModelLogout from "./ModelLogout";
import Loader from "./Loader";
import { BiMessageRounded } from "react-icons/bi";
import { GoGraph } from "react-icons/go";
import { CgNotes } from "react-icons/cg";
import { CiGlobe } from "react-icons/ci";

interface WebsiteData {
  name: string;
  url: string;
  type: string;
  image: string;
  feedback?: string[];
}

interface InfoData {
  totalWebsites: string;
  totalFeedback: string;
  totalTasksFinished: string;
  totalIncompleteTasks: string;
}

interface Plan {
  subscription: string;
}

interface User {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
}

const Table = () => {
  const [websitedata, setWebsitedata] = useState<WebsiteData[]>([]);
  const [infodata, setInfodata] = useState<InfoData>({
    totalWebsites: "0",
    totalFeedback: "0",
    totalTasksFinished: "0",
    totalIncompleteTasks: "0",
  });
  const [plan, setPlan] = useState<Plan | null>(null);

  const db1 = useMemo(() => new dbService(), []);

  const { user, loading } = useAuth() as {
    user: User | null;
    loading: boolean;
  };

  useEffect(() => {
    const checkPlan = async () => {
      if (!loading && user) {
        const userDocRef = doc(db, "USERS", user.uid);
        const docSnap = await getDoc(userDocRef);
        const userPlan = docSnap.data()?.subscription;
        console.log(userPlan);
        setPlan({ subscription: userPlan });
      }
    };
    checkPlan();
  }, [loading, user]);

  useEffect(() => {
    const fetchWebsites = async () => {
      if (!user || loading) return;

      const cachedData = cache.get(`${user.uid}_websites`);
      if (cachedData) {
        console.log("Fetched Websites Data from Cache:", cachedData.value);
        setWebsitedata(cachedData.value);
        return;
      }

      try {
        const data = await db1.fetchWebsites(user);
        console.log("Fetched Websites Data from Firestore:", data);

        const transformedData = data.map((item: any) => ({
          name: item.name || "",
          url: item.url || "",
          type: item.type || "",
          image: item.image || "",
          feedback: item.feedback || [],
        }));

        cache.set(`${user.uid}_websites`, transformedData);
        setWebsitedata(transformedData);
      } catch (error) {
        console.error("Error fetching websites:", error);
      }
    };

    fetchWebsites();
  }, [loading, user, db1]);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!user || loading) return;

      const cachedDetails = cache.get(`${user.uid}_dashboard`);
      if (cachedDetails) {
        console.log(
          "Fetched Dashboard Details from Cache:",
          cachedDetails.value
        );
        setInfodata(cachedDetails.value);
        return;
      }

      try {
        const websiteInfoData = await db1.fetchDashboardDetails(user.uid);
        if (websiteInfoData) {
          console.log("Fetched Dashboard Details:", websiteInfoData);
          const newInfo = {
            totalWebsites: websiteInfoData?.totalWebsites?.toString() || "0",
            totalFeedback: websiteInfoData?.totalFeedback?.toString() || "0",
            totalTasksFinished:
              websiteInfoData?.totalTasksFinished?.toString() || "0",
            totalIncompleteTasks:
              websiteInfoData?.totalIncompleteTasks?.toString() || "0",
          };
          cache.set(`${user.uid}_dashboard`, newInfo);
          setInfodata(newInfo);
        }
      } catch (error) {
        console.error("Error fetching dashboard details:", error);
      }
    };
    fetchDetails();
  }, [loading, user, db1]);

  const [toggle, setToggle] = useState(false);

  const [toggleLogout, setToggleLogout] = useState(false);

  return (
    <>
      {/* {loading && <Loader message="loading" />} */}
      <div className="md:ml-44">
        <nav className="md:hidden bg-[#0b0d0e] p-7 w-screen border-b-[1px] border-[#1f2327] flex justify-between items-center">
          <h1 className="text-xl font-semibold text-slate-300">FeedSense.ai</h1>
          <CiMenuFries
            size={26}
            color="white"
            className="cursor-pointer"
            onClick={() => setToggle(true)}
          />
        </nav>

        <div className="bg-[#0b0d0e] w-screen px-14 py-3 pt-5 md:-ml-36 hidden md:block border-b-[1px] border-[#1f2327]">
          <div className="flex justify-end gap-x-3 items-center pb-2">
            <div className="space-y-1">
              <h1 className="text-slate-300">{user?.displayName || "User"}</h1>
            </div>
            <CgProfile
              size={30}
              color="#00a3ff"
              className="w-10 p-2 h-10 rounded-full bg-[#13293c]"
            />
          </div>
        </div>

        {toggle && (
          <MobileSideBar
            setToggle={setToggle}
            setToggleLogout={setToggleLogout}
          />
        )}

        {toggleLogout && <ModelLogout settoggle={setToggleLogout} />}

        <div className="p-5 md:ml-10 md:px-20 lg:px-32 space-y-2">
          <h1 className="text-xl md:text-2xl lg:text-3xl text-gray-300  font-semibold mt-3">
            DashBoard OverView
          </h1>
          <p className="text-[#95a4ab]">
            AI-powered insights from your user feedback
          </p>
        </div>

        <div className="w-[76vw] mx-auto justify-center flex flex-col md:flex-row gap-8 my-4">
          <div className="bg-[#161617] py-5 px-5 rounded-xl w-[60vw] mx-auto lg:w-[18vw] flex justify-evenly gap-5 cursor-pointer border-[1px] border-[#2c2c2d]">
            <div className="space-y-3 ">
              <h1 className="  text-[#95a4ab] text-xl">Total TotalWebsites</h1>
              <p className="text-lg text-gray-300">{infodata.totalWebsites}</p>
            </div>
            <BiMessageRounded
              size={33}
              color="#00a3ff"
              className=" w-12 p-2 h-12 rounded-full bg-[#13293c]"
            />
          </div>
          <div className="bg-[#161617] py-5 px-5 rounded-xl w-[60vw] mx-auto lg:w-[18vw] flex justify-evenly gap-5 cursor-pointer border-[1px] border-[#2c2c2d]">
            <div className="space-y-3 ">
              <h1 className="  text-[#95a4ab] text-xl">Total Feedback</h1>
              <p className="text-lg text-gray-300">{infodata.totalFeedback}</p>
            </div>
            <CgNotes
              size={26}
              color="#c084fc"
              className="w-12 p-2.5 h-12 rounded-full bg-[#1b1938]"
            />
          </div>
          <div className="bg-[#161617] py-5 px-5 rounded-xl w-[60vw] mx-auto lg:w-[18vw] flex justify-evenly gap-5 cursor-pointer border-[1px] border-[#2c2c2d]">
            <div className="space-y-3 ">
              <h1 className="  text-[#95a4ab] text-xl">Total TasksFinished</h1>
              <p className="text-lg text-gray-300">
                {infodata.totalTasksFinished}
              </p>
            </div>
            <GoGraph
              size={33}
              color="green"
              className="w-12 p-2 h-12 rounded-full bg-[#112e2d]"
            />
          </div>
          <div className="bg-[#161617] py-5 px-5 rounded-xl w-[60vw] mx-auto lg:w-[18vw] flex justify-evenly gap-5 cursor-pointer border-[1px] border-[#2c2c2d]">
            <div className="space-y-3">
              <h1 className="  text-[#95a4ab] text-xl">Tasks to Finish</h1>
              <p className="text-lg text-gray-300">
                {infodata.totalIncompleteTasks}
              </p>
            </div>
            <BiMessageRounded
              size={33}
              color="#00a3ff"
              className="w-12 p-2 h-12 rounded-full bg-[#13293c]"
            />
          </div>
        </div>

        <div className="flex justify-center items-start md:flex-row flex-col gap-4 lg:gap-24">
          <div className="w-[100vw] md:w-[35vw] md:ml- ">
            <Analytics
              totalWebsites={infodata.totalWebsites}
              totalFeedback={infodata.totalFeedback}
              totalTasksFinished={infodata.totalTasksFinished}
              totalIncompleteTasks={infodata.totalIncompleteTasks}
              loading={loading}
            />
          </div>
          <div className="w-full md:w-[35vw]  py-7 md:h-[60vh] rounded-lg">
            {loading ? (
              <div>
                <Loader message="please wait" />
              </div>
            ) : websitedata?.length === 0 ? (
              <div className="space-y-6 text-center bg-[#161617] pt-28 border-[1px] border-[#15171b] p-10 md:h-[54vh] rounded-lg">
                <FaRegCircleStop size={23} color="white" className="mx-auto" />
                <p className="text-lg  text-white">
                  No websites connected yet
                </p>
                <p className="text-xs text-[#95a4ab]">
                  Add your first website to get started
                </p>
              </div>
            ) : (
              <div className="pt-3  bg-[#161617] md:h-[54vh] border-[1px] border-[#2c2c2d] overflow-y-scroll rounded-lg">
                <div>
                  <div className="">
                    <div className="flex flex-col gap-5 ">
                      {websitedata?.map((site, idx) => (
                        <div
                          key={idx}
                          className="rounded-xl flex items-center justify-between gap-8 bg-[#212223] mx-5 p-2.5"
                        >
                          <div className="flex items-center space-x-3">
                            <CiGlobe
                              size={50}
                              color="#00a3ff"
                              className="bg-[#13293c] backdrop-blur-sm border border-[#13293c] p-2 rounded-xl"
                            />
                            <div className="flex flex-col">
                              <h1 className="text-sm text-slate-300 font-semibold my-2.5">
                                {site?.name}
                              </h1>
                              <p className=" bg-green-900/50 text-green-400 text-xs shadow-[0_0_6px_#22c55e55] backdrop-blur-sm border border-green-400/10 rounded-full  px-4 py-0.5  text-center">
                                Active
                              </p>
                            </div>
                          </div>
                          <Link
                            href={{
                              pathname: "/dashboard/tasks",
                              query: {
                                feedback: JSON.stringify(site?.feedback || []),
                                name: site?.name,
                                image: site?.image,
                                Plan: plan?.subscription,
                                TotalFeedback: site?.feedback?.length ?? 0,
                              },
                            }}
                          >
                            <CiShare1
                              size={22}
                              color="#95a4ab"
                            />
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Table;
