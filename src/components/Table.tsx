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
import Image from "next/image";
import ModelLogout from "./ModelLogout";
import Loader from "./Loader";
import { BiMessageRounded } from "react-icons/bi";
import { GoGraph } from "react-icons/go";
import { CgNotes } from "react-icons/cg";

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
      if (!loading && user) {
        const cachedData = cache.get(user.uid);
        if (cachedData) {
          console.log("Fetched Websites Data from Cache:", cachedData.value);
          setWebsitedata(cachedData.value);
          return;
        }

        const data = await db1.fetchWebsites(user);
        console.log("Fetched Websites Data from Firestore:", data);

        const transformedData = data.map((item: any) => ({
          name: item.name || "",
          url: item.url || "",
          type: item.type || "",
          image: item.image || "",
          feedback: item.feedback || [],
        }));
        console.log(transformedData);
        cache.set(user.uid, transformedData);
        setWebsitedata(transformedData);
      }
    };
    fetchWebsites();
  }, [loading, user, db1]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const websiteInfoData = await db1.fetchDashboardDetails(
          user!.uid.toString()
        );
        if (websiteInfoData) {
          console.log("Fetched Dashboard Details:", websiteInfoData);
          setInfodata({
            totalWebsites: websiteInfoData?.totalWebsites?.toString() || "0",
            totalFeedback: websiteInfoData?.totalFeedback?.toString() || "0",
            totalTasksFinished:
              websiteInfoData?.totalTasksFinished?.toString() || "0",
            totalIncompleteTasks:
              websiteInfoData?.totalIncompleteTasks?.toString() || "0",
          });
        } else {
          console.error("No data returned for dashboard details.");
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
        <nav className="md:hidden bg-[#151923] p-7 w-screen border-b-[1px] border-[#15171b] flex justify-between items-center">
          <h1 className="text-xl font-semibold text-slate-300">FeedSense.ai</h1>
          <CiMenuFries
            size={26}
            color="white"
            className="cursor-pointer"
            onClick={() => setToggle(true)}
          />
        </nav>

        <div className="bg-[#151923] w-screen px-14 py-3 pt-5 md:-ml-36 hidden md:block border-b-[1px] border-[#15171b]">
          <div className="flex justify-end gap-x-3 items-center pb-2">
            <div className="space-y-1">
              <h1 className="text-slate-300">{user?.displayName || "User"}</h1>
              <p className="text-[10px] text-slate-300">Admin</p>
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

        <div className="p-5">
          <h1 className="text-xl md:text-2xl text-gray-300 md:px-20 font-semibold mt-3">
            DashBoard OverView
          </h1>
        </div>

        <div className="w-[80vw] mx-auto justify-center flex flex-col md:flex-row gap-8">
          <div className="bg-[#151923] p-5 rounded-lg w-[17vw] flex justify-evenly gap-5 cursor-pointer">
            <div className="space-y-3">
              <h1 className=" font-semibold text-slate-300 text-sm">
                Total TotalWebsites
              </h1>
              <p className="text-sm text-gray-300">{infodata.totalWebsites}</p>
            </div>
            <BiMessageRounded
              size={33}
              color="#00a3ff"
              className="w-12 p-2 h-12 rounded-full bg-[#13293c]"
            />
          </div>
          <div className="bg-[#151923] p-5 rounded-lg w-[17vw] flex justify-evenly gap-5 cursor-pointer">
            <div className="space-y-3">
              <h1 className=" font-semibold text-slate-300 text-sm">
                Total Feedback
              </h1>
              <p className="text-sm text-gray-300">{infodata.totalFeedback}</p>
            </div>
            <CgNotes
              size={26}
              color="#c084fc"
              className="w-12 p-2.5 h-12 rounded-full bg-[#1b1938]"
            />
          </div>
          <div className="bg-[#151923] p-5 rounded-lg w-[17vw] flex justify-evenly gap-5 cursor-pointer">
            <div className="space-y-3">
              <h1 className=" font-semibold text-slate-300 text-sm">
                Total TasksFinished
              </h1>
              <p className="text-sm text-gray-300">
                {infodata.totalTasksFinished}
              </p>
            </div>
            <GoGraph
              size={33}
              color="green"
              className="w-12 p-2 h-12 rounded-full bg-[#112e2d]"
            />
          </div>
          <div className="bg-[#151923] p-5 rounded-lg w-[17vw] flex justify-evenly gap-5 cursor-pointer">
            <div className="space-y-3">
              <h1 className=" font-semibold text-slate-300 text-sm">
                Tasks to Finish
              </h1>
              <p className="text-sm text-gray-300">
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

        <div className="flex justify-center items-start md:flex-row flex-col gap-4">
          <div className="w-[100vw] md:w-[40vw] ">
            <Analytics
              totalWebsites={infodata.totalWebsites}
              totalFeedback={infodata.totalFeedback}
              totalTasksFinished={infodata.totalTasksFinished}
              totalIncompleteTasks={infodata.totalIncompleteTasks}
              loading={loading}
            />
          </div>
          <div className="w-full md:w-[40vw]  py-7 md:h-[70vh] rounded-lg">
            {loading ? (
              <div>
                <Loader message="please wait" />
              </div>
            ) : websitedata?.length === 0 ? (
              <div className="space-y-6 text-center bg-[#151923] pt-28 border-[1px] border-[#15171b] p-10 md:h-[67vh] rounded-lg">
                <FaRegCircleStop size={23} color="white" className="mx-auto" />
                <p className="text-lg font-semibold text-white">
                  No websites connected yet
                </p>
                <p className="text-xs text-slate-200">
                  Add your first website to get started
                </p>
              </div>
            ) : (
              <div className="pt-3  bg-[#151923] md:h-[67vh] rounded-lg">
                <div>
                  <div className="">
                    <div className="flex flex-col  p-8">
                      {websitedata?.map((site, idx) => (
                        <div
                          key={idx}
                          className="rounded-lg flex items-center gap-8 justify-around"
                        >
                          <div className="flex gap-4 items-center">
                            <Image
                              className="w-14 h-14 rounded-full object-cover border border-[#22252a]"
                              src={site?.image}
                              alt="Profile"
                              width={48}
                              height={48}
                            />
                          </div>
                          <h1 className="text-sm text-slate-300 font-semibold my-2.5">
                            {site?.name}
                          </h1>
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
                            <button className="bg-gradient-to-r from-blue-800 via-blue-600 to-blue-700 text-white px-8 py-1.5 rounded-lg text-xs font-semibold transition duration-200 hover:bg-blue-700 w-full my-3">
                              View
                            </button>
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
