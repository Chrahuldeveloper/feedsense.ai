import React from "react";
import { LuLoader2 } from "react-icons/lu";

interface props {
  message: string;
}

const Loader: React.FC<props> = ({ message }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center h-full bg-opacity-60 backdrop-blur-sm z-40">
      <div className="flex flex-col items-center space-y-3">
        <LuLoader2 size={55} color="#5296f7" className="animate-spin " />
        <h1 className="text-slate-300 font-semibold text-lg">
          {message || "Loading"}
        </h1>
      </div>
    </div>
  );
};

export default Loader;
