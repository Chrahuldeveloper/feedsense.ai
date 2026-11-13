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
import { FiChevronDown, FiCheck } from "react-icons/fi";
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

/* ---------- static UI data ---------- */
const emotions: Emotion[] = [
  {
    title: "Happy",
    emoji: <IoHappyOutline size={30} />,
    active: "border-emerald-400/60 bg-emerald-400/10 text-emerald-300",
  },
  {
    title: "Neutral",
    emoji: <IoSadOutline size={30} />,
    active: "border-amber-400/60 bg-amber-400/10 text-amber-300",
  },
  {
    title: "Sad",
    emoji: <TbMoodSadDizzy size={30} />,
    active: "border-rose-400/60 bg-rose-400/10 text-rose-300",
  },
];

const sections = [
  {
    tittle: "General Feedback",
    image: <IoChatbubbleEllipsesOutline size={18} />,
    blurb: "Rate your experience and tell us what you think.",
    heading: "Share your experience",
    sub: "Rate the site and leave a note. It helps the team see what's working.",
    cta: "Send feedback",
    done: "Thanks, your feedback was sent.",
  },
  {
    tittle: "Bug Report",
    image: <IoBugOutline size={18} />,
    blurb: "Something broken? Describe what happened.",
    heading: "Report a bug",
    sub: "Include the steps to reproduce it so the team can fix it faster.",
    cta: "Submit bug report",
    done: "Bug report sent.",
  },
  {
    tittle: "Feature Request",
    image: <IoBulbOutline size={18} />,
    blurb: "Suggest something you'd like to see built.",
    heading: "Request a feature",
    sub: "Describe what you need and how it would help you.",
    cta: "Submit request",
    done: "Feature request sent.",
  },
];

const priorities = [
  { name: "Low Priority", color: "bg-green-500" },
  { name: "Medium Priority", color: "bg-yellow-500" },
  { name: "High Priority", color: "bg-red-500" },
];

const ratingLabels = ["", "Poor", "Fair", "Good", "Great", "Excellent"];

/* ---------- UI-only tokens ---------- */
const fieldClass =
  "w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-cyan-400/60 focus:ring-4 focus:ring-cyan-400/10";
const labelClass = "mb-2 block text-[13px] font-semibold text-slate-300";

const Field = ({
  label,
  htmlFor,
  required,
  children,
}: {
  label: string;
  htmlFor?: string;
  required?: boolean;
  children: React.ReactNode;
}) => (
  <div>
    <label htmlFor={htmlFor} className={labelClass}>
      {label}
      {required && <span className="ml-1 text-cyan-300">*</span>}
    </label>
    {children}
  </div>
);

const Form = () => {
  const { userID, websiteID } = useParams();
  const [selectedEmotion, setSelectedEmotion] = useState<number | null>(null);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, seterror] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<Feedback>({
    emotion: "",
    feedback: "",
    Rating: 0,
  });
  const db = new dbService();

  const [selectedSection, setselectedSection] =
    useState<string>("General Feedback");
  const meta = sections.find((s) => s.tittle === selectedSection) || sections[0];

  const [selected, setSelected] = useState(priorities[1]);
  const [open, setOpen] = useState(false);

  const [bug, setbug] = useState<Bug>({
    email: "",
    priority: priorities[1].name,
    tittle: "",
    desc: "",
  });

  const [feature, setfeature] = useState<Feature>({
    email: "",
    priority: priorities[1].name,
    tittle: "",
    desc: "",
  });

  const saveFeedBack = async () => {
    setLoading(true);
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
        toast.success(sections[0].done);
      } else {
        toast("The website is Not subscribed to Feedsenseai.");
      }
    } catch (error) {
      console.log(error);
      seterror(true);
    } finally {
      setLoading(false);
    }
  };

  const saveBug = async () => {
    try {
      const isSubscribed = await db.checkifSubscribed(
        userID.toString(),
        decodeURIComponent(websiteID.toString())
      );
      if (isSubscribed) {
        await db.saveBug(userID.toString(), websiteID.toString(), bug);
        setbug({
          desc: "",
          tittle: "",
          email: "",
          priority: priorities[1].name,
        });
        setSelected(priorities[1]);
        toast.success(sections[1].done);
      } else {
        toast("The website is Not subscribed to Feedsenseai.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const saveFeature = async () => {
    try {
      const isSubscribed = await db.checkifSubscribed(
        userID.toString(),
        decodeURIComponent(websiteID.toString())
      );

      if (isSubscribed) {
        await db.saveFeature(userID.toString(), websiteID.toString(), feature);
        setfeature({
          desc: "",
          tittle: "",
          email: "",
          priority: priorities[1].name,
        });
        setSelected(priorities[1]);
        toast.success(sections[2].done);
      } else {
        toast("The website is Not subscribed to Feedsenseai.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const saveSectionData = async () => {
    try {
      if (selectedSection === "General Feedback") {
        await saveFeedBack();
      } else if (selectedSection === "Bug Report") {
        setLoading(true);
        await saveBug();
        setLoading(false);
      } else {
        setLoading(true);
        await saveFeature();
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  /* one layout for both the bug and feature forms, same state setters as before */
  const renderIssueForm = (kind: "bug" | "feature") => {
    const data = kind === "bug" ? bug : feature;
    const update = (patch: Partial<Bug>) =>
      kind === "bug"
        ? setbug({ ...bug, ...patch })
        : setfeature({ ...feature, ...patch });

    return (
      <div className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Email" htmlFor={`${kind}-email`} required>
            <input
              id={`${kind}-email`}
              type="text"
              placeholder="you@example.com"
              value={data.email}
              onChange={(e) => update({ email: e.target.value })}
              className={fieldClass}
            />
          </Field>

          <Field label="Priority" htmlFor={`${kind}-priority`}>
            <div className="relative">
              {open && (
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setOpen(false)}
                  aria-hidden
                />
              )}
              <button
                id={`${kind}-priority`}
                type="button"
                aria-haspopup="listbox"
                aria-expanded={open}
                onClick={() => setOpen(!open)}
                onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
                className={`relative z-20 flex w-full items-center justify-between rounded-xl border bg-black/40 px-4 py-3 text-sm outline-none transition ${
                  open
                    ? "border-cyan-400/60 ring-4 ring-cyan-400/10"
                    : "border-white/10 hover:border-white/25"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <span className={`h-2.5 w-2.5 rounded-full ${selected.color}`} />
                  <span className="text-white">{selected.name}</span>
                </span>
                <FiChevronDown
                  size={18}
                  className={`text-slate-500 transition-transform ${
                    open ? "rotate-180" : ""
                  }`}
                />
              </button>

              {open && (
                <div
                  role="listbox"
                  className="absolute left-0 top-full z-20 mt-2 w-full overflow-hidden rounded-xl border border-white/10 bg-[#10141b] p-1 shadow-2xl shadow-black/60"
                >
                  {priorities.map((priority) => {
                    const isSel = selected.name === priority.name;
                    return (
                      <button
                        type="button"
                        role="option"
                        aria-selected={isSel}
                        key={priority.name}
                        onClick={() => {
                          setSelected(priority);
                          setOpen(false);
                          update({ priority: priority.name });
                        }}
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm transition hover:bg-white/[0.06] ${
                          isSel ? "bg-white/[0.06]" : ""
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <span className={`h-2.5 w-2.5 rounded-full ${priority.color}`} />
                          <span className="text-white">{priority.name}</span>
                        </span>
                        {isSel && <FiCheck size={16} className="text-cyan-300" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </Field>
        </div>

        <Field label="Title" htmlFor={`${kind}-title`} required>
          <input
            id={`${kind}-title`}
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
        </Field>

        <Field label="Description" htmlFor={`${kind}-desc`} required>
          <textarea
            id={`${kind}-desc`}
            cols={10}
            rows={7}
            value={data.desc}
            onChange={(e) => update({ desc: e.target.value })}
            placeholder={
              kind === "bug"
                ? "Describe the bug in detail, including steps to reproduce"
                : "Tell us what you would like and how it would help you"
            }
            className={`${fieldClass} resize-none`}
          ></textarea>
        </Field>
      </div>
    );
  };

  const shownRating = hoveredRating ?? selectedRating;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#06080b] text-slate-200 antialiased">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
        .fsf-root { font-family: 'Manrope', ui-sans-serif, system-ui, sans-serif; }
        @keyframes fsf-drift { 0%,100% { transform: translate3d(0,0,0) scale(1); } 50% { transform: translate3d(50px,30px,0) scale(1.15); } }
        @keyframes fsf-sheen { from { background-position: 200% 0; } to { background-position: -200% 0; } }
        @keyframes fsf-enter { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
        @keyframes fsf-swap { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
        .fsf-drift { animation: fsf-drift 18s ease-in-out infinite; }
        .fsf-enter { animation: fsf-enter .6s cubic-bezier(.2,.8,.2,1) both; }
        .fsf-swap { animation: fsf-swap .3s ease-out both; }
        .fsf-btn { background-size: 200% 100%; }
        .fsf-btn:hover { animation: fsf-sheen 2.4s linear infinite; }
        @media (prefers-reduced-motion: reduce) { .fsf-drift, .fsf-btn:hover, .fsf-enter, .fsf-swap { animation: none !important; } }
      `}</style>

      <div className="fsf-root relative">
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

        <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-[380px_minmax(0,1fr)] lg:gap-16">
            {/* ---------- left: context + section nav ---------- */}
            <aside className="lg:sticky lg:top-16 lg:self-start">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 text-white shadow-[0_10px_30px_-10px_rgba(34,211,238,0.8)]">
                  <HiOutlineSparkles size={20} />
                </span>
                <span className="text-base font-bold tracking-tight text-white">
                  FeedSenseAI
                </span>
              </div>

              <h1 className="mt-8 text-3xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-4xl lg:text-[2.75rem]">
                Tell us how it&apos;s going
              </h1>
              <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-slate-400">
                Your feedback goes straight to the team behind this site. It
                takes about a minute.
              </p>

              <nav
                aria-label="Feedback type"
                className="mt-8 grid grid-cols-3 gap-2 lg:mt-10 lg:grid-cols-1 lg:gap-3"
              >
                {sections.map((s) => {
                  const active = selectedSection === s.tittle;
                  return (
                    <button
                      type="button"
                      key={s.tittle}
                      aria-pressed={active}
                      onClick={() => {
                        setselectedSection(s.tittle);
                        setOpen(false);
                      }}
                      className={`flex flex-col items-center gap-2 rounded-2xl border px-2 py-3 text-center transition lg:flex-row lg:items-start lg:gap-4 lg:px-4 lg:py-4 lg:text-left ${
                        active
                          ? "border-cyan-400/40 bg-gradient-to-br from-cyan-400/15 to-violet-500/15 text-white shadow-[0_14px_36px_-18px_rgba(34,211,238,0.7)]"
                          : "border-white/[0.07] bg-white/[0.02] text-slate-400 hover:border-white/20 hover:bg-white/[0.05] hover:text-slate-200"
                      }`}
                    >
                      <span
                        className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl transition ${
                          active
                            ? "bg-gradient-to-br from-cyan-400 to-violet-500 text-white"
                            : "bg-white/[0.06] text-slate-300"
                        }`}
                      >
                        {s.image}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[11px] font-semibold leading-tight sm:text-xs lg:text-sm">
                          {s.tittle}
                        </span>
                        <span className="mt-1 hidden text-xs leading-relaxed text-slate-500 lg:block">
                          {s.blurb}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </nav>
            </aside>

            {/* ---------- right: form card ---------- */}
            <main className="fsf-enter">
              <div className="rounded-3xl bg-gradient-to-b from-white/25 via-white/[0.06] to-cyan-400/25 p-px shadow-[0_30px_90px_-30px_rgba(34,211,238,0.35)]">
                <div className="overflow-hidden rounded-[23px] bg-[#0a0d12]/95 backdrop-blur-xl">
                  {/* card header */}
                  <div className="flex items-start gap-4 border-b border-white/[0.06] px-5 py-6 sm:px-8">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-cyan-400/20 to-violet-500/20 text-cyan-200 ring-1 ring-inset ring-cyan-400/30">
                      {meta.image}
                    </span>
                    <div>
                      <h2 className="text-lg font-bold tracking-tight text-white">
                        {meta.heading}
                      </h2>
                      <p className="mt-1 text-sm leading-relaxed text-slate-400">
                        {meta.sub}
                      </p>
                    </div>
                  </div>

                  {/* card body */}
                  <div key={selectedSection} className="fsf-swap px-5 py-7 sm:px-8">
                    {selectedSection === "General Feedback" ? (
                      <div className="space-y-8">
                        {/* experience */}
                        <div>
                          <h3 className={labelClass}>
                            How was your experience
                            <span className="ml-1 text-cyan-300">*</span>
                          </h3>
                          <div className="grid grid-cols-3 gap-3">
                            {emotions.map((emotion, idx) => (
                              <button
                                type="button"
                                key={idx}
                                aria-pressed={selectedEmotion === idx}
                                onClick={() => {
                                  setSelectedEmotion(idx);
                                  setFeedback({
                                    ...feedback,
                                    emotion: emotion.title,
                                  });
                                }}
                                className={`flex flex-col items-center gap-2 rounded-2xl border px-3 py-5 transition-all duration-200 ${
                                  selectedEmotion === idx
                                    ? `${emotion.active} shadow-lg`
                                    : "border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/25 hover:bg-white/[0.06] hover:text-slate-200"
                                }`}
                              >
                                {emotion.emoji}
                                <span className="text-xs font-semibold">
                                  {emotion.title}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* rating */}
                        <div>
                          <h3 className={labelClass}>Rate us</h3>
                          <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                            <div
                              className="flex items-center gap-1"
                              onMouseLeave={() => setHoveredRating(null)}
                            >
                              {[1, 2, 3, 4, 5].map((i) => (
                                <button
                                  type="button"
                                  aria-label={`${i} star${i > 1 ? "s" : ""}`}
                                  key={i}
                                  onMouseEnter={() => setHoveredRating(i)}
                                  onClick={() => setSelectedRating(i)}
                                  className="cursor-pointer rounded-md p-0.5 outline-none transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-cyan-400/50"
                                >
                                  {i <= shownRating ? (
                                    <IoMdStar
                                      size={32}
                                      className="text-amber-300 drop-shadow-[0_0_10px_rgba(251,191,36,0.55)]"
                                    />
                                  ) : (
                                    <IoIosStarOutline size={32} className="text-slate-600" />
                                  )}
                                </button>
                              ))}
                            </div>
                            <span
                              className={`text-sm font-semibold ${
                                shownRating ? "text-amber-200" : "text-slate-600"
                              }`}
                            >
                              {ratingLabels[shownRating] || "Not rated"}
                            </span>
                          </div>
                        </div>

                        {/* message */}
                        <Field label="Your feedback" htmlFor="fsf-message">
                          <textarea
                            id="fsf-message"
                            value={feedback.feedback}
                            placeholder="Tell us what you think"
                            onChange={(e) =>
                              setFeedback({
                                ...feedback,
                                feedback: e.target.value,
                              })
                            }
                            cols={20}
                            rows={5}
                            className={`${fieldClass} resize-none`}
                          />
                        </Field>
                      </div>
                    ) : selectedSection === "Bug Report" ? (
                      renderIssueForm("bug")
                    ) : (
                      renderIssueForm("feature")
                    )}
                  </div>

                  {/* card footer */}
                  <div className="flex flex-col-reverse items-stretch gap-4 border-t border-white/[0.06] bg-black/25 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
                    <p className="text-center text-xs text-slate-500 sm:text-left">
                      Fields marked * are required.
                    </p>
                    <button
                      type="button"
                      onClick={saveSectionData}
                      className="fsf-btn flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-500 px-7 py-3.5 text-sm font-bold text-white shadow-[0_14px_40px_-12px_rgba(34,211,238,0.8)] transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-400/30"
                    >
                      <span>{meta.cta}</span>
                      <FaTelegramPlane size={18} />
                    </button>
                  </div>
                </div>
              </div>

              <p className="mt-6 text-center text-xs text-slate-600">
                Powered by FeedSenseAI
              </p>
            </main>
          </div>
        </div>

        {/* sending overlay: the form stays mounted behind it */}
        {loading && (
          <div
            role="status"
            aria-live="polite"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md"
          >
            <div className="-mt-10 flex flex-col items-center text-center">
              <LottiePlayer
                loop
                animationData={FeedbackLoader}
                play
                className="w-36 lg:w-52"
              />
              <p className="mt-2 text-sm text-slate-300">Sending…</p>
            </div>
          </div>
        )}

        {/* error overlay */}
        {error && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
            <div className="-mt-10 mx-auto flex max-w-xs flex-col items-center space-y-3 text-center">
              <LottiePlayer
                loop
                animationData={ErrorLoader}
                play
                className="w-36 lg:w-52"
              />
              <p className="text-sm text-white">
                Website Stopped Collecting Feedbacks
              </p>
            </div>
          </div>
        )}

        <ToastContainer theme="dark" toastClassName={"custom-toast"} />
      </div>
    </div>
  );
};

export default Form;