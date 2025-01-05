"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { CiMenuFries } from "react-icons/ci";
import Cookies from "js-cookie";
import logo from "../../src/app/favicon.ico";
import Image from "next/image";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [userSession, setUserSession] = useState<string | null>(null);

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
    <nav
      className={`fixed flex-row top-0 left-0 w-full border-stone-900 z-50 p-3.5 flex justify-between items-center px-12 transition-all duration-300 ${
        isScrolled ? "backdrop-blur-md border-b-[0.1px]" : "backdrop-blur-lg"
      }`}
    >
      <div>
        <Image
          className="h-16 w-16 rounded-full object-cover border-[1px] border-[#15171b]"
          src={logo}
          alt="Profile"
        />
      </div>
      <div className="md:hidden">
        <CiMenuFries size={23} color="white" />
      </div>
      <ul className="md:flex flex-row md:items-center gap-x-7 text-slate-300 hidden">
        <li className="cursor-pointer font-semibold text-sm">Home</li>
        <li className="cursor-pointer font-semibold text-sm">About</li>
        <li className="cursor-pointer font-semibold text-sm">Support</li>
        <Link href={"/contactUs"}>
          <li className="cursor-pointer font-semibold text-sm">Contact</li>
        </Link>
        {userSession === null ? (
          <Link href="/login">
            <li className="cursor-pointer font-semibold text-sm">Login</li>
          </Link>
        ) : (
          <Link href="/dashboard">
            <li className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-600 text-white py-2 px-5 w-full font-semibold rounded-lg text-xs">
              Your Account
            </li>
          </Link>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
