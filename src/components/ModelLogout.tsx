import React from "react";

interface ModelLogoutProps {
  settoggle: Function;
}

const ModelLogout: React.FC<ModelLogoutProps> = ({ settoggle }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center h-full bg-black bg-opacity-75 backdrop-blur-sm">
      <div className="bg-[#0f0d15] w-[85vw] md:w-[60vw] lg:w-[40vw] xl:w-[30vw] p-8 rounded-md ">
        <h1 className="text-slate-300 text-xl md:text-2xl text-center my-3">
          Are you sure you want to Logout?
        </h1>
        <p className="text-slate-300 text-xs text-center my-5 leading-6">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus
          nesciunt accusamus ut?
        </p>
        <div className="flex justify-end gap-2 mt-6 -mx-4">
          <button
            onClick={() => {
              settoggle(false);
            }}
            className="text-slate-300 text-xs bg-zinc-800 px-8 py-1.5 rounded-md font-semibold"
          >
            Cancel
          </button>
          <button className="text-slate-300 text-xs bg-blue-600 px-8 py-1.5 rounded-md font-semibold">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModelLogout;
