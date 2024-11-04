"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { CiMenuFries } from "react-icons/ci";
import Cookies from "js-cookie";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const userSession = Cookies.get("auth-token");


  return (
    <>
      <nav
        className={`fixed  flex-row top-0 left-0 w-full border-stone-900 z-50 p-7 flex justify-between items-center px-12 transition-all duration-300 ${
          isScrolled
            ? "backdrop-blur-md  border-b-[0.1px] "
            : "backdrop-blur-lg"
        }`}
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-white">
            Fixit
          </h1>
        </div>
        <div className="md:hidden">
          <CiMenuFries size={23} color="white" />
        </div>
        <ul className="md:flex   flex-row md:items-center gap-x-7 text-slate-300 hidden">
          <li className="cursor-pointer font-semibold text-sm">Home</li>
          <li className="cursor-pointer font-semibold text-sm">About</li>
          <li className="cursor-pointer font-semibold text-sm">Support</li>
          <Link href={"/contactUs"}>
            <li className="cursor-pointer font-semibold text-sm">Contact</li>
          </Link>
          {userSession === undefined ? (
            <Link href="/login">
              <li className="cursor-pointer font-semibold text-sm">Login</li>
            </Link>
          ) : (
            <Link href="/dashboard">
              <li className="bg-gradient-to-r from-blue-400 via-blue-600 to-blue-700  text-white py-2 px-5 w-full font-semibold rounded-full  text-sm">
                Your Account
              </li>
            </Link>
          )}
        </ul>
      </nav>
    </>
  );
};

export default Navbar;
