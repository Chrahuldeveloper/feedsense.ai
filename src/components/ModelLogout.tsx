"use client";
import authService from "@/firebase/utils/auth";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "./Loader";
import { IoLogOutOutline } from "react-icons/io5";
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
      localStorage.setItem("authstate", "false");
      navigate.push("/login");
    } catch (error) {
      setisloading(false);
      console.log(error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex h-full items-center justify-center bg-black/70 px-4 backdrop-blur-md">
      {isloading && <Loader message="Loggin you out!" />}
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-md rounded-3xl p-px bg-white/10"
      >
        <div className="relative overflow-hidden rounded-[23px] bg-[#111113] p-6 text-center sm:p-8">
          

          <span className="relative mx-auto grid h-16 w-16 place-items-center rounded-2xl text-red-300 ring-1 ring-inset ring-red-400/30 bg-red-500/20">
            <IoLogOutOutline size={30} />
          </span>

          <h1 className="relative mt-6 text-xl font-semibold tracking-tight text-white sm:text-2xl">
            Are you sure you want to Logout?
          </h1>
          <p className="relative mx-auto mt-3 max-w-sm text-sm leading-6 text-zinc-400">
            Logging out will end your current session. You can always log back in
            to continue where you left off. Are you ready to proceed?
          </p>

          <div className="relative mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={() => {
                settoggle(false);
              }}
              className="rounded-xl border border-white/10 bg-white/[0.05] px-8 py-3 text-sm font-semibold text-zinc-200 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/10"
            >
              Cancel
            </button>
            <button
              onClick={handleLogOut}
              className="rounded-xl px-8 py-3 text-sm font-semibold text-white transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-400/30 bg-red-500"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelLogout;