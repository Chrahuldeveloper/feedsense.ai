import Link from "next/link";
import React from "react";
import { LuBrain } from "react-icons/lu";

export default function Footer() {
  return (
    <>
      <footer className="w-full bg-[#0b0c0d] border-t border-[#1c1d20] py-16 text-gray-300">
        <div className="container mx-auto px-6 grid gap-12 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 mb-4 text-white">
              <LuBrain size={24} color="#00c3ff" />
              <h3 className="text-xl font-semibold">
                <span className="bg-gradient-to-r from-cyan-500 to-purple-500 text-transparent bg-clip-text">
                  FeedSenseAI
                </span>
              </h3>
            </div>
            <p className="max-w-xs">
              Transform user feedback into actionable insights with the power of
              AI.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 lg:col-span-3 lg:grid-cols-3">
            <ul className="space-y-3">
              <h4 className="font-medium text-white mb-2">Product</h4>
              <li className="hover:text-white">Dashboard</li>
              <li className="hover:text-white">Feedback</li>
              <li className="hover:text-white">Insights</li>
              <li className="hover:text-white">Integration</li>
            </ul>

            <ul className="space-y-3">
              <h4 className="font-medium text-white mb-2">Company</h4>
              <li>
                <a href="/about" className="hover:text-white">
                  About
                </a>
              </li>
              {/* <li>
                <a href="#" className="hover:text-white">
                  Blog
                </a>
              </li> */}
              {/* <li>
                <a href="#" className="hover:text-white">
                  Careers
                </a>
              </li> */}
              <li>
                <a href="/contactUs" className="hover:text-white">
                  Contact
                </a>
              </li>
            </ul>

            <ul className="space-y-3">
              <h4 className="font-medium text-white mb-2">Support</h4>
              <li>
                <a href="/contactUs" className="hover:text-white">
                  Help Center
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </>
  );
}
