"use client";
import authService from "@/firebase/utils/auth";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "./Loader";
interface ModelLogoutProps {
  settoggle: Function;
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
      <div className="bg-[#17161c]  w-[85vw] md:w-[60vw] lg:w-[40vw] xl:w-[30vw] p-6 rounded-xl ">
        <h1 className="text-slate-300 text-xl md:text-2xl text-center my-3">
          Are you sure you want to Logout?
        </h1>
        <p className="text-slate-300 text-xs text-center my-5 leading-6 max-w-screen-sm">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus
          nesciunt accusamus ut?
        </p>
        <div className="flex justify-end gap-2 mt-6 -mx-4">
          <button
            onClick={() => {
              settoggle(false);
            }}
            className="text-slate-300 text-xs bg-zinc-800 px-8 py-2 rounded-full font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleLogOut}
            className="text-slate-300 text-xs bg-gradient-to-r from-blue-400 via-blue-600 to-blue-700 px-8 py-2 rounded-full font-semibold"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModelLogout;
