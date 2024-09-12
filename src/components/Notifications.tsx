import React from "react";

const Notifications = () => {
  const data = [
    {
      tittle: "welcome to TaskFeed",
      Para: "TaskFeed is a AI pwoered Platform TaskFeed is a AI pwoered Platform",
    },
    {
      tittle: "welcome to TaskFeed",
      Para: "TaskFeed is a AI pwoered Platform TaskFeed is a AI pwoered Platform",
    },
    {
      tittle: "welcome to TaskFeed",
      Para: "TaskFeed is a AI pwoered Platform TaskFeed is a AI pwoered Platform",
    },
  ];

  return (
    <div className="bg-[#0f0d15] p-5 rounded-xl w-[70vw] md:ml-80  my-10">
      <div>
        <h1 className="text-2xl font-semibold text-white px-5 py-4">
          Your Notifications
        </h1>
      </div>

      <div className="flex flex-col gap-5">
        {data.map((itm, idx) => {
          return (
            <>
              <div
                key={idx}
                className="text-white border-[1px] border-neutral-900 p-5 rounded-lg space-y-3"
              >
                <h1 className="text-lg font-semibold">{itm.tittle}</h1>
                <p className="text-sm">{itm.Para}</p>
              </div>
            </>
          );
        })}
      </div>
    </div>
  );
};

export default Notifications;
