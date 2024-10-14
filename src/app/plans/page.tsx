import Navbar from "@/components/Navbar";
import React from "react";

const page = () => {
  const Plans = [
    {
      name: "Free",
      price: "$0",
      features: [
        "Collect up to 100 feedback entries per month",
        "Basic sentiment analysis",
        "Manual task creation from feedback",
        "Email support",
      ],
    },
    {
      name: "Pro",
      price: "$29/month",
      features: [
        "Unlimited feedback entries",
        "Advanced sentiment analysis with keyword insights",
        "Automated task generation from feedback",
        "Task assignment to team members",
        "Priority email support",
        "Feedback analytics dashboard",
        "Basic integration with project management tools (Trello, Asana)",
      ],
    },
  ];

  return (
    <div className="bg-[#131315] w-full min-h-screen overflow-x-clip">
      <Navbar />
      <div className="flex items-center justify-center min-h-screen relative -mt-20">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-1/2 h-96 rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(255,40,150,0.4)_0%,_rgba(0,0,0,1)_100%)] blur-3xl"></div>
        </div>
        <div className="p-10 rounded-lg text-center relative z-10">
          <h1 className="text-5xl font-semibold text-white max-w-2xl">
            Simple, transparent pricing with no surprises
          </h1>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 px-10 pb-10 justify-center ">
        {Plans.map((plan, idx) => (
          <div
            key={idx}
            className="p-6 rounded-lg border-[1px] bg-[#232225] border-[#272b2f] space-y-4 cursor-pointer hover:scale-105 ease-in-out duration-300"
          >
            <h1 className="text-slate-300 text-2xl font-bold">{plan.name}</h1>
            <p className="text-lg font-semibold text-slate-300">{plan.price}</p>
            <button className="bg-[#db1a5a]  mt-6 text-white py-2 md:w-[25vw] w-[80vw] font-semibold rounded-lg">
              Get Plan
            </button>
            <ul className="space-y-3 text-slate-300">
              {plan.features.map((feature, index) => (
                <li key={index} className="text-sm">
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default page;
