import React, { useEffect, useMemo, useState } from "react";
import { CiGlobe, CiMenuFries } from "react-icons/ci";
import MobileSideBar from "./MobileSideBar";
import hljs from "highlight.js/lib/core";
import html from "highlight.js/lib/languages/xml";
import "highlight.js/styles/github-dark.css";
import dbService from "../firebase/utils/db";
import useAuth from "@/hooks/CurrentUser";
import Loader from "./Loader";
import { FaRegCopy } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ModelLogout from "./ModelLogout";
import { IoCodeOutline } from "react-icons/io5";
import { BsTrash2 } from "react-icons/bs";
import { FiChevronDown, FiArrowUpRight, FiLink, FiLayers, FiType } from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi2";

const Theme = () => (
  <style>{`
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
.fs-root{font-family:'Plus Jakarta Sans',ui-sans-serif,system-ui,sans-serif;-webkit-font-smoothing:antialiased}
@keyframes fs-drift-a{0%,100%{transform:translate3d(0,0,0) scale(1)}50%{transform:translate3d(60px,30px,0) scale(1.15)}}
@keyframes fs-drift-b{0%,100%{transform:translate3d(0,0,0) scale(1.1)}50%{transform:translate3d(-50px,-30px,0) scale(0.95)}}
@keyframes fs-rise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
@keyframes fs-sheen{from{background-position:200% 0}to{background-position:-200% 0}}
.fs-drift-a{animation:fs-drift-a 14s ease-in-out infinite}
.fs-drift-b{animation:fs-drift-b 18s ease-in-out infinite}
.fs-rise{animation:fs-rise .7s cubic-bezier(.2,.7,.2,1) both}
.fs-gradient-text{background:linear-gradient(110deg,#ffffff 15%,#67e8f9 50%,#c4b5fd 85%);-webkit-background-clip:text;background-clip:text;color:transparent}
.fs-btn{background-image:linear-gradient(110deg,#22d3ee 0%,#818cf8 50%,#22d3ee 100%);background-size:200% 100%}
.fs-btn:hover{animation:fs-sheen 2.4s linear infinite}
.fs-grid{background-image:linear-gradient(rgba(255,255,255,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.045) 1px,transparent 1px);background-size:44px 44px}
@media (prefers-reduced-motion:reduce){.fs-drift-a,.fs-drift-b,.fs-rise,.fs-btn:hover{animation:none!important}}
`}</style>
);


const GlowCard = ({
  children,
  className = "",
  innerClassName = "",
  tint,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  tint?: string; // e.g. "bg-cyan-500/25"
  style?: React.CSSProperties;
}) => (
  <div
    style={style}
    className={`relative rounded-2xl bg-gradient-to-b from-white/[0.18] via-white/[0.05] to-white/[0.03] p-px ${className}`}
  >
    <div
      className={`relative h-full overflow-hidden rounded-[15px] bg-[#0a0d13]/95 backdrop-blur-xl ${innerClassName}`}
    >
      {tint && (
        <div
          className={`pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full blur-3xl ${tint}`}
        />
      )}
      <div className="relative h-full">{children}</div>
    </div>
  </div>
);


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

/* UI-only class tokens */
const inputClass =
  "w-full rounded-xl border border-white/10 bg-black/40 py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-cyan-400/60 focus:bg-black/60 focus:ring-4 focus:ring-cyan-400/10";
const labelClass = "mb-2 block text-sm font-semibold text-slate-300";
const iconClass =
  "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500";
const avatarGradients = [
  "from-cyan-400 to-blue-600",
  "from-violet-400 to-fuchsia-600",
  "from-emerald-400 to-teal-600",
  "from-amber-400 to-rose-500",
];

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

  const initial = (user?.displayName || "U").charAt(0).toUpperCase();

  return (
    <>
      <Theme />
      {(fetchingData || savingData || deleting) && <Loader message="Loading" />}
      <div className="fs-root relative min-w-0 flex-1 md:ml-64">
        {/* ambient background */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[560px] overflow-hidden">
          <div className="fs-drift-a absolute -left-24 -top-24 h-[420px] w-[420px] rounded-full bg-cyan-500/20 blur-[110px]" />
          <div className="fs-drift-b absolute -right-24 top-10 h-[460px] w-[460px] rounded-full bg-violet-600/20 blur-[120px]" />
          <div className="fs-grid absolute inset-0 opacity-70 [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]" />
        </div>

        {/* ---------- Top bar ---------- */}
        <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-[#06080b]/60 backdrop-blur-2xl">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-10">
            <div className="flex items-center gap-2.5 md:hidden">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-cyan-400 to-violet-500 text-[#06080b] shadow-[0_0_20px_-2px_rgba(34,211,238,0.7)]">
                <HiOutlineSparkles size={18} />
              </span>
              <h1 className="text-base font-bold tracking-tight text-white">
                FeedSense.ai
              </h1>
            </div>

            <p className="hidden text-sm text-slate-500 md:block">
              Workspace <span className="mx-1.5 text-slate-700">/</span>
              <span className="font-medium text-slate-200">Integrate</span>
            </p>

            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.04] py-1 pl-4 pr-1 md:flex">
                <span className="max-w-[10rem] truncate text-sm text-slate-200">
                  {user?.displayName || "User"}
                </span>
                <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 text-sm font-bold text-[#06080b]">
                  {initial}
                </span>
              </div>
              <button
                aria-label="Open menu"
                onClick={() => setToggle(true)}
                className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.05] text-white transition hover:bg-white/10 md:hidden"
              >
                <CiMenuFries size={20} />
              </button>
            </div>
          </div>
        </header>

        {toggle && (
          <MobileSideBar
            Page="Integrate"
            setToggle={setToggle}
            setToggleLogout={setToggleLogout}
          />
        )}

        {toggleLogout && <ModelLogout settoggle={setToggleLogout} />}

        <main className="relative z-10 mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:space-y-8 lg:px-10 lg:py-10">
          {/* ---------- Hero ---------- */}
          <section>
            <h1 className="fs-gradient-text text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Integrate Website
            </h1>
            <p className="mt-4 max-w-lg text-base text-slate-400 sm:text-lg">
              Add FeedSenseAI to your website in minutes
            </p>
          </section>

          {/* ---------- Form + code ---------- */}
          <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Form */}
            <GlowCard tint="bg-cyan-500/25" className="fs-rise">
              <div className="p-5 sm:p-7">
                <div className="flex items-center gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-cyan-400/30 to-cyan-400/5 text-cyan-200 ring-1 ring-inset ring-cyan-300/25 shadow-[0_0_30px_-6px_rgba(34,211,238,0.65)]">
                    <CiGlobe size={28} />
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-cyan-300">Step 1</p>
                    <h2 className="text-lg font-bold text-white">
                      Website Details
                    </h2>
                    <p className="text-sm text-slate-500">
                      Configure your integration
                    </p>
                  </div>
                </div>

                <div className="mt-8 space-y-5">
                  <div>
                    <label htmlFor="site-name" className={labelClass}>
                      Website name
                    </label>
                    <div className="relative">
                      <FiType size={17} className={iconClass} />
                      <input
                        id="site-name"
                        type="text"
                        placeholder="Website Name"
                        className={inputClass}
                        value={websiteDataInput.name}
                        onChange={(e) =>
                          setWebsiteDataInput((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="site-url" className={labelClass}>
                      Website URL
                    </label>
                    <div className="relative">
                      <FiLink size={17} className={iconClass} />
                      <input
                        id="site-url"
                        type="text"
                        placeholder="Website URL"
                        className={inputClass}
                        value={websiteDataInput.url}
                        onChange={(e) =>
                          setWebsiteDataInput((prev) => ({
                            ...prev,
                            url: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="site-type" className={labelClass}>
                      Type
                    </label>
                    <div className="relative">
                      <FiLayers size={17} className={iconClass} />
                      <select
                        id="site-type"
                        className={`${inputClass} appearance-none pr-11 [color-scheme:dark]`}
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
                      <FiChevronDown
                        size={18}
                        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                      />
                    </div>
                  </div>

                  <button
                    onClick={saveData}
                    className="fs-btn w-full rounded-xl px-6 py-3.5 text-sm font-bold text-[#06080b] shadow-[0_14px_40px_-12px_rgba(34,211,238,0.8)] transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-400/30"
                  >
                    Save website
                  </button>
                </div>
              </div>
            </GlowCard>

            {/* Code */}
            <GlowCard
              tint="bg-violet-500/25"
              className="fs-rise"
              style={{ animationDelay: "120ms" }}
              innerClassName="flex flex-col"
            >
              <div className="flex h-full flex-col p-5 sm:p-7">
                <div className="flex items-center gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-violet-400/30 to-violet-400/5 text-violet-200 ring-1 ring-inset ring-violet-300/25 shadow-[0_0_30px_-6px_rgba(167,139,250,0.65)]">
                    <IoCodeOutline size={26} />
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-violet-300">
                      Step 2
                    </p>
                    <h2 className="text-lg font-bold text-white">
                      Integration Code
                    </h2>
                    <p className="text-sm text-slate-500">
                      Copy and paste to your website
                    </p>
                  </div>
                </div>

                <div className="mt-8 flex min-h-[18rem] flex-1 flex-col overflow-hidden rounded-xl border border-white/[0.08] bg-[#070a0f] shadow-inner">
                  {highlightedCode1.length != 0 ? (
                    <>
                      <div className="flex items-center justify-between border-b border-white/[0.06] bg-white/[0.02] px-4 py-2.5">
                        <div className="flex items-center gap-1.5">
                          <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
                          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
                        </div>
                        <button
                          type="button"
                          onClick={copyCode}
                          className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-cyan-400/40 hover:bg-cyan-400/10 hover:text-cyan-200"
                        >
                          <FaRegCopy size={13} />
                          Copy
                        </button>
                      </div>
                      <pre
                        className="max-h-80 min-h-[12rem] flex-1 overflow-auto px-4 py-4 text-left text-xs leading-relaxed text-slate-200 [scrollbar-color:#2a3038_transparent] [scrollbar-width:thin]"
                        dangerouslySetInnerHTML={{ __html: highlightedCode1 }}
                      ></pre>
                    </>
                  ) : (
                    <div className="flex flex-1 flex-col items-center justify-center px-6 py-14 text-center">
                      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/[0.05] text-slate-400 ring-1 ring-inset ring-white/10">
                        <IoCodeOutline size={26} />
                      </span>
                      <p className="mt-5 max-w-xs text-sm text-slate-400">
                        Fill in your website details and save to get your
                        integration code
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </GlowCard>
          </section>

          {/* ---------- Websites table ---------- */}
          <GlowCard innerClassName="!overflow-hidden">
            <div className="flex items-center justify-between px-5 py-5 sm:px-7">
              <h2 className="text-lg font-bold text-white">
                Connected websites
              </h2>
              <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-semibold text-slate-300">
                {websitedata.length}
              </span>
            </div>

            <div className="hidden grid-cols-12 gap-4 border-y border-white/[0.06] bg-white/[0.025] px-7 py-3 text-xs font-semibold text-slate-500 md:grid">
              <div className="col-span-3">Website name</div>
              <div className="col-span-5">URL</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {websitedata.length === 0 && !fetchingData ? (
              <div className="px-6 py-16 text-center">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white/[0.05] text-slate-400 ring-1 ring-inset ring-white/10">
                  <CiGlobe size={28} />
                </span>
                <p className="mt-4 text-sm font-semibold text-slate-200">
                  No websites yet
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Save your first website above to see it here
                </p>
              </div>
            ) : (
              <div className="divide-y divide-white/[0.05]">
                {websitedata.map((site, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col gap-3 px-5 py-4 transition-colors hover:bg-cyan-400/[0.04] sm:px-7 md:grid md:grid-cols-12 md:items-center md:gap-4"
                  >
                    <div className="flex items-center justify-between gap-3 md:col-span-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <span
                          className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-to-br text-sm font-extrabold text-white ${
                            avatarGradients[idx % avatarGradients.length]
                          }`}
                        >
                          {(site.name || "?").charAt(0).toUpperCase()}
                        </span>
                        <span className="truncate text-sm font-semibold text-white">
                          {site.name}
                        </span>
                      </div>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-300 ring-1 ring-inset ring-emerald-400/25 md:hidden">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        Active
                      </span>
                    </div>

                    <button
                      type="button"
                      className="group flex min-w-0 items-center gap-1.5 text-left text-sm text-cyan-300 transition hover:text-cyan-200 md:col-span-5"
                      onClick={() => {
                        const url = site.url!.match(/^https?:\/\//)
                          ? site.url
                          : `https://${site.url}`;

                        window.open(url, "_blank", "noopener,noreferrer");
                      }}
                    >
                      <span className="truncate">{site.url}</span>
                      <FiArrowUpRight
                        size={14}
                        className="shrink-0 opacity-60 group-hover:opacity-100"
                      />
                    </button>

                    <div className="hidden md:col-span-2 md:block">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-300 ring-1 ring-inset ring-emerald-400/25">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        </span>
                        {"Active"}
                      </span>
                    </div>

                    <div className="md:col-span-2 md:text-right">
                      <button
                        aria-label={`Delete ${site.name}`}
                        onClick={() => {
                          handleDeleteWebsite(site.name);
                        }}
                        className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-slate-400 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400"
                      >
                        <BsTrash2 className="h-3.5 w-3.5" />
                        <span className="md:hidden">Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlowCard>
        </main>
      </div>

      <ToastContainer theme="dark" toastClassName={"custom-toast"} />
    </>
  );
};

export default AddIntegration;