"use client";
import Link from "next/link";
import React, { useEffect, useState, useMemo } from "react";
import { CiMenuFries } from "react-icons/ci";
import MobileSideBar from "./MobileSideBar";
import dbService from "@/firebase/utils/db";
import useAuth from "@/hooks/CurrentUser";
import Loader from "./Loader";
import Analytics from "./Analytics";
import { CgProfile } from "react-icons/cg";
import { FaRegCircleStop } from "react-icons/fa6";
import cache from "../cache/cache";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/Firebase";
import Image from "next/image";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

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

  return (
    <>
      {/* {loading && <Loader message="loading" />} */}
      <div className="md:ml-44">
        <nav className="md:hidden bg-[#111115] p-7 w-screen border-b-[1px] border-[#15171b] flex justify-between items-center">
          <h1 className="text-xl font-semibold text-slate-300">FeedSense.ai</h1>
          <CiMenuFries
            size={26}
            color="white"
            className="cursor-pointer"
            onClick={() => setToggle(true)}
          />
        </nav>

        <div className="bg-[#111115] w-screen px-14 py-8 pt-5 md:-ml-36 hidden md:block border-b-[1px] border-[#15171b]">
          <div className="flex justify-end gap-x-3 items-center pt-2">
            <CgProfile size={23} color="white" />
            <h1 className="text-slate-300 text-lg ">
              {user?.displayName || "User"}
            </h1>
          </div>
        </div>

        {toggle && <MobileSideBar setToggle={setToggle} />}

        <div className="w-full md:w-[70vw] px-2 py-14 mx-auto rounded-xl">
          {loading ? (
            <SkeletonTheme baseColor="#111115" highlightColor="#444">
              <Skeleton count={1} height={300} className="my-2" />
            </SkeletonTheme>
          ) : websitedata.length === 0 ? (
            <div className="space-y-6 text-center bg-[#111115] rounded-lg border-[1px] border-[#15171b] p-10">
              <FaRegCircleStop size={23} color="white" className="mx-auto" />
              <p className="text-lg font-semibold text-white">
                No websites connected yet
              </p>
              <p className="text-xs text-slate-200">
                Add your first website to get started
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto  pt-5">
              <table className="w-[89vw] mx-auto  md:min-w-full divide-y rounded-xl divide-[#15171b] border-[1px] border-[#15171b]">
                <thead className="bg-[#111115]">
                  <tr className="cursor-pointer">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Logo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs hidden md:block font-medium text-gray-400 uppercase tracking-wider">
                      Feedbacks
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-[#111115] divide-y divide-[#15171b]">
                  {websitedata?.map((site, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-[#15161d] transition-colors duration-300 ease-in-out cursor-pointer"
                    >
                      <td className="px-8 py-4 whitespace-nowrap">
                        <Image
                          className="h-12 w-12 rounded-full object-cover border-[1px] border-[#15171b]"
                          src={site?.image}
                          alt="Profile"
                          width={48}
                          height={48}
                        />
                      </td>
                      <td className="px-8 py-4 whitespace-nowrap text-sm text-slate-300 font-semibold">
                        {site?.name}
                      </td>
                      <td className="px-10 py-4 whitespace-nowrap text-sm text-slate-300 hidden md:block">
                        {site?.feedback && site.feedback.length > 0
                          ? site.feedback.length
                          : 0}
                      </td>
                      <td className="px-2 py-4 whitespace-nowrap text-sm text-slate-300">
                        <Link
                          href={{
                            pathname: "/dashboard/tasks",
                            query: {
                              feedback: JSON.stringify(site?.feedback || []),
                              name: site?.name,
                              image: site?.image,
                              Plan: plan?.subscription,
                              TotalFeedback: site!.feedback!.length,
                            },
                          }}
                        >
                          <button className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-600 text-xs text-white px-6 py-2 rounded-lg transition-colors duration-200 cursor-pointer font-semibold">
                            View
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <Analytics
            totalWebsites={infodata.totalWebsites}
            totalFeedback={infodata.totalFeedback}
            loading={loading}
          />
        </div>
      </div>
    </>
  );
};

export default Table;
