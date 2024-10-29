"use client";

import dbService from "@/firebase/utils/db";
import React, { useState } from "react";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const db = new dbService();

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: any) => {
    try {
      await db.ContactUs(formData);
      setFormData({
        name: "",
        email: "",
        message: "",
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-7">
      <div className="">
        <div className="bg-[#121212] p-8 rounded-lg w-[80vw] md:w-[35vw] mx-auto border-[#282e32] border-[1px] shadow-2xl">
          <div>
            <h1 className="text-white text-2xl font-semibold">Contact Us</h1>
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
                className="bg-[#1E1E1E] border-[1px] border-[#282e32] pl-4 pr-4 py-2 w-full rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
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
                className="bg-[#1E1E1E] border-[1px] border-[#282e32] pl-4 pr-4 py-2 w-full rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
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
                className="bg-[#1E1E1E] border-[1px] border-[#282e32] pl-4 pr-4 py-2 w-full rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Enter your message"
                rows={8}
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>
            <button
              onClick={handleSubmit}
              className="bg-gradient-to-r from-blue-400 via-blue-600 to-blue-700 mt-8 text-white py-2 px-4 w-full font-semibold rounded-lg  transition-colors flex items-center justify-center"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
