"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { CiMenuFries } from "react-icons/ci";
import MobileSideBar from "./MobileSideBar";
import dbService from "@/firebase/utils/db";
import useAuth from "@/hooks/CurrentUser";
import Loader from "./Loader";
import Analytics from "./Analytics";
import { CgProfile } from "react-icons/cg";
import { FaRegCircleStop } from "react-icons/fa6";
import cache from "../cache/cache";

interface Props {
  user: any;
}

const Table: React.FC<Props> = ({ user }) => {
  const [websitedata, setWebsitedata] = useState<any[]>([]);

  interface InfoData {
    totalWebsites: string;
    totalFeedback: string;
  }

  const [infodata, setInfodata] = useState<InfoData>({
    totalWebsites: "0",
    totalFeedback: "0",
  });

  const db = new dbService();
  const { user: currentUser, loading } = useAuth();

  useEffect(() => {
    const fetchWebsites = async () => {
      if (!loading && currentUser) {
        const cachedData = cache.get(currentUser.uid);

        if (cachedData) {
          console.log("Fetched Websites Data from Cache:", cachedData.value);
          setWebsitedata(cachedData.value);
          return;
        }

        const data = await db.fetchWebsites(currentUser);
        console.log("Fetched Websites Data from Firestore:", data);

        cache.set(currentUser.uid, data);
        setWebsitedata(data);
      }
    };
    fetchWebsites();
  }, [loading, currentUser]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const websiteInfoData = await db.fetchDashboardDetails(
          currentUser?.uid
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
  }, [loading, currentUser]);

  const [toggle, setToggle] = useState(false);

  return (
    <>
      {loading && <Loader />}
      <div className="md:ml-44">
        <nav className="md:hidden bg-[#151719] p-7 w-screen border-b-[1px] border-[#272b2f] flex justify-between items-center">
          <h1 className="text-xl font-semibold text-slate-300">TaskFeed</h1>
          <CiMenuFries
            size={26}
            color="white"
            className="cursor-pointer"
            onClick={() => setToggle(true)}
          />
        </nav>

        <div className="bg-[#17161c] w-screen px-6 pt-5 md:-ml-36 hidden md:block">
          <div className="flex justify-end gap-x-3 px-20 items-center">
            <CgProfile size={23} color="white" />
            <h1 className="text-slate-300 text-lg font-semibold">
              {currentUser?.displayName || "User"}
            </h1>
          </div>
        </div>

        {toggle && <MobileSideBar setToggle={setToggle} />}

        <div className="w-full md:w-[70vw]  px-12 py-14 mx-auto rounded-xl">
          {websitedata.length === 0 ? (
            <div className="space-y-6 text-center bg-[#17161c] rounded-xl p-10">
              <FaRegCircleStop size={23} color="white" className="mx-auto" />
              <p className="text-2xl font-semibold text-white">
                No websites connected yet
              </p>
              <p className="text-sm text-slate-200">Add your first website to get started</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl pt-20">
              <table className="min-w-full divide-y divide-stone-900">
                <thead className="bg-[#201d24]">
                  <tr className="cursor-pointer">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Icon
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Feedback Count
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-[#161419] divide-y divide-stone-800">
                  {websitedata.map((site, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-[#141316] transition-colors duration-200 cursor-pointer"
                    >
                      <td className="px-8 py-4 whitespace-nowrap">
                        <img
                          className="h-12 w-12 rounded-full object-cover"
                          src={site?.logo}
                          alt="Profile"
                        />
                      </td>
                      <td className="px-8 py-4 whitespace-nowrap text-sm text-slate-300 font-semibold">
                        {site?.name}
                      </td>
                      <td className="px-10 py-4 whitespace-nowrap text-sm text-slate-300">
                        {site?.feedback?.length || 0}
                      </td>
                      <td className="px-2 py-4 whitespace-nowrap text-sm text-slate-300">
                        <Link
                          href={{
                            pathname: "/dashboard/tasks",
                            query: {
                              feedback: JSON.stringify(site?.feedback),
                              name: site?.name,
                              image: site?.logo,
                            },
                          }}
                        >
                          <button className="bg-gradient-to-r from-blue-400 via-blue-600 to-blue-700 text-xs text-white px-6 py-2 rounded-full transition-colors duration-200 cursor-pointer font-semibold">
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
          />
        </div>
      </div>
    </>
  );
};

export default Table;
