"use client";

import React, { useState, useEffect } from "react";
import { CiMenuFries } from "react-icons/ci";

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

  return (
    <nav
      className={`fixed   flex-row top-0 left-0 w-full z-50 p-8 flex justify-between items-center px-12 transition-all duration-300 ${
        isScrolled ? "backdrop-blur-sm  " : "backdrop-blur-sm"
      }`}
    >
      <div>
        <h1 className="text-2xl font-semibold text-white">Fixit</h1>
      </div>
      <div className="md:hidden">
        <CiMenuFries size={23} color="white" />
      </div>
      <ul className="md:flex   flex-row md:items-center gap-x-7 text-slate-300 hidden">
        <li className="cursor-pointer font-semibold text-sm">Home</li>
        <li className="cursor-pointer font-semibold text-sm">About</li>
        <li className="cursor-pointer font-semibold text-sm">Services</li>
        <li className="cursor-pointer font-semibold text-sm">Support</li>
        <li className="cursor-pointer font-semibold text-sm">Contact</li>
      </ul>
    </nav>
  );
};

export default Navbar;
