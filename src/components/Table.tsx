"use client";
import Link from "next/link";
import React, { useEffect, useState, useMemo } from "react";
import { CiMenuFries } from "react-icons/ci";
import MobileSideBar from "./MobileSideBar";
import dbService from "@/firebase/utils/db";
import useAuth from "@/hooks/CurrentUser";
import Analytics from "./Analytics";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/Firebase";
import ModelLogout from "./ModelLogout";
import Loader from "./Loader";
import { BiMessageRounded } from "react-icons/bi";
import { GoGraph } from "react-icons/go";
import { CgNotes } from "react-icons/cg";
import { CiGlobe } from "react-icons/ci";
import { FiArrowUpRight, FiPlus, FiClock, FiTrendingUp } from "react-icons/fi";
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


interface WebsiteData {
  name: string;
  url: string;
  type: string;
  image: string;
  feedback?: string[];
}

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

type Tone = "cyan" | "violet" | "emerald" | "amber";

const toneStyles: Record<Tone, { icon: string; glow: string; bar: string }> = {
  cyan: {
    icon: "bg-cyan-400/10 text-cyan-300 ring-cyan-400/25",
    glow: "bg-cyan-400/25",
    bar: "from-cyan-400 to-sky-500",
  },
  violet: {
    icon: "bg-violet-400/10 text-violet-300 ring-violet-400/25",
    glow: "bg-violet-400/25",
    bar: "from-violet-400 to-fuchsia-500",
  },
  emerald: {
    icon: "bg-emerald-400/10 text-emerald-300 ring-emerald-400/25",
    glow: "bg-emerald-400/25",
    bar: "from-emerald-400 to-teal-400",
  },
  amber: {
    icon: "bg-amber-400/10 text-amber-300 ring-amber-400/25",
    glow: "bg-amber-400/25",
    bar: "from-amber-400 to-orange-500",
  },
};

const avatarGradients = [
  "from-cyan-400 to-blue-600",
  "from-violet-400 to-fuchsia-600",
  "from-emerald-400 to-teal-600",
  "from-amber-400 to-orange-600",
  "from-pink-400 to-rose-600",
];

const toNum = (s: string) => Number(s) || 0;

/* gradient-hairline card */
const GlowCard = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`rounded-2xl bg-gradient-to-br from-white/20 via-white/[0.04] to-white/10 p-px ${className}`}
  >
    <div className="relative h-full overflow-hidden rounded-[15px] bg-[#0a0e13]">
      {children}
    </div>
  </div>
);

const StatCard = ({
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
  <GlowCard>
    <div
      className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full blur-3xl ${toneStyles[tone].glow}`}
    />
    <div className="relative p-5">
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-slate-400">{label}</p>
        <div
          className={`grid h-10 w-10 place-items-center rounded-xl ring-1 ring-inset ${toneStyles[tone].icon}`}
        >
          {icon}
        </div>
      </div>
      <p className="mt-2 text-4xl font-semibold tabular-nums tracking-tight text-white">
        {value}
      </p>
      {progress !== undefined ? (
        <div className="mt-4">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.07]">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${toneStyles[tone].bar}`}
              style={{ width: `${Math.max(progress, 3)}%` }}
            />
          </div>
          <p className="mt-2.5 text-xs text-slate-500">{hint}</p>
        </div>
      ) : (
        <p className="mt-[1.65rem] text-xs text-slate-500">{hint}</p>
      )}
    </div>
  </GlowCard>
);

const Table = () => {
  const [websitedata, setWebsitedata] = useState<WebsiteData[]>([]);
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
    const fetchWebsites = async () => {
      if (!user || loading) return;

      try {
        const data = await db1.fetchWebsites(user);
        console.log("Fetched Websites Data from Firestore:", data);

        const transformedData = data.map((item: any) => ({
          name: item.name || "",
          url: item.url || "",
          type: item.type || "",
          image: item.image || "",
          feedback: item.feedback || [],
        }));

        setWebsitedata(transformedData);
      } catch (error) {
        console.error("Error fetching websites:", error);
      }
    };

    fetchWebsites();
  }, [loading, user, db1]);

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
      <style>{`
        @keyframes fs-drift { 0%,100% { transform: translate3d(0,0,0) scale(1); } 50% { transform: translate3d(50px,35px,0) scale(1.15); } }
        @keyframes fs-shine { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        .fs-drift { animation: fs-drift 20s ease-in-out infinite; }
        .fs-shine { background-size: 200% 100%; animation: fs-shine 6s linear infinite; }
        @media (prefers-reduced-motion: reduce) { .fs-drift, .fs-shine { animation: none !important; } }
      `}</style>

      <div className="fs-root relative min-w-0 flex-1 md:ml-64">
        {/* ambient background */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 overflow-hidden md:left-64"
        >
          <div className="fs-drift absolute -right-24 -top-24 h-[28rem] w-[28rem] rounded-full bg-cyan-500/[0.14] blur-[120px]" />
          <div
            className="fs-drift absolute -bottom-40 left-10 h-[30rem] w-[30rem] rounded-full bg-violet-600/[0.14] blur-[130px]"
            style={{ animationDelay: "-9s" }}
          />
          <div
            className="absolute inset-0 opacity-[0.35] [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
            }}
          />
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

            <p className="hidden text-sm text-slate-500 md:block">
              Workspace <span className="mx-1.5 text-slate-700">/</span>
              <span className="text-slate-200">Dashboard</span>
            </p>

            <div className="flex items-center gap-3">
              {plan?.subscription && (
                <span className="hidden rounded-full bg-gradient-to-r from-cyan-400/15 to-violet-500/15 px-3 py-1 text-xs font-semibold capitalize text-cyan-200 ring-1 ring-inset ring-cyan-400/30 sm:inline-block">
                  {plan.subscription}
                </span>
              )}
              <div className="hidden items-center gap-3 md:flex">
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

        <main className="relative z-10 mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:space-y-8 lg:px-10 lg:py-8">
          {/* ---------- Hero ---------- */}
          <section className="rounded-[28px] bg-gradient-to-br from-cyan-400/60 via-white/10 to-violet-500/60 p-px">
            <div className="relative overflow-hidden rounded-[27px] bg-[#070a0f] p-6 sm:p-8 lg:p-10">
              <div className="fs-drift pointer-events-none absolute -left-24 -top-32 h-80 w-80 rounded-full bg-cyan-500/30 blur-[90px]" />
              <div
                className="fs-drift pointer-events-none absolute -bottom-44 -right-24 h-96 w-96 rounded-full bg-violet-600/30 blur-[110px]"
                style={{ animationDelay: "-10s" }}
              />
              <div
                className="pointer-events-none absolute inset-0 opacity-70 [mask-image:radial-gradient(ellipse_at_top_left,black,transparent_70%)]"
                style={{
                  backgroundImage:
                    "radial-gradient(rgba(255,255,255,0.14) 1px, transparent 1px)",
                  backgroundSize: "22px 22px",
                }}
              />

              <div className="relative grid items-center gap-8 lg:grid-cols-5">
                <div className="lg:col-span-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs font-medium text-slate-300 backdrop-blur">
                    <HiOutlineSparkles className="text-cyan-300" size={14} />
                    Welcome back, {firstName}
                  </span>
                  <h1 className="mt-5 bg-gradient-to-r from-white via-white to-cyan-200 bg-clip-text text-4xl font-semibold tracking-tight text-transparent sm:text-5xl lg:text-6xl">
                    Dashboard Overview
                  </h1>
                  <p className="mt-4 max-w-md text-base text-slate-400 sm:text-lg">
                    AI-powered insights from your user feedback
                  </p>
                  <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                    <Link
                      href="/dashboard/integrate"
                      className="fs-shine inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_40px_-10px_rgba(34,211,238,0.8)] transition hover:brightness-110"
                    >
                      <FiPlus size={16} />
                      Connect a website
                    </Link>
                  </div>
                </div>

                {/* glass summary */}
                <div className="lg:col-span-2">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur-xl">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-slate-300">
                        Resolution rate
                      </p>
                      <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-400/10 text-emerald-300 ring-1 ring-inset ring-emerald-400/25">
                        <FiTrendingUp size={16} />
                      </span>
                    </div>
                    <p className="mt-3 text-5xl font-semibold tabular-nums tracking-tight text-white">
                      {allTasks > 0 ? `${rate}%` : "–"}
                    </p>
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"
                        style={{ width: `${rate}%` }}
                      />
                    </div>
                    <p className="mt-3 text-xs text-slate-400">
                      {finished} of {allTasks} tasks completed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ---------- Stats ---------- */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Websites"
              value={infodata.totalWebsites}
              hint="Connected to FeedSense"
              tone="cyan"
              icon={<BiMessageRounded size={20} />}
            />
            <StatCard
              label="Feedbacks"
              value={infodata.totalFeedback}
              hint={`About ${avgFeedback} per website`}
              tone="violet"
              icon={<CgNotes size={20} />}
            />
            <StatCard
              label="Completed"
              value={infodata.totalTasksFinished}
              hint="Tasks resolved"
              tone="emerald"
              icon={<GoGraph size={18} />}
              progress={allTasks > 0 ? (finished / allTasks) * 100 : 0}
            />
            <StatCard
              label="Pending"
              value={infodata.totalIncompleteTasks}
              hint="Tasks waiting on you"
              tone="amber"
              icon={<FiClock size={18} />}
              progress={allTasks > 0 ? (pending / allTasks) * 100 : 0}
            />
          </section>

          {/* ---------- Analytics + websites ---------- */}
          <section className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <Analytics
                totalWebsites={infodata.totalWebsites}
                totalFeedback={infodata.totalFeedback}
                totalTasksFinished={infodata.totalTasksFinished}
                totalIncompleteTasks={infodata.totalIncompleteTasks}
                loading={loading}
              />
            </div>

            <div className="lg:col-span-3">
              {loading ? (
                <div className="grid min-h-[22rem] place-items-center rounded-2xl border border-white/[0.07] bg-white/[0.02] lg:h-full">
                  <Loader message="please wait" />
                </div>
              ) : websitedata?.length === 0 ? (
                <div className="relative flex min-h-[22rem] flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-10 text-center lg:h-full">
                  <div className="pointer-events-none absolute left-1/2 top-1/3 h-40 w-40 -translate-x-1/2 rounded-full bg-cyan-500/20 blur-3xl" />
                  <span className="relative grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400/20 to-violet-500/20 text-cyan-200 ring-1 ring-inset ring-cyan-400/30">
                    <CiGlobe size={34} />
                  </span>
                  <p className="relative mt-5 text-lg font-semibold text-white">
                    No websites connected yet
                  </p>
                  <p className="relative mt-1.5 max-w-xs text-sm text-slate-400">
                    Add your first website to get started
                  </p>
                  <Link
                    href="/dashboard/integrate"
                    className="relative mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_rgba(34,211,238,0.8)] transition hover:brightness-110"
                  >
                    <FiPlus size={16} />
                    Connect a website
                  </Link>
                </div>
              ) : (
                <GlowCard className="lg:h-full">
                  <div className="flex items-center justify-between px-5 pb-3 pt-5 sm:px-6">
                    <h2 className="text-lg font-semibold text-white">
                      Your websites
                    </h2>
                    <span className="rounded-full bg-gradient-to-r from-cyan-400/15 to-violet-500/15 px-3 py-1 text-xs font-semibold text-cyan-200 ring-1 ring-inset ring-cyan-400/25">
                      {websitedata.length}
                    </span>
                  </div>

                  <div className="flex max-h-[26rem] flex-col gap-3 overflow-y-auto px-4 pb-5 [scrollbar-color:#2a3038_transparent] [scrollbar-width:thin] sm:px-5">
                    {websitedata?.map((site, idx) => (
                      <div
                        key={idx}
                        className="group flex items-center justify-between gap-4 rounded-xl border border-white/[0.06] bg-white/[0.03] p-3.5 transition-colors hover:border-cyan-400/30 hover:bg-white/[0.06]"
                      >
                        <div className="flex min-w-0 items-center gap-3.5">
                          <span
                            className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br text-lg font-bold text-white shadow-lg ${
                              avatarGradients[idx % avatarGradients.length]
                            }`}
                          >
                            {(site?.name || "?").charAt(0).toUpperCase()}
                          </span>
                          <div className="min-w-0">
                            <h3 className="truncate text-sm font-semibold text-white">
                              {site?.name}
                            </h3>
                            <p className="truncate text-xs text-slate-500">
                              {site?.url}
                            </p>
                            <div className="mt-2 flex flex-wrap items-center gap-2">
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-2.5 py-0.5 text-xs font-medium text-emerald-300 ring-1 ring-inset ring-emerald-400/25">
                                <span className="relative flex h-1.5 w-1.5">
                                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                </span>
                                Active
                              </span>
                              <span className="text-xs text-slate-500">
                                {site?.feedback?.length ?? 0} feedback
                              </span>
                            </div>
                          </div>
                        </div>
                        <Link
                          aria-label={`Open tasks for ${site?.name}`}
                          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-xs font-medium text-slate-200 transition hover:border-cyan-400/50 hover:bg-cyan-400/10 hover:text-cyan-200"
                          href={{
                            pathname: "/dashboard/tasks",
                            query: {
                              feedback: JSON.stringify(site?.feedback || []),
                              name: site?.name,
                              image: site?.image,
                              Plan: plan?.subscription,
                              TotalFeedback: site?.feedback?.length ?? 0,
                            },
                          }}
                        >
                          <span className="hidden sm:inline">View tasks</span>
                          <FiArrowUpRight size={16} />
                        </Link>
                      </div>
                    ))}
                  </div>
                </GlowCard>
              )}
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default Table;