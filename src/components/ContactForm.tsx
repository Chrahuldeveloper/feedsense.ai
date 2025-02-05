"use client";

import dbService from "@/firebase/utils/db";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const db = new dbService();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      await db.ContactUs(formData);
      // setFormData({
      //   name: "",
      //   email: "",
      //   message: "",
      // });
      toast("We will Contact You Soon..!");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="max-w-xl mx-auto py-7">
        <div className="">
          <div className="bg-[#111115] p-8  w-[95vw] md:w-[40vw] mx-auto border-[#15171b] border-[1px] shadow-2xl">
            <div>
              <h1 className="text-slate-300 text-2xl font-semibold">
                Reach out to us
              </h1>
            </div>

            <div className="space-y-6 mt-8">
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-slate-300"
                >
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="bg-[#0c0c0c] border-[1px] border-[#15171b] outline-none p-3 rounded-lg w-full text-sm focus:outline-none focus:border-blue-500 transition-colors text-white"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-slate-300"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="bg-[#0c0c0c] border-[1px] border-[#15171b] outline-none p-3 rounded-lg w-full text-sm focus:outline-none focus:border-blue-500 transition-colors text-white"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="message"
                  className="text-sm font-medium text-slate-300"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  className="bg-[#0c0c0c] border-[1px] border-[#15171b] outline-none p-3 rounded-lg w-full text-sm focus:outline-none focus:border-blue-500 transition-colors text-white"
                  placeholder="Enter your message"
                  rows={8}
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>
              <button
                onClick={handleSubmit}
                className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-600 mt-8 text-slate-300 py-2 px-4 w-full font-semibold rounded-lg text-sm transition-colors flex items-center justify-center"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer theme="dark" toastClassName={"custom-toast"} />
    </>
  );
};

export default ContactForm;
