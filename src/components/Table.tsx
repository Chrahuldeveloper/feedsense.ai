"use client";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { CiMenuFries } from "react-icons/ci";
import MobileSideBar from "./MobileSideBar";
import dbService from "@/firebase/utils/db";
import useAuth from "@/hooks/CurrentUser";
import Loader from "./Loader";
import Analytics from "./Analytics";
import { CgProfile } from "react-icons/cg";

const Table = () => {
  const [websitedata, setWebsitedata] = useState([]);

  interface InfoData {
    totalWebsites: any;
    totalFeedback: any;
  }

  const [infodata, setinfodata] = useState<InfoData>({
    totalWebsites: "",
    totalFeedback: "",
  });

  const db = new dbService();
  const { user, loading } = useAuth();

  useMemo(() => {
    const fetchWebsites = async () => {
      if (!loading && user) {
        const data = await db.fetchWebsites(user);
        console.log("Fetched Websites Data:", data);
        return data;
      }
      return [];
    };
    fetchWebsites().then(setWebsitedata);
  }, [loading, user]);

  useEffect(() => {
    const fetchdetails = async () => {
      try {
        const websiteinfodata = await db.fetchDashBoardDetails(user?.uid);
        if (websiteinfodata) {
          console.log("Fetched Dashboard Details:", websiteinfodata);
          setinfodata({
            totalWebsites: websiteinfodata?.totalWebsites || "0",
            totalFeedback: websiteinfodata?.totalFeedback || "0",
          });
        } else {
          console.error("No data returned for dashboard details.");
        }
      } catch (error) {
        console.error("Error fetching dashboard details:", error);
      }
    };
    fetchdetails();
  }, [loading, user]);

  const [toggle, setToggle] = useState(false);

  return (
    <>
      {loading ? <Loader /> : null}

      <div className="md:ml-44">
        <nav className="md:hidden bg-[#151719] p-7 w-screen border-b-[1px] border-[#272b2f] flex justify-between items-center">
          <h1 className="text-xl font-semibold text-slate-300">TaskFeed</h1>
          <CiMenuFries
            size={26}
            color="white"
            className="cursor-pointer"
            onClick={() => {
              setToggle(true);
            }}
          />
        </nav>

        <div className="bg-[#161618] w-screen px-6 py-5 md:-ml-36 hidden md:block ">
          <div className="flex justify-end gap-x-3 px-20 items-center">
            <CgProfile size={23} color="white" />
            <h1 className="text-slate-300 text-lg font-semibold">Rahul</h1>
          </div>
        </div>
        {toggle ? <MobileSideBar setToggle={setToggle} /> : null}

        <div className="w-full md:w-[75vw] mt-12 px-12 py-6 mx-auto rounded-xl">
          <div className="overflow-x-auto rounded-xl">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-[#1a1a1a]">
                <tr>
                  <th
                    scope="col"
                    className="px-6  py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                  >
                    Icon
                  </th>
                  <th
                    scope="col"
                    className="px-6  py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6  py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                  >
                    Feedback Count
                  </th>
                  <th
                    scope="col"
                    className="px-6  py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-[#121212] divide-y divide-gray-800">
                {websitedata?.map((site, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-[#1a1a1a] transition-colors duration-200"
                  >
                    <td className="px-8 py-4 whitespace-nowrap">
                      <img
                        className="h-10 w-10 rounded-full"
                        src="https://img.freepik.com/premium-photo/man-with-glasses-shirt-that-says-hes-character_1103290-90487.jpg?size=626&ext=jpg"
                        alt=""
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
                          query: { feedback: JSON.stringify(site?.feedback) },
                        }}
                      >
                        <button className="bg-gradient-to-r from-blue-400 via-blue-600 to-blue-700  text-xs text-white px-6  py-2 rounded-lg transition-colors duration-200 cursor-pointer font-semibold">
                          View
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
