import React, { useEffect, useMemo, useState } from "react";
import { CiGlobe, CiMenuFries } from "react-icons/ci";
import MobileSideBar from "./MobileSideBar";
import dbService from "../firebase/utils/db";
import useAuth from "@/hooks/CurrentUser";
import Loader from "./Loader";
import { FaRegCopy } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import ModelLogout from "./ModelLogout";
import { IoCodeOutline } from "react-icons/io5";
import { BsTrash2 } from "react-icons/bs";
import { FiArrowUpRight, FiLink, FiType, FiCheck, FiPlus, FiLayers } from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi2";

const Theme = () => (
  <style>{`
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
.fs-root{font-family:'Inter',ui-sans-serif,system-ui,sans-serif;-webkit-font-smoothing:antialiased}
@keyframes fs-drift-a{0%,100%{transform:translate3d(0,0,0) scale(1)}50%{transform:translate3d(60px,30px,0) scale(1.15)}}
@keyframes fs-drift-b{0%,100%{transform:translate3d(0,0,0) scale(1.1)}50%{transform:translate3d(-50px,-30px,0) scale(0.95)}}
@keyframes fs-rise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
@keyframes fs-sheen{from{background-position:200% 0}to{background-position:-200% 0}}
.fs-drift-a{animation:fs-drift-a 14s ease-in-out infinite}
.fs-drift-b{animation:fs-drift-b 18s ease-in-out infinite}
.fs-rise{animation:fs-rise .7s cubic-bezier(.2,.7,.2,1) both}
.fs-gradient-text{background:linear-gradient(110deg,#ffffff 15%,#67e8f9 50%,#c4b5fd 85%);-webkit-background-clip:text;background-clip:text;color:transparent}
.fs-btn{background-image:linear-gradient(110deg,#818cf8 0%,#818cf8 50%,#818cf8 100%);background-size:200% 100%}
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
  tint?: string; // e.g. "bg-indigo-500/25"
  style?: React.CSSProperties;
}) => (
  <div
    style={style}
    className={`relative rounded-2xl p-px bg-white/10${className}`}
  >
    <div
      className={`relative h-full overflow-hidden rounded-[15px] bg-[#111113]/95 backdrop-blur-xl ${innerClassName}`}
    >
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
  "w-full rounded-xl border border-white/10 bg-black/40 py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-zinc-600 outline-none transition focus:border-indigo-400/60 focus:bg-black/60 focus:ring-4 focus:ring-indigo-400/10";
const labelClass = "mb-2 block text-sm font-semibold text-zinc-300";
const iconClass =
  "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500";
const avatarGradients = [
  "from-indigo-500 to-indigo-600",
  "from-sky-500 to-sky-600",
  "from-emerald-500 to-emerald-600",
  "from-amber-500 to-amber-600",
];

/* ---------- Widget gallery ----------
   Each widget is plain HTML + scoped CSS. The preview renders it as-is and
   "Copy code" turns the same markup into a dependency-free React snippet. */
interface Widget {
  id: string;
  name: string;
  desc: string;
  color: string;
  css: string;
  html: string;
}

const CHAT = (size = 18, c = "#fff") =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H11l-4.2 3.6c-.5.4-1.3.1-1.3-.6V16A2.5 2.5 0 0 1 4 13.5z"/><path d="M12 6.6l.8 1.9 1.9.8-1.9.8-.8 1.9-.8-1.9-1.9-.8 1.9-.8z" fill="${c}" stroke="none"/></svg>`;

const ARROW = (c: string) =>
  `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`;

/* shared: isolation from the host site, entrance animation, reduced motion */
const base = (p: string, pos: string) => `@keyframes ${p}-in{from{opacity:0;transform:translateY(14px) scale(.96)}to{opacity:1;transform:none}}
.${p}{all:initial;position:fixed;${pos};z-index:2147483000;font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;-webkit-font-smoothing:antialiased;animation:${p}-in .7s cubic-bezier(.22,1,.36,1) .5s both}
.${p} *,.${p} *::before,.${p} *::after{box-sizing:border-box}
.${p} a{text-decoration:none;color:inherit;cursor:pointer}
@media (prefers-reduced-motion:reduce){.${p},.${p} *{animation:none!important;transition:none!important}}`;

const A = (cls: string, label = "Open feedback form") =>
  `<a href="__URL__" target="_blank" rel="noopener noreferrer" class="${cls}" aria-label="${label}">`;

const WIDGETS: Widget[] = [
  {
    id: "glass",
    name: "Glass pill",
    desc: "Frosted dark pill with an indigo accent",
    color: "#818cf8",
    css:
      base("fwa", "right:24px;bottom:24px") +
      `
.fwa-btn{position:relative;display:flex;align-items:center;gap:10px;height:48px;padding:0 16px 0 8px;border-radius:999px;color:#fff;background:linear-gradient(180deg,rgba(32,32,38,.82),rgba(17,17,19,.82));backdrop-filter:blur(16px) saturate(1.5);-webkit-backdrop-filter:blur(16px) saturate(1.5);border:1px solid rgba(255,255,255,.12);box-shadow:0 12px 32px -10px rgba(0,0,0,.55),0 2px 6px rgba(0,0,0,.25),inset 0 1px 0 rgba(255,255,255,.12);transition:transform .35s cubic-bezier(.22,1,.36,1),box-shadow .35s,border-color .35s}
.fwa-btn:hover{transform:translateY(-2px);border-color:rgba(129,140,248,.55);box-shadow:0 18px 40px -12px rgba(0,0,0,.6),0 0 0 4px rgba(129,140,248,.14),inset 0 1px 0 rgba(255,255,255,.16)}
.fwa-btn:active{transform:scale(.97)}
.fwa-btn:focus-visible{outline:2px solid #818cf8;outline-offset:3px}
.fwa-ico{display:grid;place-items:center;width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#a5b4fc,#6366f1 60%,#4f46e5);box-shadow:inset 0 1px 0 rgba(255,255,255,.35),0 4px 12px -2px rgba(99,102,241,.7)}
.fwa-ico svg{display:block;transition:transform .5s cubic-bezier(.22,1,.36,1)}
.fwa-btn:hover .fwa-ico svg{transform:rotate(-12deg) scale(1.08)}
.fwa-label{font-size:14px;font-weight:600;letter-spacing:-.01em;line-height:1}
@media (max-width:640px){.fwa-label{display:none}.fwa-btn{width:52px;height:52px;padding:0;justify-content:center}}`,
    html: `<div class="fwa">${A("fwa-btn")}<span class="fwa-ico">${CHAT()}</span><span class="fwa-label">Feedback</span></a></div>`,
  },
  {
    id: "orb",
    name: "Pulse orb",
    desc: "Compact round button with a soft violet pulse",
    color: "#a78bfa",
    css:
      base("fwb", "right:24px;bottom:24px") +
      `
@keyframes fwb-ping{0%{transform:scale(1);opacity:.55}100%{transform:scale(1.7);opacity:0}}
.fwb-btn{position:relative;display:grid;place-items:center;width:56px;height:56px;border-radius:50%;color:#fff;background:linear-gradient(135deg,#c4b5fd,#7c3aed 55%,#c026d3);box-shadow:0 12px 32px -8px rgba(124,58,237,.75),inset 0 1px 0 rgba(255,255,255,.4);transition:transform .4s cubic-bezier(.22,1,.36,1),box-shadow .4s}
.fwb-btn::before{content:"";position:absolute;inset:0;border-radius:50%;background:#8b5cf6;z-index:-1;animation:fwb-ping 2.6s ease-out infinite}
.fwb-btn:hover{transform:scale(1.08) rotate(-6deg);box-shadow:0 18px 40px -8px rgba(124,58,237,.9),inset 0 1px 0 rgba(255,255,255,.5)}
.fwb-btn:active{transform:scale(.95)}
.fwb-btn:focus-visible{outline:2px solid #c4b5fd;outline-offset:4px}
.fwb-btn svg{display:block}
.fwb-tip{position:absolute;right:calc(100% + 12px);top:50%;transform:translateY(-50%) translateX(6px);opacity:0;padding:7px 12px;border-radius:10px;background:#18181b;border:1px solid rgba(255,255,255,.1);color:#fff;font-size:12.5px;font-weight:600;white-space:nowrap;pointer-events:none;transition:opacity .25s,transform .3s cubic-bezier(.22,1,.36,1)}
.fwb-btn:hover .fwb-tip,.fwb-btn:focus-visible .fwb-tip{opacity:1;transform:translateY(-50%)}`,
    html: `<div class="fwb">${A("fwb-btn")}<span class="fwb-tip">Feedback</span>${CHAT(24)}</a></div>`,
  },
  {
    id: "tab",
    name: "Edge tab",
    desc: "Slim vertical tab that hugs the right edge",
    color: "#34d399",
    css:
      base("fwc", "right:0;top:calc(50% - 60px)") +
      `
.fwc-tab{display:flex;flex-direction:column;align-items:center;gap:10px;width:42px;padding:16px 0;border-radius:14px 0 0 14px;color:#04130d;background:linear-gradient(180deg,#6ee7b7,#10b981);box-shadow:-8px 10px 28px -10px rgba(16,185,129,.7),inset 1px 1px 0 rgba(255,255,255,.4);transition:width .35s cubic-bezier(.22,1,.36,1),box-shadow .35s}
.fwc-tab:hover{width:50px;box-shadow:-12px 12px 34px -10px rgba(16,185,129,.9),inset 1px 1px 0 rgba(255,255,255,.5)}
.fwc-tab:focus-visible{outline:2px solid #34d399;outline-offset:3px}
.fwc-ico{display:grid;place-items:center}
.fwc-txt{writing-mode:vertical-rl;transform:rotate(180deg);font-size:13px;font-weight:700;letter-spacing:.06em;line-height:1}`,
    html: `<div class="fwc">${A("fwc-tab")}<span class="fwc-ico">${CHAT(16, "#04130d")}</span><span class="fwc-txt">Feedback</span></a></div>`,
  },
  {
    id: "light",
    name: "Clean light",
    desc: "Crisp white pill that pops on dark sites",
    color: "#e4e4e7",
    css:
      base("fwd", "left:24px;bottom:24px") +
      `
.fwd-btn{display:flex;align-items:center;gap:10px;height:48px;padding:0 18px 0 8px;border-radius:999px;color:#0a0a0a;background:#fff;border:1px solid rgba(0,0,0,.06);box-shadow:0 12px 30px -10px rgba(0,0,0,.4),0 2px 6px rgba(0,0,0,.14);font-size:14px;font-weight:600;letter-spacing:-.01em;line-height:1;transition:transform .35s cubic-bezier(.22,1,.36,1),box-shadow .35s}
.fwd-btn:hover{transform:translateY(-2px);box-shadow:0 18px 40px -12px rgba(0,0,0,.5),0 2px 8px rgba(0,0,0,.16)}
.fwd-btn:active{transform:scale(.97)}
.fwd-btn:focus-visible{outline:2px solid #0a0a0a;outline-offset:3px}
.fwd-ico{display:grid;place-items:center;width:32px;height:32px;border-radius:50%;background:#0a0a0a}
.fwd-ico svg{display:block;transition:transform .5s cubic-bezier(.22,1,.36,1)}
.fwd-btn:hover .fwd-ico svg{transform:rotate(-12deg) scale(1.08)}`,
    html: `<div class="fwd">${A("fwd-btn")}<span class="fwd-ico">${CHAT(17)}</span>Give feedback</a></div>`,
  },
  {
    id: "bar",
    name: "Prompt bar",
    desc: "Centered bar with a clear call to action",
    color: "#fbbf24",
    css:
      base("fwe", "bottom:24px;left:0;right:0;margin:0 auto;width:max-content;max-width:calc(100vw - 32px)") +
      `
.fwe-bar{display:flex;align-items:center;gap:12px;padding:6px 6px 6px 16px;border-radius:999px;background:rgba(24,24,27,.92);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,.1);box-shadow:0 14px 36px -12px rgba(0,0,0,.6),inset 0 1px 0 rgba(255,255,255,.08)}
.fwe-dot{width:8px;height:8px;border-radius:50%;background:#fbbf24;box-shadow:0 0 10px #fbbf24}
.fwe-txt{font-size:13px;font-weight:500;color:#e4e4e7;white-space:nowrap}
.fwe-btn{display:inline-flex;align-items:center;gap:6px;height:34px;padding:0 14px;border-radius:999px;color:#1a1203;background:linear-gradient(135deg,#fde68a,#f59e0b);font-size:13px;font-weight:700;white-space:nowrap;box-shadow:0 6px 16px -6px rgba(245,158,11,.7);transition:transform .3s cubic-bezier(.22,1,.36,1),box-shadow .3s}
.fwe-btn svg{display:block;transition:transform .3s cubic-bezier(.22,1,.36,1)}
.fwe-btn:hover{transform:translateY(-1px);box-shadow:0 10px 22px -6px rgba(245,158,11,.9)}
.fwe-btn:hover svg{transform:translateX(3px)}
.fwe-btn:focus-visible{outline:2px solid #fbbf24;outline-offset:3px}`,
    html: `<div class="fwe"><div class="fwe-bar"><span class="fwe-dot"></span><span class="fwe-txt">Got feedback?</span>${A("fwe-btn")}Share it${ARROW("#1a1203")}</a></div></div>`,
  },
  {
    id: "react",
    name: "Quick reactions",
    desc: "One-tap emoji row with a rose accent",
    color: "#fb7185",
    css:
      base("fwf", "left:24px;bottom:24px") +
      `
.fwf-bar{display:flex;align-items:center;gap:6px;padding:7px 8px 7px 16px;border-radius:999px;background:rgba(24,24,27,.92);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1px solid rgba(251,113,133,.3);box-shadow:0 14px 36px -12px rgba(0,0,0,.6),0 0 0 4px rgba(251,113,133,.06),inset 0 1px 0 rgba(255,255,255,.08)}
.fwf-txt{margin-right:6px;font-size:13px;font-weight:600;color:#fafafa;white-space:nowrap;letter-spacing:-.01em}
.fwf-e{display:grid;place-items:center;width:34px;height:34px;border-radius:50%;background:rgba(255,255,255,.06);font-size:18px;line-height:1;transition:transform .3s cubic-bezier(.34,1.56,.64,1),background .25s}
.fwf-e:hover{transform:scale(1.22) translateY(-2px);background:rgba(251,113,133,.22)}
.fwf-e:focus-visible{outline:2px solid #fb7185;outline-offset:2px}`,
    html: `<div class="fwf"><div class="fwf-bar"><span class="fwf-txt">How was it?</span>${A("fwf-e", "Loved it")}😍</a>${A("fwf-e", "It was okay")}🙂</a>${A("fwf-e", "Not great")}😕</a></div></div>`,
  },
];

/* turn the widget's HTML into a dependency-free React snippet */
const buildSnippet = (w: Widget, url: string) => {
  const jsx = w.html
    .replace(/__URL__/g, url)
    .replace(/\bclass=/g, "className=")
    .replace(/stroke-width=/g, "strokeWidth=")
    .replace(/stroke-linecap=/g, "strokeLinecap=")
    .replace(/stroke-linejoin=/g, "strokeLinejoin=");
  return `// FeedSenseAI widget: ${w.name}. No dependencies. Paste it anywhere in your React / Next.js layout.
<>
  <style>{\`${w.css}\`}</style>
  ${jsx}
</>`;
};

/* tiny wireframe of a website, so every widget is previewed in context */
const FakeSite = () => (
  <div aria-hidden className="absolute inset-0 p-4">
    <div className="flex items-center justify-between">
      <span className="h-2.5 w-14 rounded bg-white/10" />
      <span className="flex gap-2">
        <span className="h-1.5 w-8 rounded bg-white/[0.07]" />
        <span className="h-1.5 w-8 rounded bg-white/[0.07]" />
        <span className="h-1.5 w-8 rounded bg-white/[0.07]" />
      </span>
    </div>
    <span className="mt-6 block h-3 w-2/5 rounded bg-white/[0.12]" />
    <span className="mt-2.5 block h-2 w-3/5 rounded bg-white/[0.06]" />
    <span className="mt-1.5 block h-2 w-1/2 rounded bg-white/[0.06]" />
    <div className="mt-5 grid grid-cols-3 gap-2.5">
      {[0, 1, 2].map((i) => (
        <span key={i} className="h-10 rounded-lg bg-white/[0.04]" />
      ))}
    </div>
  </div>
);

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
  /* non-empty once a website has been saved: unlocks the widget gallery */
  const [highlightedCode1, setHighlightedCode1] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

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

  const codeToCopy = (websiteId: string) => {
    console.log(websiteId);
    setHighlightedCode1("ready");
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

  const copyCode = async (w: Widget) => {
    try {
      if (lastWebsiteId) {
        await navigator.clipboard.writeText(
          buildSnippet(
            w,
            `https://feedsenseai.vercel.app/integrate/${user!.uid}/${lastWebsiteId}`
          )
        );
        setCopiedId(w.id);
        setTimeout(() => setCopiedId(null), 2000);
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
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[26rem] bg-[radial-gradient(60%_100%_at_50%_0%,rgba(129,140,248,0.09),transparent)]" />
      </div>

        <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-[#09090b]/70 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-10">
            <div className="flex items-center gap-2.5 md:hidden">
              <span className="grid h-8 w-8 place-items-center rounded-lg text-white bg-indigo-500">
                <HiOutlineSparkles size={18} />
              </span>
              <h1 className="text-base font-semibold tracking-tight text-white">
                FeedSense.ai
              </h1>
            </div>
            <p className="hidden text-sm text-zinc-500 md:block">
              Workspace <span className="mx-1.5 text-zinc-700">/</span>
              <span className="text-zinc-200">Integrate</span>
            </p>
            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-3 md:flex">
                <span className="max-w-[10rem] truncate text-sm text-zinc-300">
                  {user?.displayName || "User"}
                </span>
                <span className="grid h-9 w-9 place-items-center rounded-full text-sm font-bold text-white ring-2 ring-white/10 bg-indigo-500">
                  {initial}
                </span>
              </div>
              <button
                aria-label="Open menu"
                onClick={() => setToggle(true)}
                className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-white transition hover:bg-white/10 md:hidden"
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
          <section className="fs-rise">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <h1 className="text-white text-4xl font-semibold leading-[1.05] tracking-tight sm:text-4xl">
                  Integrate Website
                </h1>
                <p className="mt-4  text-zinc-400 ">
                  Add FeedSenseAI to your website in minutes
                </p>
              </div>
              <div className="flex items-center gap-3 self-start rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 backdrop-blur lg:self-auto">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-400/10 text-indigo-300 ring-1 ring-inset ring-indigo-400/25">
                  <FiLayers size={18} />
                </span>
                <div>
                  <p className="text-2xl font-bold tabular-nums leading-none text-white">
                    {websitedata.length}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">websites connected</p>
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
 ? "border-indigo-400/40 bg-indigo-400/[0.07] "
 : done
 ? "border-emerald-400/25 bg-emerald-400/[0.05]"
 : "border-white/[0.08] bg-white/[0.02]"
 }`}
                  >
                    <span
                      className={`grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-bold ${
 done
 ? "bg-emerald-400 text-[#09090b]"
 : active
 ? " text-white bg-indigo-500"
 : "bg-white/[0.06] text-zinc-500"
 }`}
                    >
                      {done ? <FiCheck size={18} /> : i + 1}
                    </span>
                    <div className="min-w-0">
                      <p
                        className={`text-sm font-semibold ${
 done || active ? "text-white" : "text-zinc-500"
 }`}
                      >
                        {s.title}
                      </p>
                      <p className="truncate text-xs text-zinc-500">{s.desc}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>

          {/* ---------- Setup studio: one split panel ---------- */}
          <section className="fs-rise" style={{ animationDelay: "0.1s" }}>
            <div className="rounded-[28px] p-px bg-white/10">
              <div className="grid overflow-hidden rounded-[27px] bg-[#111113] lg:grid-cols-2">
                {/* form side */}
                <div className="relative p-6 sm:p-10">
                  
                  <div className="relative">
                    <div className="flex items-center gap-4">
                      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-indigo-400/10 text-indigo-300 ring-1 ring-inset ring-indigo-400/25">
                        <CiGlobe size={28} />
                      </span>
                      <div>
                        <h2 className="text-xl font-bold text-white">
                          Website Details
                        </h2>
                        <p className="text-sm text-zinc-500">
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
 ? " text-white ring-1 ring-inset ring-indigo-400/40 bg-indigo-400/25"
 : "text-zinc-400 hover:bg-white/[0.05] hover:text-zinc-200"
 }`}
                            >
                              {o.l}
                            </button>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={saveData}
                        className=" w-full rounded-xl px-6 py-4 text-sm font-bold text-white transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-400/30 bg-indigo-500 hover:bg-indigo-400"
                      >
                        Save website
                      </button>
                    </div>
                  </div>
                </div>

                {/* widget side */}
                <div className="relative flex flex-col border-t border-white/[0.07] bg-[#09090b] p-6 sm:p-10 lg:border-l lg:border-t-0">
                  
                  <div className="relative flex items-center gap-4">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-violet-400/10 text-violet-300 ring-1 ring-inset ring-violet-400/25">
                      <IoCodeOutline size={26} />
                    </span>
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        Choose your widget
                      </h2>
                      <p className="text-sm text-zinc-500">
                        Pick a style, copy its code, paste it into your site
                      </p>
                    </div>
                  </div>

                  <div className="relative mt-9 flex flex-1 flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#111113] ">
                    {highlightedCode1.length != 0 ? (
                      <div className="max-h-[36rem] flex-1 space-y-4 overflow-y-auto p-4 [scrollbar-color:#27272a_transparent] [scrollbar-width:thin]">
                        <style>{WIDGETS.map((w) => w.css).join("\n")}</style>
                        {WIDGETS.map((w) => (
                          <div
                            key={w.id}
                            className="overflow-hidden rounded-2xl border border-white/10 bg-[#0e0e11] transition-colors hover:border-white/20"
                          >
                            {/* live preview on a mini website */}
                            <div className="relative h-44 overflow-hidden bg-[#0b0b0e]">
                              <FakeSite />
                              <div
                                className="absolute inset-0"
                                style={{ transform: "translateZ(0)" }}
                                onClick={(e) => e.preventDefault()}
                                dangerouslySetInnerHTML={{
                                  __html: w.html.replace(/__URL__/g, "#"),
                                }}
                              />
                            </div>

                            <div className="flex items-center justify-between gap-3 border-t border-white/[0.07] px-4 py-3">
                              <div className="flex min-w-0 items-center gap-3">
                                <span
                                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                                  style={{
                                    background: w.color,
                                    boxShadow: `0 0 10px ${w.color}`,
                                  }}
                                />
                                <div className="min-w-0">
                                  <p className="truncate text-sm font-semibold text-white">
                                    {w.name}
                                  </p>
                                  <p className="truncate text-xs text-zinc-500">
                                    {w.desc}
                                  </p>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => copyCode(w)}
                                className={`inline-flex shrink-0 items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                                  copiedId === w.id
                                    ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
                                    : "border-white/10 bg-white/[0.05] text-zinc-200 hover:border-indigo-400/40 hover:bg-indigo-400/10 hover:text-indigo-200"
                                }`}
                              >
                                {copiedId === w.id ? (
                                  <FiCheck size={13} />
                                ) : (
                                  <FaRegCopy size={13} />
                                )}
                                {copiedId === w.id ? "Copied" : "Copy code"}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-1 flex-col items-center justify-center px-8 py-16 text-center">
                        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/[0.05] text-zinc-400 ring-1 ring-inset ring-white/10">
                          <IoCodeOutline size={26} />
                        </span>
                        <p className="mt-5 max-w-xs text-sm text-zinc-400">
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
              <h2 className="text-xl font-bold text-white sm:text-2xl">
                Connected websites
              </h2>
              <span className="rounded-full px-3 py-1 text-xs font-semibold text-indigo-200 ring-1 ring-inset ring-indigo-400/25 bg-indigo-400/15">
                {websitedata.length}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {websitedata.map((site, idx) => (
                <GlowCard key={idx} tint="bg-indigo-500/10">
                  <div className="p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-3">
                      <span
                        className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br text-lg font-bold text-white shadow-lg ${
 avatarGradients[idx % avatarGradients.length]
 }`}
                      >
                        {(site.name || "?").charAt(0).toUpperCase()}
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-2.5 py-1 text-xs font-medium text-emerald-300 ring-1 ring-inset ring-emerald-400/25">
                        <span className="relative flex h-1.5 w-1.5">
                          
                          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        </span>
                        {"Active"}
                      </span>
                    </div>

                    <h3 className="mt-5 truncate text-base font-semibold text-white">
                      {site.name}
                    </h3>

                    <button
                      type="button"
                      className="group mt-1 flex max-w-full items-center gap-1.5 text-left text-sm text-indigo-300 transition hover:text-indigo-200"
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
                      <span className="rounded-full bg-white/[0.06] px-3 py-1 text-xs font-medium capitalize text-zinc-300">
                        {site.type || "Website"}
                      </span>
                      <button
                        aria-label={`Delete ${site.name}`}
                        onClick={() => {
                          handleDeleteWebsite(site.name);
                        }}
                        className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-zinc-400 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400"
                      >
                        <BsTrash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                </GlowCard>
              ))}

              {/* add-another tile */}
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="group flex min-h-[13rem] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/15 bg-white/[0.02] text-zinc-400 transition hover:border-indigo-400/40 hover:bg-indigo-400/[0.04] hover:text-indigo-200"
              >
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-white/[0.05] ring-1 ring-inset ring-white/10 transition group-hover:bg-indigo-400/10 group-hover:ring-indigo-400/30">
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