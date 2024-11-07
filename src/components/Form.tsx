"use client";
import dbService from "@/firebase/utils/db";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { IoHappyOutline, IoSadOutline } from "react-icons/io5";
import { TbMoodSadDizzy } from "react-icons/tb";
import LottiePlayer from "react-lottie-player";
import FeedbackLoader from "../app/lottie-asserts/FeedbackLoader.json";

const Form = () => {
  const { userID, websiteID } = useParams();
  const [feedback, setFeedback] = useState({
    name: "",
    emotion: "",
    feedback: "",
  });
  const [selectedEmotion, setSelectedEmotion] = useState<number>();
  const [loading, setLoading] = useState(false);
  const [feedbackStatus, setFeedbackStatus] = useState("");
  const db = new dbService();

  const saveFeedBack = async () => {
    setLoading(true);
    setFeedbackStatus("Saving feedback...");
    try {
      const isSubscribed = await db.checkifSubscribed(userID, websiteID);
      if (isSubscribed) {
        await db.saveFeedback(userID, websiteID, feedback);
        setFeedbackStatus("Feedback saved successfully!");
        setFeedback({ name: "", emotion: "", feedback: "" });
        setSelectedEmotion(null);
      } else {
        alert("You are not subscribed to this website.");
        setFeedbackStatus("");
      }
    } catch (error) {
      console.log(error);
      setFeedbackStatus("Failed to save feedback.");
    } finally {
      setLoading(false);
    }
  };

  const emotions = [
    { title: "Happy", emoji: <IoHappyOutline size={32} color="#c1d0d5" /> },
    { title: "Neutral", emoji: <IoSadOutline size={32} color="#c1d0d5" /> },
    { title: "Sad", emoji: <TbMoodSadDizzy size={32} color="#c1d0d5" /> },
  ];

  return (
    <div className="flex justify-center p-5">
      <div className="rounded-lg shadow-lg w-full max-w-md sm:max-w-lg lg:max-w-xl border-[1px] bg-[#121212] border-[#282e32]">
        <div className="bg-gradient-to-r from-blue-600 via-blue-600 to-blue-500 p-6 rounded-t-lg border-b-[1px] border-stone-800 space-y-2">
          <h1 className="text-2xl font-bold text-white">
            Send Us Your Feedback
          </h1>
          <p className="text-white text-sm font-semibold">
            Do you have any suggestions to improve our services or product?
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center w-[60w]">
            <LottiePlayer loop animationData={FeedbackLoader} play />
            <p className="text-white text-lg ">{feedbackStatus}</p>
          </div>
        ) : (
          <div className="p-5">
            <div className="space-y-2.5 mt-4">
              <h1 className="font-semibold text-white">Name*</h1>
              <input
                type="text"
                value={feedback.name}
                onChange={(e) =>
                  setFeedback({ ...feedback, name: e.target.value })
                }
                autoComplete="off"
                className="bg-[#1E1E1E] border-[1px] border-[#282e32] pl-3 pr-4 py-2 w-full rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="space-y-2.5 mt-6">
              <h1 className="font-semibold text-white">Feedback*</h1>
              <textarea
                value={feedback.feedback}
                onChange={(e) =>
                  setFeedback({ ...feedback, feedback: e.target.value })
                }
                cols={20}
                rows={5}
                className="bg-[#1E1E1E] border-[1px] border-[#282e32] pl-3 pr-4 py-2 w-full rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="mt-6 space-y-2.5">
              <h1 className="font-semibold text-white">
                How was your experience*
              </h1>
              <div className="flex items-center space-x-5 mt-4">
                {emotions.map((emotion, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setSelectedEmotion(idx);
                      setFeedback({ ...feedback, emotion: emotion.title });
                    }}
                    className={`cursor-pointer p-2 rounded-full ${
                      selectedEmotion === idx
                        ? "bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700"
                        : ""
                    }`}
                  >
                    {emotion.emoji}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <button
                onClick={saveFeedBack}
                className="text-white px-4 py-2 rounded-lg w-full bg-gradient-to-r from-blue-400 via-blue-600 to-blue-700"
              >
                Share Insights
              </button>
            </div>
          </div>
        )}
        <p className="text-stone-600 text-center my-2">
          Powered By{" "}
          <span>
            <Link href={"#"}>FeedSense.ai</Link>
          </span>
        </p>
      </div>
    </div>
  );
};

export default Form;
