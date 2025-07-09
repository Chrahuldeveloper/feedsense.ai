"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { CiMenuFries } from "react-icons/ci";
import Cookies from "js-cookie";
import { CiHome } from "react-icons/ci";
import { FcAbout } from "react-icons/fc";
import { FaMoneyCheckAlt } from "react-icons/fa";
import { MdOutlineAccountCircle } from "react-icons/md";
import { CiLogin } from "react-icons/ci";
import { RxCross2 } from "react-icons/rx";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [userSession, setUserSession] = useState<string | null>(null);

  const [toogle, settoogle] = useState<boolean>(false);

  const [paid, setPaid] = useState<string | null>(null);

  useEffect(() => {
    const getsubstatus = localStorage.getItem("paid");
    setPaid(getsubstatus);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    const token = Cookies.get("auth-token");
    setUserSession(token ?? null);

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <nav
        className={` border-b-[1px]  fixed flex-row top-0 left-0 w-full border-stone-900 z-50  flex justify-around items-center px-4 lg:px-12 transition-all duration-300 py-7 ${
          isScrolled ? "backdrop-blur-md" : "backdrop-blur-lg"
        }`}
      >
        <div>
          <h1 className="text-2xl font-semibold bg-gradient-to-r from-cyan-500 to-purple-500 text-transparent bg-clip-text">
            FeedSense.ai
          </h1>
        </div>
        <div className="md:hidden">
          <CiMenuFries
            size={23}
            color="white"
            className="cursor-pointer"
            onClick={() => {
              settoogle(true);
            }}
          />
        </div>
        <ul className="md:flex flex-row md:items-center gap-x-7 text-slate-300 hidden">
          <Link href="/">
            <li className="cursor-pointer font-semibold ">Home</li>
          </Link>
          <Link href={"/about"}>
            <li className="cursor-pointer font-semibold ">About</li>
          </Link>
          {paid !== "true" ? (
            <Link href="/plans">
              <li className="cursor-pointer font-semibold ">Plans</li>
            </Link>
          ) : null}
          {userSession !== null ? (
            <Link href="/login" >
            <li className="cursor-pointer  bg-gradient-to-r from-[#00bfff] via-[#00bfff] to-[#00bfff] px-7 py-2 rounded-xl text-black">Login</li>
            </Link>
          ) : (
            <Link href="/dashboard">
              <li className="cursor-pointer  bg-gradient-to-r from-[#00bfff] via-[#00bfff] to-[#00bfff] px-7 py-2 rounded-xl text-black">
                Your Account
              </li>
            </Link>
          )}
        </ul>
      </nav>

      {toogle ? (
        <nav className="bg-[#151a24] w-[100vw]  h-[40vh] space-y-10 px-5 block md:hidden  left-0  bottom-0 border-r-[1px] border-[#15171b] z-[70] fixed top-0">
          <div className="flex flex-col space-y-7 mt-5">
            <div className="flex justify-between items-center">
              <Link href="/">
                <div className="flex items-center gap-5">
                  <CiHome size={22} color="white" />
                  <h1 className="text-white text-sm font-semibold">Home</h1>
                </div>
              </Link>

              <div className="flex justify-end ">
                <RxCross2
                  onClick={() => {
                    settoogle(false);
                  }}
                  size={25}
                  color="white"
                  className="cursor-pointer"
                />
              </div>
            </div>

            <Link href="/about">
              <div className="flex items-center gap-5">
                <FcAbout size={22} color="white" />
                <h1 className="text-white text-sm font-semibold">About</h1>
              </div>
            </Link>
            {paid !== "true" ? (
              <Link href="/plans">
                <div className="flex items-center gap-5">
                  <FaMoneyCheckAlt size={22} color="white" />
                  <h1 className="text-white text-sm font-semibold">Plans</h1>
                </div>
              </Link>
            ) : null}
            {userSession === null ? (
              <Link href="/login">
                <div>
                  <button className="text-white text-sm font-semibold flex items-center gap-5">
                    <CiLogin size={22} />
                    Login
                  </button>
                </div>{" "}
              </Link>
            ) : (
              <Link href="/dashboard">
                <button className=" text-white font-semibold rounded-lg text-sm flex items-center gap-5">
                  <MdOutlineAccountCircle size={22} color="white" />
                  Your Account
                </button>
              </Link>
            )}
          </div>
        </nav>
      ) : null}
    </>
  );
};

export default Navbar;
