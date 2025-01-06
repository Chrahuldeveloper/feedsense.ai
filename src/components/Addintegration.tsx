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
import { FaRegCopy } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const [highlightedCode1, setHighlightedCode1] = useState("");

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
    const code = `<!-- Add this Link to your website -->\n https://feedsenseai.vercel.app/integrate/${
      user!.uid
    }/${websiteId}`;
    const highlighted = hljs.highlight(code, { language: "html" }).value;
    setHighlightedCode(highlighted);
    setShowCode(true);
  };

  const codeToCopy = (websiteId: string) => {
    const code = `
  <!-- Make sure you have Tailwind CSS set up to use these utility classes for styling -->
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
            codeToCopy(websiteDataInput.name);
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
        toast("Code Copied!");
      } else {
        alert("No website ID available to copy.");
      }
    } catch (error) {
      console.log("Error copying code:", error);
    }
  };

  const copyCodeToIntegrate = async () => {
    try {
      if (lastWebsiteId) {
        await navigator.clipboard.writeText(
          `<div className="fixed bottom-10 right-10">
    <Link href="https://feedsenseai.vercel.app/integrate/${
      user!.uid
    }/${lastWebsiteId}">
      <button className="text-white cursor-pointer hover:scale-110 duration-500 ease-in-out">
        <MdSettingsSuggest1
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

  return (
    <>
      {(fetchingData || savingData || deleting) && <Loader message="Loading" />}
      <div className="md:ml-80">
        <nav className="md:hidden bg-[#0e0f12] p-7 w-screen border-b-[1px] border-[#272b2f] flex justify-between items-center">
          <h1 className="text-xl font-semibold text-slate-300">TaskFeed</h1>
          <CiMenuFries
            size={26}
            color="white"
            className="cursor-pointer"
            onClick={() => setToggle(true)}
          />
        </nav>
        {toggle && <MobileSideBar setToggle={setToggle} />}

        <div className="text-slate-300 flex flex-col md:flex-row items-center gap-8 md:gap-12 md:mt-14 justify-center">
          <div className="md:ml-52">
            <div className="bg-[#0e0f12] w-[96vw] shadow-2xl  md:w-[45vw] mx-auto h-[80vh] overflow-y-scroll mt-7 border-[1px] border-[#15171b]">
              <div className="space-y-3 border-b-[1px] border-[#15171b] bg-[#131417] p-5 text-slate-300">
                <h1 className="text-2xl font-semibold ">
                  Welcome to Integration
                </h1>
                <p className="">Connect your website</p>
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
                        <p className="text-xl font-semibold text-slate-300">
                          No websites connected yet
                        </p>
                        <p className="text-sm text-slate-300">
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
                              className="h-12 w-12 rounded-full object-cover cursor-pointer border-[1px] border-[#15171b]"
                            />
                            <h1 className="text-sm font-semibold text-slate-300">
                              {i?.name}
                            </h1>
                            <button
                              onClick={() => handleDeleteWebsite(i?.name)}
                              className="text-sm hover:text-red-500 ease-in-out duration-500 text-slate-300"
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
                  <div className="w-[85vw] md:w-[33vw] p-6 space-y-9  mx-auto ">
                    <div className="space-y-4 text-slate-300">
                      <h1 className="text-2xl font-semibold">
                        Add your website
                      </h1>
                      <input
                        type="text"
                        placeholder="Website Name"
                        className="bg-[#0c0c0c] border-[1px] border-[#15171b] outline-none p-3 rounded-lg w-full text-sm focus:outline-none focus:border-blue-500 transition-colors"
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
                        className="bg-[#0c0c0c] border-[1px] border-[#15171b] outline-none p-3 rounded-lg w-full text-sm focus:outline-none focus:border-blue-500 transition-colors"
                        value={websiteDataInput.url}
                        onChange={(e) =>
                          setWebsiteDataInput((prev) => ({
                            ...prev,
                            url: e.target.value,
                          }))
                        }
                      />
                      <select
                        className="bg-[#0c0c0c] border-[1px] border-[#15171b] outline-none p-3 rounded-lg w-full text-sm focus:outline-none focus:border-blue-500 transition-colors"
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
                            className="bg-gradient-to-r from-blue-800 via-blue-600 to-blue-700 text-center text-slate-300 rounded-lg p-2 cursor-pointer"
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
                            className="bg-gradient-to-r from-blue-800 via-blue-600 to-blue-700 text-center text-sm text-slate-300 rounded-lg p-2 cursor-pointer"
                          >
                            Upload Logo
                          </label>
                        </div>
                      )}

                      <div className="flex justify-between">
                        <button
                          onClick={() => setCurrentStep(1)}
                          className="bg-[#1E1E1E] border-[1px] border-[#282c34] text-slate-300 rounded-lg px-6 py-2 text-sm"
                        >
                          Back
                        </button>
                        <button
                          onClick={saveData}
                          className="bg-gradient-to-r from-blue-800 via-blue-600 to-blue-700 text-slate-300 rounded-lg px-6 py-2 text-sm"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-4 text-center  max-w-4xl mx-auto">
                    <h1 className="text-2xl font-semibold">Integration Code</h1>
                    <p className="text-slate-400">
                      Copy and paste this code into your website
                    </p>
                    <pre
                      className="bg-[#0c0c0c] border-[1px] border-[#15171b] max-w-2xl overflow-auto text-white px-4 py-16"
                      dangerouslySetInnerHTML={{ __html: highlightedCode }}
                    ></pre>
                    <div className="flex justify-end">
                      <FaRegCopy
                        size={24}
                        className="relative bottom-14 right-5"
                        cursor={"pointer"}
                        onClick={copyCode}
                      />
                    </div>
                    OR
                    <div>
                      <pre
                        className="bg-[#0c0c0c] border-[1px] border-[#15171b] px-4 py-10 overflow-auto text-white  "
                        dangerouslySetInnerHTML={{
                          __html: "npm i react-icons",
                        }}
                      ></pre>
                      <div className="flex justify-end">
                        <FaRegCopy
                          onClick={async () => {
                            try {
                              await navigator.clipboard.writeText(
                                "npm i react-icons"
                              );
                              toast("Code Copied!");
                            } catch (error: any) {
                              console.log(error);
                            }
                          }}
                          size={24}
                          className="relative bottom-10 right-5"
                          cursor={"pointer"}
                        />
                      </div>
                    </div>
                    <div className="bg-[#0c0c0c] border-[1px] border-[#15171b]">
                      <pre
                        className="  overflow-auto text-white  rounded-md"
                        dangerouslySetInnerHTML={{ __html: highlightedCode1 }}
                      ></pre>
                      <div className="flex justify-end">
                        <FaRegCopy
                          size={24}
                          className="relative bottom-5 right-5"
                          cursor={"pointer"}
                          onClick={copyCodeToIntegrate}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer theme="dark" toastClassName={"custom-toast"} />
    </>
  );
};

export default AddIntegration;
