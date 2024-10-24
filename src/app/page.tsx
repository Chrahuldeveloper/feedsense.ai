import Navbar from "@/components/Navbar";
import React from "react";

export default function page() {
  const data = [
    {
      tittle: "Shortcut to a better productivity",
      para: "Design Maestro was built for designers by designers. We’ve analyzed our work and created macros that let you skip repetitive and tiresome tasks.",
    },
    {
      tittle: "Shortcut to a better productivity",
      para: "Design Maestro was built for designers by designers. We’ve analyzed our work and created macros that let you skip repetitive and tiresome tasks.",
    },
    {
      tittle: "Shortcut to a better productivity",
      para: "Design Maestro was built for designers by designers. We’ve analyzed our work and created macros that let you skip repetitive and tiresome tasks.",
    },
    {
      tittle: "Shortcut to a better productivity",
      para: "Design Maestro was built for designers by designers. We’ve analyzed our work and created macros that let you skip repetitive and tiresome tasks.",
    },
  ];

  const howItWorks = [
    {
      tittle: "Install Keyboard Maestro",
      para: "Design Maestro is an extension for the Keyboard Maestro app. First, you need to install it on your Mac.",
    },
    {
      tittle: "Install Keyboard Maestro",
      para: "Design Maestro is an extension for the Keyboard Maestro app. First, you need to install it on your Mac.",
    },
    {
      tittle: "Install Keyboard Maestro",
      para: "Design Maestro is an extension for the Keyboard Maestro app. First, you need to install it on your Mac.",
    },
  ];

  const faq = [
    {
      qes: "What is Design Maestro?",
      ans: "Design Maestro is a FREE package of macros that you can use in the Keyboard Maestro app for macOS. Wonder how Design Maestro automations can help you? Read this article.",
    },
    {
      qes: "What is Design Maestro?",
      ans: "Design Maestro is a FREE package of macros that you can use in the Keyboard Maestro app for macOS. Wonder how Design Maestro automations can help you? Read this article.",
    },
    {
      qes: "What is Design Maestro?",
      ans: "Design Maestro is a FREE package of macros that you can use in the Keyboard Maestro app for macOS. Wonder how Design Maestro automations can help you? Read this article.",
    },
    {
      qes: "What is Design Maestro?",
      ans: "Design Maestro is a FREE package of macros that you can use in the Keyboard Maestro app for macOS. Wonder how Design Maestro automations can help you? Read this article.",
    },
    {
      qes: "What is Design Maestro?",
      ans: "Design Maestro is a FREE package of macros that you can use in the Keyboard Maestro app for macOS. Wonder how Design Maestro automations can help you? Read this article.",
    },
    {
      qes: "What is Design Maestro?",
      ans: "Design Maestro is a FREE package of macros that you can use in the Keyboard Maestro app for macOS. Wonder how Design Maestro automations can help you? Read this article.",
    },
  ];

  return (
    <div className="bg-black w-full min-h-screen">
      <Navbar />
      <div className="flex flex-col items-center space-y-8 pt-40 px-4">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[30vh] bg-blue-600 rounded-full opacity-20 blur-[120px]" />
            <div className="absolute top-1/4 left-1/4 w-[60vw] h-[30vh] bg-blue-500 rounded-full opacity-15 blur-[100px]" />
            <div className="absolute bottom-1/4 right-1/4 w-[70vw] h-[30vh] bg-blue-400 rounded-full opacity-10 blur-[130px]" />
          </div>{" "}
        </div>
        <h1 className="text-xl md:text-3xl lg:text-5xl text-center font-semibold text-white leading-8 z-50">
          Boost your design productivity
        </h1>
        <p className="text-[#a2a2a2] max-w-lg text-center z-50 text-sm md:text-base">
          Design Maestro is a free extension for Keyboard Maestro app. It lets
          you automate tasks that you repeat hundreds of times each day.
        </p>
        <button className="bg-white z-50 text-black py-2 px-8 md:px-16 lg:px-20 font-semibold rounded-full">
          Get Started
        </button>
      </div>

      <div className="mt-20 md:mt-36 px-4">
        <div className="space-y-8 flex flex-col items-center justify-center">
          <h1 className="text-xl md:text-3xl text-white">
            Don’t repeat yourself
          </h1>
          <p className="text-[#a2a2a2] max-w-xl text-center text-sm md:text-base">
            Each day, you waste time on repetitive tasks...
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10">
            {data.map((i, idx) => {
              return (
                <div
                  className="p-5 max-w-lg text-center space-y-3 bg-[#121212] border-[#191d1f] border-[1px] rounded-lg cursor-pointer hover:scale-105 ease-in-out duration-300"
                  key={idx}
                >
                  <h1 className="text-white font-semibold text-xl">
                    {i.tittle}
                  </h1>
                  <p className="text-[#a2a2a2] leading-7">{i.para}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-28 px-4">
        <div className="space-y-8 flex flex-col items-center justify-center">
          <h1 className="text-xl md:text-3xl text-white">How does it work?</h1>
          <p className="text-[#a2a2a2] max-w-xl text-center text-sm md:text-base">
            Macros are quick actions that you can run with Design Maestro...
          </p>
          <div className="flex flex-col gap-8 md:flex-row">
            {howItWorks.map((i, idx) => {
              return (
                <div
                  className="p-5 max-w-sm text-center space-y-3 bg-[#121212] border-[#191d1f] border-[1px] rounded-lg cursor-pointer hover:scale-105 ease-in-out duration-300"
                  key={idx}
                >
                  <h1 className="bg-[#323334] rounded-full w-8 mx-auto px-3 py-1 text-center text-white">
                    {idx + 1}
                  </h1>
                  <h1 className="text-white font-semibold text-xl">
                    {i.tittle}
                  </h1>
                  <p className="text-[#a2a2a2] leading-7">{i.para}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="py-28 px-4">
        <div className="space-y-10 flex flex-col justify-center items-center">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold text-white">
            Macros for busy designers
          </h1>
          <p className="text-[#a2a2a2] text-sm max-w-md leading-7 font-semibold text-center">
            Macros are quick actions that you can run with Design Maestro
            launcher...
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {faq.map((i, idx) => {
              return (
                <div
                  className="p-5 max-w-lg space-y-3 bg-[#121212] border-[#191d1f] border-[1px] rounded-lg cursor-pointer hover:scale-105 ease-in-out duration-300"
                  key={idx}
                >
                  <h1 className="text-white font-semibold text-xl">{i.qes}</h1>
                  <p className="text-[#a2a2a2] leading-7">{i.ans}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
