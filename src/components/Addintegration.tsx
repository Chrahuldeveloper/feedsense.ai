import React, { useEffect, useState } from "react";
import { CiMenuFries } from "react-icons/ci";
import MobileSideBar from "./MobileSideBar";
import { FaRegCopy } from "react-icons/fa";
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import "highlight.js/styles/github.css";
import dbService from "../firebase/utils/db";
import useAuth from "@/hooks/CurrentUser";
import cache from "../cache/cache";
const Addintegration = () => {
  const [toogle, settoogle] = useState(false);

  const [section, setsection] = useState<string | undefined>();

  interface User {
    uid: string;
    email: string;
  }

  const [websitedata, setwebsitedata] = useState([]);

  const { user, loading } = useAuth() as {
    user: User | null;
    loading?: boolean;
  };

  const [websiteData, setwebsiteData] = useState({
    name: "",
    url: "",
    type: "",
  });

  useEffect(() => {
    const fetchWebsites = async () => {
      if (!loading && user) {
        const cachedData = cache.get(user.uid);

        if (cachedData) {
          console.log("Fetched Websites Data from Cache:", cachedData.value);
          return setwebsitedata(cachedData.value);
        }
        const data = await db.fetchWebsites(user?.uid);
        console.log(data);
        return setwebsitedata(data);
      }
      return [];
    };
    fetchWebsites();
  }, [loading, user]);

  const url = new URL(window.location.href);

  hljs.registerLanguage("javascript", javascript);

  const codeToCopy = hljs.highlight(
    `<!-- Add this snippet to your website's HTML -->
      <iframe src="http://${url.hostname}:3000/integrate/${user?.uid}"} ></iframe>`,
    { language: "javascript" }
  ).value;

  const db = new dbService();

  const saveData = async () => {
    try {
      if (Object.values(websiteData).every((i) => i !== "")) {
        if (loading) {
          console.log("Loading...");
          return;
        }

        if (!user) {
          console.log("User is not logged in.");
          return;
        }

        const data = {
          uid: user.uid,
          email: user.email,
        };

        await db.savewebsite(data, websiteData);
        setsection("showcode");
      } else {
        alert("fill the details");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(`
      <iframe src="http://${url.hostname}:3000/integrate/${user?.uid}"} ></iframe>`);
      console.log("dn");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="md:ml-80">
        <nav className="md:hidden bg-[#18181b] p-7 w-screen border-b-[1px] border-[#272b2f] flex justify-between items-center">
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
        {toogle ? <MobileSideBar settoogle={settoogle} /> : null}
        <div
          className={`text-slate-300  p-8 flex flex-col md:flex-row items-center gap-8 md:gap-12 mt-10
          md:mt-28 justify-center ${
            section === "showinput" || section === "showcode"
              ? "hidden"
              : "block"
          }`}
        >
          <div className=" md:ml-52">
            <div className="bg-[#17161c] w-[35vw] mx-auto p-6 rounded-xl mt-6">
              <div className="space-y-5">
                <h1 className="text-xl   font-bold">Welcome to Integration</h1>
                <p className="text-slate-300  font-semibold">
                  Connect your website{" "}
                </p>
                <div className="space-y-4">
                  {websitedata?.map((i, idx) => {
                    return (
                      <div
                        key={idx}
                        className="flex items-center gap-x-5 justify-between"
                      >
                        <h1 className="text-sm font-semibold">{i?.name}</h1>
                        <button className="text-sm">Remove</button>
                      </div>
                    );
                  })}
                </div>
                <button
                  onClick={() => {
                    setsection("showinput");
                  }}
                  className="bg-gradient-to-r from-blue-400 via-blue-600 to-blue-700 w-full  text-white  py-2 px-20 text-sm  font-semibold rounded-lg"
                >
                  Connect website
                </button>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`lg:ml-52 ${
            section === "showinput" || section === "showcode"
              ? "block"
              : "hidden"
          }`}
        >
          <div
            className={`w-[85vw] md:w-[33vw] p-6 space-y-6 mt-20 mx-auto bg-[#171819] rounded-lg ${
              section === "showcode" ? "hidden" : "block"
            }`}
          >
            <div className="space-y-4 text-slate-300">
              <h1 className="font-semibold text-sm">Website Name*</h1>
              <input
                type="text"
                autoComplete="false"
                value={websiteData.name}
                onChange={(e) => {
                  setwebsiteData({ ...websiteData, name: e.target.value });
                }}
                className="bg-[#272c2e]  px-2 py-2 outline-none md:w-[30vw] w-[75vw] rounded-lg cursor-pointer "
              />
            </div>
            <div className="space-y-4 text-slate-300">
              <h1 className="font-semibold text-sm">Website Url*</h1>
              <input
                type="text"
                autoComplete="false"
                value={websiteData.url}
                onChange={(e) => {
                  setwebsiteData({ ...websiteData, url: e.target.value });
                }}
                className="bg-[#272c2e]  px-2 py-2 outline-none md:w-[30vw] w-[75vw] rounded-lg cursor-pointer "
              />
            </div>
            <div className="space-y-4 text-slate-300">
              <h1 className="font-semibold text-sm">Website Type*</h1>
              <select
                name="websiteType"
                value={websiteData.type}
                onChange={(e) => {
                  setwebsiteData({ ...websiteData, type: e.target.value });
                }}
                className="bg-[#272c2e]  px-2 py-2 outline-none md:w-[30vw] w-[75vw] rounded-lg cursor-pointer"
              >
                <option value="WebApp">WebApp</option>
                <option value="E-commerce">E-commerce</option>
                <option value="LandingPage">LandingPage</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <button
                onClick={async () => {
                  await saveData();
                }}
                className="bg-white text-black px-5 mt-2.5 text-sm py-2 font-semibold md:w-[30vw] w-[75vw] rounded-lg cursor-pointer"
              >
                Get Code
              </button>
            </div>
          </div>

          {/* Code for integration */}
          <div
            className={`p-6  space-y-6 mt-20 -mr-20 bg-[#171819] ${
              section === "showcode" ? "block" : "hidden"
            }`}
          >
            <div className="  bg-[#1c1c21] overflow-auto">
              <pre className="text-white p-3 w-[40vw]">
                <div className="flex justify-end">
                  <FaRegCopy
                    size={19}
                    color="white"
                    className="cursor-pointer"
                    onClick={copyCode}
                  />
                </div>
                <code
                  className="whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: codeToCopy }}
                ></code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Addintegration;
