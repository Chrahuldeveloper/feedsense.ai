import React, { useEffect, useState } from "react";
import { CiMenuFries } from "react-icons/ci";
import MobileSideBar from "./MobileSideBar";
import { FaRegCircleStop } from "react-icons/fa6";
import hljs from "highlight.js/lib/core";
import html from "highlight.js/lib/languages/xml";
import "highlight.js/styles/github.css";
import dbService from "../firebase/utils/db";
import useAuth from "@/hooks/CurrentUser";
import cache from "../cache/cache";
import Loader from "../components/Loader";

const AddIntegration = () => {
  const [toggle, setToggle] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [websitedata, setWebsiteData] = useState([]);
  const { user, loading } = useAuth();
  const [showCode, setShowCode] = useState(false);
  const [websiteDataInput, setWebsiteDataInput] = useState({
    name: "",
    url: "",
    type: "",
  });
  const [highlightedCode, setHighlightedCode] = useState("");
  const [lastWebsiteId, setLastWebsiteId] = useState(null);
  const db = new dbService();

  useEffect(() => {
    const fetchWebsites = async () => {
      if (!loading && user) {
        const cachedData = cache.get(user.uid);
        if (cachedData) {
          console.log("Fetched Websites Data from Cache:", cachedData.value);
          setWebsiteData(cachedData.value);
        } else {
          const data = await db.fetchWebsites(user);
          if (Array.isArray(data)) {
            setWebsiteData(data);
          } else {
            console.error("Fetched data is not an array:", data);
            setWebsiteData([]);
          }
        }
      }
    };
    fetchWebsites();
  }, [loading, user]);

  hljs.registerLanguage("html", html);

  const generateCodeToCopy = (websiteId) => {
    const code = `<!-- Add this snippet to your website's HTML -->\n<iframe src="http://${window.location.hostname}:3000/integrate/${websiteId}"></iframe>`;
    const highlighted = hljs.highlight(code, { language: "html" }).value;
    setHighlightedCode(highlighted);
    setShowCode(true);
  };

  const handleDeleteWebsite = async (websiteId) => {
    try {
      await db.deleteWebsite(user.uid, websiteId);
      setWebsiteData((prev) => prev.filter((site) => site.id !== websiteId));
    } catch (error) {
      console.log("Error deleting website:", error);
    }
  };

  const saveData = async () => {
    try {
      if (Object.values(websiteDataInput).every((i) => i !== "")) {
        if (!loading && user) {
          const data = { uid: user.uid, email: user.email };
          await db.saveWebsite(data, websiteDataInput); 
          setLastWebsiteId(websiteDataInput.url);
          setCurrentStep(3);
          generateCodeToCopy(websiteDataInput.url);
          setWebsiteDataInput({ name: "", url: "", type: "" });
          const updatedWebsites = await db.fetchWebsites(user);
          setWebsiteData(updatedWebsites);
        } else {
          console.log("Loading or user not authenticated");
        }
      } else {
        alert("Fill in all the details.");
      }
    } catch (error) {
      console.log("Error saving website:", error);
    }
  };

  const copyCode = async () => {
    try {
      if (lastWebsiteId) {
        await navigator.clipboard.writeText(
          `<iframe src="http://${window.location.hostname}:3000/integrate/${lastWebsiteId}"></iframe>`
        );
        alert("Code copied to clipboard!");
      } else {
        alert("No website ID available to copy.");
      }
    } catch (error) {
      console.log("Error copying code:", error);
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
                {currentStep === 1 && (
                  <div>
                    <div className="flex items-center justify-between">
                      <h1 className="text-2xl font-semibold">Connected Websites</h1>
                      <button
                        onClick={() => setCurrentStep(2)}
                        className="text-sm bg-gradient-to-r from-blue-500 to-blue-600 text-white  py-2 px-4 rounded-full"
                      >
                        Add Website
                      </button>
                    </div>
                    {websitedata?.length === 0 ? (
                      <div className="space-y-4 text-center pt-16">
                        <FaRegCircleStop size={23} color="white" className="mx-auto" />
                        <p className="text-xl font-semibold">No websites connected yet</p>
                        <p className="text-sm">Add your first website to get started</p>
                      </div>
                    ) : (
                      <div className="space-y-4 mt-5">
                        {websitedata?.map((i) => (
                          <div key={i.id} className="flex items-center gap-x-5 justify-between">
                            <h1 className="text-sm font-semibold">{i?.name}</h1>
                            <button
                              onClick={() => handleDeleteWebsite(i?.id)}
                              className="text-sm hover:text-red-500 ease-in-out duration-500"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="w-[85vw] md:w-[33vw] p-6 space-y-6 mt-0.5 mx-auto bg-[#171819] rounded-lg">
                    <div className="space-y-4 text-slate-300">
                      <h1 className="font-semibold text-sm">Website Name*</h1>
                      <input
                        type="text"
                        value={websiteDataInput.name}
                        onChange={(e) => setWebsiteDataInput({ ...websiteDataInput, name: e.target.value })}
                        className="bg-[#272c2e] px-2 py-2 outline-none md:w-[30vw] w-[75vw] rounded-lg cursor-pointer"
                      />
                    </div>
                    <div className="space-y-4 text-slate-300">
                      <h1 className="font-semibold text-sm">Website URL*</h1>
                      <input
                        type="text"
                        value={websiteDataInput.url}
                        onChange={(e) => setWebsiteDataInput({ ...websiteDataInput, url: e.target.value })}
                        className="bg-[#272c2e] px-2 py-2 outline-none md:w-[30vw] w-[75vw] rounded-lg cursor-pointer"
                      />
                    </div>
                    <div className="space-y-4 text-slate-300">
                      <h1 className="font-semibold text-sm">Website Type*</h1>
                      <select
                        value={websiteDataInput.type}
                        onChange={(e) => setWebsiteDataInput({ ...websiteDataInput, type: e.target.value })}
                        className="bg-[#272c2e] w-full px-2 py-2 outline-none rounded-lg cursor-pointer"
                      >
                        <option value="">Select Website Type</option>
                        <option value="blog">Blog</option>
                        <option value="ecommerce">E-commerce</option>
                        <option value="portfolio">Portfolio</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <button
                      onClick={saveData}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full w-full py-3 hover:bg-blue-700"
                    >
                      Save Website
                    </button>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="w-[85vw] md:w-[40vw] p-6 space-y-6 mx-auto mt-10">
                    <div className="bg-[#272c2e] rounded-lg p-4">
                      <h1 className="font-semibold text-slate-300">Code to Integrate</h1>
                      <div className="code-block">
                        <pre>
                          <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
                        </pre>
                      </div>
                      <button
                        onClick={copyCode}
                        className="mt-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full w-full py-2 hover:bg-blue-700"
                      >
                        Copy to Clipboard
                      </button>
                    </div>
                  </div>
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
