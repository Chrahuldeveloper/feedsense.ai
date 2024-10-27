"use client";
import dbService from "@/firebase/utils/db";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { RxCross2 } from "react-icons/rx";

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
  const [isOpen, setIsOpen] = useState(false);
  const { userID, websiteID } = useParams();

  const toggleForm = () => {
    setIsOpen(!isOpen);
  };

  const [feedback, setfeedback] = useState({
    name: "",
    email: "",
    feedback: "",
  });

  const db = new dbService();

  const saveFeedBack = async () => {
    try {
      // check if he is one basic plan if yes then only 100 feedbacks if not then unlimted

      await db.saveFeedback(userID, websiteID, feedback);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="">
        <button
          className={`fixed right-[-1.5rem] text-lg top-1/2 p-3 -rotate-90 transform translate-y-[-50%] border-[#272b2f] bg-[#18181b] rounded-lg border-[1px] text-slate-300 focus:outline-none z-[1000] ${
            isOpen ? "hidden" : "block"
          }`}
          onClick={toggleForm}
        >
          Feedback
        </button>
        <div
          className={`fixed right-0 w-[85vw] md:w-[35vw] top-16 p-5 border-[#272b2f] rounded-lg border-[1px] shadow-lg z-50 transform transition-transform duration-500 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
          style={{ backgroundColor: formBgColor }}
        >
          <div className="flex justify-end">
            <RxCross2
              onClick={toggleForm}
              size={25}
              color={textColor}
              cursor={"pointer"}
            />
          </div>
          <div className="text-center">
            <h1 className={`text-xl font-bold`} style={{ color: textColor }}>
              Feedback {websiteID}
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
                setfeedback({ ...feedback, name: e.target.value });
              }}
              autoComplete="false"
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
                setfeedback({ ...feedback, email: e.target.value });
              }}
              autoComplete="false"
              className="border-[1px] border-neutral-900 px-3 py-2 outline-none w-full rounded-lg"
              style={{ backgroundColor: inputBgColor, color: textColor }}
            />
          </div>
          <div className="space-y-2 mt-6">
            <h1 className="font-semibold" style={{ color: textColor }}>
              Feedback*
            </h1>
            <textarea
              autoComplete="false"
              value={feedback.feedback}
              onChange={(e) => {
                setfeedback({ ...feedback, feedback: e.target.value });
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
              className="text-white px-4 py-2 rounded-lg w-full hover:brightness-75 ease-in-out duration-300"
              style={{ backgroundColor: buttonColor }}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Form;
