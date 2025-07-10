"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import React from "react";

const Page = () => {
  return (
    <div className="w-screen min-h-screen bg-[#0b0c0d] text-white">
      <Navbar />

      <section className="px-6 md:px-20 py-32 text-center">
        <h1 className="text-4xl font-bold mb-4">
          About{" "}
          <span className="bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent">
            FeedSenseAI
          </span>
        </h1>
        <p className="text-gray-300 max-w-2xl mx-auto">
          We're on a mission to transform how businesses understand and act on
          user feedback through the power of artificial intelligence.
        </p>
      </section>

      <section className="grid md:grid-cols-2 gap-10 px-6 md:px-20 pb-20 lg:w-[80vw] lg:mx-auto">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
          <p className="text-gray-400 mb-4">
            Founded in 2023, FeedSenseAI was born from a simple frustration:
            businesses were drowning in user feedback but struggling to extract
            meaningful insights that could drive real change.
          </p>
          <p className="text-gray-400 mb-4">
            Our team of AI researchers, product managers, and engineers came
            together to solve this problem by creating the most advanced
            feedback analysis platform on the market.
          </p>
          <p className="text-gray-400">
            Today, we help over 500 companies worldwide turn their user feedback
            into actionable insights that improve user satisfaction and drive
            business growth.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#0e0f10] border border-[#1e1e1e] rounded-lg p-6 text-center">
            <div className="text-cyan-400 text-3xl mb-2">👥</div>
            <p className="text-xl font-semibold">500+</p>
            <p className="text-sm text-gray-400">Companies Trust Us</p>
          </div>

          <div className="bg-[#0e0f10] border border-[#1e1e1e] rounded-lg p-6 text-center">
            <div className="text-green-400 text-3xl mb-2">💬</div>
            <p className="text-xl font-semibold">10M+</p>
            <p className="text-sm text-gray-400">Feedback Analyzed</p>
          </div>

          <div className="bg-[#0e0f10] border border-[#1e1e1e] rounded-lg p-6 text-center">
            <div className="text-yellow-400 text-3xl mb-2">🎯</div>
            <p className="text-xl font-semibold">98%</p>
            <p className="text-sm text-gray-400">Accuracy Rate</p>
          </div>

          <div className="bg-[#0e0f10] border border-[#1e1e1e] rounded-lg p-6 text-center">
            <div className="text-purple-400 text-3xl mb-2">🏅</div>
            <p className="text-xl font-semibold">4.9/5</p>
            <p className="text-sm text-gray-400">Customer Rating</p>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-20 py-20 bg-[#0b0c0d] text-white">
        <div className="text-center mb-12 ">
          <h2 className="text-3xl font-bold mb-2">Our Values</h2>
          <p className="text-gray-400">
            The principles that guide everything we do
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 lg:px-32  justify-center ">
          <div className="bg-[#0e0f10] border border-[#1e1e1e] p-6 rounded-xl max-w-md mx-auto space-y-3 hover:scale-105 ease-in-out duration-300">
            <div className="w-10 h-10 rounded-md bg-cyan-500 flex items-center justify-center mb-4">
              <span className="text-white text-xl">🧠</span>
            </div>
            <h3 className="font-semibold text-lg mb-2 md:text-xl lg:text-2xl">Innovation First</h3>
            <p className="text-gray-400 ">
              We constantly push the boundaries of what's possible with AI to
              deliver cutting-edge solutions.
            </p>
          </div>

          <div className="bg-[#0e0f10] border border-[#1e1e1e] p-6 rounded-xl max-w-md mx-auto space-y-3 hover:scale-105 ease-in-out duration-300">
            <div className="w-10 h-10 rounded-md bg-green-500 flex items-center justify-center mb-4">
              <span className="text-white text-xl">👥</span>
            </div>
            <h3 className="font-semibold text-lg md:text-xl lg:text-2xl mb-2">Customer Success</h3>
            <p className="text-gray-400 ">
              Your success is our success. We're committed to helping you
              achieve your goals with our platform.
            </p>
          </div>

          <div className="bg-[#0e0f10] border border-[#1e1e1e] p-6 rounded-xl max-w-md mx-auto space-y-3 hover:scale-105 ease-in-out duration-300">
            <div className="w-10 h-10 rounded-md bg-purple-500 flex items-center justify-center mb-4">
              <span className="text-white text-xl">⚡</span>
            </div>
            <h3 className="font-semibold text-lg md:text-xl mb-2 lg:text-2xl">Speed & Reliability</h3>
            <p className="text-gray-400 ">
              We deliver fast, reliable insights you can trust to make critical
              business decisions.
            </p>
          </div>
        </div>
      </section>

      <section className="w-full flex justify-center py-20 bg-[#0b0c0d]">
        <div className="relative max-w-3xl w-full group">
          <div
            className="absolute inset-0 rounded-2xl bg-gradient-to-r
                     from-cyan-400 via-sky-400 to-purple-600
                     opacity-40 blur-md transition
                     group-hover:opacity-70 group-hover:blur-lg"
          />

          <div
            className="relative rounded-2xl p-10 bg-[#0e0f11]/90 text-center
                     border border-transparent backdrop-blur-sm"
          >
            <h2 className="text-3xl font-semibold mb-4 text-white">
              Ready to Transform Your{" "}
              <span className="bg-gradient-to-r from-cyan-500 to-purple-500 text-transparent bg-clip-text">
                User Feedback?
              </span>
            </h2>

            <p className="text-gray-300 mb-10 max-w-2xl mx-auto">
              Join thousands of companies using FeedSenseAI to make smarter,
              data‑driven decisions. Start your free trial today and see the
              difference AI can make.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
              <button
                className="inline-flex items-center justify-center gap-2
                               bg-[#00c3ff] hover:bg-[#00b4eb] text-black
                               font-medium rounded-md px-6 py-3 shadow-lg transition"
              >
                Start Free Trial
              </button>
            </div>

            <p className="text-gray-400 text-sm">
              No credit card required • 14‑day free trial • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Page;
