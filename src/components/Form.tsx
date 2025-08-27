"use client";
import dbService from "@/firebase/utils/db";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { IoHappyOutline, IoSadOutline } from "react-icons/io5";
import { TbMoodSadDizzy } from "react-icons/tb";
import LottiePlayer from "react-lottie-player";
import FeedbackLoader from "../app/lottie-asserts/FeedbackLoader.json";
import ErrorLoader from "../app/lottie-asserts/ErrorLoader.json";
import { IoIosStarOutline, IoMdStar } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTelegramPlane } from "react-icons/fa";
import { IoBugOutline } from "react-icons/io5";

interface Feedback {
  emotion: string;
  feedback: string;
  Rating: number;
}

interface Emotion {
  title: string;
  emoji: JSX.Element;
}

interface Bug {
  email: string;
  priority: string;
  tittle: string;
  desc: string;
}

type Feature = Bug;

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
    { title: "Happy", emoji: <IoHappyOutline size={32} color="#c1d0d5" /> },
    { title: "Neutral", emoji: <IoSadOutline size={32} color="#c1d0d5" /> },
    { title: "Sad", emoji: <TbMoodSadDizzy size={32} color="#c1d0d5" /> },
  ];

  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

  const sections = [
    {
      image: <IoBugOutline size={24} color="white" />,
      tittle: "General Feedback",
    },
    {
      image: <IoBugOutline size={24} color="white" />,
      tittle: "Bug Report",
    },
    {
      image: <IoBugOutline size={24} color="white" />,
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

  return (
    <div className="bg-gradient-to-b from-[#0c0c0e] via-[#1f1f21] to-[#2a2b2d] w-full ">
      <div className="flex justify-center p-5 pt-5">
        <div className="rounded-xl shadow-lg w-full max-w-lg sm:max-w-lg lg:max-w-xl border-[0.8px] border-[#121212]">
          {error && (
            <div className="fixed inset-0 z-50 flex items-center justify-center h-full bg-black bg-opacity-70">
              <div className="max-w-xs mx-auto -mt-10 text-center flex flex-col items-center space-y-3">
                <LottiePlayer
                  loop
                  animationData={ErrorLoader}
                  play
                  className="w-36 lg:w-52"
                />
                <p className="text-white text-sm">
                  Website Stopped Collecting Feedbacks
                </p>
              </div>
            </div>
          )}

          {loading ? (
            <div className="fixed inset-0 z-50 flex items-center justify-center h-full bg-black bg-opacity-70">
              <div className="max-w-xs mx-auto -mt-10">
                <LottiePlayer
                  loop
                  animationData={FeedbackLoader}
                  play
                  className="w-36 lg:w-52"
                />
              </div>
            </div>
          ) : (
            <div className="bg-[#080809]">
              <div className="w-36 py-1.5 mx-auto rounded-full text-blue-600 bg-[#0e1522] text-center my-4 border-[1px] border-blue-600">
                <p className="text-xs">Feedback</p>
              </div>
              <div className="flex flex-col gap-3 my-4 justify-center text-center text-gray-300">
                <h1 className="text-2xl font-bold">We Value Your Feedback</h1>
                <p className="text-sm max-w-sm mx-auto">
                  Help us improve our service by sharing your thoughts and
                  experiences.
                </p>
              </div>

              <div className="flex items-center space-x-7 justify-center">
                {sections.map((i, id) => {
                  return (
                    <div
                      key={id}
                      onClick={() => {
                        setselectedSection(i.tittle);
                      }}
                    >
                      <div
                        className={`flex justify-center items-center space-x-2 cursor-pointer  rounded-lg px-3 py-2 text-gray-300 bg-[#0e1522] text-center my-4  ${
                          selectedSection === i.tittle
                            ? "border-[1px] border-blue-600 text-blue-600"
                            : ""
                        } `}
                      >
                        {i.image}
                        <h1 className="text-white text-xs">{i.tittle}</h1>
                      </div>
                    </div>
                  );
                })}
              </div>

              {selectedSection === "General Feedback" ? (
                <>
                  <div className="space-y-2.5 mt-4 px-5">
                    <div className="flex justify-between items-center text-sm">
                      <h1 className="text-gray-300 font-semibold">Rate Us</h1>
                      <p className="text-gray-300 font-semibold">
                        {selectedRating} out of 5 stars
                      </p>
                    </div>
                    <div className="flex items-center gap-5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          onMouseEnter={() => setHoveredRating(i)}
                          onMouseLeave={() => setHoveredRating(null)}
                          onClick={() => setSelectedRating(i)}
                          className="cursor-pointer"
                        >
                          {i <= (hoveredRating ?? selectedRating) ? (
                            <IoMdStar size={24} color="gold" />
                          ) : (
                            <IoIosStarOutline size={24} color="white" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2.5 mt-7 px-5">
                    <textarea
                      value={feedback.feedback}
                      placeholder="Feedback"
                      onChange={(e) =>
                        setFeedback({ ...feedback, feedback: e.target.value })
                      }
                      cols={20}
                      rows={5}
                      className="bg-[#131314] border-[1px] border-[#282e32] pl-3 pr-4 py-2 w-full rounded-xl text-white outline-none hover:border-blue-400 transition ease-in-out duration-300"
                    />
                  </div>

                  {/* Emotions */}
                  <div className="mt-6 space-y-2.5 px-5">
                    <h1 className="font-semibold text-white text-sm">
                      How was your experience*
                    </h1>
                    <div className="flex items-center justify-center space-x-5 mt-4">
                      {emotions.map((emotion, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            setSelectedEmotion(idx);
                            setFeedback({
                              ...feedback,
                              emotion: emotion.title,
                            });
                          }}
                          className={`cursor-pointer flex items-center justify-center w-16 h-16 p-3 rounded-lg transition-all duration-200 ${
                            selectedEmotion === idx
                              ? "bg-[#0e1522] border-[1px] border-blue-600"
                              : ""
                          }`}
                        >
                          <div className="flex flex-col items-center space-y-1">
                            {emotion.emoji}
                            <p className="text-xs text-gray-300 font-semibold">
                              {emotion.title}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : selectedSection === "Bug Report" ? (
                <>
                  <div className="flex flex-col justify-center px-10 space-y-6 my-3">
                    <div className="space-y-2">
                      <h1 className="text-white">Email*</h1>
                      <input
                        type="text"
                        placeholder="
                        Email."
                        value={bug.email}
                        onChange={(e) => {
                          setbug({ ...bug, email: e.target.value });
                        }}
                        className="bg-[#131314] border-[1px] border-[#282e32] pl-3 pr-4 py-2 w-full rounded-xl text-white outline-none hover:border-blue-400 transition ease-in-out duration-300"
                      />
                    </div>

                    <div className="space-y-2">
                      <h1 className="text-white">Priority</h1>

                      <div className="relative w-full">
                        <div
                          className="flex items-center justify-between bg-[#131314] border border-[#282e32] rounded-xl px-4 py-3 cursor-pointer hover:border-blue-400 transition"
                          onClick={() => setOpen(!open)}
                        >
                          <div className="flex items-center space-x-2">
                            <span
                              className={`w-3 h-3 rounded-full ${selected.color}`}
                            ></span>
                            <span className="text-white">{selected.name}</span>
                          </div>
                          <span className="text-gray-400">▼</span>
                        </div>

                        {open && (
                          <div className="absolute bottom-full mb-1 w-full bg-[#131314] border border-[#282e32] rounded-xl shadow-lg z-10">
                            {priorities.map((priority, idx) => (
                              <div
                                key={idx}
                                onClick={() => {
                                  setSelected(priority);
                                  setOpen(false);
                                  setbug({ ...bug, priority: priority.name });
                                }}
                                className={`flex items-center space-x-2 px-4 py-3 cursor-pointer hover:bg-[#1f2937] transition ${
                                  selected.name === priority.name
                                    ? "bg-[#1f2937]"
                                    : ""
                                }`}
                              >
                                <span
                                  className={`w-3 h-3 rounded-full ${priority.color}`}
                                ></span>
                                <span className="text-white">
                                  {priority.name}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h1 className="text-white">Tittle*</h1>
                      <input
                        type="text"
                        value={bug.tittle}
                        onChange={(e) => {
                          setbug({ ...bug, tittle: e.target.value });
                        }}
                        placeholder="
                        Brief description of the bug."
                        className="bg-[#131314] border-[1px] border-[#282e32] pl-3 pr-4 py-2 w-full rounded-xl text-white outline-none hover:border-blue-400 transition ease-in-out duration-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <h1 className="text-white">Description*</h1>
                      <textarea
                        cols={10}
                        rows={8}
                        value={bug.desc}
                        onChange={(e) => {
                          setbug({ ...bug, desc: e.target.value });
                        }}
                        placeholder="
                          Please describe the bug in detail, including steps to reproduce.."
                        className="bg-[#131314] border-[1px] border-[#282e32] pl-3 pr-4 py-2 w-full rounded-xl text-white outline-none hover:border-blue-400 transition ease-in-out duration-300"
                      ></textarea>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-col justify-center px-10 space-y-6 my-3">
                    <div className="space-y-2">
                      <h1 className="text-white">Email*</h1>
                      <input
                        type="text"
                        placeholder="
                        Email."
                        value={feature.email}
                        onChange={(e) => {
                          setfeature({ ...feature, email: e.target.value });
                        }}
                        className="bg-[#131314] border-[1px] border-[#282e32] pl-3 pr-4 py-2 w-full rounded-xl text-white outline-none hover:border-blue-400 transition ease-in-out duration-300"
                      />
                    </div>

                    <div className="space-y-2">
                      <h1 className="text-white">Priority</h1>

                      <div className="relative w-full">
                        <div
                          className="flex items-center justify-between bg-[#131314] border border-[#282e32] rounded-xl px-4 py-3 cursor-pointer hover:border-blue-400 transition"
                          onClick={() => setOpen(!open)}
                        >
                          <div className="flex items-center space-x-2">
                            <span
                              className={`w-3 h-3 rounded-full ${selected.color}`}
                            ></span>
                            <span className="text-white">{selected.name}</span>
                          </div>
                          <span className="text-gray-400">▼</span>
                        </div>

                        {open && (
                          <div className="absolute bottom-full mb-1 w-full bg-[#131314] border border-[#282e32] rounded-xl shadow-lg z-10">
                            {priorities.map((priority, idx) => (
                              <div
                                key={idx}
                                onClick={() => {
                                  setSelected(priority);
                                  setOpen(false);
                                  setfeature({
                                    ...feature,
                                    priority: priority.name,
                                  });
                                }}
                                className={`flex items-center space-x-2 px-4 py-3 cursor-pointer hover:bg-[#1f2937] transition ${
                                  selected.name === priority.name
                                    ? "bg-[#1f2937]"
                                    : ""
                                }`}
                              >
                                <span
                                  className={`w-3 h-3 rounded-full ${priority.color}`}
                                ></span>
                                <span className="text-white">
                                  {priority.name}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h1 className="text-white">Tittle*</h1>

                      <input
                        type="text"
                        value={feature.tittle}
                        onChange={(e) => {
                          setfeature({ ...feature, tittle: e.target.value });
                        }}
                        placeholder="
                        Brief description of the bug."
                        className="bg-[#131314] border-[1px] border-[#282e32] pl-3 pr-4 py-2 w-full rounded-xl text-white outline-none hover:border-blue-400 transition ease-in-out duration-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <h1 className="text-white">Description*</h1>
                      <textarea
                        cols={10}
                        rows={8}
                        value={feature.desc}
                        onChange={(e) => {
                          setfeature({ ...feature, desc: e.target.value });
                        }}
                        placeholder="
                          Please describe the bug in detail, including steps to reproduce.."
                        className="bg-[#131314] border-[1px] border-[#282e32] pl-3 pr-4 py-2 w-full rounded-xl text-white outline-none hover:border-blue-400 transition ease-in-out duration-300"
                      ></textarea>
                    </div>
                  </div>
                </>
              )}

              <div className="my-3 p-5">
                <button
                  onClick={saveSectionData}
                  className="text-black  flex items-center justify-center gap-3 font-semibold px-4 py-2 rounded-lg w-full bg-slate-50 text-sm"
                >
                  <h1>Share Insights</h1>
                  <FaTelegramPlane size={25} color="black" />
                </button>
              </div>
            </div>
          )}
        </div>
        <ToastContainer theme="dark" toastClassName={"custom-toast"} />
      </div>
    </div>
  );
};

export default Form;
