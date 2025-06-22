"use client";

import MobileSideBar from "@/components/MobileSideBar";
import SideBar from "@/components/SideBar";
import React, { useEffect, useState, Suspense } from "react";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

const Page = () => {
  interface User {
    uid: string;
  }

  const searchParams = useSearchParams();

  const { user, loading } = useAuth() as {
    user: User | null;
    loading: boolean;
  };

  interface Feedback {
    // name: string;
    // email: string;
    emotion: string;
    Rating: number;
    feedback: string;
    parsedFeedback?: { response: string };
  }

  const [websites, setWebsites] = useState<Feedback[]>([]);
  const [HappyCount, setHappyCount] = useState<number>(0);
  const [NeutralCount, setNeutralCount] = useState<number>(0);
  const [SadCount, setSadCount] = useState<number>(0);
  const [toggle, setToggle] = useState(false);

  const getdata = searchParams?.get("feedback")!;
  const getImage = searchParams?.get("image")!;
  const getName = searchParams?.get("name")!;
  const getPlan = searchParams?.get("Plan")!;
  const TotalFeedback = searchParams?.get("TotalFeedback")!;

  console.log(TotalFeedback);

  const db = new dbService();

  const [isloading, setisloading] = useState<boolean>(false);

  useEffect(() => {
    if (getdata) {
      const data: Feedback[] = JSON.parse(getdata);
      setWebsites(data);

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
    }
  }, [getdata]);

  const analytics = {
    labels: ["Happy", "Neutral", "Sad"],
    datasets: [
      {
        label: "My First Dataset",
        data: [HappyCount || 0, NeutralCount || 0, SadCount || 0],
        backgroundColor: ["#00a3ff", "#9f7aea", "#fc8181"],
        hoverOffset: 4,
      },
    ],
  };

  const [toggleLogout, setToggleLogout] = useState(false);

  return (
    <>
      {isloading ? <Loader message="Deleting..." /> : null}
      {/* Navigation Bar */}
      <nav className="md:hidden bg-[#151923] p-7 w-screen border-b-[1px] border-[#272b2f] flex justify-between items-center">
        <h1 className="text-xl font-semibold text-slate-300">FeedSense.Ai</h1>
        <CiMenuFries
          onClick={() => setToggle(true)}
          size={26}
          color="#9ca3af"
          className="cursor-pointer"
        />
      </nav>

      {/* Main Content */}
      <div className="bg-[#1a1f2c] w-full flex overflow-x-clip">
        <SideBar page="Home" />
        <div className="md:w-[100vw] mx-auto md:ml-44 space-y-16 rounded-xl">
          {/* User Info */}
          <div className="overflow-x-auto rounded-xl my-12">
            <div className="flex md:mx-auto items-center justify-between rounded-lg w-[100vw] md:w-[73vw] bg-[#151923] px-8 py-2 border-[1px] border-[#0e1012]">
              <div className="flex items-center gap-4">
                <Image
                  src={getImage}
                  alt={getName}
                  className="w-12 h-12 rounded-full"
                  width={48}
                  height={48}
                />
                <h1 className="text-sm md:text-xl text-gray-300 font-semibold">
                  {getName}
                </h1>
              </div>
              <Link href="/dashboard">
                <RxCross2 size={25} color="#9ca3af" />
              </Link>
            </div>

            <div className="border rounded-lg border-[#1a1f2c] md:mx-auto w-[100vw] md:w-[73vw] mt-7 divide-y divide-[#151923] overflow-hidden">
              <div
                className={`bg-[#151923] rounded-lg ${
                  getPlan === "Basic" ? "blur-md cursor-not-allowed" : ""
                }`}
              >
                {websites.length > 0 ? (
                  websites.map((site, idx) =>
                    site?.parsedFeedback?.response ? (
                      <div
                        key={idx}
                        className={`flex items-center justify-between px-4 py-3 font-semibold transition-colors duration-300 ease-in-out ${
                          getPlan === "Basic" ? "cursor-not-allowed" : ""
                        }`}
                      >
                        {/* Index */}
                        <h1 className="text-sm text-gray-300 w-6 text-center">
                          {idx + 1}
                        </h1>

                        {/* Feedback Text (Centered) */}
                        <h1
                          className={`flex-1 text-sm text-gray-300 text-center px-4 ${
                            getPlan === "Basic" ? "blur-md" : ""
                          }`}
                        >
                          {site?.parsedFeedback?.response?.replace(/"/g, "") ||
                            "No analysis available"}
                        </h1>

                        {/* Status Dropdown */}
                        <div className="text-xs text-gray-300">
                          <select
                            className={`bg-[#1a1f2c] border border-[#222529] text-gray-300 text-sm rounded px-3 py-2 outline-none ${
                              getPlan === "Basic"
                                ? "blur-md cursor-not-allowed"
                                : ""
                            }`}
                            defaultValue="Pending"
                            disabled={getPlan === "Basic"}
                            onChange={async (e) => {
                              const status = e.target.value;
                              if (status === "Completed") {
                                try {
                                  setisloading(true);
                                  await db.handleStatusChange(
                                    user!,
                                    idx,
                                    status,
                                    site?.parsedFeedback?.response
                                  );
                                  setWebsites((prev) =>
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
                              }
                            }}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </div>
                      </div>
                    ) : null
                  )
                ) : (
                  <div className="py-10 text-center text-slate-300 bg-[#151923]">
                    <div className="flex flex-col items-center gap-5">
                      <FaRegCircleStop size={25} color="#9ca3af" />
                      <p className="font-semibold">No Analysis Yet</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-center items-center md:flex-row flex-col md:items-start md:space-x-8  my-10">
              <div className=" mb-5 bg-[#151923] p-4  w-full md:w-[35vw] rounded-lg">
                <h2 className="text-gray-300 text-lg font-semibold mb-4">
                  Sentiment Distribution
                </h2>
                <Doughnut data={analytics} className="w-96 mx-auto p-10" />
              </div>

              <div className="bg-[#151923] p-4 space-y-3 h-[53vh] overflow-y-scroll rounded-lg  md:w-[35vw]">
                <h2 className="text-gray-300 text-lg font-semibold mb-4">
                  User Feedback
                </h2>
                {websites.length > 0 ? (
                  websites.map((site, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 px-4 py-2 transition-colors duration-300 ease-in-out cursor-pointer font-semibold"
                    >
                      <div className="flex-shrink-0">
                        <MdOutlineEventNote
                          size={24}
                          className="w-10 h-10 p-2 rounded-full bg-[#13293c] text-[#00a3ff]"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-300">{site.feedback}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-5 text-center text-slate-300">
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
      </div>
      {/* Mobile Sidebar */}
      {toggle && (
        <MobileSideBar
          setToggle={setToggle}
          setToggleLogout={setToggleLogout}
        />
      )}
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

{
  /* <table className="border-[1px] border-[#15171b] md:mx-auto w-[100vw] md:w-[60vw] mx-auto mt-7 divide-y divide-[#15171b] ">
              <thead className="bg-[#111115] border-[1px] border-[#15171b]">
                <tr>
                  <th className="py-3 px-3 md:px-9 text-left text-[10px] font-medium text-gray-400 uppercase">
                    S.NO
                  </th>
                  <th className="py-3 px-3 md:px-9 text-left text-[10px] font-medium text-gray-400 uppercase">
                    Rating
                  </th>
                  <th className="py-3 px-3 md:px-9 text-left text-[10px] font-medium text-gray-400 uppercase">
                    Emotion
                  </th>
                  <th className="py-3 px-3 md:px-9 text-left text-[10px] font-medium text-gray-400 uppercase">
                    User Feedback
                  </th>
                  {/* <th className="py-3 px-3 md:px-9 text-left text-xs font-medium text-gray-400 uppercase">
                    Analysis
                  </th> */
}
//   </tr>
//   </thead>
//   <tbody className="bg-[#111115] border-[1px] border-[#15171b] overflow-scroll">
//     {websites.length > 0 ? (
//       websites.map((site, idx) => (
//         <tr
//           key={idx}
//           className="hover:bg-[#0c0d12] transition-colors duration-300 ease-in-out cursor-pointer font-semibold"
//         >
//           <td className="py-5 px-9 text-[10px] text-gray-300">
//             {idx + 1}
//           </td>
//           <td className="py-5 px-9 text-[10px] text-gray-300">
//             {site.Rating}
//           </td>
//           <td className="py-5 px-9 text-[10px] text-gray-300">
//             {site.emotion}
//           </td>
//           <td className="py-5 px-9 w-72 text-[10px] text-gray-300">
//             {site.feedback}
//           </td>
//           {/* <td
//             className={`py-5 px-3 text-xs text-gray-300 w-60 ${
//               getPlan === "Basic" ? "blur-sm" : ""
//             }`}
//           >
//             {site?.parsedFeedback?.response?.replace(/"/g, "") ||
//               "No analysis available"}
//           </td> */}
//         </tr>
//       ))
//     ) : (
//       <tr>
//         <td colSpan={4} className="py-5 text-center text-slate-300">
//           <div className="flex flex-col items-center gap-5">
//             <FaRegCircleStop size={25} color="#9ca3af" />
//             <p className="font-semibold">No Feedbacks Yet</p>
//           </div>
//         </td>
//       </tr>
//     )}
//   </tbody>
// </table>
