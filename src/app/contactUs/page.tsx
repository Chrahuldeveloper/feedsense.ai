"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import React from "react";

const Contact = () => {
  return (
    <div className="w-screen min-h-screen bg-[#0b0c0d] text-white">
      <Navbar />
      <div className="space-y-5 pt-36 flex flex-col justify-center items-center">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-2 text-white">
          Get in
          <span className="bg-gradient-to-r from-cyan-500 to-purple-500 text-transparent bg-clip-text">
            Touch
          </span>
        </h1>
        <p className="text-gray-300 mb-10 text-center max-w-xl">
          Have questions about FeedSenseAI? We're here to help you transform
          your user feedback into actionable insights.
        </p>
      </div>
      <div className="px-4 md:px-20 py-28 grid md:grid-cols-2 gap-10 lg:w-[80vw] lg:mx-auto">
        <div className="bg-[#141519] p-6 md:p-10 rounded-xl">
          <h2 className="text-2xl font-semibold mb-2">Send us a message</h2>
          <p className="text-sm text-gray-400 mb-6">
            Fill out the form below and we'll get back to you within 24 hours.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              placeholder="First Name"
              className="p-3 bg-[#0b0c0d] border border-gray-700 rounded-md outline-none"
            />
            <input
              placeholder="Last Name"
              className="p-3 bg-[#0b0c0d] border border-gray-700 rounded-md outline-none"
            />
          </div>

          <input
            placeholder="Email"
            className="mt-4 p-3 bg-[#0b0c0d] border border-gray-700 rounded-md w-full outline-none"
          />
          <input
            placeholder="Company"
            className="mt-4 p-3 bg-[#0b0c0d] border border-gray-700 rounded-md w-full outline-none"
          />

          <select className="mt-4 outline-none p-3 bg-[#0b0c0d] border border-gray-700 rounded-md w-full text-white">
            <option>General Inquiry</option>
            <option>Support</option>
            <option>Partnership</option>
          </select>

          <textarea
            placeholder="Tell us more about your needs..."
            className="mt-4 p-3 bg-[#0b0c0d]  outline-none border border-gray-700 rounded-md w-full min-h-[120px]"
          />

          <button className="w-full mt-6 p-3 rounded-md bg-gradient-to-r from-[#00bfff] via-[#00bfff] to-[#00bfff] text-black transition">
            Send Message ✈️
          </button>
        </div>

        <div className="text-white space-y-6">
          <div className="space-y-3">
            <h3 className="text-xl font-semibold mb-2">Contact Information</h3>
            <p className="text-sm text-gray-400">
              We'd love to hear from you. Choose the best way to reach out to
              us.
            </p>
          </div>

          <div className="flex items-start gap-4 p-5 bg-[#0e0f10] rounded-lg border border-[#1e1e1e]">
            <div className="text-cyan-400 text-2xl">📧</div>
            <div className="space-y-3">
              <h4 className="font-semibold">Email Us</h4>
              <p className="text-sm text-gray-400">
                Get in touch via email for detailed inquiries
              </p>
              <a href="mailto:hello@feedsenseai.com" className="text-cyan-400">
                hello@feedsenseai.com
              </a>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 bg-[#0e0f10] rounded-lg border border-[#1e1e1e]">
            <div className="text-green-400 text-2xl">📞</div>
            <div className="space-y-3">
              <h4 className="font-semibold">Call Us</h4>
              <p className="text-sm text-gray-400">
                Speak directly with our team
              </p>
              <a href="tel:+15551234567" className="text-green-400">
                +1 (555) 123-4567
              </a>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 bg-[#0e0f10] rounded-lg border border-[#1e1e1e]">
            <div className="text-purple-400 text-2xl">📍</div>
            <div className="space-y-3">
              <h4 className="font-semibold">Visit Us</h4>
              <p className="text-sm text-gray-400">
                Come see us at our headquarters
              </p>
              <p className="text-purple-300">
                123 Innovation Drive
                <br />
                San Francisco, CA 94105
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 bg-[#0e0f10] rounded-lg border border-[#1e1e1e]">
            <div className="text-yellow-400 text-2xl">🕒</div>
            <div className="space-y-3">
              <h4 className="font-semibold">Business Hours</h4>
              <p className="text-sm text-gray-400">
                We're here to help during these hours
              </p>
              <p className="text-sm text-yellow-300">
                Monday - Friday: 9:00 AM – 6:00 PM PST
              </p>
              <p className="text-sm text-yellow-300">
                Saturday: 10:00 AM – 4:00 PM PST
              </p>
              <p className="text-sm text-red-400">Sunday: Closed</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
