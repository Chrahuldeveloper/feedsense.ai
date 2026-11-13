"use client";
import dbService from "@/firebase/utils/db";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import {
  IoHappyOutline,
  IoSadOutline,
  IoBugOutline,
  IoChatbubbleEllipsesOutline,
  IoBulbOutline,
} from "react-icons/io5";
import { TbMoodSadDizzy } from "react-icons/tb";
import LottiePlayer from "react-lottie-player";
import FeedbackLoader from "../app/lottie-asserts/FeedbackLoader.json";
import ErrorLoader from "../app/lottie-asserts/ErrorLoader.json";
import { IoIosStarOutline, IoMdStar } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTelegramPlane } from "react-icons/fa";
import { HiOutlineSparkles } from "react-icons/hi2";

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

/* ---------- static config ---------- */

const emotions: Emotion[] = [
  {
    title: "Happy",
    emoji: <IoHappyOutline size={30} />,
    active:
      "border-emerald-400/60 bg-emerald-400/10 text-emerald-300 shadow-[0_12px_32px_-14px_rgba(52,211,153,0.7)]",
  },
  {
    title: "Neutral",
    emoji: <IoSadOutline size={30} />,
    active:
      "border-amber-400/60 bg-amber-400/10 text-amber-300 shadow-[0_12px_32px_-14px_rgba(251,191,36,0.7)]",
  },
  {
    title: "Sad",
    emoji: <TbMoodSadDizzy size={30} />,
    active:
      "border-rose-400/60 bg-rose-400/10 text-rose-300 shadow-[0_12px_32px_-14px_rgba(251,113,133,0.7)]",
  },
];

const sections = [
  {
    image: <IoChatbubbleEllipsesOutline size={20} />,
    tittle: "General Feedback",
    hint: "Rate your experience",
    heading: "Share your thoughts",
    sub: "Tell us how things are going. It takes less than a minute.",
    cta: "Send feedback",
    noun: "feedback",
  },
  {
    image: <IoBugOutline size={20} />,
    tittle: "Bug Report",
    hint: "Something isn't working",
    heading: "Report a bug",
    sub: "Tell us what went wrong and how we can reproduce it.",
    cta: "Submit report",
    noun: "bug report",
  },
  {
    image: <IoBulbOutline size={20} />,
    tittle: "Feature Request",
    hint: "Suggest an improvement",
    heading: "Suggest a feature",
    sub: "What would make this better for you?",
    cta: "Submit request",
    noun: "request",
  },
];

const priorities = [
  {
    name: "Low Priority",
    short: "Low",
    dot: "bg-emerald-400",
    active: "border-emerald-400/50 bg-emerald-400/10 text-emerald-200",
  },
  {
    name: "Medium Priority",
    short: "Medium",
    dot: "bg-amber-400",
    active: "border-amber-400/50 bg-amber-400/10 text-amber-200",
  },
  {
    name: "High Priority",
    short: "High",
    dot: "bg-rose-400",
    active: "border-rose-400/50 bg-rose-400/10 text-rose-200",
  },
];

const DEFAULT_PRIORITY = priorities[1].name;

const emptyIssue = (): Bug => ({
  email: "",
  priority: DEFAULT_PRIORITY,
  tittle: "",
  desc: "",
});

const ratingLabels = ["Tap to rate", "Poor", "Fair", "Good", "Great", "Excellent"];

/* ---------- UI tokens ---------- */

const fieldClass =
  "w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-cyan-400/60 focus:ring-4 focus:ring-cyan-400/10";
const labelClass = "mb-2.5 block text-sm font-medium text-slate-300";
const focusRing =
  "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-400/25";

const Req = () => <span className="ml-0.5 text-cyan-300/80">*</span>;

const Form = () => {
  const { userID, websiteID } = useParams();
  const [selectedEmotion, setSelectedEmotion] = useState<number | null>(null);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, seterror] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [selectedSection, setselectedSection] =
    useState<string>("General Feedback");
  const [feedback, setFeedback] = useState<Feedback>({
    emotion: "",
    feedback: "",
    Rating: 0,
  });
  const [bug, setbug] = useState<Bug>(emptyIssue());
  const [feature, setfeature] = useState<Feature>(emptyIssue());
  const db = new dbService();

  const siteName = (() => {
    const raw = String(websiteID ?? "");
    try {
      return decodeURIComponent(raw)
        .replace(/^https?:\/\//, "")
        .replace(/\/$/, "");
    } catch {
      return raw;
    }
  })();

  const current = sections.find((s) => s.tittle === selectedSection)!;

  /* ---------- data ---------- */

  const isSiteSubscribed = async () => {
    const ok = await db.checkifSubscribed(
      userID.toString(),
      decodeURIComponent(websiteID.toString())
    );
    if (!ok) toast("The website is Not subscribed to Feedsenseai.");
    return ok;
  };

  const saveFeedBack = async (): Promise<boolean> => {
    try {
      if (!(await isSiteSubscribed())) return false;
      await db.saveFeedback(userID.toString(), websiteID.toString(), {
        emotion: feedback.emotion,
        feedback: feedback.feedback,
        Rating: selectedRating,
      });
      setFeedback({ emotion: "", feedback: "", Rating: 0 });
      setSelectedEmotion(null);
      setSelectedRating(0);
      return true;
    } catch (err) {
      console.log(err);
      seterror(true);
      return false;
    }
  };

  const saveBug = async (): Promise<boolean> => {
    try {
      if (!(await isSiteSubscribed())) return false;
      await db.saveBug(userID.toString(), websiteID.toString(), bug);
      setbug(emptyIssue());
      return true;
    } catch (err) {
      console.log(err);
      toast("Something went wrong. Please try again.");
      return false;
    }
  };

  const saveFeature = async (): Promise<boolean> => {
    try {
      if (!(await isSiteSubscribed())) return false;
      await db.saveFeature(userID.toString(), websiteID.toString(), feature);
      setfeature(emptyIssue());
      return true;
    } catch (err) {
      console.log(err);
      toast("Something went wrong. Please try again.");
      return false;
    }
  };

  const saveSectionData = async () => {
    setLoading(true);
    let ok = false;
    try {
      if (selectedSection === "General Feedback") ok = await saveFeedBack();
      else if (selectedSection === "Bug Report") ok = await saveBug();
      else ok = await saveFeature();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
    if (ok) setSubmitted(true);
  };

  /* ---------- sections ---------- */

  const renderIssueForm = (kind: "bug" | "feature") => {
    const data = kind === "bug" ? bug : feature;
    const update = (patch: Partial<Bug>) =>
      kind === "bug"
        ? setbug({ ...bug, ...patch })
        : setfeature({ ...feature, ...patch });

    return (
      <div className="space-y-5">
        <div>
          <label className={labelClass}>
            Email
            <Req />
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            value={data.email}
            onChange={(e) => update({ email: e.target.value })}
            className={fieldClass}
          />
        </div>

        <div>
          <span className={labelClass}>Priority</span>
          <div role="radiogroup" aria-label="Priority" className="grid grid-cols-3 gap-2.5">
            {priorities.map((p) => {
              const active = data.priority === p.name;
              return (
                <button
                  type="button"
                  role="radio"
                  aria-checked={active}
                  key={p.name}
                  onClick={() => update({ priority: p.name })}
                  className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition ${focusRing} ${
                    active
                      ? p.active
                      : "border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/25 hover:bg-white/[0.06] hover:text-slate-200"
                  }`}
                >
                  <span className={`h-2 w-2 rounded-full ${p.dot}`} />
                  {p.short}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className={labelClass}>
            Title
            <Req />
          </label>
          <input
            type="text"
            value={data.tittle}
            onChange={(e) => update({ tittle: e.target.value })}
            placeholder={
              kind === "bug"
                ? "Brief description of the bug"
                : "Short summary of your idea"
            }
            className={fieldClass}
          />
        </div>

        <div>
          <label className={labelClass}>
            Description
            <Req />
          </label>
          <textarea
            rows={6}
            value={data.desc}
            onChange={(e) => update({ desc: e.target.value })}
            placeholder={
              kind === "bug"
                ? "What happened, and what did you expect? Include steps to reproduce."
                : "Tell us what you'd like and how it would help you."
            }
            className={`${fieldClass} resize-none`}
          />
        </div>
      </div>
    );
  };

  const renderGeneral = () => (
    <div className="space-y-7">
      <fieldset>
        <legend className={labelClass}>
          How was your experience?
          <Req />
        </legend>
        <div className="grid grid-cols-3 gap-3">
          {emotions.map((emotion, idx) => {
            const active = selectedEmotion === idx;
            return (
              <button
                type="button"
                key={idx}
                aria-pressed={active}
                onClick={() => {
                  setSelectedEmotion(idx);
                  setFeedback({ ...feedback, emotion: emotion.title });
                }}
                className={`flex flex-col items-center gap-2.5 rounded-2xl border px-3 py-5 transition-all duration-200 ${focusRing} ${
                  active
                    ? `${emotion.active} scale-[1.02]`
                    : "border-white/10 bg-white/[0.03] text-slate-400 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.06] hover:text-slate-200"
                }`}
              >
                {emotion.emoji}
                <span className="text-xs font-semibold">{emotion.title}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <div>
        <div className="mb-2.5 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-300">Rate us</span>
          <span className="text-sm text-slate-500">
            {ratingLabels[hoveredRating ?? selectedRating]}
          </span>
        </div>
        <div
          className="flex items-center gap-1.5"
          onMouseLeave={() => setHoveredRating(null)}
        >
          {[1, 2, 3, 4, 5].map((i) => (
            <button
              type="button"
              key={i}
              aria-label={`${i} star${i > 1 ? "s" : ""}`}
              onMouseEnter={() => setHoveredRating(i)}
              onClick={() => setSelectedRating(i)}
              className={`rounded-lg p-0.5 transition-transform hover:scale-110 ${focusRing}`}
            >
              {i <= (hoveredRating ?? selectedRating) ? (
                <IoMdStar
                  size={36}
                  className="text-amber-300 drop-shadow-[0_0_10px_rgba(251,191,36,0.55)]"
                />
              ) : (
                <IoIosStarOutline size={36} className="text-slate-600" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className={labelClass}>Your feedback</label>
        <textarea
          value={feedback.feedback}
          placeholder="Tell us what you think"
          onChange={(e) => setFeedback({ ...feedback, feedback: e.target.value })}
          rows={5}
          className={`${fieldClass} resize-none`}
        />
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="flex flex-1 flex-col items-center justify-center py-10 text-center">
      <div className="relative">
        <div className="absolute inset-0 -z-10 scale-150 rounded-full bg-gradient-to-br from-cyan-400/40 to-violet-500/40 blur-2xl" />
        <svg viewBox="0 0 52 52" className="h-24 w-24" fill="none">
          <defs>
            <linearGradient id="fsf-g" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#22d3ee" />
              <stop offset="1" stopColor="#a78bfa" />
            </linearGradient>
          </defs>
          <circle
            className="fsf-circle"
            cx="26"
            cy="26"
            r="24"
            stroke="url(#fsf-g)"
            strokeWidth="2"
          />
          <path
            className="fsf-tick"
            d="M15 27l8 8 14-16"
            stroke="url(#fsf-g)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h2 className="mt-7 text-2xl font-bold tracking-tight text-white">
        Thank you, we got it
      </h2>
      <p className="mt-2 max-w-xs text-sm text-slate-400">
        Your {current.noun} was sent to the team
        {siteName ? ` at ${siteName}` : ""}.
      </p>
      <button
        type="button"
        onClick={() => setSubmitted(false)}
        className={`mt-8 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-white/25 hover:bg-white/[0.08] ${focusRing}`}
      >
        Send another
      </button>
    </div>
  );

  const renderError = () => (
    <div className="flex flex-1 flex-col items-center justify-center py-10 text-center">
      <LottiePlayer
        loop
        animationData={ErrorLoader}
        play
        className="w-36 lg:w-48"
      />
      <p className="mt-2 text-sm text-white">
        Website Stopped Collecting Feedbacks
      </p>
      <button
        type="button"
        onClick={() => seterror(false)}
        className={`mt-6 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-white/25 hover:bg-white/[0.08] ${focusRing}`}
      >
        Try again
      </button>
    </div>
  );

  /* ---------- render ---------- */

  return (
    <div className="fsf-root relative min-h-screen w-full overflow-hidden bg-[#06080b] text-slate-200 antialiased">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .fsf-root { font-family: 'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif; }
        @keyframes fsf-drift { 0%,100% { transform: translate3d(0,0,0) scale(1); } 50% { transform: translate3d(50px,30px,0) scale(1.15); } }
        @keyframes fsf-sheen { from { background-position: 200% 0; } to { background-position: -200% 0; } }
        @keyframes fsf-rise { from { opacity: 0; transform: translateY(16px) scale(.985); } to { opacity: 1; transform: none; } }
        @keyframes fsf-swap { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        @keyframes fsf-draw { to { stroke-dashoffset: 0; } }
        .fsf-drift { animation: fsf-drift 18s ease-in-out infinite; }
        .fsf-card { animation: fsf-rise .6s cubic-bezier(.2,.8,.2,1) both; }
        .fsf-swap { animation: fsf-swap .35s ease-out both; }
        .fsf-btn { background-size: 200% 100%; }
        .fsf-btn:not(:disabled):hover { animation: fsf-sheen 2.4s linear infinite; }
        .fsf-circle { stroke-dasharray: 151; stroke-dashoffset: 151; animation: fsf-draw .7s ease-out forwards; }
        .fsf-tick { stroke-dasharray: 40; stroke-dashoffset: 40; animation: fsf-draw .4s .55s ease-out forwards; }
        @media (prefers-reduced-motion: reduce) {
          .fsf-drift, .fsf-card, .fsf-swap, .fsf-btn:hover { animation: none !important; }
          .fsf-circle, .fsf-tick { animation: none !important; stroke-dashoffset: 0; }
        }
      `}</style>

      {/* ambient background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="fsf-drift absolute -left-24 -top-24 h-[28rem] w-[28rem] rounded-full bg-cyan-500/20 blur-[120px]" />
        <div
          className="fsf-drift absolute -right-24 top-1/3 h-[30rem] w-[30rem] rounded-full bg-violet-600/20 blur-[130px]"
          style={{ animationDelay: "-9s" }}
        />
        <div
          className="absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className="relative z-10 flex justify-center px-4 py-6 sm:py-12">
        <div className="fsf-card w-full max-w-4xl rounded-[28px] bg-gradient-to-b from-white/25 via-white/[0.06] to-cyan-400/25 p-px shadow-[0_30px_90px_-30px_rgba(34,211,238,0.35)]">
          <div className="relative overflow-hidden rounded-[27px] bg-[#0a0d12]/95 backdrop-blur-xl">
            <div className="grid md:grid-cols-[19rem_1fr]">
              {/* left rail */}
              <aside className="border-b border-white/[0.07] bg-gradient-to-b from-cyan-400/[0.07] via-transparent to-violet-500/[0.07] p-6 md:border-b-0 md:border-r md:p-8">
                <div className="flex items-center gap-4 md:block">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 text-white shadow-[0_10px_30px_-10px_rgba(34,211,238,0.8)]">
                    <IoChatbubbleEllipsesOutline size={22} />
                  </div>
                  <h1 className="text-xl font-bold leading-tight tracking-tight text-white md:mt-5 md:text-[1.65rem]">
                    We&apos;d love to hear from you
                  </h1>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">
                  Pick a topic and send it straight to the team.
                </p>

                {siteName && (
                  <div className="mt-4 inline-flex max-w-full items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-slate-300">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
                    <span className="truncate">{siteName}</span>
                  </div>
                )}

                <div
                  role="tablist"
                  aria-label="Feedback type"
                  className="mt-6 grid grid-cols-3 gap-2 md:mt-8 md:grid-cols-1"
                >
                  {sections.map((s) => {
                    const active = selectedSection === s.tittle;
                    return (
                      <button
                        type="button"
                        role="tab"
                        aria-selected={active}
                        key={s.tittle}
                        onClick={() => {
                          setselectedSection(s.tittle);
                          setSubmitted(false);
                        }}
                        className={`flex flex-col items-center gap-1.5 rounded-xl px-2 py-3 text-center transition md:flex-row md:gap-3.5 md:px-3.5 md:py-3 md:text-left ${focusRing} ${
                          active
                            ? "bg-gradient-to-br from-cyan-400/20 to-violet-500/20 text-white shadow-[0_8px_24px_-12px_rgba(34,211,238,0.6)] ring-1 ring-inset ring-cyan-400/40"
                            : "text-slate-400 hover:bg-white/[0.05] hover:text-slate-200"
                        }`}
                      >
                        <span
                          className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg transition md:h-9 md:w-9 ${
                            active
                              ? "bg-white/10 text-cyan-200"
                              : "bg-white/[0.04]"
                          }`}
                        >
                          {s.image}
                        </span>
                        <span className="min-w-0">
                          <span className="block text-[11px] font-semibold leading-tight md:text-sm">
                            {s.tittle}
                          </span>
                          <span className="mt-0.5 hidden text-xs text-slate-500 md:block">
                            {s.hint}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </aside>

              {/* form pane */}
              <main className="flex min-h-[32rem] flex-col p-6 md:p-9">
                <div
                  key={error ? "error" : submitted ? "done" : selectedSection}
                  className="fsf-swap flex flex-1 flex-col"
                >
                  {error ? (
                    renderError()
                  ) : submitted ? (
                    renderSuccess()
                  ) : (
                    <>
                      <h2 className="text-2xl font-bold tracking-tight text-white">
                        {current.heading}
                      </h2>
                      <p className="mt-1.5 text-sm text-slate-400">
                        {current.sub}
                      </p>

                      <div className="mt-7">
                        {selectedSection === "General Feedback"
                          ? renderGeneral()
                          : selectedSection === "Bug Report"
                          ? renderIssueForm("bug")
                          : renderIssueForm("feature")}
                      </div>

                      <div className="mt-auto pt-8">
                        <button
                          type="button"
                          onClick={saveSectionData}
                          disabled={loading}
                          className={`fsf-btn flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-500 px-4 py-3.5 text-sm font-bold text-white shadow-[0_14px_40px_-12px_rgba(34,211,238,0.8)] transition hover:-translate-y-0.5 disabled:opacity-60 ${focusRing}`}
                        >
                          <span>{current.cta}</span>
                          <FaTelegramPlane size={19} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </main>
            </div>

            {/* footer */}
            <div className="flex items-center justify-between gap-3 border-t border-white/[0.07] px-6 py-3.5 text-xs text-slate-500 md:px-9">
              <span>Your response goes straight to the team.</span>
              <span className="inline-flex shrink-0 items-center gap-1.5">
                <HiOutlineSparkles size={13} className="text-cyan-300/80" />
                Powered by{" "}
                <span className="font-semibold text-slate-300">FeedSenseAI</span>
              </span>
            </div>

            {/* loading overlay (stays inside the card so the layout doesn't jump) */}
            {loading && (
              <div
                role="status"
                aria-live="polite"
                className="absolute inset-0 z-20 grid place-items-center bg-[#0a0d12]/85 backdrop-blur-md"
              >
                <LottiePlayer
                  loop
                  animationData={FeedbackLoader}
                  play
                  className="w-36 lg:w-52"
                />
              </div>
            )}
          </div>
        </div>
        <ToastContainer theme="dark" toastClassName={"custom-toast"} />
      </div>
    </div>
  );
};

export default Form;