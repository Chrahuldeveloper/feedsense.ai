import Navbar from "@/components/Navbar";
import React from "react";
import Link from "next/link";

export default function page() {
  const data = [
    {
      title: "Automate Your Workflow",
      para: "Our tool simplifies repetitive tasks, letting you focus on creativity. Automate your work and boost productivity with ease.",
    },
    {
      title: "Convert Feedback to Action",
      para: "Automatically turn user feedback into actionable tasks. Improve your website's performance and user experience effortlessly.",
    },
    {
      title: "Real-Time Insights",
      para: "Gain real-time insights from your users. Understand their needs and make informed improvements faster than ever.",
    },
    {
      title: "Boost Website Performance",
      para: "Let AI prioritize the most critical changes needed to improve your website's performance based on user feedback.",
    },
  ];

  const howItWorks = [
    {
      title: "Install Our Extension",
      para: "Get started by installing our extension on your website. It integrates seamlessly and starts gathering user feedback immediately.",
    },
    {
    title: "Collect Feedback",
      para: "Your users can submit feedback about their experience on your site. Our AI processes this to highlight areas of improvement.",
    },
    {
      title: "AI-Generated Task List",
      para: "Our AI converts feedback into prioritized tasks, making it easy for you to take action and improve your website efficiently.",
    },
  ];

  const faq = [
    {
      qes: "How does your tool work?",
      ans: "Our AI-powered software collects user feedback and converts it into actionable tasks that can improve your website's performance.",
    },
    {
      qes: "What kind of tasks does it generate?",
      ans: "It creates tasks focused on enhancing user experience, improving performance, and addressing feedback-driven insights.",
    },
    {
      qes: "How do I get started?",
      ans: "Simply install our extension on your website, and it will start collecting feedback immediately, turning it into actionable improvements.",
    },
  ];

  return (
    <div className="bg-black w-full min-h-screen">
      <Navbar />
      <div className="flex flex-col items-center space-y-8 pt-36 px-4">
        <div className="absolute inset-0 overflow-hidden ">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[30vh] bg-blue-600 rounded-full opacity-20 blur-[120px]" />
            <div className="absolute top-1/4 left-1/4 w-[60vw] h-[30vh] bg-blue-500 rounded-full opacity-15 blur-[100px]" />
            <div className="absolute bottom-1/4 right-1/4 w-[70vw] h-[50vh] bg-blue-400 rounded-full opacity-10 blur-[130px]" />
          </div>
        </div>
        <h1 className="text-3xl lg:text-5xl text-center font-semibold text-white leading-8 z-50">
          Boost Your Website's Performance
        </h1>
        <p className="text-[#a2a2a2] max-w-lg text-center z-50 text-sm md:text-base">
          Our AI-driven tool collects user feedback and turns it into actionable
          tasks to enhance your website's user experience.
        </p>
        <Link href="/login" className="z-50">
          <button className="bg-white  text-black py-2 px-8 md:px-16 lg:px-20 font-semibold rounded-full">
            Get Started
          </button>
        </Link>
        <img
          src="https://firebasestorage.googleapis.com/v0/b/notes-app-e3995.appspot.com/o/TaskFeed-10-24-2024_09_01_PM.png?alt=media&token=48ce631d-3bd7-4df3-a7c1-6147d9503532"
          alt=""
          className="lg:max-w-5xl mx-auto"
        />
      </div>

      <div className="mt-32 md:mt-40 px-4">
        <div className="space-y-8 flex flex-col items-center justify-center">
          <h1 className="text-xl md:text-3xl text-white">
            Don’t waste time on repetitive tasks
          </h1>
          <p className="text-[#a2a2a2] max-w-xl text-center text-sm md:text-base">
            Our tool automates the mundane tasks you encounter daily. Focus on
            creativity while we handle the rest.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10">
            {data.map((i, idx) => (
              <div
                className="p-5 max-w-lg text-center space-y-3 bg-[#121212] border-[#191d1f] border-[1px] rounded-lg cursor-pointer hover:scale-105 ease-in-out duration-300"
                key={idx}
              >
                <h1 className="text-white font-semibold text-xl">{i.title}</h1>
                <p className="text-[#a2a2a2] leading-7">{i.para}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-40 px-4">
        <div className="space-y-8 flex flex-col items-center justify-center">
          <h1 className="text-xl md:text-3xl text-white">How does it work?</h1>
          <p className="text-[#a2a2a2] max-w-xl text-center text-sm md:text-base">
            From feedback collection to task generation, here’s how our tool
            helps you improve your website.
          </p>
          <div className="flex flex-col gap-8 md:flex-row">
            {howItWorks.map((i, idx) => (
              <div
                className="p-5 max-w-sm text-center space-y-3 bg-[#121212] border-[#191d1f] border-[1px] rounded-lg cursor-pointer hover:scale-105 ease-in-out duration-300"
                key={idx}
              >
                <h1 className="bg-[#323334] rounded-full w-8 mx-auto px-3 py-1 text-center text-white">
                  {idx + 1}
                </h1>
                <h1 className="text-white font-semibold text-xl">{i.title}</h1>
                <p className="text-[#a2a2a2] leading-7">{i.para}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="py-40 px-4">
        <div className="space-y-10 flex flex-col justify-center items-center">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold text-white">
            Frequently Asked Questions
          </h1>
          <p className="text-[#a2a2a2] text-sm max-w-md leading-7 font-semibold text-center">
            Get answers to common questions about our AI-driven tool.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {faq.map((i, idx) => (
              <div
                className="p-5 max-w-lg space-y-3 bg-[#121212] border-[#191d1f] border-[1px] rounded-lg cursor-pointer hover:scale-105 ease-in-out duration-300"
                key={idx}
              >
                <h1 className="text-white font-semibold text-xl">{i.qes}</h1>
                <p className="text-[#a2a2a2] leading-7">{i.ans}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
