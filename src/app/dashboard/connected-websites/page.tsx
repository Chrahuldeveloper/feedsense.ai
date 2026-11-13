"use client";
import Link from "next/link";
import React, { useEffect, useState, useMemo } from "react";
import { CiMenuFries } from "react-icons/ci";
import MobileSideBar from "../../../components/MobileSideBar";
import dbService from "@/firebase/utils/db";
import useAuth from "@/hooks/CurrentUser";
import Analytics from "../../../components/Analytics";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase/Firebase";
import ModelLogout from "../../../components/ModelLogout";
import { BiMessageRounded } from "react-icons/bi";
import { GoGraph } from "react-icons/go";
import { CgNotes } from "react-icons/cg";
import {
  FiPlus,
  FiClock,
  FiLifeBuoy,
  FiChevronRight,
} from "react-icons/fi";
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


interface InfoData {
  totalWebsites: string;
  totalFeedback: string;
  totalTasksFinished: string;
  totalIncompleteTasks: string;
}

interface Plan {
  subscription: string;
}

interface User {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
}

/* ---------- UI-only helpers ---------- */

const toNum = (s: string) => Number(s) || 0;

type Tone = "cyan" | "violet" | "emerald" | "amber";
const tones: Record<Tone, { text: string; bar: string; dot: string }> = {
  cyan: { text: "text-cyan-300", bar: "from-cyan-400 to-sky-500", dot: "bg-cyan-400" },
  violet: { text: "text-violet-300", bar: "from-violet-400 to-fuchsia-500", dot: "bg-violet-400" },
  emerald: { text: "text-emerald-300", bar: "from-emerald-400 to-teal-400", dot: "bg-emerald-400" },
  amber: { text: "text-amber-300", bar: "from-amber-400 to-orange-500", dot: "bg-amber-400" },
};

/* gradient-hairline surface */
const Surface = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`rounded-2xl bg-gradient-to-b from-white/[0.16] via-white/[0.04] to-white/[0.03] p-px ${className}`}
  >
    <div className="relative h-full overflow-hidden rounded-[15px] bg-[#0a0d13]">
      {children}
    </div>
  </div>
);

const Kpi = ({
  label,
  value,
  hint,
  tone,
  icon,
  progress,
}: {
  label: string;
  value: string;
  hint: string;
  tone: Tone;
  icon: React.ReactNode;
  progress?: number;
}) => (
  <div className="group relative px-6 py-6">
    <div className="flex items-center justify-between">
      <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
        {label}
      </span>
      <span className={`${tones[tone].text} opacity-80`}>{icon}</span>
    </div>
    <p className="mt-4 text-[2.6rem] font-semibold leading-none tabular-nums tracking-tight text-white">
      {value}
    </p>
    {progress !== undefined ? (
      <div className="mt-5 h-1 w-full overflow-hidden rounded-full bg-white/[0.07]">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${tones[tone].bar}`}
          style={{ width: `${Math.max(progress, 3)}%` }}
        />
      </div>
    ) : (
      <div className="mt-5 h-1 w-8 rounded-full bg-white/10" />
    )}
    <p className="mt-3 text-xs text-slate-500">{hint}</p>
  </div>
);

const Gauge = ({ percent }: { percent: number }) => {
  const r = 52;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative mx-auto h-44 w-44">
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        <defs>
          <linearGradient id="fsd-gauge" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#34d399" />
            <stop offset="1" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="9" />
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke="url(#fsd-gauge)"
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (c * percent) / 100}
          style={{ transition: "stroke-dashoffset 1s cubic-bezier(.2,.7,.2,1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-semibold tabular-nums tracking-tight text-white">
          {percent}%
        </span>
        <span className="mt-0.5 text-[11px] uppercase tracking-[0.14em] text-slate-500">
          resolved
        </span>
      </div>
    </div>
  );
};

const Table = () => {
  const [infodata, setInfodata] = useState<InfoData>({
    totalWebsites: "0",
    totalFeedback: "0",
    totalTasksFinished: "0",
    totalIncompleteTasks: "0",
  });
  const [plan, setPlan] = useState<Plan | null>(null);

  const db1 = useMemo(() => new dbService(), []);

  const { user, loading } = useAuth() as {
    user: User | null;
    loading: boolean;
  };

  useEffect(() => {
    const checkPlan = async () => {
      if (!loading && user) {
        const userDocRef = doc(db, "USERS", user.uid);
        const docSnap = await getDoc(userDocRef);
        const userPlan = docSnap.data()?.subscription;
        console.log(userPlan);
        setPlan({ subscription: userPlan });
      }
    };
    checkPlan();
  }, [loading, user]);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!user || loading) return;

      try {
        const websiteInfoData = await db1.fetchDashboardDetails(user.uid);
        if (websiteInfoData) {
          console.log("Fetched Dashboard Details:", websiteInfoData);
          const newInfo = {
            totalWebsites: websiteInfoData?.totalWebsites?.toString() || "0",
            totalFeedback: websiteInfoData?.totalFeedback?.toString() || "0",
            totalTasksFinished:
              websiteInfoData?.totalTasksFinished?.toString() || "0",
            totalIncompleteTasks:
              websiteInfoData?.totalIncompleteTasks?.toString() || "0",
          };
          setInfodata(newInfo);
        }
      } catch (error) {
        console.error("Error fetching dashboard details:", error);
      }
    };
    fetchDetails();
  }, [loading, user, db1]);

  const [toggle, setToggle] = useState(false);

  const [toggleLogout, setToggleLogout] = useState(false);

  const [greeting, setGreeting] = useState("Welcome back");
  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening");
  }, []);

  const firstName = (user?.displayName || "there").split(" ")[0];
  const initial = (user?.displayName || "U").charAt(0).toUpperCase();

  const finished = toNum(infodata.totalTasksFinished);
  const pending = toNum(infodata.totalIncompleteTasks);
  const allTasks = finished + pending;
  const rate = allTasks > 0 ? Math.round((finished / allTasks) * 100) : 0;
  const sites = toNum(infodata.totalWebsites);
  const avgFeedback =
    sites > 0 ? (toNum(infodata.totalFeedback) / sites).toFixed(1) : "0";

  return (
    <>
      <Theme />
      <div className="fs-root relative min-w-0 flex-1 md:ml-64">
        {/* ambient background */}
        <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden md:left-64">
          <div className="fs-drift-a absolute -left-24 -top-24 h-[420px] w-[420px] rounded-full bg-cyan-500/[0.14] blur-[120px]" />
          <div className="fs-drift-b absolute -right-24 top-10 h-[460px] w-[460px] rounded-full bg-violet-600/[0.15] blur-[130px]" />
          <div className="fs-grid absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_top,black_15%,transparent_65%)]" />
        </div>

        {/* ---------- Top bar ---------- */}
        <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-[#06080b]/70 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-10">
            <div className="flex items-center gap-2.5 md:hidden">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-cyan-400 to-violet-500 text-white">
                <HiOutlineSparkles size={18} />
              </span>
              <h1 className="text-base font-semibold tracking-tight text-white">
                FeedSense.ai
              </h1>
            </div>

            <p className="hidden items-center gap-1.5 text-sm text-slate-500 md:flex">
              Workspace
              <FiChevronRight size={14} className="text-slate-700" />
              <span className="text-slate-200">Dashboard</span>
            </p>

            <div className="flex items-center gap-3">
              {plan?.subscription && (
                <span className="hidden items-center gap-1.5 rounded-full bg-gradient-to-r from-cyan-400/15 to-violet-500/15 px-3 py-1 text-xs font-semibold capitalize text-cyan-200 ring-1 ring-inset ring-cyan-400/30 sm:inline-flex">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
                  {plan.subscription}
                </span>
              )}
              <div className="hidden items-center gap-3 border-l border-white/[0.08] pl-4 md:flex">
                <span className="max-w-[10rem] truncate text-sm text-slate-300">
                  {user?.displayName || "User"}
                </span>
                <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 text-sm font-bold text-white ring-2 ring-white/10">
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
            setToggle={setToggle}
            setToggleLogout={setToggleLogout}
            Page="Home"
          />
        )}

        {toggleLogout && <ModelLogout settoggle={setToggleLogout} />}

        <main className="relative z-10 mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
          {/* ---------- Heading row ---------- */}
          <section className="fs-rise flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium text-cyan-300">
                {greeting}, {firstName}
              </p>
              <h1 className="fs-gradient-text mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Dashboard Overview
              </h1>
              <p className="mt-2 text-slate-400">
                AI-powered insights from your user feedback
              </p>
            </div>
            <Link
              href="/dashboard/integrate"
              className="fs-btn inline-flex items-center justify-center gap-2 self-start rounded-xl px-5 py-3 text-sm font-bold text-[#06080b] shadow-[0_12px_36px_-12px_rgba(34,211,238,0.8)] transition hover:-translate-y-0.5 sm:self-auto"
            >
              <FiPlus size={16} />
              Connect a website
            </Link>
          </section>

          {/* ---------- KPI strip ---------- */}
          <section className="fs-rise" style={{ animationDelay: "0.05s" }}>
            <Surface>
              <div className="grid grid-cols-2 divide-white/[0.07] lg:grid-cols-4 lg:divide-x [&>div:nth-child(n+3)]:border-t [&>div:nth-child(n+3)]:border-white/[0.07] lg:[&>div:nth-child(n+3)]:border-t-0 [&>div:nth-child(even)]:border-l [&>div:nth-child(even)]:border-white/[0.07] lg:[&>div:nth-child(even)]:border-l-0">
                <Kpi
                  label="Websites"
                  value={infodata.totalWebsites}
                  hint="Connected to FeedSense"
                  tone="cyan"
                  icon={<BiMessageRounded size={20} />}
                />
                <Kpi
                  label="Feedbacks"
                  value={infodata.totalFeedback}
                  hint={`About ${avgFeedback} per website`}
                  tone="violet"
                  icon={<CgNotes size={19} />}
                />
                <Kpi
                  label="Completed"
                  value={infodata.totalTasksFinished}
                  hint="Tasks resolved"
                  tone="emerald"
                  icon={<GoGraph size={18} />}
                  progress={allTasks > 0 ? (finished / allTasks) * 100 : 0}
                />
                <Kpi
                  label="Pending"
                  value={infodata.totalIncompleteTasks}
                  hint="Tasks waiting on you"
                  tone="amber"
                  icon={<FiClock size={18} />}
                  progress={allTasks > 0 ? (pending / allTasks) * 100 : 0}
                />
              </div>
            </Surface>
          </section>

          {/* ---------- Analytics + gauge + quick actions ---------- */}
          <section className="fs-rise grid gap-6 lg:grid-cols-3" style={{ animationDelay: "0.1s" }}>
            <div className="lg:col-span-2">
              <Analytics
                totalWebsites={infodata.totalWebsites}
                totalFeedback={infodata.totalFeedback}
                totalTasksFinished={infodata.totalTasksFinished}
                totalIncompleteTasks={infodata.totalIncompleteTasks}
                loading={loading}
              />
            </div>

            <div className="grid gap-6">
              <Surface>
                <div className="p-6">
                  <h2 className="text-sm font-semibold text-white">
                    Resolution rate
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    {finished} of {allTasks} tasks completed
                  </p>
                  <div className="mt-5">
                    <Gauge percent={rate} />
                  </div>
                </div>
              </Surface>

              <Surface>
                <div className="p-2">
                  {[
                    {
                      href: "/dashboard/integrate",
                      icon: <FiPlus size={16} />,
                      t: "Connect a website",
                      d: "Add the snippet to a new site",
                      c: "bg-cyan-400/10 text-cyan-300 ring-cyan-400/25",
                    },
                    {
                      href: "/dashboard/contact",
                      icon: <FiLifeBuoy size={16} />,
                      t: "Get help",
                      d: "Talk to the FeedSense team",
                      c: "bg-violet-400/10 text-violet-300 ring-violet-400/25",
                    },
                  ].map((a) => (
                    <Link
                      key={a.t}
                      href={a.href}
                      className="group flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-white/[0.05]"
                    >
                      <span className={`grid h-9 w-9 place-items-center rounded-lg ring-1 ring-inset ${a.c}`}>
                        {a.icon}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium text-white">{a.t}</span>
                        <span className="block truncate text-xs text-slate-500">{a.d}</span>
                      </span>
                      <FiChevronRight
                        size={16}
                        className="text-slate-600 transition group-hover:translate-x-0.5 group-hover:text-slate-300"
                      />
                    </Link>
                  ))}
                </div>
              </Surface>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default Table;