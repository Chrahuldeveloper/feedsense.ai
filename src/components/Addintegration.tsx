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
import { FiArrowUpRight, FiLink, FiType, FiCheck, FiPlus, FiLayers } from "react-icons/fi";
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


/* Card with a thin gradient border and an optional corner glow */
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
  "w-full rounded-xl border border-white/10 bg-black/40 py-3.5 pl-11 pr-4 text-sm text-[#06080b] placeholder:text-slate-600 outline-none transition focus:border-cyan-400/60 focus:bg-black/60 focus:ring-4 focus:ring-cyan-400/10";
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
      <button className="text-[#06080b] cursor-pointer hover:scale-110 duration-500 ease-in-out">
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
      <button className="text-[#06080b] cursor-pointer hover:scale-110 duration-500 ease-in-out">
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

  const filled =
    websiteDataInput.name !== "" &&
    websiteDataInput.url !== "" &&
    websiteDataInput.type !== "";
  const stage = highlightedCode1.length !== 0 ? 2 : filled ? 1 : 0;
  const steps = [
    { title: "Add details", desc: "Name, URL and type" },
    { title: "Save website", desc: "Register it with FeedSense" },
    { title: "Paste the code", desc: "Drop it into your site" },
  ];

  return (
    <>
      <Theme />
      {(fetchingData || savingData || deleting) && <Loader message="Loading" />}
      <div className="fs-root relative min-w-0 flex-1 md:ml-64">
        {/* ambient background */}
        <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden md:left-64">
          <div className="fs-drift-a absolute -left-24 -top-24 h-[420px] w-[420px] rounded-full bg-cyan-500/20 blur-[110px]" />
          <div className="fs-drift-b absolute -right-24 top-10 h-[460px] w-[460px] rounded-full bg-violet-600/20 blur-[120px]" />
          <div className="fs-grid absolute inset-0 opacity-70 [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]" />
        </div>

        {/* ---------- Top bar ---------- */}
        <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-[#06080b]/70 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-10">
            <div className="flex items-center gap-2.5 md:hidden">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-cyan-400 to-violet-500 text-[#06080b]">
                <HiOutlineSparkles size={18} />
              </span>
              <h1 className="text-base font-semibold tracking-tight text-[#06080b]">
                FeedSense.ai
              </h1>
            </div>
            <p className="hidden text-sm text-slate-500 md:block">
              Workspace <span className="mx-1.5 text-slate-700">/</span>
              <span className="text-slate-200">Integrate</span>
            </p>
            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-3 md:flex">
                <span className="max-w-[10rem] truncate text-sm text-slate-300">
                  {user?.displayName || "User"}
                </span>
                <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 text-sm font-bold text-[#06080b] ring-2 ring-white/10">
                  {initial}
                </span>
              </div>
              <button
                aria-label="Open menu"
                onClick={() => setToggle(true)}
                className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-[#06080b] transition hover:bg-white/10 md:hidden"
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

        <main className="relative z-10 mx-auto max-w-7xl space-y-10 px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
          {/* ---------- Title + live stepper ---------- */}
          <section className="fs-rise">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <h1 className="fs-gradient-text text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                  Integrate Website
                </h1>
                <p className="mt-4 text-base text-slate-400 sm:text-lg">
                  Add FeedSenseAI to your website in minutes
                </p>
              </div>
              <div className="flex items-center gap-3 self-start rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 backdrop-blur lg:self-auto">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-400/10 text-cyan-300 ring-1 ring-inset ring-cyan-400/25">
                  <FiLayers size={18} />
                </span>
                <div>
                  <p className="text-2xl font-bold tabular-nums leading-none text-[#06080b]">
                    {websitedata.length}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">websites connected</p>
                </div>
              </div>
            </div>

            <ol className="relative mt-10 grid gap-3 sm:grid-cols-3 sm:gap-5">
              {steps.map((s, i) => {
                const done = i < stage;
                const active = i === stage;
                return (
                  <li
                    key={s.title}
                    className={`relative flex items-center gap-4 rounded-2xl border px-5 py-4 transition-colors ${
                      active
                        ? "border-cyan-400/40 bg-cyan-400/[0.07] shadow-[0_0_40px_-12px_rgba(34,211,238,0.5)]"
                        : done
                        ? "border-emerald-400/25 bg-emerald-400/[0.05]"
                        : "border-white/[0.08] bg-white/[0.02]"
                    }`}
                  >
                    <span
                      className={`grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-bold ${
                        done
                          ? "bg-emerald-400 text-[#06080b]"
                          : active
                          ? "bg-gradient-to-br from-cyan-400 to-violet-500 text-[#06080b]"
                          : "bg-white/[0.06] text-slate-500"
                      }`}
                    >
                      {done ? <FiCheck size={18} /> : i + 1}
                    </span>
                    <div className="min-w-0">
                      <p
                        className={`text-sm font-semibold ${
                          done || active ? "text-[#06080b]" : "text-slate-500"
                        }`}
                      >
                        {s.title}
                      </p>
                      <p className="truncate text-xs text-slate-500">{s.desc}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>

          {/* ---------- Setup studio: one split panel ---------- */}
          <section className="fs-rise" style={{ animationDelay: "0.1s" }}>
            <div className="rounded-[28px] bg-gradient-to-br from-cyan-400/50 via-white/10 to-violet-500/50 p-px shadow-[0_30px_90px_-40px_rgba(34,211,238,0.45)]">
              <div className="grid overflow-hidden rounded-[27px] bg-[#080b10] lg:grid-cols-2">
                {/* form side */}
                <div className="relative p-6 sm:p-10">
                  <div className="pointer-events-none absolute -left-20 -top-20 h-60 w-60 rounded-full bg-cyan-500/15 blur-3xl" />
                  <div className="relative">
                    <div className="flex items-center gap-4">
                      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-cyan-400/10 text-cyan-300 ring-1 ring-inset ring-cyan-400/25">
                        <CiGlobe size={28} />
                      </span>
                      <div>
                        <h2 className="text-xl font-bold text-[#06080b]">
                          Website Details
                        </h2>
                        <p className="text-sm text-slate-500">
                          Configure your integration
                        </p>
                      </div>
                    </div>

                    <div className="mt-9 space-y-6">
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
                        <span className={labelClass}>Type</span>
                        <div className="grid grid-cols-2 gap-1.5 rounded-xl border border-white/10 bg-black/40 p-1.5">
                          {[
                            { v: "personal", l: "Personal" },
                            { v: "business", l: "Business" },
                          ].map((o) => (
                            <button
                              key={o.v}
                              type="button"
                              onClick={() =>
                                setWebsiteDataInput((prev) => ({
                                  ...prev,
                                  type: o.v,
                                }))
                              }
                              className={`rounded-lg py-2.5 text-sm font-semibold transition ${
                                websiteDataInput.type === o.v
                                  ? "bg-gradient-to-br from-cyan-400/25 to-violet-500/25 text-[#06080b] ring-1 ring-inset ring-cyan-400/40"
                                  : "text-slate-400 hover:bg-white/[0.05] hover:text-slate-200"
                              }`}
                            >
                              {o.l}
                            </button>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={saveData}
                        className="fs-btn w-full rounded-xl px-6 py-4 text-sm font-bold text-[#06080b] shadow-[0_14px_40px_-12px_rgba(34,211,238,0.8)] transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-400/30"
                      >
                        Save website
                      </button>
                    </div>
                  </div>
                </div>

                {/* code side */}
                <div className="relative flex flex-col border-t border-white/[0.07] bg-[#06080c] p-6 sm:p-10 lg:border-l lg:border-t-0">
                  <div className="pointer-events-none absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-violet-600/20 blur-3xl" />
                  <div className="relative flex items-center gap-4">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-violet-400/10 text-violet-300 ring-1 ring-inset ring-violet-400/25">
                      <IoCodeOutline size={26} />
                    </span>
                    <div>
                      <h2 className="text-xl font-bold text-[#06080b]">
                        Integration Code
                      </h2>
                      <p className="text-sm text-slate-500">
                        Copy and paste to your website
                      </p>
                    </div>
                  </div>

                  <div className="relative mt-9 flex flex-1 flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0b0f15] shadow-[0_20px_60px_-30px_rgba(0,0,0,0.9)]">
                    {highlightedCode1.length != 0 ? (
                      <>
                        <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="h-3 w-3 rounded-full bg-red-400/80" />
                            <span className="h-3 w-3 rounded-full bg-amber-400/80" />
                            <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
                            <span className="ml-3 text-xs text-slate-500">
                              feedback-button.tsx
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={copyCode}
                            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-cyan-400/40 hover:bg-cyan-400/10 hover:text-cyan-200"
                          >
                            <FaRegCopy size={13} />
                            Copy
                          </button>
                        </div>
                        <pre
                          className="max-h-80 min-h-[14rem] flex-1 overflow-auto px-5 py-5 text-left text-xs leading-relaxed text-slate-200 [scrollbar-color:#2a3038_transparent] [scrollbar-width:thin]"
                          dangerouslySetInnerHTML={{ __html: highlightedCode1 }}
                        ></pre>
                      </>
                    ) : (
                      <div className="flex flex-1 flex-col items-center justify-center px-8 py-16 text-center">
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
              </div>
            </div>
          </section>

          {/* ---------- Connected websites: card grid ---------- */}
          <section className="fs-rise" style={{ animationDelay: "0.2s" }}>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#06080b] sm:text-2xl">
                Connected websites
              </h2>
              <span className="rounded-full bg-gradient-to-r from-cyan-400/15 to-violet-500/15 px-3 py-1 text-xs font-semibold text-cyan-200 ring-1 ring-inset ring-cyan-400/25">
                {websitedata.length}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {websitedata.map((site, idx) => (
                <GlowCard key={idx} tint="bg-cyan-500/10">
                  <div className="p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-3">
                      <span
                        className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br text-lg font-bold text-[#06080b] shadow-lg ${
                          avatarGradients[idx % avatarGradients.length]
                        }`}
                      >
                        {(site.name || "?").charAt(0).toUpperCase()}
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-2.5 py-1 text-xs font-medium text-emerald-300 ring-1 ring-inset ring-emerald-400/25">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        </span>
                        {"Active"}
                      </span>
                    </div>

                    <h3 className="mt-5 truncate text-base font-semibold text-[#06080b]">
                      {site.name}
                    </h3>

                    <button
                      type="button"
                      className="group mt-1 flex max-w-full items-center gap-1.5 text-left text-sm text-cyan-300 transition hover:text-cyan-200"
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
                        className="shrink-0 opacity-60 transition group-hover:opacity-100"
                      />
                    </button>

                    <div className="mt-6 flex items-center justify-between border-t border-white/[0.07] pt-4">
                      <span className="rounded-full bg-white/[0.06] px-3 py-1 text-xs font-medium capitalize text-slate-300">
                        {site.type || "Website"}
                      </span>
                      <button
                        aria-label={`Delete ${site.name}`}
                        onClick={() => {
                          handleDeleteWebsite(site.name);
                        }}
                        className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-slate-400 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400"
                      >
                        <BsTrash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                </GlowCard>
              ))}

              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="group flex min-h-[13rem] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/15 bg-white/[0.02] text-slate-400 transition hover:border-cyan-400/40 hover:bg-cyan-400/[0.04] hover:text-cyan-200"
              >
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-white/[0.05] ring-1 ring-inset ring-white/10 transition group-hover:bg-cyan-400/10 group-hover:ring-cyan-400/30">
                  <FiPlus size={22} />
                </span>
                <span className="text-sm font-semibold">
                  {websitedata.length === 0 && !fetchingData
                    ? "Save your first website above"
                    : "Add another website"}
                </span>
              </button>
            </div>
          </section>
        </main>
      </div>

      <ToastContainer theme="dark" toastClassName={"custom-toast"} />
    </>
  );
};

export default AddIntegration;