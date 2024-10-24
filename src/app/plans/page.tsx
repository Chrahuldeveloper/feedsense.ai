import Navbar from "@/components/Navbar";
import React from "react";

export default function PricingPage() {
  const Plans = [
    {
      name: "Basic",
      price: "$20/month",
      features: [
        "Collect up to 100 feedback entries per month",
        "Basic sentiment analysis",
        "Manual task creation from feedback",
        "Email support",
      ],
    },
    {
      name: "Pro",
      price: "$30/month",
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
    {
      name: "Pro",
      price: "$30/month",
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
    <div className="bg-[#000000] w-full min-h-screen overflow-hidden ">
   <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[30vh] bg-blue-600 rounded-full opacity-20 blur-[120px]" />
          <div className="absolute top-1/4 left-1/4 w-[60vw] h-[30vh] bg-blue-500 rounded-full opacity-15 blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[70vw] h-[30vh] bg-blue-400 rounded-full opacity-10 blur-[130px]" />
        </div>

      <div className="relative z-10">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen relative -mt-28">
          <div className="absolute inset-2 flex items-center justify-center">
          </div>
          <div className="p-10 rounded-lg text-center relative z-10">
            <h1 className="text-5xl font-semibold text-white max-w-2xl">
              Simple, transparent pricing with no surprises
            </h1>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8 px-10 pb-14 justify-center -mt-28">
          {Plans.map((plan, idx) => ( 
            <div
              key={idx}
              className="p-6 rounded-lg border-[1px] bg-[#121212] border-[#282e32] space-y-4 cursor-pointer hover:scale-105 ease-in-out duration-300"
            >
              <h1 className="text-slate-300 text-2xl font-bold">{plan.name}</h1>
              <p className="text-lg font-semibold text-slate-300">
                {plan.price}
              </p>
              <button className="bg-gradient-to-r from-blue-400 via-blue-600 to-blue-700 mt-6 text-white py-2 md:w-[25vw] w-[80vw] font-semibold rounded-lg">
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
    </div>
  );
}
