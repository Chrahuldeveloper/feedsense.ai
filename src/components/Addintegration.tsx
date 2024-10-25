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
import { FaRegCircleStop } from "react-icons/fa6";

const AddIntegration = () => {
  const [toggle, setToggle] = useState(false);
  const [isAddingWebsite, setIsAddingWebsite] = useState(false);
  const [websitedata, setWebsiteData] = useState([]);
  const { user, loading } = useAuth();
  const [showCode, setShowCode] = useState(false);
  const [websiteData, setWebsiteDataInput] = useState({
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
          return setWebsiteData(cachedData.value);
        }
        const data = await db.fetchWebsites(user?.uid);
        console.log(data);
        return setWebsiteData(data);
      }
      return [];
    };
    fetchWebsites();
  }, [loading, user]);

  hljs.registerLanguage("javascript", javascript);

  const codeToCopy = hljs.highlight(
    `<!-- Add this snippet to your website's HTML -->
      <iframe src="http://${window.location.hostname}:3000/integrate/${user?.uid}"></iframe>`,
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

        const data = { uid: user.uid, email: user.email };
        await db.savewebsite(data, websiteData);
        setIsAddingWebsite(false);
        setShowCode(true); // Show the code section after successful data save
      } else {
        alert("Fill in all the details.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(
        `<iframe src="http://${window.location.hostname}:3000/integrate/${user?.uid}"></iframe>`
      );
      console.log("Code copied");
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
            onClick={() => setToggle(true)}
          />
        </nav>
        {toggle ? <MobileSideBar setToggle={setToggle} /> : null}

        <div className="text-slate-300 flex flex-col md:flex-row items-center gap-8 md:gap-12 md:mt-16 justify-center">
          <div className="md:ml-52">
            <div className="bg-[#17161c] w-[45vw] mx-auto h-[80vh] rounded-xl overflow-y-scroll">
              <div className="space-y-3 border-b-[1px] border-stone-800 bg-gradient-to-r from-blue-600 via-blue-600 to-blue-500 p-5 rounded-t-xl">
                <h1 className="text-2xl font-bold">Welcome to Integration</h1>
                <p className="font-semibold">Connect your website</p>
              </div>

              <div className="p-8">
                <div className="flex items-center space-x-5">
                  <button
                    onClick={() => setIsAddingWebsite(false)}
                    className={`border-[1px] border-[#272b2f] ${
                      !isAddingWebsite
                        ? "bg-gradient-to-r from-blue-500 to-blue-600"
                        : ""
                    } text-slate-300 px-5 text-sm py-2 font-semibold rounded-full`}
                  >
                    Website List
                  </button>
                  <button
                    onClick={() => setIsAddingWebsite(true)}
                    className={`border-[1px] border-[#272b2f] ${
                      isAddingWebsite
                        ? "bg-gradient-to-r from-blue-500 to-blue-600"
                        : ""
                    } text-slate-300 px-5 text-sm py-2 font-semibold rounded-full`}
                  >
                    Add New Website
                  </button>
                </div>

                {!isAddingWebsite ? (
                  <>
                    <div className="mt-7">
                      <h1 className="text-2xl font-semibold">
                        Connected Websites
                      </h1>
                    </div>
                    {websitedata?.length === 0 ? (
                      <div className="space-y-4 text-center pt-16">
                        <FaRegCircleStop
                          size={23}
                          color="white"
                          className="mx-auto"
                        />
                        <p className="text-xl font-semibold">
                          No websites connected yet
                        </p>
                        <p className="text-sm">
                          Add your first website to get started
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4 mt-5 ">
                        {websitedata?.map((i, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-x-5 justify-between"
                          >
                            <h1 className="text-sm font-semibold">{i?.name}</h1>
                            <button className="text-sm hover:text-red-500 ease-in-out duration-500">
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="w-[85vw] md:w-[33vw] p-6 space-y-6 mt-6 mx-auto bg-[#171819] rounded-lg">
                      <div className="space-y-4 text-slate-300">
                        <h1 className="font-semibold text-sm">Website Name*</h1>
                        <input
                          type="text"
                          autoComplete="false"
                          value={websiteData.name}
                          onChange={(e) =>
                            setWebsiteDataInput({
                              ...websiteData,
                              name: e.target.value,
                            })
                          }
                          className="bg-[#272c2e] px-2 py-2 outline-none md:w-[30vw] w-[75vw] rounded-lg cursor-pointer"
                        />
                      </div>
                      <div className="space-y-4 text-slate-300">
                        <h1 className="font-semibold text-sm">Website URL*</h1>
                        <input
                          type="text"
                          autoComplete="false"
                          value={websiteData.url}
                          onChange={(e) =>
                            setWebsiteDataInput({
                              ...websiteData,
                              url: e.target.value,
                            })
                          }
                          className="bg-[#272c2e] px-2 py-2 outline-none md:w-[30vw] w-[75vw] rounded-lg cursor-pointer"
                        />
                      </div>
                      <div className="space-y-4 text-slate-300">
                        <h1 className="font-semibold text-sm">Website Type*</h1>
                        <select
                          value={websiteData.type}
                          onChange={(e) =>
                            setWebsiteDataInput({
                              ...websiteData,
                              type: e.target.value,
                            })
                          }
                          className="bg-[#272c2e] px-2 py-2 outline-none md:w-[30vw] w-[75vw] rounded-lg cursor-pointer"
                        >
                          <option value="WebApp">WebApp</option>
                          <option value="E-commerce">E-commerce</option>
                          <option value="LandingPage">LandingPage</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <button
                        onClick={saveData}
                        className="bg-gradient-to-r from-blue-500 to-blue-600  px-5 mt-2.5 text-sm py-2 font-semibold md:w-[30vw] w-[75vw] rounded-lg cursor-pointer text-white"
                      >
                        Get Code
                      </button>
                    </div>

                    {showCode && (
                      <div className="mt-5 p-4 bg-[#272c2e] rounded-lg">
                        <h1 className="text-lg font-semibold text-slate-300 mb-2">
                          Copy Integration Code
                        </h1>
                        <pre
                          className="text-white text-sm rounded-md bg-gray-800 p-4 overflow-auto"
                          dangerouslySetInnerHTML={{ __html: codeToCopy }}
                        />
                        <button
                          onClick={copyCode}
                          className="flex items-center mt-3 space-x-2 text-blue-500 hover:text-blue-700"
                        >
                          <FaRegCopy />
                          <span>Copy Code</span>
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddIntegration;
