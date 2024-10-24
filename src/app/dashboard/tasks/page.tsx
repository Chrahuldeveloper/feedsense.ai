"use client";
import MobileSideBar from "@/components/MobileSideBar";
import SideBar from "@/components/SideBar";
import React, { useEffect, useState } from "react";
import { CiMenuFries } from "react-icons/ci";
import { useSearchParams } from "next/navigation";
import { FaArrowLeftLong } from "react-icons/fa6";
import Link from "next/link";

const Page = () => {
  const searchParams = useSearchParams();

  interface Feedback {
    name: string;
    email: string;
    feedback: string;
  }

  const [websites, setWebsites] = useState<Feedback[]>([]);
  const getdata = searchParams!.get("feedback")!;
  const getImage = searchParams!.get("image")!;
  const getName = searchParams!.get("name")!;

  console.log(getImage, getName);

  useEffect(() => {
    const data: Feedback[] = JSON.parse(getdata);
    console.log(data);
    setWebsites(data);
  }, [getdata]);

  const [toggle, setToggle] = useState(false);

  return (
    <>
      <nav className="md:hidden bg-[#0e0f11] p-7 w-screen border-b-[1px] border-[#272b2f] flex justify-between items-center">
        <h1 className="text-xl font-semibold text-slate-300">TaskFeed</h1>
        <CiMenuFries
          onClick={() => {
            setToggle(true);
          }}
          size={26}
          color="white"
          className="cursor-pointer"
        />
      </nav>

      <div className="bg-[#0e0f11] w-full h-screen flex overflow-x-clip">
        <SideBar page="Home" />
        <div className="md:w-[100vw] mx-auto  md:ml-44 space-y-16 rounded-xl">
          <div className="overflow-x-auto rounded-xl mt-16">
            <div className="flex mx-auto items-center  justify-between w-[85vw] md:w-[64vw] ">
              <div className="flex items-center gap-5">
                <img src={getImage} className="w-12 h-12 rounded-full" alt="" />
                <h1 className="text-xl text-slate-300 font-semibold">
                  {getName}
                </h1>
              </div>
              <Link href="/dashboard">
                <FaArrowLeftLong size={22} color="white" />
              </Link>
            </div>
            <table className="mx-auto w-[40vw] md:w-[64vw] mt-7 divide-y divide-stone-900 rounded-lg overflow-hidden">
              <thead className="bg-[#201d24] rounded-lg cursor-pointer">
                <tr>
                  <th className="py-3 px-5 md:px-9 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    SNo
                  </th>
                  <th className="py-3 px-5 md:px-9 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="py-3 px-5 md:px-9 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="py-3 px-5 md:px-9 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Task
                  </th>
                </tr>
              </thead>
              <tbody className="bg-[#161419] ">
                {websites?.map((site, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-[#141316] transition-colors duration-200 cursor-pointer"
                  >
                    <td className="py-5 px-6 md:px-9 text-sm  text-slate-300 ">
                      {idx + 1}
                    </td>
                    <td className="py-5 px-6 md:px-9 text-sm  text-slate-300 ">
                      {site.name}
                    </td>
                    <td className="py-5 px-6 md:px-9 text-sm  text-slate-300 ">
                      {site.email}
                    </td>
                    <td className="py-5 px-6 md:px-9 text-sm  text-slate-300 ">
                      {site.feedback}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {toggle ? <MobileSideBar setToggle={setToggle} /> : null}
    </>
  );
};

export default Page;
