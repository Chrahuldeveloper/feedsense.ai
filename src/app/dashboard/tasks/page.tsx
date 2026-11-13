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
import { FiCheck, FiArrowLeft, FiAlertTriangle, FiLock } from "react-icons/fi";
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
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
.fst-root{font-family:'Plus Jakarta Sans',ui-sans-serif,system-ui,sans-serif;-webkit-font-smoothing:antialiased}
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

const Panel = ({
  icon,
  title,
  count,
  right,
  children,
  tone = "cyan",
}: {
  icon: React.ReactNode;
  title: string;
  count?: number;
  right?: React.ReactNode;
  children: React.ReactNode;
  tone?: "cyan" | "violet" | "rose" | "amber";
}) => {
  const tones = {
    cyan: "bg-cyan-400/10 text-cyan-300 ring-cyan-400/25",
    violet: "bg-violet-400/10 text-violet-300 ring-violet-400/25",
    rose: "bg-rose-400/10 text-rose-300 ring-rose-400/25",
    amber: "bg-amber-400/10 text-amber-300 ring-amber-400/25",
  };
  return (
    <div className="fst-rise rounded-3xl bg-gradient-to-b from-white/[0.18] via-white/[0.05] to-white/[0.03] p-px">
      <div className="flex h-[34rem] flex-col overflow-hidden rounded-[23px] bg-[#0a0d13]">
        <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className={`grid h-10 w-10 place-items-center rounded-xl ring-1 ring-inset ${tones[tone]}`}>
              {icon}
            </span>
            <h2 className="font-semibold text-white">{title}</h2>
            {count !== undefined && (
              <span className="rounded-full bg-white/[0.07] px-2.5 py-0.5 text-xs font-semibold tabular-nums text-slate-300">
                {count}
              </span>
            )}
          </div>
          {right}
        </div>
        <div className="flex-1 overflow-y-auto p-4 [scrollbar-color:#2a3038_transparent] [scrollbar-width:thin] sm:p-5">
          {children}
        </div>
      </div>
    </div>
  );
};

const Empty = ({ text }: { text: string }) => (
  <div className="flex h-full min-h-[16rem] flex-col items-center justify-center gap-4 text-center">
    <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/[0.04] text-slate-500 ring-1 ring-inset ring-white/10">
      <FaRegCircleStop size={24} />
    </span>
    <p className="text-sm font-semibold text-slate-400">{text}</p>
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
    { l: "Sad", v: SadCount, bar: "from-rose-400 to-pink-500", dot: "bg-rose-400" },
  ];

  /* shared renderer for bug + feature cards */
  const IssueCard = ({
    i,
    kind,
    onClose,
  }: {
    i: Bug;
    kind: "Bug" | "Feature";
    onClose: () => void;
  }) => (
    <div className="mb-4 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 transition-colors hover:border-white/20">
      <div className="flex items-center justify-between gap-3">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${priorityTone(
            i.priority
          )}`}
        >
          <FiAlertTriangle size={12} />
          {i.priority.replace(" Priority", "") || "Medium"}
        </span>
        <div className="flex gap-2">
          <span className="rounded-full bg-rose-500/15 px-3 py-1 text-xs font-semibold text-rose-300">
            Open
          </span>
          <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300">
            {kind}
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-600 font-bold text-white">
          {i.email[0].toUpperCase()}
        </span>
        <h3 className="truncate text-sm font-semibold text-slate-200">
          {i.email.split("@")[0]}
        </h3>
      </div>

      <h4 className="mt-4 text-lg font-bold text-white">{i.tittle}</h4>
      <p className="mt-2 text-sm leading-6 text-slate-400">{i.desc}</p>

      <div className="mt-5 flex justify-end">
        <button
          onClick={onClose}
          className="rounded-lg border border-rose-400/30 bg-rose-500/10 px-4 py-2 text-xs font-semibold text-rose-300 transition hover:bg-rose-500 hover:text-white"
        >
          Close
        </button>
      </div>
    </div>
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

      <div className="fst-root relative flex min-h-screen w-full overflow-x-clip bg-[#06080b] text-slate-200">
        <SideBar page="Home" />

        <div className="relative min-w-0 flex-1 md:ml-64">
          {/* ambient background */}
          <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden md:left-64">
            <div className="fst-a absolute -left-24 -top-24 h-[420px] w-[420px] rounded-full bg-cyan-500/20 blur-[110px]" />
            <div className="fst-b absolute -right-24 top-10 h-[460px] w-[460px] rounded-full bg-violet-600/20 blur-[120px]" />
            <div
              className="absolute inset-0 opacity-70 [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)",
                backgroundSize: "44px 44px",
              }}
            />
          </div>

          {/* top bar */}
          <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-[#06080b]/70 backdrop-blur-xl">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-10">
              <div className="flex items-center gap-2.5 md:hidden">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-cyan-400 to-violet-500 text-[#06080b]">
                  <HiOutlineSparkles size={18} />
                </span>
                <h1 className="text-base font-semibold tracking-tight text-white">
                  FeedSense.ai
                </h1>
              </div>
              <p className="hidden text-sm text-slate-500 md:block">
                Dashboard <span className="mx-1.5 text-slate-700">/</span>
                <span className="text-slate-200">{getName || "Insights"}</span>
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
                className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
              >
                <FiArrowLeft size={16} />
                Back to dashboard
              </Link>
              <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-2xl">
                  <h1 className="bg-gradient-to-r from-white via-cyan-200 to-violet-300 bg-clip-text text-4xl font-extrabold leading-[1.05] tracking-tight text-transparent sm:text-5xl">
                    AI-Powered Insights
                  </h1>
                  <p className="mt-4 text-base text-slate-400">
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
                    <span className="rounded-full bg-gradient-to-r from-cyan-400/15 to-violet-500/15 px-4 py-2 text-sm font-semibold capitalize text-cyan-200 ring-1 ring-inset ring-cyan-400/30">
                      {getPlan} plan
                    </span>
                  )}
                </div>
              </div>
            </section>

            {/* sentiment overview */}
            <section className="fst-rise grid gap-5 lg:grid-cols-5" style={{ animationDelay: "0.08s" }}>
              <div className="rounded-3xl bg-gradient-to-br from-cyan-400/40 via-white/10 to-violet-500/40 p-px lg:col-span-2">
                <div className="relative h-full overflow-hidden rounded-[23px] bg-[#0a0d13] p-6 sm:p-8">
                  <div className="pointer-events-none absolute -left-16 -top-16 h-52 w-52 rounded-full bg-cyan-500/20 blur-3xl" />
                  <h2 className="relative text-lg font-bold text-white">
                    Sentiment overview
                  </h2>
                  <p className="relative mt-1 text-sm text-slate-500">
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
                      <span className="text-4xl font-extrabold tabular-nums text-white">
                        {total}
                      </span>
                      <span className="text-xs text-slate-500">responses</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:col-span-3">
                {/* sentiment bars */}
                <div className="rounded-3xl border border-white/[0.08] bg-gradient-to-b from-white/[0.05] to-white/[0.01] p-6 sm:col-span-2 sm:p-8">
                  <div className="space-y-5">
                    {sentiments.map((s) => (
                      <div key={s.l} className="flex items-center gap-4 text-sm">
                        <span className="flex w-20 items-center gap-2 text-slate-300">
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
                  { l: "AI insights", v: insightCount, c: "text-cyan-300 bg-cyan-400/10 ring-cyan-400/25", i: <LuBrain size={18} /> },
                  { l: "Open bugs", v: bugsdata?.length ?? 0, c: "text-rose-300 bg-rose-400/10 ring-rose-400/25", i: <IoBugOutline size={18} /> },
                ].map((x) => (
                  <div
                    key={x.l}
                    className="flex items-center justify-between rounded-3xl border border-white/[0.08] bg-gradient-to-b from-white/[0.05] to-white/[0.01] p-6"
                  >
                    <div>
                      <p className="text-sm text-slate-400">{x.l}</p>
                      <p className="mt-1 text-3xl font-extrabold tabular-nums text-white">
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

            {/* panels */}
            <section className="grid gap-5 xl:grid-cols-2">
              {/* AI insights */}
              <Panel
                icon={<LuBrain size={20} />}
                title="AI Insights"
                count={insightCount}
                right={
                  <span className="inline-flex items-center gap-2 rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-300 ring-1 ring-inset ring-cyan-400/25">
                    <span className="fst-blink h-1.5 w-1.5 rounded-full bg-cyan-300" />
                    AI analyzing...
                  </span>
                }
              >
                {isBasic && insightCount > 0 && (
                  <Link
                    href="/plans"
                    className="mb-4 flex items-center gap-3 rounded-xl border border-violet-400/25 bg-violet-400/[0.08] px-4 py-3 text-sm text-violet-200 transition hover:bg-violet-400/15"
                  >
                    <FiLock size={16} />
                    Upgrade to Pro to read and act on AI insights
                  </Link>
                )}
                {feedbackData.length > 0 ? (
                  feedbackData.map((fb, idx) =>
                    fb?.parsedFeedback?.response ? (
                      <div
                        key={idx}
                        className={`mb-4 flex items-start gap-4 rounded-2xl border border-amber-400/20 bg-gradient-to-br from-amber-400/[0.08] to-transparent p-5 ${
                          getPlan === "Basic"
                            ? "cursor-not-allowed"
                            : "cursor-pointer"
                        }`}
                      >
                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-amber-400/15 text-amber-300 ring-1 ring-inset ring-amber-400/25">
                          <HiOutlineLightBulb size={22} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p
                            className={`text-sm leading-6 text-slate-200 ${
                              getPlan === "Basic" ? "blur-sm" : ""
                            }`}
                          >
                            {fb.parsedFeedback.response.replace(/"/g, "")}
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          <RxCross2
                            size={36}
                            className="cursor-pointer rounded-full p-2 text-rose-400 transition hover:bg-rose-500/20"
                            onClick={() => {
                              if (getPlan !== "Basic") {
                                setFeedbackData((prev) =>
                                  prev.filter((_, i) => i !== idx)
                                );
                              }
                            }}
                          />
                          <FiCheck
                            size={36}
                            className={`cursor-pointer rounded-full p-2 text-emerald-400 transition hover:bg-emerald-500/20 ${
                              getPlan === "Basic"
                                ? "cursor-not-allowed opacity-50"
                                : ""
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
                      </div>
                    ) : null
                  )
                ) : (
                  <Empty text="No Analysis Yet" />
                )}
              </Panel>

              {/* user feedback */}
              <Panel
                icon={<GoGraph size={18} />}
                title="User Feedback"
                count={feedbackData.length}
                tone="violet"
                right={null}
              >
                {feedbackData.length > 0 ? (
                  feedbackData.map((fb, idx) => (
                    <div
                      key={idx}
                      className="mb-4 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 transition-colors hover:border-white/20"
                    >
                      <div className="flex items-center justify-between gap-3">
                        {fb.emotion ? (
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ring-1 ring-inset ${emotionTone(
                              fb.emotion
                            )}`}
                          >
                            {fb.emotion}
                          </span>
                        ) : (
                          <span />
                        )}
                        {fb.Rating > 0 && (
                          <span className="inline-flex items-center gap-1 text-sm font-semibold text-amber-300">
                            <AiFillStar size={16} />
                            {fb.Rating}
                            <span className="font-normal text-slate-500">/5</span>
                          </span>
                        )}
                      </div>
                      <p className="mt-3 text-sm leading-6 text-slate-300">
                        {fb.feedback}
                      </p>
                    </div>
                  ))
                ) : (
                  <Empty text="No Feedbacks Yet" />
                )}
              </Panel>

              {/* bugs */}
              <Panel
                icon={<IoBugOutline size={20} />}
                title="Bugs Reported"
                count={bugsdata?.length ?? 0}
                tone="rose"
              >
                {bugsdata?.length > 0 ? (
                  bugsdata?.map((i, id) => (
                    <IssueCard
                      key={id}
                      i={i}
                      kind="Bug"
                      onClose={() => {
                        bugDelete(i.tittle);
                      }}
                    />
                  ))
                ) : (
                  <Empty text="No Bugs Reported" />
                )}
              </Panel>

              {/* features */}
              <Panel
                icon={<IoBulbOutline size={20} />}
                title="Feature Requests"
                count={featuredata?.length ?? 0}
                tone="amber"
              >
                {featuredata?.length > 0 ? (
                  featuredata?.map((i, id) => (
                    <IssueCard
                      key={id}
                      i={i}
                      kind="Feature"
                      onClose={() => {
                        featureDelete(i.tittle);
                      }}
                    />
                  ))
                ) : (
                  <Empty text="No Feature Requests" />
                )}
              </Panel>
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