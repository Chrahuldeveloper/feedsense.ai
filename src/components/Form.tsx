"use client";
import dbService from "@/firebase/utils/db";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import {
  IoHappyOutline,
  IoSadOutline,
  IoBugOutline,
  IoChatbubbleEllipsesOutline,
  IoBulbOutline,
  IoMailOutline,
} from "react-icons/io5";
import { TbMoodSadDizzy } from "react-icons/tb";
import { IoIosStarOutline, IoMdStar } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTelegramPlane } from "react-icons/fa";
import { HiOutlineSparkles } from "react-icons/hi2";

/* TODO: point this at your marketing site */
const BRAND_URL = "#";

interface Feedback {
  emotion: string;
  feedback: string;
  Rating: number;
}

interface Emotion {
  title: string;
  emoji: JSX.Element;
  active: string;
}

interface Bug {
  email: string;
  priority: string;
  tittle: string;
  desc: string;
}

type Feature = Bug;

/* UI tokens */
const fieldClass =
  "w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none transition hover:border-white/20 focus:border-cyan-400/60 focus:bg-white/[0.05] focus:ring-4 focus:ring-cyan-400/10";
const labelClass = "mb-2 block text-[13px] font-medium text-slate-300";

const priorities = [
  {
    name: "Low Priority",
    short: "Low",
    dot: "bg-emerald-400",
    active: "border-emerald-400/50 bg-emerald-400/10 text-white",
  },
  {
    name: "Medium Priority",
    short: "Medium",
    dot: "bg-amber-400",
    active: "border-amber-400/50 bg-amber-400/10 text-white",
  },
  {
    name: "High Priority",
    short: "High",
    dot: "bg-rose-400",
    active: "border-rose-400/50 bg-rose-400/10 text-white",
  },
];
const DEFAULT_PRIORITY = "Medium Priority";
const ratingLabels = ["Poor", "Fair", "Good", "Great", "Excellent"];
const stages = [
  "Reading your feedback",
  "Detecting the sentiment",
  "Sending it to the team",
];
/* minimum time the sending animation stays up; set to 0 to disable */
const MIN_SEND_MS = 1700;

const emptyIssue: Bug = {
  email: "",
  priority: DEFAULT_PRIORITY,
  tittle: "",
  desc: "",
};

const Form = () => {
  const { userID, websiteID } = useParams();
  const cardRef = useRef<HTMLDivElement>(null);
  const [selectedEmotion, setSelectedEmotion] = useState<number | null>(null);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [error, seterror] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<Feedback>({
    emotion: "",
    feedback: "",
    Rating: 0,
  });
  const [stage, setStage] = useState<number>(0);
  const [sent, setSent] = useState<{
    title: string;
    meta: string;
    rating: number;
  } | null>(null);
  const db = new dbService();

  useEffect(() => {
    if (!loading) {
      setStage(0);
      return;
    }
    const t = setInterval(
      () => setStage((s) => Math.min(s + 1, stages.length - 1)),
      700
    );
    return () => clearInterval(t);
  }, [loading]);

  const emotions: Emotion[] = [
    {
      title: "Happy",
      emoji: <IoHappyOutline size={22} />,
      active: "border-emerald-400/50 bg-emerald-400/10 text-emerald-300",
    },
    {
      title: "Neutral",
      emoji: <IoSadOutline size={22} />,
      active: "border-amber-400/50 bg-amber-400/10 text-amber-300",
    },
    {
      title: "Sad",
      emoji: <TbMoodSadDizzy size={22} />,
      active: "border-rose-400/50 bg-rose-400/10 text-rose-300",
    },
  ];

  const sections = [
    { image: <IoChatbubbleEllipsesOutline size={17} />, tittle: "General Feedback" },
    { image: <IoBugOutline size={17} />, tittle: "Bug Report" },
    { image: <IoBulbOutline size={17} />, tittle: "Feature Request" },
  ];
  const [selectedSection, setselectedSection] =
    useState<string>("General Feedback");
  const sectionIndex = sections.findIndex((s) => s.tittle === selectedSection);

  const [bug, setbug] = useState<Bug>(emptyIssue);
  const [feature, setfeature] = useState<Feature>(emptyIssue);

  const notSubscribed = () =>
    toast("The website is Not subscribed to Feedsenseai.");

  const saveFeedBack = async (): Promise<boolean> => {
    try {
      const isSubscribed = await db.checkifSubscribed(
        userID.toString(),
        decodeURIComponent(websiteID.toString())
      );
      if (isSubscribed) {
        const savefeedback = {
          emotion: feedback.emotion,
          feedback: feedback.feedback,
          Rating: selectedRating,
        };
        await db.saveFeedback(
          userID.toString(),
          websiteID.toString(),
          savefeedback
        );
        setFeedback({ emotion: "", feedback: "", Rating: 0 });
        setSelectedEmotion(null);
        setSelectedRating(0);
        return true;
      }
      notSubscribed();
      return false;
    } catch (error) {
      console.log(error);
      seterror(true);
      return false;
    }
  };

  const saveBug = async (): Promise<boolean> => {
    try {
      const isSubscribed = await db.checkifSubscribed(
        userID.toString(),
        decodeURIComponent(websiteID.toString())
      );
      if (isSubscribed) {
        await db.saveBug(userID.toString(), websiteID.toString(), bug);
        setbug(emptyIssue);
        return true;
      }
      notSubscribed();
      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const saveFeature = async (): Promise<boolean> => {
    try {
      const isSubscribed = await db.checkifSubscribed(
        userID.toString(),
        decodeURIComponent(websiteID.toString())
      );
      if (isSubscribed) {
        await db.saveFeature(userID.toString(), websiteID.toString(), feature);
        setfeature(emptyIssue);
        return true;
      }
      notSubscribed();
      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const saveSectionData = async () => {
    const isGeneral = selectedSection === "General Feedback";
    const isBugTab = selectedSection === "Bug Report";
    const data = isBugTab ? bug : feature;
    const summary = isGeneral
      ? {
          title: feedback.emotion
            ? `${feedback.emotion} experience`
            : "General feedback",
          meta:
            feedback.feedback.trim() ||
            ratingLabels[selectedRating - 1] ||
            "No message added",
          rating: selectedRating,
        }
      : {
          title:
            data.tittle.trim() || (isBugTab ? "Bug report" : "Feature request"),
          meta: data.priority,
          rating: 0,
        };

    setLoading(true);
    try {
      const wait = new Promise((r) => setTimeout(r, MIN_SEND_MS));
      const ok = isGeneral
        ? await saveFeedBack()
        : isBugTab
        ? await saveBug()
        : await saveFeature();
      await wait;
      if (ok) {
        setSent(summary);
        setSubmitted(true);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const submitLabel =
    selectedSection === "Bug Report"
      ? "Report bug"
      : selectedSection === "Feature Request"
      ? "Submit idea"
      : "Send feedback";

  const noun =
    selectedSection === "Bug Report"
      ? "bug report"
      : selectedSection === "Feature Request"
      ? "idea"
      : "feedback";

  /* cursor spotlight: updates CSS vars, no re-render */
  const onMove = (e: React.MouseEvent) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  /* completion progress for the top line */
  const issue = selectedSection === "Bug Report" ? bug : feature;
  const done =
    selectedSection === "General Feedback"
      ? [
          selectedRating > 0,
          selectedEmotion !== null,
          feedback.feedback.trim().length > 0,
        ]
      : [
          issue.tittle.trim() !== "",
          issue.desc.trim() !== "",
          issue.email.trim() !== "",
        ];
  const progress = done.filter(Boolean).length / done.length;

  /* One layout for bug + feature, same state setters as before */
  const renderIssueForm = (kind: "bug" | "feature") => {
    const isBug = kind === "bug";
    const data = isBug ? bug : feature;
    const update = (patch: Partial<Bug>) =>
      isBug ? setbug({ ...bug, ...patch }) : setfeature({ ...feature, ...patch });

    return (
      <div className="fsf-stagger space-y-5">
        <div className="flex items-start gap-3 rounded-xl border border-white/[0.07] bg-gradient-to-r from-cyan-400/[0.07] to-violet-500/[0.07] p-3.5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-cyan-400/25 to-violet-500/25 text-cyan-200 ring-1 ring-inset ring-cyan-400/30">
            {isBug ? <IoBugOutline size={18} /> : <IoBulbOutline size={18} />}
          </span>
          <div>
            <p className="text-sm font-semibold text-white">
              {isBug ? "Something not working?" : "Have an idea?"}
            </p>
            <p className="mt-0.5 text-xs leading-relaxed text-slate-400">
              {isBug
                ? "Tell us what happened and how to reproduce it."
                : "Tell us what you would like to see next."}
            </p>
          </div>
        </div>

        <div>
          <label className={labelClass}>Title*</label>
          <input
            type="text"
            value={data.tittle}
            onChange={(e) => update({ tittle: e.target.value })}
            placeholder={
              isBug ? "Brief description of the bug" : "Short summary of your idea"
            }
            className={fieldClass}
          />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-[13px] font-medium text-slate-300">
              Description*
            </label>
            <span className="text-[11px] tabular-nums text-slate-600">
              {data.desc.length}
            </span>
          </div>
          <textarea
            rows={6}
            value={data.desc}
            onChange={(e) => update({ desc: e.target.value })}
            placeholder={
              isBug
                ? "What did you expect, what happened instead, and what were the steps?"
                : "What would you like, and how would it help you?"
            }
            className={`${fieldClass} resize-none`}
          />
        </div>

        <div>
          <label className={labelClass}>
            {isBug ? "How serious is it?" : "How important is it to you?"}
          </label>
          <div className="grid grid-cols-3 gap-2" role="radiogroup">
            {priorities.map((p) => {
              const active = data.priority === p.name;
              return (
                <button
                  type="button"
                  role="radio"
                  aria-checked={active}
                  key={p.name}
                  onClick={() => update({ priority: p.name })}
                  className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-semibold transition ${
                    active
                      ? p.active
                      : "border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/20 hover:text-slate-200"
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${p.dot} ${
                      active ? "shadow-[0_0_10px_2px_currentColor]" : ""
                    }`}
                  />
                  {p.short}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className={labelClass}>Email*</label>
          <div className="relative">
            <IoMailOutline
              size={17}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              type="text"
              placeholder="you@example.com"
              value={data.email}
              onChange={(e) => update({ email: e.target.value })}
              className={`${fieldClass} pl-11`}
            />
          </div>
          <p className="mt-1.5 text-[11px] text-slate-600">
            So we can follow up with you.
          </p>
        </div>
      </div>
    );
  };

  const shownRating = hoveredRating ?? selectedRating;

  return (
    <div className="fsf-root relative min-h-screen w-full bg-[#07090d] text-slate-200 antialiased">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        @property --fsf-a { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
        .fsf-root { font-family: 'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif; }

        @keyframes fsf-a { to { --fsf-a: 360deg; } }
        @keyframes fsf-rise { from { opacity: 0; transform: translateY(14px) scale(.985); } to { opacity: 1; transform: none; } }
        @keyframes fsf-fade { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        @keyframes fsf-pop { 0% { transform: scale(.6) rotate(-14deg); } 55% { transform: scale(1.3) rotate(8deg); } 100% { transform: scale(1) rotate(0); } }
        @keyframes fsf-bounce { 0% { transform: scale(.7); } 50% { transform: scale(1.3) rotate(-8deg); } 100% { transform: scale(1); } }
        @keyframes fsf-draw { to { stroke-dashoffset: 0; } }
        @keyframes fsf-ping { 0% { transform: scale(.8); opacity: .6; } 100% { transform: scale(2); opacity: 0; } }

        /* slowly travelling light on the card edge */
        .fsf-border {
          background: conic-gradient(from var(--fsf-a), rgba(255,255,255,.07) 0 58%, rgba(34,211,238,.95) 80%, rgba(167,139,250,.95) 92%, rgba(255,255,255,.07));
          animation: fsf-a 7s linear infinite;
        }
        .fsf-card { animation: fsf-rise .6s cubic-bezier(.2,.8,.2,1) both; }

        /* cursor spotlight */
        .fsf-spot {
          background: radial-gradient(380px circle at var(--mx, 50%) var(--my, 0%), rgba(34,211,238,.10), rgba(139,92,246,.05) 45%, transparent 70%);
        }

        /* staggered reveal for each tab's content */
        .fsf-stagger > * { animation: fsf-fade .5s cubic-bezier(.2,.8,.2,1) both; }
        .fsf-stagger > *:nth-child(2) { animation-delay: .06s; }
        .fsf-stagger > *:nth-child(3) { animation-delay: .12s; }
        .fsf-stagger > *:nth-child(4) { animation-delay: .18s; }
        .fsf-stagger > *:nth-child(5) { animation-delay: .24s; }
        .fsf-stagger > *:nth-child(6) { animation-delay: .30s; }

        .fsf-pop { animation: fsf-pop .45s cubic-bezier(.3,1.4,.5,1) both; }
        .fsf-bounce { animation: fsf-bounce .4s cubic-bezier(.3,1.4,.5,1) both; }

        .fsf-btn { position: relative; overflow: hidden; transition: transform .2s ease, filter .2s ease; }
        .fsf-btn::after {
          content: ""; position: absolute; inset: 0; pointer-events: none;
          background: linear-gradient(105deg, transparent 35%, rgba(255,255,255,.4) 50%, transparent 65%);
          transform: translateX(-120%); transition: transform .7s ease;
        }
        .fsf-btn:hover { transform: translateY(-1px); filter: brightness(1.08); }
        .fsf-btn:hover::after { transform: translateX(120%); }
        .fsf-btn:active { transform: translateY(0) scale(.99); }
        .fsf-send { transition: transform .3s ease; }
        .fsf-btn:hover .fsf-send { transform: translate(3px, -3px); }

        .fsf-ring { stroke-dasharray: 151; stroke-dashoffset: 151; animation: fsf-draw .7s ease forwards; }
        .fsf-tick { stroke-dasharray: 40; stroke-dashoffset: 40; animation: fsf-draw .4s .55s ease forwards; }
        .fsf-ping { animation: fsf-ping 2.4s ease-out .9s infinite; }

        /* sending orb */
        @keyframes fso-spin { to { transform: rotate(360deg); } }
        @keyframes fso-morph {
          0%, 100% { border-radius: 60% 40% 55% 45% / 55% 45% 60% 40%; }
          25% { border-radius: 42% 58% 38% 62% / 60% 40% 62% 38%; }
          50% { border-radius: 52% 48% 63% 37% / 40% 62% 38% 60%; }
          75% { border-radius: 38% 62% 46% 54% / 55% 38% 62% 45%; }
        }
        @keyframes fso-breathe { 0%, 100% { transform: scale(.94); } 50% { transform: scale(1.06); } }
        @keyframes fso-glow { 0%, 100% { opacity: .5; transform: scale(.95); } 50% { opacity: .95; transform: scale(1.12); } }
        @keyframes fso-ripple { 0% { transform: scale(1); opacity: .45; } 100% { transform: scale(2.4); opacity: 0; } }
        @keyframes fso-twinkle { 0%, 100% { transform: scale(.9) rotate(-8deg); } 50% { transform: scale(1.12) rotate(8deg); } }
        @keyframes fso-sheen { from { background-position: 200% 0; } to { background-position: -200% 0; } }
        @keyframes fso-slide { 0% { transform: translateX(-120%); } 100% { transform: translateX(320%); } }
        @keyframes fso-swap { from { opacity: 0; transform: translateY(6px); filter: blur(4px); } to { opacity: 1; transform: none; filter: blur(0); } }
        .fso-overlay { animation: fsf-fade .3s ease-out both; }
        .fso-glow { position: absolute; inset: -26px; border-radius: 9999px; filter: blur(34px);
          background: radial-gradient(circle, rgba(34,211,238,.55), rgba(139,92,246,.4) 55%, transparent 72%);
          animation: fso-glow 3s ease-in-out infinite; }
        .fso-ripple { position: absolute; inset: 30px; border-radius: 9999px; border: 1px solid rgba(34,211,238,.5);
          animation: fso-ripple 2.8s cubic-bezier(.2,.6,.3,1) infinite; }
        .fso-ripple.b { animation-delay: 1.4s; border-color: rgba(167,139,250,.5); }
        .fso-orbit { position: absolute; border-radius: 9999px; border: 1px solid rgba(148,163,184,.14); }
        .fso-orbit::before { content: ""; position: absolute; inset: -1px; border-radius: 9999px;
          -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 1px));
                  mask: radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 1px)); }
        .fso-orbit.a { inset: 0; animation: fso-spin 2.6s linear infinite; }
        .fso-orbit.a::before { background: conic-gradient(from 0deg, transparent 0 55%, rgba(34,211,238,.95) 100%); }
        .fso-orbit.b { inset: 12px; animation: fso-spin 4.2s linear infinite reverse; }
        .fso-orbit.b::before { background: conic-gradient(from 0deg, transparent 0 65%, rgba(167,139,250,.95) 100%); }
        .fso-comet { position: absolute; top: -4px; left: 50%; width: 8px; height: 8px; margin-left: -4px; border-radius: 9999px; background: #fff;
          box-shadow: 0 0 10px 2px rgba(34,211,238,.9), 0 0 22px 6px rgba(34,211,238,.45); }
        .fso-orbit.b .fso-comet { width: 6px; height: 6px; margin-left: -3px; top: -3px;
          box-shadow: 0 0 10px 2px rgba(167,139,250,.9), 0 0 20px 5px rgba(167,139,250,.45); }
        .fso-core { position: absolute; inset: 30px; animation: fso-breathe 3s ease-in-out infinite; }
        .fso-blob { position: absolute; inset: 0; background: conic-gradient(from 0deg, #22d3ee, #6366f1, #a78bfa, #22d3ee);
          box-shadow: 0 0 34px rgba(34,211,238,.55), inset 0 0 16px rgba(255,255,255,.25);
          animation: fso-morph 6s ease-in-out infinite, fso-spin 9s linear infinite; }
        .fso-gloss { position: absolute; inset: 0; border-radius: 9999px; pointer-events: none;
          background: radial-gradient(circle at 30% 24%, rgba(255,255,255,.65), rgba(255,255,255,0) 42%); }
        .fso-icon { animation: fso-twinkle 2.4s ease-in-out infinite; }
        .fso-text { background: linear-gradient(110deg, #8b9bb4 30%, #fff 50%, #8b9bb4 70%); background-size: 200% 100%;
          -webkit-background-clip: text; background-clip: text; color: transparent;
          animation: fso-sheen 3s linear infinite, fso-swap .4s ease-out both; }
        .fso-bar { position: relative; overflow: hidden; width: 7rem; height: 2px; border-radius: 9999px; background: rgba(148,163,184,.15); }
        .fso-bar::after { content: ""; position: absolute; inset: 0; width: 38%; border-radius: 9999px;
          background: linear-gradient(90deg, transparent, #22d3ee, #a78bfa, transparent);
          animation: fso-slide 1.5s cubic-bezier(.6,.1,.4,.9) infinite; }

        @media (prefers-reduced-motion: reduce) {
          .fso-overlay, .fso-glow, .fso-ripple, .fso-core, .fso-blob, .fso-icon, .fso-bar::after { animation: none; }
          .fso-orbit.a { animation-duration: 12s; } .fso-orbit.b { animation-duration: 18s; }
          .fso-text { animation: none; background: none; color: #cbd5e1; -webkit-text-fill-color: #cbd5e1; }
          .fsf-border, .fsf-card, .fsf-stagger > *, .fsf-pop, .fsf-bounce, .fsf-ping { animation: none; }
          .fsf-ring, .fsf-tick { animation: none; stroke-dashoffset: 0; }
          .fsf-btn, .fsf-btn:hover, .fsf-btn::after, .fsf-send { transition: none; transform: none; }
        }
      `}</style>

      {/* quiet, static backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[30rem]"
        style={{
          background:
            "radial-gradient(60% 100% at 50% 0%, rgba(34,211,238,0.10), rgba(139,92,246,0.05) 45%, transparent 75%)",
        }}
      />

      <div className="relative z-10 flex justify-center px-4 py-8 sm:py-14">
        <div
          onMouseMove={onMove}
          className="fsf-card fsf-border group w-full max-w-[34rem] rounded-2xl p-px shadow-[0_30px_90px_-30px_rgba(34,211,238,0.25)]"
        >
          <div
            ref={cardRef}
            className="relative overflow-hidden rounded-[15px] bg-[#0b0e14]"
          >
            <div
              aria-hidden
              className="fsf-spot pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />

            {loading && (
              <div
                role="status"
                aria-live="polite"
                className="fso-overlay absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#0b0e14]/90 backdrop-blur-md"
              >
                <div className="relative h-28 w-28">
                  <div className="fso-glow" />
                  <span className="fso-ripple" />
                  <span className="fso-ripple b" />
                  <div className="fso-orbit a"><span className="fso-comet" /></div>
                  <div className="fso-orbit b"><span className="fso-comet" /></div>
                  <div className="fso-core">
                    <div className="fso-blob" />
                    <div className="fso-gloss" />
                    <div className="absolute inset-0 grid place-items-center text-white">
                      <span className="fso-icon drop-shadow-[0_0_8px_rgba(255,255,255,.8)]">
                        <HiOutlineSparkles size={24} />
                      </span>
                    </div>
                  </div>
                </div>
                <p key={stage} className="fso-text mt-9 text-base font-semibold tracking-tight">
                  {stages[stage]}
                </p>
                <div className="fso-bar mt-4" aria-hidden />
              </div>
            )}

            {error && !loading && (
              <div className="fso-overlay absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#0b0e14]/95 px-8 text-center backdrop-blur-md">
                <div className="relative grid h-20 w-20 place-items-center">
                  <div className="absolute inset-0 rounded-full bg-rose-500/20 blur-2xl" />
                  <svg viewBox="0 0 52 52" className="relative h-20 w-20" aria-hidden>
                    <circle className="fsf-ring" cx="26" cy="26" r="24" fill="none" stroke="#fb7185" strokeWidth="2" />
                    <path className="fsf-tick" d="M26 15v14M26 36v.5" fill="none" stroke="#fb7185" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </div>
                <h2 className="mt-7 text-xl font-bold tracking-tight text-white">
                  Feedback is paused
                </h2>
                <p className="mt-2 max-w-xs text-sm text-slate-400">
                  This website has stopped collecting feedback for now.
                </p>
                <button
                  type="button"
                  onClick={() => seterror(false)}
                  className="mt-7 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-cyan-400/40 hover:bg-white/[0.07]"
                >
                  Try again
                </button>
              </div>
            )}

            {/* progress line */}
            <div aria-hidden className="relative h-[2px] w-full bg-white/[0.06]">
              <div
                className="h-full rounded-r-full bg-gradient-to-r from-cyan-400 to-violet-500 shadow-[0_0_12px_rgba(34,211,238,0.9)] transition-[width] duration-500 ease-out"
                style={{ width: submitted ? "100%" : `${progress * 100}%` }}
              />
            </div>

            <div className="relative">
              {/* header */}
              {!submitted && (
                <div className="flex items-center gap-3.5 px-5 pb-1 pt-6 sm:px-8">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 text-white shadow-[0_8px_24px_-8px_rgba(34,211,238,0.7)]">
                    <HiOutlineSparkles size={22} />
                  </span>
                  <div>
                    <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                      We value your feedback
                    </h1>
                    <p className="mt-0.5 text-[13px] text-slate-400">
                      It takes under a minute and helps us improve.
                    </p>
                  </div>
                </div>
              )}

              {submitted ? (
                <div className="flex flex-col items-center px-5 pb-6 pt-14 text-center sm:px-8">
                  <div className="relative grid h-20 w-20 place-items-center">
                    <span className="fsf-ping absolute inset-2 rounded-full border border-cyan-400/50" />
                    <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-2xl" />
                    <svg viewBox="0 0 52 52" className="relative h-20 w-20" aria-hidden>
                      <defs>
                        <linearGradient id="fsfg" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0" stopColor="#22d3ee" />
                          <stop offset="1" stopColor="#a78bfa" />
                        </linearGradient>
                      </defs>
                      <circle className="fsf-ring" cx="26" cy="26" r="24" fill="none" stroke="url(#fsfg)" strokeWidth="2" />
                      <path className="fsf-tick" d="M15 27l8 8 14-16" fill="none" stroke="url(#fsfg)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <h2 className="mt-7 text-2xl font-bold tracking-tight text-white">
                    Thank you!
                  </h2>
                  <p className="mt-2 max-w-xs text-sm text-slate-400">
                    Your {noun} just reached the team. We read every one.
                  </p>
                  {sent && (
                    <div className="mt-7 w-full max-w-xs rounded-xl border border-white/10 bg-white/[0.03] p-3.5 text-left">
                      <div className="flex items-center gap-3">
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-cyan-400/25 to-violet-500/25 text-cyan-200 ring-1 ring-inset ring-cyan-400/30">
                          {selectedSection === "Bug Report" ? (
                            <IoBugOutline size={17} />
                          ) : selectedSection === "Feature Request" ? (
                            <IoBulbOutline size={17} />
                          ) : (
                            <IoChatbubbleEllipsesOutline size={17} />
                          )}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-white">{sent.title}</p>
                          <p className="truncate text-xs text-slate-500">{sent.meta}</p>
                        </div>
                      </div>
                      {sent.rating > 0 && (
                        <div className="mt-3 flex items-center gap-1 border-t border-white/[0.06] pt-3">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <IoMdStar
                              key={i}
                              size={16}
                              className={i <= sent.rating ? "text-amber-300" : "text-slate-700"}
                            />
                          ))}
                          <span className="ml-1.5 text-xs text-slate-500">
                            {ratingLabels[sent.rating - 1]}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-8 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-cyan-400/40 hover:bg-white/[0.07]"
                  >
                    Send another
                  </button>
                  <a
                    href={BRAND_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 bg-gradient-to-r from-cyan-300 to-violet-300 bg-clip-text text-xs font-semibold text-transparent hover:opacity-80"
                  >
                    Collect feedback like this on your own site
                  </a>
                </div>
              ) : (
                <>
                  {/* segmented switcher with sliding indicator */}
                  <div className="px-5 pb-5 pt-6 sm:px-8">
                    <div
                      role="tablist"
                      className="relative grid grid-cols-3 rounded-xl border border-white/[0.07] bg-black/30 p-1"
                    >
                      <span
                        aria-hidden
                        className="absolute inset-y-1 left-1 w-[calc((100%-0.5rem)/3)] rounded-lg bg-gradient-to-br from-cyan-400/20 to-violet-500/20 ring-1 ring-inset ring-cyan-400/35 transition-transform duration-300 ease-[cubic-bezier(.3,.8,.3,1)]"
                        style={{ transform: `translateX(${sectionIndex * 100}%)` }}
                      />
                      {sections.map((s) => {
                        const active = selectedSection === s.tittle;
                        return (
                          <button
                            type="button"
                            role="tab"
                            aria-selected={active}
                            key={s.tittle}
                            onClick={() => setselectedSection(s.tittle)}
                            className={`relative z-10 flex items-center justify-center gap-2 rounded-lg px-2 py-2.5 text-xs font-semibold transition-colors ${
                              active ? "text-white" : "text-slate-500 hover:text-slate-300"
                            }`}
                          >
                            {s.image}
                            <span className="hidden sm:inline">{s.tittle}</span>
                            <span className="sm:hidden">{s.tittle.split(" ")[0]}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div key={selectedSection} className="px-5 sm:px-8">
                    {selectedSection === "General Feedback" ? (
                      <div className="fsf-stagger space-y-7">
                        {/* rating */}
                        <div>
                          <div className="mb-3 flex items-baseline justify-between">
                            <h2 className="text-[13px] font-medium text-slate-300">
                              How would you rate us?
                            </h2>
                            <span
                              className={`text-xs font-semibold transition-colors ${
                                shownRating ? "text-amber-300" : "text-slate-600"
                              }`}
                            >
                              {shownRating
                                ? ratingLabels[shownRating - 1]
                                : "Select a rating"}
                            </span>
                          </div>
                          <div
                            className="grid grid-cols-5 gap-2"
                            onMouseLeave={() => setHoveredRating(null)}
                          >
                            {[1, 2, 3, 4, 5].map((i) => {
                              const filled = i <= shownRating;
                              const chosen = i <= selectedRating;
                              return (
                                <button
                                  type="button"
                                  key={i}
                                  aria-label={`${i} star${i > 1 ? "s" : ""}`}
                                  onMouseEnter={() => setHoveredRating(i)}
                                  onClick={() => setSelectedRating(i)}
                                  className={`grid h-14 place-items-center rounded-xl border transition-all duration-150 ${
                                    filled
                                      ? "border-amber-300/40 bg-amber-300/10 text-amber-300 shadow-[0_8px_22px_-12px_rgba(251,191,36,0.8)]"
                                      : "border-white/10 bg-white/[0.03] text-slate-600 hover:border-white/20"
                                  }`}
                                >
                                  <span
                                    key={`${i}-${selectedRating}`}
                                    className={chosen ? "fsf-pop" : ""}
                                    style={{ animationDelay: `${(i - 1) * 55}ms` }}
                                  >
                                    {filled ? <IoMdStar size={26} /> : <IoIosStarOutline size={26} />}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* experience */}
                        <div>
                          <h2 className="mb-3 text-[13px] font-medium text-slate-300">
                            How was your experience?*
                          </h2>
                          <div className="grid grid-cols-3 gap-2">
                            {emotions.map((emotion, idx) => {
                              const on = selectedEmotion === idx;
                              return (
                                <button
                                  type="button"
                                  key={idx}
                                  onClick={() => {
                                    setSelectedEmotion(idx);
                                    setFeedback({ ...feedback, emotion: emotion.title });
                                  }}
                                  className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-xs font-semibold transition-all duration-200 ${
                                    on
                                      ? emotion.active
                                      : "border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/20 hover:text-slate-200"
                                  }`}
                                >
                                  <span key={on ? "on" : "off"} className={on ? "fsf-bounce" : ""}>
                                    {emotion.emoji}
                                  </span>
                                  {emotion.title}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* message */}
                        <div>
                          <label className={labelClass}>
                            Anything else you&apos;d like to add?
                          </label>
                          <textarea
                            value={feedback.feedback}
                            placeholder="Tell us what you think"
                            onChange={(e) =>
                              setFeedback({ ...feedback, feedback: e.target.value })
                            }
                            rows={4}
                            className={`${fieldClass} resize-none`}
                          />
                        </div>
                      </div>
                    ) : selectedSection === "Bug Report" ? (
                      renderIssueForm("bug")
                    ) : (
                      renderIssueForm("feature")
                    )}
                  </div>

                  {/* submit */}
                  <div className="px-5 pt-7 sm:px-8">
                    <button
                      onClick={saveSectionData}
                      className="fsf-btn flex w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-500 px-4 py-3.5 text-sm font-bold text-white shadow-[0_14px_36px_-14px_rgba(34,211,238,0.8)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-400/30"
                    >
                      <span>{submitLabel}</span>
                      <FaTelegramPlane size={18} className="fsf-send" />
                    </button>
                  </div>
                </>
              )}

              {/* attribution */}
              <div className="flex items-center justify-center gap-1.5 px-5 pb-6 pt-5 text-[11px] text-slate-500">
                <HiOutlineSparkles size={12} className="text-cyan-400/80" />
                <a
                  href={BRAND_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-slate-300"
                >
                  Powered by{" "}
                  <span className="font-semibold text-slate-300">FeedSenseAI</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <ToastContainer theme="dark" toastClassName={"custom-toast"} />
      </div>
            <div
        aria-hidden
        className="pointer-events-none relative -mb-[3.5vw] select-none overflow-hidden px-4 text-center [mask-image:linear-gradient(to_bottom,black_25%,transparent_95%)]"
      >
        <span className="block bg-gradient-to-b from-white/[0.14] to-transparent bg-clip-text text-[17vw] font-extrabold leading-[0.9] tracking-tighter text-transparent">
          FeedSenseAI
        </span>
      </div>

    </div>
  );
};

export default Form;