"use client";
import dbService from "@/firebase/utils/db";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { IoHappyOutline, IoSadOutline } from "react-icons/io5";
import { TbMoodSadDizzy } from "react-icons/tb";
import LottiePlayer from "react-lottie-player";
import FeedbackLoader from "../app/lottie-asserts/FeedbackLoader.json";
import ErrorLoader from "../app/lottie-asserts/ErrorLoader.json";
import { IoIosStarOutline, IoMdStar } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";

interface Feedback {
  emotion: string;
  feedback: string;
  Rating: number;
}

interface Emotion {
  title: string;
  emoji: JSX.Element;
}

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
        toast("You are not subscribed to this website.");
      }
    } catch (error) {
      console.log(error);
      seterror(true);
    } finally {
      setLoading(false);
    }
  };

  const emotions: Emotion[] = [
    { title: "Happy", emoji: <IoHappyOutline size={32} color="#c1d0d5" /> },
    { title: "Neutral", emoji: <IoSadOutline size={32} color="#c1d0d5" /> },
    { title: "Sad", emoji: <TbMoodSadDizzy size={32} color="#c1d0d5" /> },
  ];

  return (
    <div className="flex justify-center p-5 pt-5">
      <div className="rounded-lg shadow-lg w-full max-w-lg sm:max-w-lg lg:max-w-xl border-[1px] bg-[#121212] border-[#282e32]">
        {error ? (
          <>
            <div className="fixed inset-0 z-50 flex items-center justify-center h-full bg-black bg-opacity-70 blur-xs">
              <div className="max-w-xs mx-auto -mt-10 text-center flex flex-col items-center space-y-3">
                <LottiePlayer
                  loop
                  animationData={ErrorLoader}
                  play
                  className="w-36 lg:w-52"
                />
                <p className="text-white text-sm">
                  Website Stoppped Collecting Feedbacks
                </p>
              </div>
            </div>
          </>
        ) : null}

        {loading ? (
          <>
            <div className="fixed inset-0 z-50 flex items-center justify-center h-full bg-black bg-opacity-70 blur-xs">
              <div className="max-w-xs mx-auto -mt-10">
                <LottiePlayer
                  loop
                  animationData={FeedbackLoader}
                  play
                  className="w-36 lg:w-52"
                />
              </div>
            </div>
          </>
        ) : (
          <div className="">
            <div className="bg-[#1e1e1e] p-6 rounded-t-lg border-b-[1px] border-stone-800 space-y-2">
              <h1 className="text-xl font-bold text-white">
                Your Opinion Matters
              </h1>
              <p className="text-white text-xs font-semibold">
                Take a moment to share your feedback
              </p>
            </div>

            <div className="space-y-2.5 mt-4  px-5">
              <div>
                <h1 className="text-white font-semibold">Rate Us</h1>
              </div>
              <div className="flex items-center gap-5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedRating(i)}
                    className="cursor-pointer"
                  >
                    {i <= selectedRating ? (
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
                className="bg-[#1E1E1E] border-[1px] border-[#282e32] pl-3 pr-4 py-2 w-full rounded-lg text-white "
              />
            </div>

            <div className="mt-6 space-y-2.5 px-5">
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
                      selectedEmotion === idx ? "bg-[#282e32]" : ""
                    }`}
                  >
                    {emotion.emoji}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 p-5">
              <button
                onClick={saveFeedBack}
                className="text-black font-semibold px-4 py-2 rounded-lg w-full bg-slate-50 text-sm"
              >
                Share Insights
              </button>
            </div>
            <p className="text-stone-600 text-center my-4">
              Powered By{" "}
              <span>
                <Link href={"#"}>FeedSense.ai</Link>
              </span>
            </p>
          </div>
        )}
      </div>
      <ToastContainer theme="dark" toastClassName={"custom-toast"} />
    </div>
  );
};

export default Form;
