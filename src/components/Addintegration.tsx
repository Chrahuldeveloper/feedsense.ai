import React, { useEffect, useMemo, useState } from "react";
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
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../firebase/Firebase";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
}

const AddIntegration: React.FC = () => {
  const [toggle, setToggle] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
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
    logo: null,
  });
  const [highlightedCode, setHighlightedCode] = useState("");
  const [lastWebsiteId, setLastWebsiteId] = useState<string | null>(null);

  const router = useRouter();

  console.log(showCode);

  const db = useMemo(() => new dbService(), []);

  useEffect(() => {
    const fetchWebsites = async () => {
      if (!userLoading && user) {
        setFetchingData(true);
        const cachedData = cache.get(user.uid);
        if (cachedData) {
          setWebsiteData(cachedData.value);
        } else {
          const data = (await db.fetchWebsites(user)) as Website[];
          setWebsiteData(Array.isArray(data) ? data : []);
        }
        setFetchingData(false);
      }
    };

    fetchWebsites();
  }, [userLoading, user, db]);

  hljs.registerLanguage("html", html);

  const generateCodeToCopy = (websiteId: string) => {
    const code = `<!-- Add this snippet to your website's HTML -->\n https://feedsenseai.vercel.app/integrate/${
      user!.uid
    }/${websiteId}`;
    const highlighted = hljs.highlight(code, { language: "html" }).value;
    setHighlightedCode(highlighted);
    setShowCode(true);
  };

  const handleDeleteWebsite = async (websiteName: string) => {
    try {
      setDeleting(true);
      await db.deleteWebsite(user!.uid, websiteName);
      setWebsiteData((prev) =>
        prev.filter((site) => site.name !== websiteName)
      );
      cache.set(
        user!.uid,
        websitedata.filter((site) => site.name !== websiteName)
      );
    } catch (error) {
      console.log("Error deleting website:", error);
    } finally {
      setDeleting(false);
    }
  };

  const uploadLogo = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const storageRef = ref(storage, `website_logos/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        null,
        (error) => reject(error),
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  };

  const saveData = async () => {
    try {
      if (Object.values(websiteDataInput).every((i) => i !== "")) {
        if (!userLoading && user) {
          setSavingData(true);

          let logoURL = "";
          if (websiteDataInput.logo) {
            logoURL = await uploadLogo(websiteDataInput.logo);
          }

          const newWebsiteData = {
            name: websiteDataInput.name,
            url: websiteDataInput.url,
            type: websiteDataInput.type,
            image: logoURL || "",
          };

          const res = await db.saveWebsite(user, newWebsiteData);

          if (res === "WebsiteFull") {
            alert("Upgrade your plan");
            return router.push("/plans");
          } else {
            setLastWebsiteId(websiteDataInput.name);
            setCurrentStep(3);
            generateCodeToCopy(websiteDataInput.name);
            setWebsiteDataInput({ name: "", url: "", type: "", logo: null });

            await db.fetchWebsites(user);
            const data = (await db.fetchWebsites(user)) as Website[];
            setWebsiteData(Array.isArray(data) ? (data as Website[]) : []);
          }
        } else {
          console.log("User is loading or not authenticated");
        }
      } else {
        alert("Fill in all the details.");
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
          `https://feedsenseai.vercel.app/integrate/${
            user!.uid
          }/${lastWebsiteId}"`
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
      {(fetchingData || savingData || deleting) && <Loader message="Loading" />}
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
        {toggle && <MobileSideBar setToggle={setToggle} />}

        <div className="text-slate-300 flex flex-col md:flex-row items-center gap-8 md:gap-12 md:mt-16 justify-center">
          <div className="md:ml-52">
            <div className="bg-[#070707] w-[96vw] shadow-2xl  md:w-[45vw] mx-auto h-[80vh] overflow-y-scroll mt-7 border-[1px] border-neutral-900">
              <div className="space-y-3 border-b-[1px] border-stone-900 bg-[#111217] p-5 text-slate-300">
                <h1 className="text-2xl font-bold ">Welcome to Integration</h1>
                <p className="font-semibold">Connect your website</p>
              </div>

              <div className="p-8">
                {currentStep === 1 && (
                  <div>
                    <div className="flex items-center justify-between">
                      <h1 className="text-xl font-semibold">
                        Connected Websites
                      </h1>
                      <button
                        onClick={() => setCurrentStep(2)}
                        className="text-xs bg-gradient-to-r from-blue-800 via-blue-600 to-blue-700 text-slate-300  py-2 px-4 rounded-lg"
                      >
                        Add Website
                      </button>
                    </div>
                    {websitedata?.length === 0 ? (
                      <div className="space-y-4 text-center pt-28">
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
                      <div className="space-y-4 mt-5">
                        {websitedata?.map((i) => (
                          <div
                            key={i.id}
                            className="flex items-center gap-x-5 justify-between"
                          >
                            <Image
                              src={i.image || "/default-image.jpg"}
                              alt={`${i.name} logo`}
                              width={48}
                              height={48}
                              className="h-12 w-12 rounded-full object-cover cursor-pointer border-[1px] border-stone-800"
                            />
                            <h1 className="text-sm font-semibold">{i?.name}</h1>
                            <button
                              onClick={() => handleDeleteWebsite(i?.name)}
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
                  <div className="w-[85vw] md:w-[33vw] p-6 space-y-6 mt- mx-auto ">
                    <div className="space-y-4 text-slate-300">
                      <h1 className="text-2xl font-semibold">
                        Add your website
                      </h1>
                      <input
                        type="text"
                        placeholder="Website Name"
                        className="bg-[#1E1E1E] border-[1px] border-[#282c34] outline-none p-3 rounded-lg w-full text-sm"
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
                        className="bg-[#1E1E1E] border-[1px] border-[#282c34] outline-none p-3 rounded-lg w-full text-sm"
                        value={websiteDataInput.url}
                        onChange={(e) =>
                          setWebsiteDataInput((prev) => ({
                            ...prev,
                            url: e.target.value,
                          }))
                        }
                      />
                      <select
                        className="bg-[#1E1E1E] border-[1px] border-[#282c34] outline-none p-3 rounded-lg w-full text-sm"
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

                      {websiteDataInput.logo ? (
                        <div className="flex flex-col">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              setWebsiteDataInput((prev) => ({
                                ...prev,
                                logo: e.target.files![0],
                              }))
                            }
                            className="hidden"
                            id="fileInput"
                          />
                          <label
                            htmlFor="fileInput"
                            className="bg-gradient-to-r from-blue-800 via-blue-600 to-blue-700   text-center text-white rounded-lg p-2 cursor-pointer"
                          >
                            Change Logo
                          </label>
                        </div>
                      ) : (
                        <div className="flex flex-col">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              setWebsiteDataInput((prev) => ({
                                ...prev,
                                logo: e.target.files![0],
                              }))
                            }
                            className="hidden"
                            id="fileInput"
                          />
                          <label
                            htmlFor="fileInput"
                            className="bg-gradient-to-r from-blue-800 via-blue-600 to-blue-700 text-center text-sm text-white rounded-lg p-2 cursor-pointer"
                          >
                            Upload Logo
                          </label>
                        </div>
                      )}

                      <div className="flex justify-between">
                        <button
                          onClick={() => setCurrentStep(1)}
                          className="bg-[#1E1E1E] border-[1px] border-[#282c34] text-white rounded-full px-6 py-2 text-sm"
                        >
                          Back
                        </button>
                        <button
                          onClick={saveData}
                          className="bg-gradient-to-r from-blue-800 via-blue-600 to-blue-700 text-white rounded-full px-6 py-2 text-sm"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-4 text-center mt-10">
                    <h1 className="text-2xl font-semibold">Integration Code</h1>
                    <p className="text-slate-400">
                      Copy and paste this code into your website
                    </p>
                    <pre
                      className="bg-[#1E1E1E] border-[1px] border-[#282c34] text-white p-4 rounded-md"
                      dangerouslySetInnerHTML={{ __html: highlightedCode }}
                    ></pre>
                    <div className="flex justify-end">
                      <button
                        onClick={copyCode}
                        className="bg-gradient-to-r from-blue-400 via-blue-600 to-blue-700 text-white py-2 px-6 text-xs  font-semibold rounded-full"
                      >
                        Copy Code
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
