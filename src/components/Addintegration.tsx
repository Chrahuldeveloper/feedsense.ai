import React, { useEffect, useMemo, useState } from "react";
import { CiGlobe, CiMenuFries } from "react-icons/ci";
import MobileSideBar from "./MobileSideBar";
import hljs from "highlight.js/lib/core";
import html from "highlight.js/lib/languages/xml";
import "highlight.js/styles/github.css";
import dbService from "../firebase/utils/db";
import useAuth from "@/hooks/CurrentUser";
import Loader from "./Loader";
import { FaRegCopy } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ModelLogout from "./ModelLogout";
import { CgProfile } from "react-icons/cg";
import { IoCodeOutline } from "react-icons/io5";
import { BsTrash2 } from "react-icons/bs";

interface Website {
  id: string;
  name: string;
  url?: string;
  type?: string;
  image?: string;
}

interface WebsiteDataInput {
  name: string;
  url: string;
  type: string;
  logo?: File | null;
}

interface User {
  uid: string;
  email: string;
  displayName: string;
}

const AddIntegration: React.FC = () => {
  const [toggle, setToggle] = useState(false);
  const [websitedata, setWebsiteData] = useState<Website[]>([]);
  const [fetchingData, setFetchingData] = useState(true);
  const [savingData, setSavingData] = useState(false);
  const { user, loading: userLoading } = useAuth() as {
    user: User | null;
    loading: boolean;
  };
  const [deleting, setDeleting] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [websiteDataInput, setWebsiteDataInput] = useState<WebsiteDataInput>({
    name: "",
    url: "",
    type: "",
  });
  const [highlightedCode1, setHighlightedCode1] = useState("");

  const [lastWebsiteId, setLastWebsiteId] = useState<string | null>(null);

  console.log(showCode);

  const db = useMemo(() => new dbService(), []);

  useEffect(() => {
    const fetchWebsites = async () => {
      if (!userLoading && user) {
        setFetchingData(true);
        const data = (await db.fetchWebsites(user)) as Website[];
        setWebsiteData(Array.isArray(data) ? data : []);
        setFetchingData(false);
      }
    };

    fetchWebsites();
  }, [userLoading, user, db]);

  hljs.registerLanguage("html", html);

  const codeToCopy = (websiteId: string) => {
    const code = `
  <!-- Make sure you have Tailwind CSS & react-icons set up to use these utility classes for styling -->
  <div className="fixed bottom-10 right-10">
    <Link href="https://feedsenseai.vercel.app/integrate/${
      user!.uid
    }/${websiteId}">
      <button className="text-white cursor-pointer hover:scale-110 duration-500 ease-in-out">
        <MdSettingsSuggest
          size={47}
          color="white"
          className="bg-gradient-to-r from-blue-400 via-blue-600 to-blue-700 rounded-full p-3"
        />
      </button>
    </Link>
  </div>
`;
    const highlighted = hljs.highlight(code, { language: "html" }).value;
    setHighlightedCode1(highlighted);
    setShowCode(true);
  };

  const handleDeleteWebsite = async (websiteName: string) => {
    try {
      setDeleting(true);
      await db.deleteWebsite(user!.uid, websiteName);
      setWebsiteData((prev) =>
        prev.filter((site) => site.name !== websiteName)
      );
    } catch (error) {
      console.log("Error deleting website:", error);
    } finally {
      setDeleting(false);
    }
  };

  const saveData = async () => {
    try {
      if (Object.values(websiteDataInput).every((i) => i !== "")) {
        if (!userLoading && user) {
          setSavingData(true);

          const newWebsiteData = {
            name: websiteDataInput.name,
            url: websiteDataInput.url,
            type: websiteDataInput.type,
          };

          const res = await db.saveWebsite(user, newWebsiteData);

          if (res === "WebsiteFull") {
            toast("Upgrade your plan");
          } else {
            setLastWebsiteId(websiteDataInput.name);
            codeToCopy(websiteDataInput.name);
            setWebsiteDataInput({ name: "", url: "", type: "" });

            await db.fetchWebsites(user);
            const data = (await db.fetchWebsites(user)) as Website[];
            setWebsiteData(Array.isArray(data) ? (data as Website[]) : []);
          }
        } else {
          console.log("User is loading or not authenticated");
        }
      } else {
        toast("Fill in all the details.");
      }
    } catch (error) {
      console.log("Error saving website:", error);
    } finally {
      setSavingData(false);
    }
  };

  const copyCode = async () => {
    try {


      if (lastWebsiteId) {
        await navigator.clipboard.writeText(
          `     <!-- Make sure you have Tailwind CSS & react-icons set up to use these utility classes for styling -->
  <div className="fixed bottom-10 right-10">
    <Link href="https://feedsenseai.vercel.app/integrate/${
      user!.uid
    }/${lastWebsiteId}">
      <button className="text-white cursor-pointer hover:scale-110 duration-500 ease-in-out">
        <MdSettingsSuggest
          size={47}
          color="white"
          className="bg-gradient-to-r from-blue-400 via-blue-600 to-blue-700 rounded-full p-3"
        />
      </button>
    </Link>
  </div>`
        );
        toast("Code Copied!");
      } else {
        alert("No website ID available to copy.");
      }
    } catch (error) {
      console.log("Error copying code:", error);
    }
  };

  const [toggleLogout, setToggleLogout] = useState(false);

  return (
    <>
      {(fetchingData || savingData || deleting) && <Loader message="Loading" />}
      <div className="md:ml-44">
        <nav className="md:hidden bg-[#0b0d0e] p-7 w-screen border-b-[1px] border-[#1f2327] flex justify-between items-center">
          <h1 className="text-xl font-semibold text-slate-300">FeedSense.ai</h1>
          <CiMenuFries
            size={26}
            color="white"
            className="cursor-pointer"
            onClick={() => setToggle(true)}
          />
        </nav>
        <div className="bg-[#0b0d0e] w-screen px-14 py-3 pt-5 md:-ml-36 hidden md:block border-b-[1px] border-[#1f2327]">
          <div className="flex justify-end gap-x-3 items-center pb-2">
            <div className="space-y-1">
              <h1 className="text-slate-300">{user?.displayName || "User"}</h1>
            </div>
            <CgProfile
              size={30}
              color="#00a3ff"
              className="w-10 p-2 h-10 rounded-full bg-[#13293c]"
            />
          </div>
        </div>
        <div className="p-5 md:ml-10 md:px-20 lg:px-28 space-y-3">
          <h1 className="text-xl md:text-2xl lg:text-3xl text-gray-300  font-semibold mt-3">
            Integrate Website
          </h1>
          <p className="text-[#95a4ab]">
            Add FeedSenseAI to your website in minutes
          </p>
        </div>
        {/* continue */}

        <div className="flex w-[90vw] md:w-[77vw] md:flex-row flex-col mx-auto gap-10 items-center md:justify-normal justify-center my-6">
          <div className="w-[95vw] md:w-[40vw] p-7 space-y-9 bg-[#161617] rounded-xl mt-3">
            <div className="space-y-4 text-slate-300">
              <div className="flex items-center space-x-3">
                <CiGlobe
                  size={50}
                  color="#00a3ff"
                  className="bg-[#13293c] backdrop-blur-sm border border-[#13293c] p-2 rounded-xl"
                />
                <div className="space-y-1">
                  <h1 className="text-2xl font-semibold">Website Details</h1>
                  <p className="text-[#95a4ab]">Configure your integration</p>
                </div>
              </div>
              <input
                type="text"
                placeholder="Website Name"
                className="bg-black border-[1px] border-[#15171b] outline-none p-3 rounded-lg w-full text-sm focus:outline-none focus:border-blue-500 transition-colors"
                value={websiteDataInput.name}
                onChange={(e) =>
                  setWebsiteDataInput((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
              />
              <input
                type="text"
                placeholder="Website URL"
                className="bg-black border-[1px] border-[#15171b] outline-none p-3 rounded-lg w-full text-sm focus:outline-none focus:border-blue-500 transition-colors"
                value={websiteDataInput.url}
                onChange={(e) =>
                  setWebsiteDataInput((prev) => ({
                    ...prev,
                    url: e.target.value,
                  }))
                }
              />
              <select
                className="bg-[#20242e] border-[1px] border-[#15171b] outline-none p-3 rounded-lg w-full text-sm focus:outline-none focus:border-blue-500 transition-colors"
                value={websiteDataInput.type}
                onChange={(e) =>
                  setWebsiteDataInput((prev) => ({
                    ...prev,
                    type: e.target.value,
                  }))
                }
              >
                <option value="">Select Type</option>
                <option value="personal">Personal</option>
                <option value="business">Business</option>
              </select>

              <div className="flex justify-center items-center space-x-6">
                <button
                  onClick={saveData}
                  className="bg-[#0a758b]  text-slate-300 rounded-lg px-6 py-2 text-sm"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
          <div className="w-[95vw] md:w-[40vw] p-5 space-y-9 bg-[#161617] rounded-xl mt-5 ">
            <div className="flex items-center space-x-3 ">
              <IoCodeOutline
                size={50}
                color="#00a3ff"
                className="bg-[#13293c] backdrop-blur-sm border border-[#13293c] p-2 rounded-xl"
              />
              <div className="space-y-1">
                <h1 className="text-2xl text-white font-semibold">
                  Integration Code
                </h1>
                <p className="text-[#95a4ab]">Copy and paste to your website</p>
              </div>
            </div>
            <div className="space-y-4 text-center  max-w-4xl mx-auto">
              <div className="bg-[#212223]   px-4 my-3 space-y-3 rounded-lg">
                {highlightedCode1.length != 0 ? (
                  <>
                    <pre
                      className="bg-[#212223]  overflow-auto text-white px-4 py-3 h-[20vh] my-5"
                      dangerouslySetInnerHTML={{ __html: highlightedCode1 }}
                    ></pre>
                    <div className="flex justify-end">
                      <FaRegCopy
                        size={24}
                        className="relative bottom-14 right-5"
                        cursor={"pointer"}
                        onClick={copyCode}
                        color="#95a4ab"
                      />
                    </div>
                  </>
                ) : (
                  <div className="py-16 space-y-3">
                    <IoCodeOutline
                      size={40}
                      className="mx-auto"
                      color="#95a4ab"
                    />
                    <p className="text-[#95a4ab] text-sm">
                      Fill in your website details and click "Generate
                      Integration Code" to get started
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="w-[97vw] mx-auto md:w-[75vw] p-7 space-y-9 bg-[#161617] rounded-xl my-6">
          <div className="text-sm">
            <div className="grid grid-cols-4 text-gray-400 border-b border-gray-700 pb-2">
              <div className="col-span-1">Website Name</div>
              <div className="col-span-1">URL</div>
              <div className="text-center">Status</div>
              <div className="text-center">Actions</div>
            </div>
            {websitedata.map((site, idx) => (
              <div
                key={idx}
                className="grid grid-cols-4 items-center py-4 border-b border-gray-800 text-sm"
              >
                <div className="col-span-1 text-white">{site.name}</div>
                <div
                  className="col-span-1 text-blue-400 truncate cursor-pointer"
                  onClick={() => {
                    const url = site.url!.match(/^https?:\/\//)
                      ? site.url
                      : `https://${site.url}`;

                    window.open(url, "_blank", "noopener,noreferrer");
                  }}
                >
                  {site.url}
                </div>
                <div className="text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium bg-green-900 text-green-300 `}
                  >
                    {"Active"}
                  </span>
                </div>
                <div className="text-center">
                  <button
                    onClick={() => {
                      handleDeleteWebsite(site.name);
                    }}
                    className="p-2 rounded-full hover:bg-red-900/30 transition"
                  >
                    <BsTrash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="md:ml-80">
        <nav className="md:hidden bg-[#151923] p-7 w-screen border-b-[1px] border-[#151923] flex justify-between items-center">
          <h1 className="text-xl font-semibold text-slate-300">FeedSense.ai</h1>
          <CiMenuFries
            size={26}
            color="white"
            className="cursor-pointer"
            onClick={() => setToggle(true)}
          />
        </nav>
        {toggle && (
          <MobileSideBar
            Page="Integrate"
            setToggle={setToggle}
            setToggleLogout={setToggleLogout}
          />
        )}

        {toggleLogout && <ModelLogout settoggle={setToggleLogout} />}
      </div>
      <ToastContainer theme="dark" toastClassName={"custom-toast"} />
    </>
  );
};

export default AddIntegration;
