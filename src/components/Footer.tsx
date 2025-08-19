import React from "react";
import { LuBrain } from "react-icons/lu";

export default function Footer() {
  return (
    <footer className="w-full bg-[#0b0c0d] border-t border-[#1c1d20] text-gray-300">
      <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-4 gap-10">
        
        {/* Brand */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
          <div className="flex items-center gap-2 mb-4">
            <LuBrain size={28} color="#00c3ff" />
            <h3 className="text-xl font-semibold text-white">
              <span className="bg-gradient-to-r from-cyan-500 to-purple-500 text-transparent bg-clip-text">
                FeedSenseAI
              </span>
            </h3>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-gray-400">
            Transform user feedback into actionable insights with the power of AI.
          </p>
        </div>

        <div className="flex flex-col items-center lg:items-start justify-center">
          <h4 className="font-semibold text-white mb-4 uppercase tracking-wide text-sm">
            Product
          </h4>
          <ul className="space-y-2">
            {["Dashboard", "Feedback", "Insights", "Integration"].map((item) => (
              <li key={item}>
                <a href="#" className="hover:text-white hover:underline transition">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div className="flex flex-col items-center lg:items-start">
          <h4 className="font-semibold text-white mb-4 uppercase tracking-wide text-sm">
            Company
          </h4>
          <ul className="space-y-2">
            <li>
              <a href="/about" className="hover:text-white hover:underline transition">
                About
              </a>
            </li>
            <li>
              <a href="/contactUs" className="hover:text-white hover:underline transition">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div className="flex flex-col items-center lg:items-start">
          <h4 className="font-semibold text-white mb-4 uppercase tracking-wide text-sm">
            Support
          </h4>
          <ul className="space-y-2">
            <li>
              <a href="/contactUs" className="hover:text-white hover:underline transition">
                Help Center
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#1c1d20] text-sm text-gray-500 text-center py-4">
        © {new Date().getFullYear()} FeedSenseAI. All rights reserved.
      </div>
    </footer>
  );
}
