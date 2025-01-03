"use client";
import authService from "@/firebase/utils/auth";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "./Loader";
interface ModelLogoutProps {
  settoggle: (value: boolean) => void;
}

const ModelLogout: React.FC<ModelLogoutProps> = ({ settoggle }) => {
  const auth = new authService();

  const [isloading, setisloading] = useState(false);

  const navigate = useRouter();

  const handleLogOut = async () => {
    try {
      setisloading(true);
      await auth.signOut();
      console.log("logout sucessful");
      navigate.push("/login");
    } catch (error) {
      setisloading(false);
      console.log(error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center h-full bg-black bg-opacity-75 backdrop-blur-sm">
      {isloading && <Loader message="Loggin you out!" />}
      <div className="bg-[#0e0f12] border-[1px] border-[#15171b]  w-[85vw] md:w-[60vw] lg:w-[40vw] xl:w-[30vw] p-6">
        <h1 className="text-gray-300 text-xl md:text-2xl text-center  my-3">
          Are you sure you want to Logout?
        </h1>
        <p className="text-gray-300 text-xs text-center my-5 leading-6 max-w-screen-sm">
          Logging out will end your current session. You can always log back in
          to continue where you left off. Are you ready to proceed?
        </p>
        <div className="flex justify-end gap-5 mt-6 -mx-4">
          <button
            onClick={() => {
              settoggle(false);
            }}
            className="text-gray-300 text-xs bg-[#1E1E1E] px-8 py-2 rounded-lg font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleLogOut}
            className="text-slate-300 text-xs bg-gradient-to-r from-blue-800 via-blue-600 to-blue-700 px-8 py-2 rounded-lg font-semibold"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModelLogout;
