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
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import ModelLogout from "./ModelLogout";

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

        <div className="bg-[#151923] w-screen px-14 py-8 pt-5 md:-ml-36 hidden md:block border-b-[1px] border-[#15171b]">
          <div className="flex justify-end gap-x-3 items-center pt-2">
            <CgProfile size={23} color="white" />
            <h1 className="text-slate-300 text-lg ">
              {user?.displayName || "User"}
            </h1>
          </div>
        </div>

        {toggle && (
          <MobileSideBar
            setToggle={setToggle}
            setToggleLogout={setToggleLogout}
          />
        )}

        {toggleLogout && <ModelLogout settoggle={setToggleLogout} />}

        <div className="flex justify-center items-start md:flex-row flex-col mt-10 gap-8">
          <div className="w-[100vw] md:w-[30vw] ">
            <Analytics
              totalWebsites={infodata.totalWebsites}
              totalFeedback={infodata.totalFeedback}
              loading={loading}
            />
          </div>

          <div className="w-full md:w-[35vw]  py-7 md:h-[70vh] rounded-lg">
            {loading ? (
              <SkeletonTheme baseColor="#151923" highlightColor="#151923">
                <Skeleton count={1} height={300} className="my-2" />
              </SkeletonTheme>
            ) : 0 === 0 ? (
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

                            <h1 className="text-sm text-slate-300 font-semibold my-2.5">
                              {site?.name}
                            </h1>
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
