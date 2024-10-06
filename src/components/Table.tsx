"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { CiMenuFries } from "react-icons/ci";
import MobileSideBar from "./MobileSideBar";
import dbService from "@/firebase/utils/db";
import useAuth from "@/hooks/CurrentUser";
import Loader from "./Loader";

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

  type dataItem = {
    label: String;
    number: String;
  };

  const data: dataItem[] = [
    {
      label: "Total website",
      number: infodata.totalWebsites,
    },
    {
      label: "Total Feedback",
      number: infodata.totalFeedback,
    },
  ];

  const [toogle, settoogle] = useState(false);

  console.log(infodata);

  return (
    <>
      {loading ? <Loader /> : null}
      <div className=" md:ml-40">
        <nav className="md:hidden bg-[#0f0d15] p-7 w-screen border-b-[1px] border-neutral-900 flex justify-between items-center">
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

        <h1 className="text-2xl font-semibold text-white mb-4 px-8 py-6">
          Your DashBoard
        </h1>

        {toogle ? <MobileSideBar settoogle={settoogle} /> : null}

        <div className="flex flex-col md:flex-row gap-5 justify-center items-center mt-7 px-8">
          {data.map((itm, idx) => {
            return (
              <div
                key={idx}
                className="bg-[#0f0d15] p-4 rounded-lg md:w-[15vw] w-[50vw]  cursor-pointer border-[1px] border-neutral-900"
              >
                <div className="text-white space-y-3 text-center">
                  <h1>{itm.label}</h1>
                  <p>{itm.number}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="w-full md:w-[90vw]   mt-12 px-12 py-6">
          <div className="overflow-x-auto">
            <table className="text-white w-full table-auto  border-[1px] border-neutral-900 ">
              <thead className="bg-[#0f0d15]">
                <tr className="text-center text-xs">
                  <th className="py-2 px-4">Name</th>
                  <th className="py-2 px-4">Feedback Count</th>
                  {/* <th className="py-2 px-4">Task Generated</th> */}
                  <th className="py-2 px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {websitedata.map((site, idx) => (
                  <tr
                    key={idx}
                    className={`text-center transition duration-300 ease-in-out  ${
                      idx % 2 !== 0 ? "bg-[#0f0d15]" : ""
                    }`}
                  >
                    <td className="py-2 px-4 cursor-pointer text-[11px] md:text-sm">
                      {site?.name}
                    </td>
                    <td className="py-2 px-4 cursor-pointer text-[11px] md:text-sm">
                      {site.feedback.length}
                    </td>
                    {/* <td
                      className={`py-2 px-4 cursor-pointer text-[11px] md:text-sm ${
                        site.taskStatus === "Completed"
                          ? "text-green-500"
                          : site.taskStatus === "In Progress"
                          ? "text-blue-500"
                          : ""
                      }`}
                    >
                      • {site.taskStatus}
                    </td> */}
                    <td className="py-2 px-4 cursor-pointer">
                      <Link href="/dashboard/tasks">
                        <button className="bg-blue-500 text-white px-5 rounded-full text-sm py-1 cursor-pointer hover:bg-blue-600 ease-in-out duration-500">
                          View
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Table;
