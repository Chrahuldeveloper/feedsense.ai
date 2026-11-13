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
import { FiChevronDown } from "react-icons/fi";
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

/* UI-only tokens */
const fieldClass =
  "w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none transition focus:border-indigo-400/60 focus:ring-4 focus:ring-indigo-400/10";
const labelClass = "mb-2 block text-sm font-medium text-zinc-300";

const Form = () => {
  const { userID, websiteID } = useParams();
  const [selectedEmotion, setSelectedEmotion] = useState<number | null>(null);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, seterror] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<Feedback>({
    emotion: "",
    feedback: "",
    Rating: 0,
  });
  const db = new dbService();

  const emotions: Emotion[] = [
    {
      title: "Happy",
      emoji: <IoHappyOutline size={32} />,
      active: "border-emerald-400/60 bg-emerald-400/10 text-emerald-300",
    },
    {
      title: "Neutral",
      emoji: <IoSadOutline size={32} />,
      active: "border-amber-400/60 bg-amber-400/10 text-amber-300",
    },
    {
      title: "Sad",
      emoji: <TbMoodSadDizzy size={32} />,
      active: "border-rose-400/60 bg-rose-400/10 text-rose-300",
    },
  ];

  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

  const sections = [
    {
      image: <IoChatbubbleEllipsesOutline size={20} />,
      tittle: "General Feedback",
    },
    {
      image: <IoBugOutline size={20} />,
      tittle: "Bug Report",
    },
    {
      image: <IoBulbOutline size={20} />,
      tittle: "Feature Request",
    },
  ];

  const [selectedSection, setselectedSection] =
    useState<string>("General Feedback");

  const priorities = [
    { name: "Low Priority", color: "bg-green-500" },
    { name: "Medium Priority", color: "bg-yellow-500" },
    { name: "High Priority", color: "bg-red-500" },
  ];

  const [selected, setSelected] = useState(priorities[1]);
  const [open, setOpen] = useState(false);

  const [bug, setbug] = useState<Bug>({
    email: "",
    priority: "",
    tittle: "",
    desc: "",
  });

  const [feature, setfeature] = useState<Feature>({
    email: "",
    priority: "",
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
          priority: "",
        });
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
          priority: "",
        });
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

  /* UI-only: one layout for both the bug and feature forms,
     wired to the same state setters as before */
  const renderIssueForm = (kind: "bug" | "feature") => {
    const data = kind === "bug" ? bug : feature;
    const update = (patch: Partial<Bug>) =>
      kind === "bug"
        ? setbug({ ...bug, ...patch })
        : setfeature({ ...feature, ...patch });

    return (
      <div className="space-y-5 px-5 pt-2 sm:px-8">
        <div>
          <label className={labelClass}>Email*</label>
          <input
            type="text"
            placeholder="you@example.com"
            value={data.email}
            onChange={(e) => update({ email: e.target.value })}
            className={fieldClass}
          />
        </div>

        <div>
          <label className={labelClass}>Priority</label>
          <div className="relative w-full">
            <div
              role="button"
              tabIndex={0}
              className={`flex cursor-pointer items-center justify-between rounded-xl border bg-black/40 px-4 py-3 text-sm transition ${
 open
 ? "border-indigo-400/60 ring-4 ring-indigo-400/10"
 : "border-white/10 hover:border-white/25"
 }`}
              onClick={() => setOpen(!open)}
            >
              <div className="flex items-center gap-2.5">
                <span className={`h-2.5 w-2.5 rounded-full ${selected.color}`} />
                <span className="text-white">{selected.name}</span>
              </div>
              <FiChevronDown
                size={18}
                className={`text-zinc-500 transition-transform ${
 open ? "rotate-180" : ""
 }`}
              />
            </div>

            {open && (
              <div className="absolute bottom-full z-10 mb-2 w-full overflow-hidden rounded-xl border border-white/10 bg-[#18181b] shadow-2xl shadow-black/60">
                {priorities.map((priority, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setSelected(priority);
                      setOpen(false);
                      update({ priority: priority.name });
                    }}
                    className={`flex cursor-pointer items-center gap-2.5 px-4 py-3 text-sm transition hover:bg-white/[0.06] ${
 selected.name === priority.name ? "bg-white/[0.06]" : ""
 }`}
                  >
                    <span className={`h-2.5 w-2.5 rounded-full ${priority.color}`} />
                    <span className="text-white">{priority.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <label className={labelClass}>Title*</label>
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
          <label className={labelClass}>Description*</label>
          <textarea
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
        </div>
      </div>
    );
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#09090b] text-zinc-200 antialiased">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        .fsf-root { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }
        @keyframes fsf-drift { 0%,100% { transform: translate3d(0,0,0) scale(1); } 50% { transform: translate3d(50px,30px,0) scale(1.15); } }
        @keyframes fsf-sheen { from { background-position: 200% 0; } to { background-position: -200% 0; } }
        .fsf-drift { animation: fsf-drift 18s ease-in-out infinite; }
        .fsf-btn { background-size: 200% 100%; }
        .fsf-btn:hover { animation: fsf-sheen 2.4s linear infinite; }
        @media (prefers-reduced-motion: reduce) { .fsf-drift, .fsf-btn:hover { animation: none !important; } }
      `}</style>

      <div className="fsf-root relative">
        {/* ambient background */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[26rem] bg-[radial-gradient(60%_100%_at_50%_0%,rgba(129,140,248,0.09),transparent)]" />
      </div>

        <div className="relative z-10 flex justify-center px-4 py-8 sm:py-14">
          <div className="w-full max-w-xl rounded-3xl p-px bg-white/10">
            {error && (
              <div className="fixed inset-0 z-50 flex h-full items-center justify-center bg-black/70 backdrop-blur-md">
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

            {loading ? (
              <div className="fixed inset-0 z-50 flex h-full items-center justify-center bg-black/70 backdrop-blur-md">
                <div className="-mt-10 mx-auto max-w-xs">
                  <LottiePlayer
                    loop
                    animationData={FeedbackLoader}
                    play
                    className="w-36 lg:w-52"
                  />
                </div>
              </div>
            ) : (
              <div className="rounded-[23px] bg-[#111113]/95 pb-2 backdrop-blur-xl">
                {/* header */}
                <div className="px-5 pt-8 text-center sm:px-8">
                  <span className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold text-indigo-200 ring-1 ring-inset ring-indigo-400/30 bg-indigo-400/15">
                    <HiOutlineSparkles size={14} />
                    Feedback
                  </span>
                  <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl text-white">
                    We Value Your Feedback
                  </h1>
                  <p className="mx-auto mt-3 max-w-sm text-sm text-zinc-400">
                    Help us improve our service by sharing your thoughts and
                    experiences.
                  </p>
                </div>

                {/* section switcher */}
                <div className="px-5 pb-5 pt-7 sm:px-8">
                  <div className="grid grid-cols-3 gap-1.5 rounded-2xl border border-white/[0.07] bg-black/30 p-1.5">
                    {sections.map((i, id) => {
                      const active = selectedSection === i.tittle;
                      return (
                        <button
                          type="button"
                          key={id}
                          onClick={() => {
                            setselectedSection(i.tittle);
                          }}
                          className={`flex flex-col items-center justify-center gap-1.5 rounded-xl px-2 py-3 text-center transition sm:flex-row sm:gap-2 ${
 active
 ? " text-white ring-1 ring-inset ring-indigo-400/40 bg-indigo-400/20"
 : "text-zinc-400 hover:bg-white/[0.05] hover:text-zinc-200"
 }`}
                        >
                          {i.image}
                          <span className="text-[11px] font-semibold leading-tight sm:text-xs">
                            {i.tittle}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {selectedSection === "General Feedback" ? (
                  <>
                    <div className="px-5 sm:px-8">
                      <div className="flex items-center justify-between text-sm">
                        <h2 className="font-semibold text-zinc-200">Rate Us</h2>
                        <p className="text-zinc-500">
                          {selectedRating} out of 5 stars
                        </p>
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <button
                            type="button"
                            aria-label={`${i} star${i > 1 ? "s" : ""}`}
                            key={i}
                            onMouseEnter={() => setHoveredRating(i)}
                            onMouseLeave={() => setHoveredRating(null)}
                            onClick={() => setSelectedRating(i)}
                            className="cursor-pointer transition-transform hover:scale-110"
                          >
                            {i <= (hoveredRating ?? selectedRating) ? (
                              <IoMdStar
                                size={36}
                                className="text-amber-300 drop-"
                              />
                            ) : (
                              <IoIosStarOutline size={36} className="text-zinc-600" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mt-7 px-5 sm:px-8">
                      <label className={labelClass}>Your feedback</label>
                      <textarea
                        value={feedback.feedback}
                        placeholder="Tell us what you think"
                        onChange={(e) =>
                          setFeedback({ ...feedback, feedback: e.target.value })
                        }
                        cols={20}
                        rows={5}
                        className={`${fieldClass} resize-none`}
                      />
                    </div>

                    {/* Emotions */}
                    <div className="mt-7 px-5 sm:px-8">
                      <h2 className="text-sm font-semibold text-zinc-200">
                        How was your experience*
                      </h2>
                      <div className="mt-4 grid grid-cols-3 gap-3">
                        {emotions.map((emotion, idx) => (
                          <button
                            type="button"
                            key={idx}
                            onClick={() => {
                              setSelectedEmotion(idx);
                              setFeedback({
                                ...feedback,
                                emotion: emotion.title,
                              });
                            }}
                            className={`flex flex-col items-center gap-2 rounded-2xl border px-3 py-4 transition-all duration-200 ${
                              selectedEmotion === idx
                                ? `${emotion.active} scale-[1.03] shadow-lg`
                                : "border-white/10 bg-white/[0.03] text-zinc-400 hover:border-white/25 hover:bg-white/[0.06]"
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
                  </>
                ) : selectedSection === "Bug Report" ? (
                  renderIssueForm("bug")
                ) : (
                  renderIssueForm("feature")
                )}

                <div className="px-5 pb-5 pt-8 sm:px-8">
                  <button
                    onClick={saveSectionData}
                    className=" flex w-full items-center justify-center gap-3 rounded-xl px-4 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-400/30 bg-indigo-500 hover:bg-indigo-400"
                  >
                    <span>Share Insights</span>
                    <FaTelegramPlane size={20} />
                  </button>
                  <p className="mt-4 text-center text-xs text-zinc-600">
                    Powered by FeedSenseAI
                  </p>
                </div>
              </div>
            )}
          </div>
          <ToastContainer theme="dark" toastClassName={"custom-toast"} />
        </div>
      </div>
    </div>
  );
};

export default Form;