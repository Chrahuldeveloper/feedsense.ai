import Navbar from "@/components/Navbar";
import React from "react";

export default function page() {
  const data = [
    {
      tittle: "Shortcut to a better productivit",
      para: "Design Maestro was built for designers by designers. We’ve analyzed our work and created macros that let you skip repetitive and tiresome tasks.",
    },
    {
      tittle: "Shortcut to a better productivit",
      para: "Design Maestro was built for designers by designers. We’ve analyzed our work and created macros that let you skip repetitive and tiresome tasks.",
    },
    {
      tittle: "Shortcut to a better productivit",
      para: "Design Maestro was built for designers by designers. We’ve analyzed our work and created macros that let you skip repetitive and tiresome tasks.",
    },
    {
      tittle: "Shortcut to a better productivit",
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
    <div className="bg-[#0e0f11] w-full min-h-screen">
      <Navbar />
      <div className="flex justify-center flex-col items-center space-y-8">
        <h1 className="text-xl md:text-3xl lg:text-6xl lg:max-w-2xl text-center max-w-sm font-semibold text-white leading-8">
          Boost your design productivity
        </h1>
        <p className="text-[#a2a2a2] max-w-lg text-center">
          Design Maestro is a free extension for Keyboard Maestro app. It lets
          you automate tasks that you repeat hundreds of times each day.
        </p>
        <button className="bg-white  text-black  py-2 px-20  font-semibold rounded-full">
          Get Started
        </button>
      </div>

      <div className="mt-28">
        <div className="space-y-8 flex flex-col items-center justify-center">
          <h1 className="text-xl md:text-3xl text-white">
            Don’t repeat yourself{" "}
          </h1>
          <p className="text-[#a2a2a2] max-w-xl text-center">
            Each day, you waste time on repetitive tasks: navigating, typing,
            searching, copying. "But it takes just 10 seconds" you'd say. Just
            multiply this by hundreds of times and you have hours wasted during
            a month! But here's the good news: it doesn't have to look like
            this.
          </p>
          <div className="grid grid-cols-2 gap-x-24 gap-y-10">
            {data.map((i, idx) => {
              return (
                <div className="p-5 max-w-lg  text-center space-y-3" key={idx}>
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

      <div className="mt-28">
        <div className="space-y-8 flex flex-col items-center justify-center">
          <h1 className="text-xl md:text-3xl text-white">How does it work?</h1>
          <p className="text-[#a2a2a2] max-w-xl text-center">
            Macros are quick actions that you can run with Design Maestro
            launcher. To launch a macro you just need to choose it from the list
            or activate it with an assigned keyboard shortcut.
          </p>
          <div className="flex gap-8 flex-col md:flex-row">
            {howItWorks.map((i, idx) => {
              return (
                <div className="p-5 max-w-sm  text-center space-y-3" key={idx}>
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

      <div className="bg-[#1c1d1f]  p-8 flex items-center justify-between w-[80vw] mx-auto mt-28">
        <div className="space-y-8">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold text-white">
            Get Design Maestro{" "}
          </h1>
          <p className="text-[#a2a2a2] text-sm max-w-sm leading-7 font-semibold">
            Get instant access to Design Maestro and our setup guide. Completely
            for free.
          </p>
        </div>

        <button className="bg-white  text-black  py-2 px-10  font-semibold rounded-full">
          Get Started
        </button>
      </div>

      <div className="py-28 ">
        <div className="space-y-10 flex flex-col justify-center items-center">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold text-white">
            Macros for busy designers
          </h1>
          <p className="text-[#a2a2a2] text-sm max-w-md leading-7 font-semibold text-center">
            Macros are quick actions that you can run with Design Maestro
            launcher. To launch a macro you just need to choose it from the list
            or activate it with an assigned keyboard shortcut.
          </p>

          <div className="grid grid-cols-2 gap-6 ">
            {faq.map((i, idx) => {
              return (
                <div className="p-5 max-w-lg  space-y-3 bg-[#1c1c1c]" key={idx}>
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
