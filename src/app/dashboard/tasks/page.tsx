"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import MobileSideBar from "@/components/MobileSideBar";
import SideBar from "@/components/SideBar";
import { CiMenuFries } from "react-icons/ci";
import { useSearchParams } from "next/navigation";
import { RxCross2 } from "react-icons/rx";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import dbService from "@/firebase/utils/db";
import useAuth from "@/hooks/CurrentUser";
import Loader from "@/components/Loader";
import { FaRegCircleStop } from "react-icons/fa6";
import ModelLogout from "@/components/ModelLogout";
import { LuBrain } from "react-icons/lu";
import { GoGraph } from "react-icons/go";
import {
  FiCheck,
  FiArrowLeft,
  FiAlertTriangle,
  FiLock,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { AiFillStar } from "react-icons/ai";
import { HiOutlineSparkles, HiOutlineLightBulb } from "react-icons/hi2";
import { IoBugOutline, IoBulbOutline } from "react-icons/io5";

ChartJS.register(
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

interface Feedback {
  emotion: string;
  Rating: number;
  feedback: string;
  parsedFeedback?: { response: string };
}

interface User {
  uid: string;
  displayName: string;
}

interface Bug {
  email: string;
  priority: string;
  tittle: string;
  desc: string;
}

type Feature = Bug;

/* ---------- UI-only helpers ---------- */

const Theme = () => (
  <style>{`
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
.fst-root{font-family:'Inter',ui-sans-serif,system-ui,sans-serif;-webkit-font-smoothing:antialiased}
@keyframes fst-a{0%,100%{transform:translate3d(0,0,0) scale(1)}50%{transform:translate3d(60px,30px,0) scale(1.15)}}
@keyframes fst-b{0%,100%{transform:translate3d(0,0,0) scale(1.1)}50%{transform:translate3d(-50px,-30px,0) scale(.95)}}
@keyframes fst-rise{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
@keyframes fst-blink{0%,100%{opacity:1}50%{opacity:.35}}
.fst-a{animation:fst-a 16s ease-in-out infinite}.fst-b{animation:fst-b 20s ease-in-out infinite}
.fst-rise{animation:fst-rise .6s cubic-bezier(.2,.7,.2,1) both}
.fst-blink{animation:fst-blink 1.6s ease-in-out infinite}
@media (prefers-reduced-motion:reduce){.fst-a,.fst-b,.fst-rise,.fst-blink{animation:none!important}}
`}</style>
);

const Empty = ({ text }: { text: string }) => (
  <div className="flex h-full min-h-[16rem] flex-col items-center justify-center gap-4 text-center">
    <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/[0.04] text-zinc-500 ring-1 ring-inset ring-white/10">
      <FaRegCircleStop size={24} />
    </span>
    <p className="text-sm font-semibold text-zinc-400">{text}</p>
  </div>
);

const priorityTone = (p: string) => {
  const s = p.toLowerCase();
  if (s.includes("high")) return "bg-rose-400/10 text-rose-300 ring-rose-400/25";
  if (s.includes("low")) return "bg-emerald-400/10 text-emerald-300 ring-emerald-400/25";
  return "bg-amber-400/10 text-amber-300 ring-amber-400/25";
};

const emotionTone = (e: string) => {
  const s = (e || "").toLowerCase();
  if (s === "happy") return "bg-emerald-400/10 text-emerald-300 ring-emerald-400/25";
  if (s === "sad") return "bg-rose-400/10 text-rose-300 ring-rose-400/25";
  return "bg-amber-400/10 text-amber-300 ring-amber-400/25";
};

const Page = () => {
  const searchParams = useSearchParams();
  const { user, loading } = useAuth() as {
    user: User | null;
    loading: boolean;
  };
  const [feedbackData, setFeedbackData] = useState<Feedback[]>([]);
  const [HappyCount, setHappyCount] = useState<number>(0);
  const [NeutralCount, setNeutralCount] = useState<number>(0);
  const [SadCount, setSadCount] = useState<number>(0);
  const [isloading, setisloading] = useState<boolean>(false);
  const [toggleLogout, setToggleLogout] = useState(false);
  const [toggle, setToggle] = useState(true);
  const [bugsdata, setbugsdata] = useState<Bug[]>([]);
  const [featuredata, setfeaturedata] = useState<Feature[]>([]);
  const getdata = searchParams?.get("feedback");
  const getName = searchParams?.get("name")!;
  const getPlan = searchParams?.get("Plan")!;
  const db = new dbService();

  useEffect(() => {
    if (getdata) {
      try {
        const data: Feedback[] = JSON.parse(getdata);
        setFeedbackData(data);

        const happy = data.filter(
          (item) => item.emotion.toLowerCase() === "happy"
        ).length;
        const neutral = data.filter(
          (item) => item.emotion.toLowerCase() === "neutral"
        ).length;
        const sad = data.filter(
          (item) => item.emotion.toLowerCase() === "sad"
        ).length;

        setHappyCount(happy);
        setNeutralCount(neutral);
        setSadCount(sad);
      } catch (e) {
        console.error("Error parsing feedback:", e);
      }
    }
  }, [getdata]);

  const analytics = {
    labels: ["Happy", "Neutral", "Sad"],
    datasets: [
      {
        label: "Feedback Summary",
        data: [HappyCount, NeutralCount, SadCount],
        backgroundColor: ["#34d399", "#fbbf24", "#fb7185"],
        borderWidth: 0,
        borderRadius: 6,
        spacing: 4,
        hoverOffset: 4,
      },
    ],
  };

  const getBugsData = async () => {
    try {
      if (user) {
        const getBugs = await db.getBugs(user?.uid.toString(), getName);
        console.log(getBugs);
        setbugsdata(getBugs);
      }
    } catch (error) {
      console.log(error);
      setisloading(false);
    }
  };

  const getsetFeatureData = async () => {
    try {
      if (user) {
        const getFeatures = await db.getFeatures(user?.uid.toString(), getName);
        console.log(getFeatures);
        setfeaturedata(getFeatures);
      }
    } catch (error) {
      console.log(error);
      setisloading(false);
    }
  };

  const bugDelete = async (tittle: string) => {
    try {
      if (user) {
        setisloading(true);
        const updatedBugList = await db.deleteBug(
          user?.uid.toString(),
          getName,
          tittle
        );
        setbugsdata(updatedBugList);
        setisloading(false);
      }
    } catch (error) {
      console.log(error);
      setisloading(false);
    }
  };

  const featureDelete = async (tittle: string) => {
    try {
      if (user) {
        setisloading(true);
        const updatedsetfeatureList = await db.deleteFeature(
          user?.uid.toString(),
          getName,
          tittle
        );
        setfeaturedata(updatedsetfeatureList);
        setisloading(false);
      }
    } catch (error) {
      console.log(error);
      setisloading(false);
    }
  };

  useEffect(() => {
    getBugsData();
    getsetFeatureData();
  }, [user]);

  const total = HappyCount + NeutralCount + SadCount;
  const initial = (user?.displayName || "U").charAt(0).toUpperCase();
  const isBasic = getPlan === "Basic";
  const insightCount = feedbackData.filter(
    (f) => f?.parsedFeedback?.response
  ).length;

  const sentiments = [
    { l: "Happy", v: HappyCount, bar: "from-emerald-400 to-teal-400", dot: "bg-emerald-400" },
    { l: "Neutral", v: NeutralCount, bar: "from-amber-400 to-orange-400", dot: "bg-amber-400" },
    { l: "Sad", v: SadCount, bar: "from-rose-400 to-rose-500", dot: "bg-rose-400" },
  ];

  /* ---------- table state (UI only) ---------- */
  type Tab = "insights" | "feedback" | "bugs" | "features";
  const [tab, setTab] = useState<Tab>("insights");
  const [pageNo, setPageNo] = useState(0);
  const PAGE_SIZE = 8;

  const insightRows = feedbackData
    .map((fb, idx) => ({ fb, idx }))
    .filter((r) => r.fb?.parsedFeedback?.response);

  const counts: Record<Tab, number> = {
    insights: insightRows.length,
    feedback: feedbackData.length,
    bugs: bugsdata?.length ?? 0,
    features: featuredata?.length ?? 0,
  };

  const tabs: { k: Tab; l: string; i: React.ReactNode }[] = [
    { k: "insights", l: "AI Insights", i: <LuBrain size={16} /> },
    { k: "feedback", l: "User Feedback", i: <GoGraph size={15} /> },
    { k: "bugs", l: "Bugs Reported", i: <IoBugOutline size={16} /> },
    { k: "features", l: "Feature Requests", i: <IoBulbOutline size={16} /> },
  ];

  const totalRows = counts[tab];
  const pageCount = Math.max(1, Math.ceil(totalRows / PAGE_SIZE));
  const safePage = Math.min(pageNo, pageCount - 1);
  const start = safePage * PAGE_SIZE;
  const end = start + PAGE_SIZE;

  const thClass =
    "px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500";
  const tdClass = "px-5 py-4 align-top";

  const reporter = (i: Bug) => (
    <div className="flex items-center gap-3">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-bold text-white bg-indigo-500">
        {i.email[0].toUpperCase()}
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-zinc-200">
          {i.email.split("@")[0]}
        </p>
        <p className="truncate text-xs text-zinc-500">{i.email}</p>
      </div>
    </div>
  );

  const priorityCell = (i: Bug) => (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${priorityTone(
 i.priority
 )}`}
    >
      <FiAlertTriangle size={12} />
      {i.priority.replace(" Priority", "") || "Medium"}
    </span>
  );

  const statusCell = (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-300 ring-1 ring-inset ring-rose-400/25">
      <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
      Open
    </span>
  );

  return (
    <>
      <Theme />
      {toggle && (
        <MobileSideBar
          setToggle={setToggle}
          setToggleLogout={setToggleLogout}
          Page="Home"
        />
      )}
      {isloading && <Loader message="Deleting..." />}

      <div className="fst-root relative flex min-h-screen w-full overflow-x-clip bg-[#09090b] text-zinc-200">
        <SideBar page="Your websites" />

        <div className="relative min-w-0 flex-1 md:ml-64">
          {/* ambient background */}
          <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden md:left-64">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[26rem] bg-[radial-gradient(60%_100%_at_50%_0%,rgba(129,140,248,0.09),transparent)]" />
      </div>

          {/* top bar */}
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
                Dashboard <span className="mx-1.5 text-zinc-700">/</span> Your Websites <span className="mx-1.5 text-zinc-700">/</span>
                <span className="text-zinc-200">{getName || "Insights"}</span>
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

          <main className="relative z-10 mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
            {/* hero */}
            <section className="fst-rise">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
              >
                <FiArrowLeft size={16} />
                Back to dashboard
              </Link>
              <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-2xl">
                  <h1 className=" text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl text-white">
                    AI-Powered Insights
                  </h1>
                  <p className="mt-4 text-base text-zinc-400">
                    Unlock the power of artificial intelligence to understand
                    your users better and make data-driven decisions
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                  {getName && (
                    <span className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-semibold text-white">
                      {getName}
                    </span>
                  )}
                  {getPlan && getPlan !== "undefined" && (
                    <span className="rounded-full px-4 py-2 text-sm font-semibold capitalize text-indigo-200 ring-1 ring-inset ring-indigo-400/30 bg-indigo-400/15">
                      {getPlan} plan
                    </span>
                  )}
                </div>
              </div>
            </section>

            {/* sentiment overview */}
            <section className="fst-rise grid gap-5 lg:grid-cols-5" style={{ animationDelay: "0.08s" }}>
              <div className="rounded-3xl p-px lg:col-span-2 bg-white/10">
                <div className="relative h-full overflow-hidden rounded-[23px] bg-[#111113] p-6 sm:p-8">
                  
                  <h2 className="relative text-lg font-bold text-white">
                    Sentiment overview
                  </h2>
                  <p className="relative mt-1 text-sm text-zinc-500">
                    How your users feel
                  </p>
                  <div className="relative mx-auto mt-6 aspect-square w-full max-w-[220px]">
                    {HappyCount > 0 && NeutralCount > 0 && SadCount > 0 ? (
                      <Doughnut
                        data={analytics}
                        options={{ cutout: "74%", plugins: { legend: { display: false } } }}
                      />
                    ) : (
                      <div className="absolute inset-0 rounded-full border-[14px] border-white/[0.06]" />
                    )}
                    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-semibold tabular-nums text-white">
                        {total}
                      </span>
                      <span className="text-xs text-zinc-500">responses</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:col-span-3">
                {/* sentiment bars */}
                <div className="rounded-3xl border border-white/[0.08] p-6 sm:col-span-2 sm:p-8 bg-white/[0.03]">
                  <div className="space-y-5">
                    {sentiments.map((s) => (
                      <div key={s.l} className="flex items-center gap-4 text-sm">
                        <span className="flex w-20 items-center gap-2 text-zinc-300">
                          <span className={`h-2.5 w-2.5 rounded-full ${s.dot}`} />
                          {s.l}
                        </span>
                        <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-white/[0.07]">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${s.bar}`}
                            style={{
                              width: `${total > 0 ? Math.max((s.v / total) * 100, s.v > 0 ? 4 : 0) : 0}%`,
                            }}
                          />
                        </div>
                        <span className="w-8 text-right font-semibold tabular-nums text-white">
                          {s.v}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {[
                  { l: "AI insights", v: insightCount, c: "text-indigo-300 bg-indigo-400/10 ring-indigo-400/25", i: <LuBrain size={18} /> },
                  { l: "Open bugs", v: bugsdata?.length ?? 0, c: "text-rose-300 bg-rose-400/10 ring-rose-400/25", i: <IoBugOutline size={18} /> },
                ].map((x) => (
                  <div
                    key={x.l}
                    className="flex items-center justify-between rounded-3xl border border-white/[0.08] p-6 bg-white/[0.03]"
                  >
                    <div>
                      <p className="text-sm text-zinc-400">{x.l}</p>
                      <p className="mt-1 text-3xl font-semibold tabular-nums text-white">
                        {x.v}
                      </p>
                    </div>
                    <span className={`grid h-11 w-11 place-items-center rounded-xl ring-1 ring-inset ${x.c}`}>
                      {x.i}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* ---------- one proper data table ---------- */}
            <section className="fst-rise" style={{ animationDelay: "0.14s" }}>
              <div className="rounded-3xl p-px bg-white/10">
                <div className="overflow-hidden rounded-[23px] bg-[#111113]">
                  {/* toolbar */}
                  <div className="flex flex-col gap-4 border-b border-white/[0.07] p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
                    <div
                      role="tablist"
                      className="flex gap-1.5 overflow-x-auto rounded-2xl border border-white/[0.07] bg-black/30 p-1.5 [scrollbar-width:none]"
                    >
                      {tabs.map((x) => {
                        const active = tab === x.k;
                        return (
                          <button
                            key={x.k}
                            role="tab"
                            aria-selected={active}
                            onClick={() => {
                              setTab(x.k);
                              setPageNo(0);
                            }}
                            className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
 active
 ? " text-white ring-1 ring-inset ring-indigo-400/40 bg-indigo-400/20"
 : "text-zinc-400 hover:bg-white/[0.05] hover:text-zinc-200"
 }`}
                          >
                            {x.i}
                            {x.l}
                            <span
                              className={`rounded-full px-2 py-0.5 text-[11px] tabular-nums ${
 active
 ? "bg-white/15 text-white"
 : "bg-white/[0.07] text-zinc-400"
 }`}
                            >
                              {counts[x.k]}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-zinc-500">
                      {tab === "insights" && (
                        <span className="inline-flex items-center gap-2 rounded-full bg-indigo-400/10 px-3 py-1.5 font-medium text-indigo-300 ring-1 ring-inset ring-indigo-400/25">
                          <span className=" h-1.5 w-1.5 rounded-full bg-indigo-300" />
                          AI analyzing...
                        </span>
                      )}
                      <span className="tabular-nums">{totalRows} records</span>
                    </div>
                  </div>

                  {tab === "insights" && isBasic && insightCount > 0 && (
                    <Link
                      href="/plans"
                      className="flex items-center gap-3 border-b border-violet-400/20 bg-violet-400/[0.08] px-5 py-3 text-sm text-violet-200 transition hover:bg-violet-400/15"
                    >
                      <FiLock size={16} />
                      Upgrade to Pro to read and act on AI insights
                    </Link>
                  )}

                  {/* table */}
                  <div className="max-h-[36rem] overflow-auto [scrollbar-color:#27272a_transparent] [scrollbar-width:thin]">
                    <table className="w-full min-w-[780px] border-collapse text-sm">
                      <thead className="sticky top-0 z-10 bg-[#141416]/95 backdrop-blur">
                        {tab === "insights" && (
                          <tr className="border-b border-white/[0.07]">
                            <th className={`${thClass} w-14`}>#</th>
                            <th className={thClass}>AI insight</th>
                            <th className={thClass}>Source feedback</th>
                            <th className={thClass}>Sentiment</th>
                            <th className={`${thClass} text-right`}>Actions</th>
                          </tr>
                        )}
                        {tab === "feedback" && (
                          <tr className="border-b border-white/[0.07]">
                            <th className={`${thClass} w-14`}>#</th>
                            <th className={thClass}>Sentiment</th>
                            <th className={thClass}>Rating</th>
                            <th className={thClass}>Feedback</th>
                          </tr>
                        )}
                        {(tab === "bugs" || tab === "features") && (
                          <tr className="border-b border-white/[0.07]">
                            <th className={thClass}>Priority</th>
                            <th className={thClass}>Reporter</th>
                            <th className={thClass}>Title</th>
                            <th className={thClass}>Description</th>
                            <th className={thClass}>Status</th>
                            <th className={`${thClass} text-right`}>Action</th>
                          </tr>
                        )}
                      </thead>

                      <tbody className="divide-y divide-white/[0.05]">
                        {totalRows === 0 && (
                          <tr>
                            <td colSpan={6}>
                              <Empty
                                text={
                                  tab === "insights"
                                    ? "No Analysis Yet"
                                    : tab === "feedback"
                                    ? "No Feedbacks Yet"
                                    : tab === "bugs"
                                    ? "No Bugs Reported"
                                    : "No Feature Requests"
                                }
                              />
                            </td>
                          </tr>
                        )}

                        {/* AI insights */}
                        {tab === "insights" &&
                          insightRows.slice(start, end).map(({ fb, idx }, n) => (
                            <tr
                              key={idx}
                              className="group transition-colors hover:bg-white/[0.035]"
                            >
                              <td className={`${tdClass} text-xs tabular-nums text-zinc-600`}>
                                {String(start + n + 1).padStart(2, "0")}
                              </td>
                              <td className={`${tdClass} max-w-md`}>
                                <div className="flex items-start gap-3">
                                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-amber-400/15 text-amber-300 ring-1 ring-inset ring-amber-400/25">
                                    <HiOutlineLightBulb size={18} />
                                  </span>
                                  <p
                                    className={`line-clamp-3 leading-6 text-zinc-200 ${
 getPlan === "Basic" ? "select-none blur-sm" : ""
 }`}
                                  >
                                    {fb.parsedFeedback!.response.replace(/"/g, "")}
                                  </p>
                                </div>
                              </td>
                              <td className={`${tdClass} max-w-[16rem]`}>
                                <p className="line-clamp-2 text-zinc-400">{fb.feedback}</p>
                              </td>
                              <td className={tdClass}>
                                {fb.emotion ? (
                                  <span
                                    className={`inline-block rounded-full px-3 py-1 text-xs font-semibold capitalize ring-1 ring-inset ${emotionTone(
 fb.emotion
 )}`}
                                  >
                                    {fb.emotion}
                                  </span>
                                ) : (
                                  <span className="text-zinc-600">–</span>
                                )}
                              </td>
                              <td className={`${tdClass} text-right`}>
                                <div className="inline-flex items-center gap-1.5">
                                  <RxCross2
                                    size={34}
                                    className={`cursor-pointer rounded-lg border border-white/10 p-2 text-rose-400 transition hover:border-rose-400/40 hover:bg-rose-500/15 ${
 getPlan === "Basic" ? "cursor-not-allowed opacity-50" : ""
 }`}
                                    onClick={() => {
                                      if (getPlan !== "Basic") {
                                        setFeedbackData((prev) =>
                                          prev.filter((_, i) => i !== idx)
                                        );
                                      }
                                    }}
                                  />
                                  <FiCheck
                                    size={34}
                                    className={`cursor-pointer rounded-lg border border-white/10 p-2 text-emerald-400 transition hover:border-emerald-400/40 hover:bg-emerald-500/15 ${
 getPlan === "Basic" ? "cursor-not-allowed opacity-50" : ""
 }`}
                                    onClick={async () => {
                                      if (getPlan === "Basic") return;
                                      try {
                                        setisloading(true);
                                        if (fb.parsedFeedback?.response) {
                                          await db.handleStatusChange(
                                            user!,
                                            "Completed",
                                            fb.feedback,
                                            getName
                                          );
                                        }

                                        setFeedbackData((prev) =>
                                          prev.filter((_, i) => i !== idx)
                                        );
                                      } catch (error) {
                                        console.error("Error updating status:", error);
                                      } finally {
                                        setisloading(false);
                                      }
                                    }}
                                  />
                                </div>
                              </td>
                            </tr>
                          ))}

                        {/* user feedback */}
                        {tab === "feedback" &&
                          feedbackData.slice(start, end).map((fb, n) => (
                            <tr
                              key={start + n}
                              className="transition-colors hover:bg-white/[0.035]"
                            >
                              <td className={`${tdClass} text-xs tabular-nums text-zinc-600`}>
                                {String(start + n + 1).padStart(2, "0")}
                              </td>
                              <td className={tdClass}>
                                {fb.emotion ? (
                                  <span
                                    className={`inline-block rounded-full px-3 py-1 text-xs font-semibold capitalize ring-1 ring-inset ${emotionTone(
 fb.emotion
 )}`}
                                  >
                                    {fb.emotion}
                                  </span>
                                ) : (
                                  <span className="text-zinc-600">–</span>
                                )}
                              </td>
                              <td className={tdClass}>
                                {fb.Rating > 0 ? (
                                  <span className="inline-flex items-center gap-1 whitespace-nowrap font-semibold text-amber-300">
                                    <AiFillStar size={16} />
                                    {fb.Rating}
                                    <span className="font-normal text-zinc-500">/5</span>
                                  </span>
                                ) : (
                                  <span className="text-zinc-600">–</span>
                                )}
                              </td>
                              <td className={`${tdClass} w-full max-w-xl leading-6 text-zinc-300`}>
                                {fb.feedback}
                              </td>
                            </tr>
                          ))}

                        {/* bugs */}
                        {tab === "bugs" &&
                          bugsdata?.slice(start, end).map((i, id) => (
                            <tr
                              key={start + id}
                              className="transition-colors hover:bg-white/[0.035]"
                            >
                              <td className={tdClass}>{priorityCell(i)}</td>
                              <td className={tdClass}>{reporter(i)}</td>
                              <td className={`${tdClass} font-semibold text-white`}>
                                {i.tittle}
                              </td>
                              <td className={`${tdClass} max-w-xs`}>
                                <p className="line-clamp-2 leading-6 text-zinc-400">{i.desc}</p>
                              </td>
                              <td className={tdClass}>{statusCell}</td>
                              <td className={`${tdClass} text-right`}>
                                <button
                                  onClick={() => {
                                    bugDelete(i.tittle);
                                  }}
                                  className="rounded-lg border border-rose-400/30 bg-rose-500/10 px-4 py-2 text-xs font-semibold text-rose-300 transition hover:bg-rose-500 hover:text-white"
                                >
                                  Close
                                </button>
                              </td>
                            </tr>
                          ))}

                        {/* feature requests */}
                        {tab === "features" &&
                          featuredata?.slice(start, end).map((i, id) => (
                            <tr
                              key={start + id}
                              className="transition-colors hover:bg-white/[0.035]"
                            >
                              <td className={tdClass}>{priorityCell(i)}</td>
                              <td className={tdClass}>{reporter(i)}</td>
                              <td className={`${tdClass} font-semibold text-white`}>
                                {i.tittle}
                              </td>
                              <td className={`${tdClass} max-w-xs`}>
                                <p className="line-clamp-2 leading-6 text-zinc-400">{i.desc}</p>
                              </td>
                              <td className={tdClass}>{statusCell}</td>
                              <td className={`${tdClass} text-right`}>
                                <button
                                  onClick={() => {
                                    featureDelete(i.tittle);
                                  }}
                                  className="rounded-lg border border-rose-400/30 bg-rose-500/10 px-4 py-2 text-xs font-semibold text-rose-300 transition hover:bg-rose-500 hover:text-white"
                                >
                                  Close
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>

                  {/* footer / pagination */}
                  <div className="flex items-center justify-between gap-4 border-t border-white/[0.07] bg-white/[0.015] px-5 py-3.5 text-xs text-zinc-500">
                    <span className="tabular-nums">
                      {totalRows === 0
                        ? "No records"
                        : `Showing ${start + 1}–${Math.min(end, totalRows)} of ${totalRows}`}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        aria-label="Previous page"
                        disabled={safePage === 0}
                        onClick={() => setPageNo(safePage - 1)}
                        className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-zinc-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-35"
                      >
                        <FiChevronLeft size={16} />
                      </button>
                      <span className="min-w-[4.5rem] text-center tabular-nums text-zinc-400">
                        Page {safePage + 1} / {pageCount}
                      </span>
                      <button
                        aria-label="Next page"
                        disabled={safePage >= pageCount - 1}
                        onClick={() => setPageNo(safePage + 1)}
                        className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-zinc-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-35"
                      >
                        <FiChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>

      {toggleLogout && <ModelLogout settoggle={setToggleLogout} />}
    </>
  );
};

const PageWithSuspense = () => (
  <Suspense fallback={<Loader message="Loading" />}>
    <Page />
  </Suspense>
);

export default PageWithSuspense;