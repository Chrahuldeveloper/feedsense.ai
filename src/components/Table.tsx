"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { CiMenuFries } from "react-icons/ci";
import MobileSideBar from "./MobileSideBar";
import dbService from "@/firebase/utils/db";
import useAuth from "@/hooks/CurrentUser";
import Loader from "./Loader";
import Analytics from "./Analytics";

const Table = () => {
  const [websitedata, setwebsitedata] = useState([]);

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

  useEffect(() => {
    const fetchWebsites = async () => {
      if (!loading && user) {
        const data = await db.fetchWebsites(user?.uid);
        console.log(data);
        setwebsitedata(data);
      }
    };
    fetchWebsites();
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

  const [toogle, settoogle] = useState(false);

  return (
    <>
      {loading ? <Loader /> : null}

      <div className=" md:ml-44 ">
        <nav className="md:hidden bg-[#1b1d1e] p-7 w-screen border-b-[1px] border-[#272b2f]  flex justify-between items-center">
          <h1 className="text-xl font-semibold text-slate-300">TaskFeed</h1>
          <CiMenuFries
            size={26}
            color="white"
            className="cursor-pointer"
            onClick={() => {
              settoogle(true);
            }}
          />
        </nav>

        <div className="bg-[#1c1d1c] w-screen   md:-ml-36 hidden md:block"></div>
        {toogle ? <MobileSideBar settoogle={settoogle} /> : null}

        <div className="w-full md:w-[75vw] mt-12 px-12 py-6 mx-auto ">
          <div className="overflow-x-auto">
            <table className="text-white w-full table-auto bg-[#2a2a2a]    ">
              <thead className=" mb-3">
                <tr className="text-center text-xs">
                  <th className="py-1 px-2">Name</th>
                  <th className="py-1 px-2">Feedback Count</th>
                  <th className="py-1 px-2">Action</th>
                  <th className="py-1 px-2">Delete</th>
                </tr>
              </thead>
              <tbody>
                {websitedata.map((site, idx) => (
                  <tr
                    key={idx}
                    className={`text-center transition duration-300 ease-in-out border-[#272b2f] border-[1px]  mt-2 `}
                  >
                    <td className="py-1 cursor-pointer text-[11px] md:text-sm">
                      {site?.name}
                    </td>
                    <td className="py-1 cursor-pointer text-[11px] md:text-sm">
                      {site?.feedback?.length || 0}
                    </td>
                    <td className="py-1  cursor-pointer">
                      <Link
                        href={{
                          pathname: "/dashboard/tasks",
                          query: { feedback: JSON.stringify(site?.feedback) },
                        }}
                      >
                        <button className=" text-white px-6 rounded-lg text-sm py-1 cursor-pointer ease-in-out duration-500">
                          View
                        </button>
                      </Link>
                    </td>
                    <td>
                      <button className=" text-white px-6 rounded-lg text-sm py-1 cursor-pointer ease-in-out duration-500">
                        Delete
                      </button>
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
