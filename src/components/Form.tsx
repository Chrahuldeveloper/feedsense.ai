"use client";
import dbService from "@/firebase/utils/db";
import { useParams } from "next/navigation";
import React, { useState } from "react";

interface Props {
  formBgColor: string;
  inputBgColor: string;
  textColor: string;
  buttonColor: string;
}

const Form: React.FC<Props> = ({
  formBgColor,
  inputBgColor,
  textColor,
  buttonColor,
}) => {
  const { userID, websiteID } = useParams();
  const [feedback, setFeedback] = useState({
    name: "",
    email: "",
    feedback: "",
  });
  const db = new dbService();

  const saveFeedBack = async () => {
    try {
      const isSubscribed = await db.checkifSubscribed(userID, websiteID);

      if (isSubscribed) {
        await db.saveFeedback(userID, websiteID, feedback);
        alert("Feedback submitted successfully!");
        setFeedback({ name: "", email: "", feedback: "" });
      } else {
        alert("You are not subscribed to this website.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center p-4 sm:p-8">
      <div
        style={{ backgroundColor: formBgColor }}
        className="p-5 border-[#272b2f] rounded-lg border-[1px] shadow-lg w-full max-w-md sm:max-w-lg lg:max-w-xl"
      >
        <div className="text-center">
          <h1 className="text-xl font-bold" style={{ color: textColor }}>
            Feedback
          </h1>
        </div>
        <div className="space-y-2 mt-6">
          <h1 className="font-semibold" style={{ color: textColor }}>
            Name*
          </h1>
          <input
            type="text"
            value={feedback.name}
            onChange={(e) => {
              setFeedback({ ...feedback, name: e.target.value });
            }}
            autoComplete="off"
            className="border-[1px] border-neutral-900 px-3 py-2 outline-none w-full rounded-lg"
            style={{ backgroundColor: inputBgColor, color: textColor }}
          />
        </div>
        <div className="space-y-2 mt-6">
          <h1 className="font-semibold" style={{ color: textColor }}>
            Email*
          </h1>
          <input
            type="text"
            value={feedback.email}
            onChange={(e) => {
              setFeedback({ ...feedback, email: e.target.value });
            }}
            autoComplete="off"
            className="border-[1px] border-neutral-900 px-3 py-2 outline-none w-full rounded-lg"
            style={{ backgroundColor: inputBgColor, color: textColor }}
          />
        </div>
        <div className="space-y-2 mt-6">
          <h1 className="font-semibold" style={{ color: textColor }}>
            Feedback*
          </h1>
          <textarea
            value={feedback.feedback}
            onChange={(e) => {
              setFeedback({ ...feedback, feedback: e.target.value });
            }}
            cols={20}
            rows={5}
            className="border-[1px] border-neutral-900 px-3 py-2 outline-none w-full rounded-lg"
            style={{ backgroundColor: inputBgColor, color: textColor }}
          />
        </div>
        <div className="mt-4">
          <button
            onClick={saveFeedBack}
            className="text-white px-4 py-2 rounded-lg w-full hover:brightness-75 transition duration-300"
            style={{ backgroundColor: buttonColor }}
          >
            Submit
          </button>
        </div>
        <p className="text-slate-300 text-center mt-5">Powered By FixiT</p>
      </div>
    </div>
  );
};

export default Form;
