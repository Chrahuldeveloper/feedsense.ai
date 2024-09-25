import React from "react";
import { TiTickOutline } from "react-icons/ti";

const SubscriptionCard = () => {
  const subscriptionPlans = [
    {
      id: 1,
      name: "Basic",
      price: 10,
      features: [
        "Collect user feedback",
        "Manual task creation from feedback",
        "Basic analytics",
        "Email support",
        "Up to 100 feedback submissions per month",
      ],
      billingCycle: "monthly",
    },
    {
      id: 2,
      name: "Premium",
      price: 50,
      features: [
        "Collect user feedback",
        "Automated task generation from feedback",
        "Advanced analytics and insights",
        "Priority email and chat support",
        "Unlimited feedback submissions",
        "Customizable feedback forms",
        "AI-powered feedback analysis",
        "Integration with project management tools (e.g., Jira, Trello)",
        "Real-time feedback dashboard",
        "Visual feedback tools (screenshot annotations)",
      ],
      billingCycle: "monthly",
    },
  ];

  return (
    <div className="md:ml-96">
      <div className="flex  flex-col md:flex-row justify-center gap-8 pt-16">
        {subscriptionPlans.map((itm, idx) => {
          return (
            <React.Fragment key={idx}>
              <div
                className={`border-[1px] border-neutral-900 bg-[#131b2376] p-5 rounded-lg space-y-3 cursor-pointer hover:scale-110 duration-500 ease-in-out`}
              >
                <h1 className="text-slate-300 text-2xl font-bold ">
                  {itm.name}
                </h1>
                <p className="text-slate-300 font-semibold text-lg">
                  {itm.price}
                </p>
                <ul className="space-y-2 ">
                  {itm.features.map((i, index) => {
                    return (
                      <li
                        key={index}
                        className="text-slate-300 text-sm flex items-center gap-2"
                      >
                        <TiTickOutline size={22} color="white" />
                        <h1>{i}</h1>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default SubscriptionCard;
