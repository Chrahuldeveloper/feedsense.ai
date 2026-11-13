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
import { FiMail, FiCheck, FiArrowRight } from "react-icons/fi";
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
  "w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-[15px] text-white placeholder:text-zinc-600 outline-none transition hover:border-white/20 focus:border-indigo-400/70 focus:bg-white/[0.05] focus:ring-4 focus:ring-indigo-400/15";

const Field = ({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div>
    <div className="mb-2 flex items-baseline justify-between">
      <label className="text-sm font-medium text-zinc-200">{label}</label>
      {hint && <span className="text-xs text-zinc-500">{hint}</span>}
    </div>
    {children}
  </div>
);

const ratingLabels = ["Poor", "Fair", "Good", "Very good", "Excellent"];

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
        toast.success("Thank you for your feedback!");
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
        toast.success("Bug report submitted. Thank you!");
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
        toast.success("Feature request submitted. Thank you!");
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

  const sectionIndex = Math.max(
    0,
    sections.findIndex((s) => s.tittle === selectedSection)
  );

  const shortLabels = ["General", "Bug report", "Feature"];

  /* one layout for the bug and feature forms, wired to the same setters */
  const renderIssueForm = (kind: "bug" | "feature") => {
    const data = kind === "bug" ? bug : feature;
    const update = (patch: Partial<Bug>) =>
      kind === "bug"
        ? setbug({ ...bug, ...patch })
        : setfeature({ ...feature, ...patch });

    return (
      <div className="space-y-6">
        <Field label="Email*">
          <div className="relative">
            <FiMail
              size={17}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
            />
            <input
              type="text"
              placeholder="you@example.com"
              value={data.email}
              onChange={(e) => update({ email: e.target.value })}
              className={`${fieldClass} pl-11`}
            />
          </div>
        </Field>

        <Field label="Priority">
          <div role="radiogroup" className="grid grid-cols-3 gap-2">
            {priorities.map((priority) => {
              const active = selected.name === priority.name;
              return (
                <button
                  type="button"
                  role="radio"
                  aria-checked={active}
                  key={priority.name}
                  onClick={() => {
                    setSelected(priority);
                    setOpen(false);
                    update({ priority: priority.name });
                  }}
                  className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-medium transition ${
                    active
                      ? "border-indigo-400/60 bg-indigo-400/10 text-white"
                      : "border-white/10 bg-white/[0.03] text-zinc-400 hover:border-white/20 hover:text-zinc-200"
                  }`}
                >
                  <span className={`h-2 w-2 rounded-full ${priority.color}`} />
                  {priority.name.replace(" Priority", "")}
                </button>
              );
            })}
          </div>
        </Field>

        <Field label="Title*">
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
        </Field>

        <Field label="Description*" hint={`${data.desc.length} characters`}>
          <textarea
            cols={10}
            rows={6}
            value={data.desc}
            onChange={(e) => update({ desc: e.target.value })}
            placeholder={
              kind === "bug"
                ? "What happened, and what did you expect? Include steps to reproduce."
                : "Tell us what you would like and how it would help you"
            }
            className={`${fieldClass} resize-none leading-6`}
          ></textarea>
        </Field>
      </div>
    );
  };

  const activeRating = hoveredRating ?? selectedRating;

  return (
    <div className="fsf-root relative min-h-screen w-full bg-[#09090b] text-zinc-200 antialiased">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        .fsf-root { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }
        @keyframes fsf-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        .fsf-card { animation: fsf-in .5s cubic-bezier(.2,.7,.2,1) both; }
        @media (prefers-reduced-motion: reduce) { .fsf-card { animation: none; } }
      `}</style>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[26rem] bg-[radial-gradient(60%_100%_at_50%_0%,rgba(129,140,248,0.09),transparent)]"
      />

      {error && (
        <div className="fixed inset-0 z-50 flex h-full items-center justify-center bg-[#09090b]/85 backdrop-blur-md">
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

      {loading && (
        <div className="fixed inset-0 z-50 flex h-full items-center justify-center bg-[#09090b]/85 backdrop-blur-md">
          <div className="-mt-10 mx-auto max-w-xs">
            <LottiePlayer
              loop
              animationData={FeedbackLoader}
              play
              className="w-36 lg:w-52"
            />
          </div>
        </div>
      )}

      <div className="relative z-10 flex min-h-screen items-start justify-center px-4 py-8 sm:items-center sm:py-14">
        <div className="fsf-card w-full max-w-[560px]">
          {/* brand */}
          <div className="mb-6 flex items-center justify-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-500 text-white">
              <HiOutlineSparkles size={18} />
            </span>
            <span className="text-[15px] font-semibold tracking-tight text-white">
              FeedSense.ai
            </span>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-[#111113] shadow-2xl shadow-black/50">
            {/* header */}
            <div className="px-6 pb-2 pt-8 text-center sm:px-9 sm:pt-10">
              <h1 className="text-[28px] font-semibold leading-tight tracking-tight text-white sm:text-[32px]">
                We Value Your Feedback
              </h1>
              <p className="mx-auto mt-3 max-w-sm text-[15px] leading-6 text-zinc-400">
                Help us improve our service by sharing your thoughts and
                experiences.
              </p>
            </div>

            {/* segmented control with sliding indicator */}
            <div className="px-6 pb-7 pt-7 sm:px-9">
              <div
                role="tablist"
                className="relative grid grid-cols-3 rounded-xl border border-white/[0.06] bg-white/[0.03] p-1"
              >
                <span
                  aria-hidden
                  className="absolute inset-y-1 left-1 w-[calc((100%-0.5rem)/3)] rounded-lg bg-white/[0.09] ring-1 ring-inset ring-white/10 transition-transform duration-300 ease-out"
                  style={{ transform: `translateX(${sectionIndex * 100}%)` }}
                />
                {sections.map((i, id) => {
                  const active = selectedSection === i.tittle;
                  return (
                    <button
                      type="button"
                      role="tab"
                      aria-selected={active}
                      key={id}
                      onClick={() => {
                        setselectedSection(i.tittle);
                      }}
                      className={`relative z-10 flex items-center justify-center gap-2 rounded-lg px-2 py-2.5 text-[13px] font-medium transition-colors ${
                        active ? "text-white" : "text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      <span className="hidden sm:inline">{i.image}</span>
                      {shortLabels[id]}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-white/[0.06]" />

            {/* form body */}
            <div className="px-6 py-7 sm:px-9 sm:py-8">
              {selectedSection === "General Feedback" ? (
                <div className="space-y-8">
                  {/* rating */}
                  <div>
                    <div className="flex items-baseline justify-between">
                      <h2 className="text-sm font-medium text-zinc-200">Rate Us</h2>
                      <p className="text-xs text-zinc-500">
                        {activeRating > 0
                          ? `${ratingLabels[activeRating - 1]} · ${selectedRating} out of 5 stars`
                          : `${selectedRating} out of 5 stars`}
                      </p>
                    </div>
                    <div className="mt-3 flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <button
                          type="button"
                          aria-label={`${i} star${i > 1 ? "s" : ""}`}
                          key={i}
                          onMouseEnter={() => setHoveredRating(i)}
                          onMouseLeave={() => setHoveredRating(null)}
                          onClick={() => setSelectedRating(i)}
                          className="rounded-md p-1 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-400/25"
                        >
                          {i <= activeRating ? (
                            <IoMdStar size={34} className="text-amber-300" />
                          ) : (
                            <IoIosStarOutline size={34} className="text-zinc-700" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* feedback */}
                  <Field
                    label="Your feedback"
                    hint={`${feedback.feedback.length} characters`}
                  >
                    <textarea
                      value={feedback.feedback}
                      placeholder="Tell us what you think"
                      onChange={(e) =>
                        setFeedback({ ...feedback, feedback: e.target.value })
                      }
                      cols={20}
                      rows={5}
                      className={`${fieldClass} resize-none leading-6`}
                    />
                  </Field>

                  {/* emotions */}
                  <div>
                    <h2 className="text-sm font-medium text-zinc-200">
                      How was your experience*
                    </h2>
                    <div role="radiogroup" className="mt-3 grid grid-cols-3 gap-3">
                      {emotions.map((emotion, idx) => {
                        const active = selectedEmotion === idx;
                        return (
                          <button
                            type="button"
                            role="radio"
                            aria-checked={active}
                            key={idx}
                            onClick={() => {
                              setSelectedEmotion(idx);
                              setFeedback({
                                ...feedback,
                                emotion: emotion.title,
                              });
                            }}
                            className={`relative flex flex-col items-center gap-2.5 rounded-xl border px-3 py-5 transition-all duration-200 ${
                              active
                                ? emotion.active
                                : "border-white/10 bg-white/[0.03] text-zinc-500 hover:border-white/20 hover:text-zinc-300"
                            }`}
                          >
                            {active && (
                              <span className="absolute right-2.5 top-2.5 grid h-4 w-4 place-items-center rounded-full bg-current">
                                <FiCheck size={10} strokeWidth={4} className="text-[#111113]" />
                              </span>
                            )}
                            {emotion.emoji}
                            <span className="text-[13px] font-medium">
                              {emotion.title}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : selectedSection === "Bug Report" ? (
                renderIssueForm("bug")
              ) : (
                renderIssueForm("feature")
              )}

              <button
                onClick={saveSectionData}
                className="group mt-9 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 px-5 py-3.5 text-[15px] font-semibold text-white transition hover:bg-indigo-400 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-400/30 active:scale-[0.99]"
              >
                Share Insights
                <FiArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </button>
            </div>
          </div>

          <p className="mt-6 flex items-center justify-center gap-2 text-xs text-zinc-600">
            <HiOutlineSparkles size={14} />
            Powered by FeedSenseAI
          </p>
        </div>
        <ToastContainer theme="dark" toastClassName={"custom-toast"} />
      </div>
    </div>
  );
};

export default Form;