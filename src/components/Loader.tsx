import React from "react";
import { LuLoader2 } from "react-icons/lu";

const Loader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center h-full bg-black bg-opacity-60 backdrop-blur-md">
      <div>
        <LuLoader2 size={30} color="white" className="animate-spin" />
      </div>
    </div>
  );
};

export default Loader;
